"use client";

import React, {
  useState,
  useTransition,
  useMemo,
  useRef,
  useEffect,
} from "react";
import Image from "next/image";
import { Food, RateLimitResult } from "../lib/types";
import {
  addFoodAction,
  updateFoodAction,
  deleteFoodAction,
} from "../app/actions";
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  SearchIcon,
  AlertCircleIcon,
  UploadCloudIcon,
  CloseIcon,
  CheckIcon,
} from "./Icons";

interface FoodCatalogCrudProps {
  foods: Food[];
  categories: string[];
  initialRateLimit: RateLimitResult;
  onFoodsChange: (updated: Food[]) => void;
}

export function FoodCatalogCrud({
  foods,
  categories,
  initialRateLimit,
  onFoodsChange,
}: FoodCatalogCrudProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] =
    useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  // Rate limit state
  const [, setRateLimit] = useState<RateLimitResult>(initialRateLimit);
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // Handle countdown timer when rate limited
  useEffect(() => {
    if (rateLimitCountdown <= 0) return;
    const timer = setInterval(() => {
      setRateLimitCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setErrorMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [rateLimitCountdown]);

  // Filtered foods for catalog
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedFilterCategory === "ALL" ||
        food.category === selectedFilterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [foods, searchTerm, selectedFilterCategory]);

  // Delete handler
  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบเมนู "${name}"?`)) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await deleteFoodAction(id);
      if (res.rateLimit) {
        setRateLimit(res.rateLimit);
        if (!res.rateLimit.allowed) {
          setRateLimitCountdown(res.rateLimit.resetInSeconds);
        }
      }

      if (!res.success) {
        setErrorMessage(res.error);
      } else {
        const updated = foods.filter((f) => f.id !== id);
        onFoodsChange(updated);
        setSuccessMessage(`ลบเมนู "${name}" เรียบร้อยแล้ว`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pt-6">
      {/* Header and Controls */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>คลังเมนูอาหาร &amp; จัดการข้อมูล</span>
              <span className="font-heading text-xs px-2.5 py-0.5 rounded-full font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                {foods.length} เมนู
              </span>
            </h2>
            <p className="font-body text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              ทุกคนสามารถเพิ่ม แก้ไข หรือลบเมนูอาหารในระบบเพื่อแบ่งปันร่วมกันได้
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setIsAddModalOpen(true);
              }}
              className="font-heading inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-colors shadow-xs cursor-pointer leading-normal"
            >
              <PlusIcon className="text-base" />
              <span>เพิ่มเมนูอาหาร</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs flex items-center justify-between gap-2 font-body">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="text-lg text-red-600 dark:text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {rateLimitCountdown > 0 && (
              <span className="font-mono font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/60 px-2 py-0.5 rounded">
                รีเซ็ตใน {rateLimitCountdown} วิ
              </span>
            )}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-body">
            <CheckIcon className="text-base text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Search & Category Filter Section */}
        <div className="pt-4 space-y-3">
          {/* Full-width Search Input */}
          <div className="relative w-full">
            <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-zinc-400 dark:text-zinc-500">
              <SearchIcon className="text-lg" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อเมนูอาหาร เช่น ข้าวกะเพรา, ต้มยำกุ้ง, ข้าวผัด..."
              className="font-body w-full text-sm pl-10 pr-10 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-900 dark:focus:border-zinc-400 outline-none transition-colors leading-normal"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-0 bottom-0 my-auto w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer rounded-md transition-colors"
                title="ล้างข้อความค้นหา"
              >
                <CloseIcon className="text-base" />
              </button>
            )}
          </div>

          {/* Category Filter Chips with smooth horizontal scrolling */}
          <div className="w-full min-w-0 flex items-center gap-1.5 overflow-x-auto py-1.5 text-xs touch-pan-x scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedFilterCategory("ALL")}
              className={`font-heading shrink-0 px-3.5 py-2 rounded-lg font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 leading-normal active:scale-95 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 ${
                selectedFilterCategory === "ALL"
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-xs"
                  : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
            >
              <span>ทั้งหมด</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedFilterCategory === "ALL"
                    ? "bg-zinc-700 text-zinc-200 dark:bg-zinc-300 dark:text-zinc-800"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {foods.length}
              </span>
            </button>
            {categories.map((c) => {
              const count = foods.filter((f) => f.category === c).length;
              const isSelected = selectedFilterCategory === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedFilterCategory(c)}
                  className={`font-heading shrink-0 px-3 py-2 rounded-lg font-medium border transition-all cursor-pointer inline-flex items-center gap-1.5 leading-normal active:scale-95 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 ${
                    isSelected
                      ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-xs"
                      : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  <span>{c}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-zinc-700 text-zinc-200 dark:bg-zinc-300 dark:text-zinc-800"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Catalog Items Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredFoods.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0 flex items-center justify-center">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain p-1"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate leading-snug">
                    {item.name}
                  </h4>
                  <span className="font-heading inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 leading-normal">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Action buttons with refined 28x28 hitboxes and micro-interactions */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => setEditingFood(item)}
                  title="แก้ไขเมนู"
                  className="w-7 h-7 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-90 transition-all cursor-pointer flex items-center justify-center shrink-0 focus-visible:ring-1"
                >
                  <EditIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.name)}
                  disabled={isPending}
                  title="ลบเมนู"
                  className="w-7 h-7 rounded-lg text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 active:scale-90 transition-all cursor-pointer flex items-center justify-center shrink-0 focus-visible:ring-1"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}

          {filteredFoods.length === 0 && (
            <div className="col-span-full py-10 text-center text-xs text-zinc-400 dark:text-zinc-500 font-body">
              ไม่พบเมนูอาหารที่ค้นหาหรือตรงกับตัวกรอง
            </div>
          )}
        </div>
      </div>

      {/* Add Food Modal */}
      {isAddModalOpen && (
        <FoodFormModal
          title="เพิ่มเมนูอาหารใหม่"
          submitLabel="เพิ่มเมนู"
          categories={categories}
          isPending={isPending}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={async (formData) => {
            startTransition(async () => {
              const res = await addFoodAction(formData);
              if (res.rateLimit) {
                setRateLimit(res.rateLimit);
                if (!res.rateLimit.allowed) {
                  setRateLimitCountdown(res.rateLimit.resetInSeconds);
                }
              }

              if (!res.success) {
                setErrorMessage(res.error);
              } else {
                onFoodsChange([res.data, ...foods]);
                setIsAddModalOpen(false);
                setSuccessMessage(
                  `เพิ่มเมนู "${res.data.name}" เรียบร้อยแล้ว!`,
                );
                setTimeout(() => setSuccessMessage(null), 3000);
              }
            });
          }}
        />
      )}

      {/* Edit Food Modal */}
      {editingFood && (
        <FoodFormModal
          title="แก้ไขเมนูอาหาร"
          submitLabel="บันทึกการเปลี่ยนแปลง"
          initialData={editingFood}
          categories={categories}
          isPending={isPending}
          onClose={() => setEditingFood(null)}
          onSubmit={async (formData) => {
            startTransition(async () => {
              const res = await updateFoodAction(editingFood.id, formData);
              if (res.rateLimit) {
                setRateLimit(res.rateLimit);
                if (!res.rateLimit.allowed) {
                  setRateLimitCountdown(res.rateLimit.resetInSeconds);
                }
              }

              if (!res.success) {
                setErrorMessage(res.error);
              } else {
                const updated = foods.map((f) =>
                  f.id === editingFood.id ? res.data : f,
                );
                onFoodsChange(updated);
                setEditingFood(null);
                setSuccessMessage(
                  `อัปเดตเมนู "${res.data.name}" เรียบร้อยแล้ว`,
                );
                setTimeout(() => setSuccessMessage(null), 3000);
              }
            });
          }}
        />
      )}
    </div>
  );
}

// Modal component for Add / Edit
interface FoodFormModalProps {
  title: string;
  submitLabel: string;
  initialData?: Food;
  categories: string[];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

function FoodFormModal({
  title,
  submitLabel,
  initialData,
  categories,
  isPending,
  onClose,
  onSubmit,
}: FoodFormModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(
    initialData?.category || categories[0] || "อาหารตามสั่ง & สตรีทฟู้ด",
  );
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setLocalError("ขนาดไฟล์รูปภาพต้องไม่เกิน 3MB");
      return;
    }

    setLocalError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setLocalError("กรุณากรอกชื่อเมนูอาหาร");
      return;
    }
    if (trimmedName.length > 100) {
      setLocalError("ชื่อเมนูอาหารต้องมีความยาวไม่เกิน 100 ตัวอักษร");
      return;
    }

    const rawCategory = isCustomCategory ? customCategory : category;
    const trimmedCategory = rawCategory.trim();
    if (!trimmedCategory) {
      setLocalError("กรุณากรอกหรือเลือกหมวดหมู่อาหาร");
      return;
    }
    if (trimmedCategory.length > 50) {
      setLocalError("ชื่อหมวดหมู่อาหารต้องมีความยาวไม่เกิน 50 ตัวอักษร");
      return;
    }

    const formData = new FormData();
    formData.append("name", trimmedName);
    formData.append("category", trimmedCategory);

    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-backdrop-in">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 active:scale-90 cursor-pointer flex items-center justify-center transition-all shrink-0 focus-visible:ring-1"
            title="ปิดหน้าต่าง"
          >
            <CloseIcon className="text-base" />
          </button>
        </div>

        {localError && (
          <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-body flex items-center gap-2">
            <AlertCircleIcon className="text-base text-red-600 dark:text-red-400 shrink-0" />
            <span>{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Name input with length validation and focus ring */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-heading block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                ชื่อเมนูอาหาร *
              </label>
              <span className="font-mono text-[10px] text-zinc-400">
                {name.length}/100
              </span>
            </div>
            <input
              type="text"
              value={name}
              maxLength={100}
              onChange={(e) => {
                setName(e.target.value);
                if (localError) setLocalError(null);
              }}
              placeholder="เช่น ข้าวกะเพราหมูกรอบไข่ดาว, ผัดซีอิ๊ว"
              required
              className="font-body w-full text-xs px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 outline-none transition-all leading-normal"
            />
          </div>

          {/* Category selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-heading text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                หมวดหมู่อาหาร *
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomCategory(!isCustomCategory);
                  if (localError) setLocalError(null);
                }}
                className="font-body text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline cursor-pointer transition-colors"
              >
                {isCustomCategory
                  ? "เลือกจากหมวดหมู่เดิม"
                  : "+ สร้างหมวดหมู่ใหม่"}
              </button>
            </div>

            {isCustomCategory ? (
              <div>
                <input
                  type="text"
                  value={customCategory}
                  maxLength={50}
                  onChange={(e) => {
                    setCustomCategory(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  placeholder="พิมพ์ชื่อหมวดหมู่ใหม่..."
                  required
                  className="font-body w-full text-xs px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 outline-none transition-all leading-normal"
                />
                <span className="font-mono text-[10px] text-zinc-400 mt-1 block text-right">
                  {customCategory.length}/50
                </span>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (localError) setLocalError(null);
                }}
                className="font-body w-full text-xs px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 outline-none transition-all leading-normal cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Unified Image Dropzone */}
          <div>
            <label className="font-heading block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              รูปภาพอาหาร (อัปโหลดรูปภาพจานอาหาร)
            </label>
            <label className="group relative w-full h-36 rounded-xl overflow-hidden border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer bg-zinc-50 dark:bg-zinc-950/40 flex items-center justify-center transition-all focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-100">
              {previewUrl ? (
                <div className="relative w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                  <Image
                    src={previewUrl}
                    alt="ภาพตัวอย่างอาหาร"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                  {/* Interactive Hover / Focus Overlay */}
                  <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-2xs">
                    <UploadCloudIcon className="text-2xl text-white drop-shadow-sm" />
                    <span className="font-heading text-xs font-semibold">
                      คลิกเพื่อเปลี่ยนรูปภาพใหม่
                    </span>
                    <span className="font-body text-[10px] text-zinc-300">
                      ขนาดไม่เกิน 3MB (JPG, PNG, WEBP)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <UploadCloudIcon className="text-2xl text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 mb-1 transition-colors" />
                  <span className="font-heading text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-normal">
                    คลิกเพื่อเลือกไฟล์รูปภาพ
                  </span>
                  <span className="font-body text-[10px] text-zinc-400 mt-0.5">
                    ขนาดไม่เกิน 3MB (JPG, PNG, WEBP, SVG)
                  </span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="font-heading text-xs px-3.5 py-2.5 rounded-lg font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer leading-normal"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="font-heading text-xs px-4 py-2.5 rounded-lg font-semibold bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 active:scale-95 transition-all cursor-pointer disabled:opacity-50 leading-normal shadow-xs"
            >
              {isPending ? "กำลังบันทึก..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
