"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import path from "node:path";
import fs from "node:fs/promises";

import {
  getAllFoods,
  getFoodCategories,
  createFood,
  updateFood,
  deleteFood,
  checkAndRecordRateLimit,
  getRateLimitStatus,
} from "../lib/db";
import { sanitizeHtml } from "../lib/sanitize";
import { ActionResponse, Food, RateLimitResult } from "../lib/types";

async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    const realIp = headerList.get("x-real-ip");
    if (realIp) {
      return realIp.trim();
    }
  } catch {
    // Fallback if headers cannot be resolved
  }
  return "127.0.0.1";
}

export async function getFoodsAction(): Promise<{
  foods: Food[];
  categories: string[];
  rateLimit: RateLimitResult;
}> {
  const ip = await getClientIp();
  const foods = await getAllFoods();
  const categories = await getFoodCategories();
  const rateLimit = await getRateLimitStatus(ip);
  return { foods, categories, rateLimit };
}

export async function addFoodAction(formData: FormData): Promise<ActionResponse<Food>> {
  const ip = await getClientIp();
  const rateCheck = await checkAndRecordRateLimit(ip, "create");

  if (!rateCheck.allowed) {
    return {
      success: false,
      error: `ใช้งานเกินโควตา (จำกัด 5 ครั้ง/นาที) กรุณารออีก ${rateCheck.resetInSeconds} วินาทีก่อนทำรายการใหม่`,
      rateLimit: rateCheck,
    };
  }

  const rawName = formData.get("name") as string | null;
  const rawCategory = formData.get("category") as string | null;

  // Server-side HTML & Input Sanitization (defense in depth)
  const name = sanitizeHtml(rawName);
  const category = sanitizeHtml(rawCategory);

  if (!name || name.length < 2 || name.length > 100) {
    return {
      success: false,
      error: "ชื่อเมนูอาหารต้องมีความยาวระหว่าง 2 ถึง 100 ตัวอักษร (ห้ามใช้แท็ก HTML)",
      rateLimit: rateCheck,
    };
  }

  if (!category || category.length < 2 || category.length > 50) {
    return {
      success: false,
      error: "หมวดหมู่อาหารต้องมีความยาวระหว่าง 2 ถึง 50 ตัวอักษร (ห้ามใช้แท็ก HTML)",
      rateLimit: rateCheck,
    };
  }

  const file = formData.get("image") as File | null;

  let imageUrl = "/uploads/seed-pad-thai.svg"; // default fallback

  if (file && file.size > 0) {
    // 3MB size limit for performance & abuse prevention
    const maxSizeBytes = 3 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: "ขนาดไฟล์รูปภาพต้องไม่เกิน 3MB",
        rateLimit: rateCheck,
      };
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return {
        success: false,
        error: "ประเภทไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์รูปภาพ JPG, PNG, WEBP, GIF หรือ SVG",
        rateLimit: rateCheck,
      };
    }

    // Determine safe extension
    let ext = ".jpg";
    if (file.type === "image/png") ext = ".png";
    else if (file.type === "image/webp") ext = ".webp";
    else if (file.type === "image/gif") ext = ".gif";
    else if (file.type === "image/svg+xml") ext = ".svg";

    const fileName = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    imageUrl = `/uploads/${fileName}`;
  }

  const created = await createFood({
    name,
    category,
    imageUrl,
  });

  revalidatePath("/");
  return {
    success: true,
    data: created,
    rateLimit: rateCheck,
  };
}

export async function updateFoodAction(
  id: string,
  formData: FormData
): Promise<ActionResponse<Food>> {
  const ip = await getClientIp();
  const rateCheck = await checkAndRecordRateLimit(ip, "update");

  if (!rateCheck.allowed) {
    return {
      success: false,
      error: `ใช้งานเกินโควตา (จำกัด 5 ครั้ง/นาที) กรุณารออีก ${rateCheck.resetInSeconds} วินาทีก่อนทำรายการใหม่`,
      rateLimit: rateCheck,
    };
  }

  const rawName = formData.get("name") as string | null;
  const rawCategory = formData.get("category") as string | null;
  // Server-side HTML & Input Sanitization
  const name = rawName !== null ? sanitizeHtml(rawName) : undefined;
  const category = rawCategory !== null ? sanitizeHtml(rawCategory) : undefined;

  if (name !== undefined && (name.length < 2 || name.length > 100)) {
    return {
      success: false,
      error: "ชื่อเมนูอาหารต้องมีความยาวระหว่าง 2 ถึง 100 ตัวอักษร (ห้ามใช้แท็ก HTML)",
      rateLimit: rateCheck,
    };
  }

  if (category !== undefined && (category.length < 2 || category.length > 50)) {
    return {
      success: false,
      error: "หมวดหมู่อาหารต้องมีความยาวระหว่าง 2 ถึง 50 ตัวอักษร (ห้ามใช้แท็ก HTML)",
      rateLimit: rateCheck,
    };
  }

  const file = formData.get("image") as File | null;

  let imageUrl: string | undefined = undefined;

  if (file && file.size > 0) {
    const maxSizeBytes = 3 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: "ขนาดไฟล์รูปภาพต้องไม่เกิน 3MB",
        rateLimit: rateCheck,
      };
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return {
        success: false,
        error: "ประเภทไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์รูปภาพ JPG, PNG, WEBP, GIF หรือ SVG",
        rateLimit: rateCheck,
      };
    }

    let ext = ".jpg";
    if (file.type === "image/png") ext = ".png";
    else if (file.type === "image/webp") ext = ".webp";
    else if (file.type === "image/gif") ext = ".gif";
    else if (file.type === "image/svg+xml") ext = ".svg";

    const fileName = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    imageUrl = `/uploads/${fileName}`;
  }

  const updated = await updateFood(id, {
    name: name || undefined,
    category: category || undefined,
    imageUrl,
  });

  if (!updated) {
    return {
      success: false,
      error: "ไม่พบข้อมูลเมนูอาหารดังกล่าว",
      rateLimit: rateCheck,
    };
  }

  revalidatePath("/");
  return {
    success: true,
    data: updated,
    rateLimit: rateCheck,
  };
}

export async function deleteFoodAction(id: string): Promise<ActionResponse<{ id: string }>> {
  const ip = await getClientIp();
  const rateCheck = await checkAndRecordRateLimit(ip, "delete");

  if (!rateCheck.allowed) {
    return {
      success: false,
      error: `ใช้งานเกินโควตา (จำกัด 5 ครั้ง/นาที) กรุณารออีก ${rateCheck.resetInSeconds} วินาทีก่อนทำรายการใหม่`,
      rateLimit: rateCheck,
    };
  }

  const success = await deleteFood(id);
  if (!success) {
    return {
      success: false,
      error: "ไม่สามารถลบเมนูได้ หรือเมนูนี้ถูกลบไปแล้ว",
      rateLimit: rateCheck,
    };
  }

  revalidatePath("/");
  return {
    success: true,
    data: { id },
    rateLimit: rateCheck,
  };
}
