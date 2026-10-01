import path from "node:path";
import fs from "node:fs";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { Food, RateLimitResult } from "./types";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(dataDir, "street_food.db");

// Module singleton database instance for Next.js hot-reload safety
const globalForPrisma = globalThis as unknown as {
  prismaClientInstance?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({
    url: dbPath,
  });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient =
  globalForPrisma.prismaClientInstance ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaClientInstance = prisma;
}

// In-memory cache for queries (1 minute TTL)
const CACHE_TTL_MS = 60 * 1000;

interface MemoryCache {
  foods: { data: Food[]; timestamp: number } | null;
  categories: { data: string[]; timestamp: number } | null;
}

const globalForCache = globalThis as unknown as {
  memoryCache?: MemoryCache;
};

const cache: MemoryCache = globalForCache.memoryCache ?? {
  foods: null,
  categories: null,
};

if (process.env.NODE_ENV !== "production") {
  globalForCache.memoryCache = cache;
}

export function clearCache(): void {
  cache.foods = null;
  cache.categories = null;
}

/**
 * Checks rate limit for a specific IP.
 * Enforces max 5 actions per minute.
 */
export async function checkAndRecordRateLimit(
  ip: string,
  action: string,
  limit: number = 5,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Purge records older than 5 minutes to keep DB size minimal
  await prisma.rateLimit.deleteMany({
    where: {
      timestamp: {
        lt: BigInt(now - 300000),
      },
    },
  });

  // Count requests in the current window
  const currentCount = await prisma.rateLimit.count({
    where: {
      ip,
      timestamp: {
        gte: BigInt(windowStart),
      },
    },
  });

  if (currentCount >= limit) {
    const oldestResult = await prisma.rateLimit.findFirst({
      where: {
        ip,
        timestamp: {
          gte: BigInt(windowStart),
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    const oldestTimestamp = oldestResult ? Number(oldestResult.timestamp) : windowStart;
    const resetInSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  // Record this action
  await prisma.rateLimit.create({
    data: {
      ip,
      action,
      timestamp: BigInt(now),
    },
  });

  return {
    allowed: true,
    remaining: limit - currentCount - 1,
    resetInSeconds: Math.ceil(windowMs / 1000),
  };
}

/**
 * Gets the current rate limit status without recording an action.
 */
export async function getRateLimitStatus(
  ip: string,
  limit: number = 5,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowMs;

  const currentCount = await prisma.rateLimit.count({
    where: {
      ip,
      timestamp: {
        gte: BigInt(windowStart),
      },
    },
  });

  const remaining = Math.max(0, limit - currentCount);

  if (remaining === 0) {
    const oldestResult = await prisma.rateLimit.findFirst({
      where: {
        ip,
        timestamp: {
          gte: BigInt(windowStart),
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    const oldestTimestamp = oldestResult ? Number(oldestResult.timestamp) : windowStart;
    const resetInSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

    return { allowed: false, remaining: 0, resetInSeconds };
  }

  return { allowed: true, remaining, resetInSeconds: 60 };
}

export async function getAllFoods(): Promise<Food[]> {
  const now = Date.now();
  if (cache.foods && now - cache.foods.timestamp < CACHE_TTL_MS) {
    return cache.foods.data;
  }

  const rows = await prisma.food.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const foods = rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    imageUrl: r.imageUrl,
    createdAt: Number(r.createdAt),
  }));

  cache.foods = {
    data: foods,
    timestamp: now,
  };

  return foods;
}

export async function getFoodCategories(): Promise<string[]> {
  const now = Date.now();
  if (cache.categories && now - cache.categories.timestamp < CACHE_TTL_MS) {
    return cache.categories.data;
  }

  const rows = await prisma.food.findMany({
    distinct: ["category"],
    select: {
      category: true,
    },
    orderBy: {
      category: "asc",
    },
  });
  const categories = rows.map((r: any) => r.category);

  cache.categories = {
    data: categories,
    timestamp: now,
  };

  return categories;
}

export async function createFood(item: {
  name: string;
  category: string;
  imageUrl: string;
}): Promise<Food> {
  const id = `food-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = Date.now();

  const created = await prisma.food.create({
    data: {
      id,
      name: item.name.trim(),
      category: item.category.trim(),
      imageUrl: item.imageUrl,
      createdAt: BigInt(now),
    },
  });

  clearCache();

  return {
    id: created.id,
    name: created.name,
    category: created.category,
    imageUrl: created.imageUrl,
    createdAt: Number(created.createdAt),
  };
}

export async function updateFood(
  id: string,
  item: { name?: string; category?: string; imageUrl?: string }
): Promise<Food | null> {
  const current = await prisma.food.findUnique({
    where: { id },
  });

  if (!current) return null;

  const newName = item.name !== undefined ? item.name.trim() : current.name;
  const newCategory = item.category !== undefined ? item.category.trim() : current.category;
  const newImageUrl = item.imageUrl !== undefined ? item.imageUrl : current.imageUrl;

  const updated = await prisma.food.update({
    where: { id },
    data: {
      name: newName,
      category: newCategory,
      imageUrl: newImageUrl,
    },
  });

  // Delete the old file if the image was replaced
  if (
    item.imageUrl !== undefined && 
    item.imageUrl !== current.imageUrl && 
    current.imageUrl.startsWith("/uploads/upload-")
  ) {
    const filename = path.basename(current.imageUrl);
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Ignore deletion error
      }
    }
  }

  clearCache();

  return {
    id: updated.id,
    name: updated.name,
    category: updated.category,
    imageUrl: updated.imageUrl,
    createdAt: Number(updated.createdAt),
  };
}

export async function deleteFood(id: string): Promise<boolean> {
  const existing = await prisma.food.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  if (!existing) return false;

  // Optionally remove the uploaded file if it was a user upload
  if (existing.imageUrl.startsWith("/uploads/upload-")) {
    const filename = path.basename(existing.imageUrl);
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Ignore deletion error
      }
    }
  }

  await prisma.food.delete({
    where: { id },
  });

  clearCache();

  return true;
}
