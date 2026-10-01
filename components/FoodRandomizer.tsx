"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Food } from "../lib/types";
import { DiceIcon, CheckIcon, ShuffleIcon } from "./Icons";

interface FoodRandomizerProps {
  foods: Food[];
  categories: string[];
}

export function FoodRandomizer({ foods, categories }: FoodRandomizerProps) {
  // Category selection (multi-select). Empty set means all.
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentFood, setCurrentFood] = useState<Food | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState<Food[]>([]);
  const [noRepeatMode, setNoRepeatMode] = useState(false);
  const [usedFoodIds, setUsedFoodIds] = useState<Set<string>>(new Set());

  // Filter foods by selected categories
  const eligibleFoods = useMemo(() => {
    if (selectedCategories.length === 0) return foods;
    return foods.filter((f) => selectedCategories.includes(f.category));
  }, [foods, selectedCategories]);

  // Handle category toggle
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) {
        return prev.filter((c) => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const selectAllCategories = () => {
    setSelectedCategories([]);
  };

  // Pick random category: either append to existing selection or pick multiple at once
  const pickRandomCategory = (mode: "append" | "multiple" = "append") => {
    if (categories.length === 0) return;

    if (mode === "append") {
      // Find categories that aren't selected yet
      const unselected = categories.filter(
        (c) => !selectedCategories.includes(c),
      );
      if (unselected.length > 0) {
        const randomCat =
          unselected[Math.floor(Math.random() * unselected.length)];
        setSelectedCategories((prev) => [...prev, randomCat]);
      } else {
        // If all are already selected or empty, pick one fresh
        const randomCat =
          categories[Math.floor(Math.random() * categories.length)];
        setSelectedCategories([randomCat]);
      }
    } else if (mode === "multiple") {
      // Randomly pick 2-3 categories at once
      const count = Math.min(
        categories.length,
        Math.floor(Math.random() * 2) + 2,
      ); // 2 or 3
      const shuffled = [...categories].sort(() => 0.5 - Math.random());
      setSelectedCategories(shuffled.slice(0, count));
    }
  };

  // Perform one-by-one randomization

  const randomizeFood = useCallback(() => {
    if (eligibleFoods.length === 0 || isRolling) return;

    setIsRolling(true);

    // Filter available pool if no-repeat mode is on
    let candidatePool = eligibleFoods;
    if (noRepeatMode) {
      const remaining = eligibleFoods.filter((f) => !usedFoodIds.has(f.id));
      if (remaining.length > 0) {
        candidatePool = remaining;
      } else {
        // Deck exhausted, reset used pool
        setUsedFoodIds(new Set());
        candidatePool = eligibleFoods;
      }
    }

    // Fast shuffle animation over 280ms
    const totalFrames = 6;
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const tempPick =
        candidatePool[Math.floor(Math.random() * candidatePool.length)];
      setCurrentFood(tempPick);

      if (frame >= totalFrames) {
        clearInterval(interval);
        const finalPick =
          candidatePool[Math.floor(Math.random() * candidatePool.length)];
        setCurrentFood(finalPick);
        setIsRolling(false);

        // Update history
        setRollHistory((prev) => [finalPick, ...prev.slice(0, 4)]);
        if (noRepeatMode) {
          setUsedFoodIds((prev) => new Set(prev).add(finalPick.id));
        }
      }
    }, 45);
  }, [eligibleFoods, isRolling, noRepeatMode, usedFoodIds]);

  // Initial pick on mount if not picked
  useEffect(() => {
    if (!currentFood && foods.length > 0) {
      const initial = foods[Math.floor(Math.random() * foods.length)];
      setCurrentFood(initial);
      setRollHistory([initial]);
    }
  }, [foods, currentFood]);

  // Spacebar shortcut for instant rolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const target = e.target as HTMLElement;
        const isInput =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable;
        if (!isInput) {
          e.preventDefault();
          randomizeFood();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [randomizeFood]);

  const allSelected = selectedCategories.length === 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Category Selection Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-100">
              ขั้นตอนที่ 1: เลือกหมวดหมู่อาหาร
            </h2>
            <p className="font-body text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              เลือกได้หนึ่งหรือหลายหมวดหมู่ หรือกดสุ่มหมวดหมู่เพื่อช่วยตัดสินใจ
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={selectAllCategories}
              className={`font-heading text-xs px-3 py-2 rounded-lg font-semibold border transition-all cursor-pointer leading-normal active:scale-95 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 ${
                allSelected
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-xs"
                  : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
              }`}
            >
              ทุกหมวดหมู่
            </button>
            <button
              type="button"
              onClick={() => pickRandomCategory("append")}
              title="สุ่มหมวดหมู่เพิ่มโดยไม่ล้างอันเดิมที่เลือกไว้"
              className="font-heading text-xs px-3 py-2 rounded-lg font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer leading-normal active:scale-95 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
            >
              <DiceIcon className="text-sm shrink-0" />
              <span>สุ่มเพิ่ม (+1)</span>
            </button>
            <button
              type="button"
              onClick={() => pickRandomCategory("multiple")}
              title="สุ่มพร้อมกันทีละ 2-3 หมวดหมู่"
              className="font-heading text-xs px-3 py-2 rounded-lg font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer leading-normal active:scale-95 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
            >
              <ShuffleIcon className="text-sm shrink-0" />
              <span>สุ่มหลายหมวดหมู่</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-4">
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat);
            const count = foods.filter((f) => f.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`group inline-flex items-center justify-center gap-1.5 text-xs px-3.5 py-2 rounded-lg font-medium border transition-all cursor-pointer leading-normal active:scale-95 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 ${
                  isSelected
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-xs"
                    : "bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                {isSelected && <CheckIcon className="text-sm shrink-0" />}
                <span className="font-heading">{cat}</span>
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

        <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-body">
          <span>
            มี <strong>{eligibleFoods.length}</strong> เมนูให้สุ่มในรอบนี้
          </span>
          {selectedCategories.length > 0 && (
            <button
              onClick={selectAllCategories}
              className="text-zinc-600 dark:text-zinc-400 hover:underline cursor-pointer font-medium"
            >
              รีเซ็ตเลือกทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* Randomizer Main Stage */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-6">
        <div>
          <span className="font-body inline-block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-5">
            ขั้นตอนที่ 2: สุ่มเมนูอาหารทีละอย่าง
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            วันนี้กินอะไรดี?
          </h1>
        </div>

        {/* Selected Food Showcase Card */}
        {currentFood ? (
          <div
            className={`max-w-md mx-auto bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-6 transition-transform duration-200 ${
              isRolling ? "scale-[0.98] opacity-80" : "scale-100 opacity-100"
            }`}
          >
            {/* Food Image */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center shadow-xs">
              <Image
                src={currentFood.imageUrl}
                alt={currentFood.name}
                width={224}
                height={224}
                priority
                className={`w-full h-full object-contain p-2 transition-transform duration-200 ${
                  isRolling ? "scale-90 blur-xs" : "scale-100 blur-none"
                }`}
                unoptimized
              />
            </div>

            {/* Food Details */}
            <div className="mt-5 space-y-2">
              <div className="font-heading inline-block px-3 py-1 rounded-full text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                {currentFood.category}
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                {currentFood.name}
              </h2>
            </div>
          </div>
        ) : (
          <div className="py-12 font-body text-zinc-400 dark:text-zinc-500">
            ไม่มีเมนูที่ตรงกับหมวดหมู่ที่เลือก กรุณาเลือกหมวดหมู่อาหารอย่างน้อย
            1 อย่าง
          </div>
        )}

        {/* Controls */}
        <div className="max-w-md mx-auto space-y-4">
          <button
            type="button"
            onClick={randomizeFood}
            disabled={eligibleFoods.length === 0 || isRolling}
            className={`w-full py-4 px-6 rounded-xl font-heading font-bold text-lg sm:text-xl inline-flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm active:scale-[0.98] leading-normal ${
              eligibleFoods.length === 0
                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                : "bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900"
            }`}
          >
            <DiceIcon
              className={`w-6 h-6 shrink-0 ${isRolling ? "animate-spin" : ""}`}
            />
            <span className="leading-none">{isRolling ? "กำลังสุ่มเมนู..." : "สุ่มเมนูถัดไป"}</span>
            <kbd className="hidden sm:inline-flex items-center ml-1 text-xs px-2.5 py-1 rounded bg-zinc-800 dark:bg-zinc-200 text-zinc-300 dark:text-zinc-700 font-mono font-normal">
              SPACE
            </kbd>
          </button>

          {/* Mode toggle with custom switch */}
          <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 px-1 font-body">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  checked={noRepeatMode}
                  onChange={(e) => {
                    setNoRepeatMode(e.target.checked);
                    setUsedFoodIds(new Set());
                  }}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:border-zinc-700 peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100 dark:peer-checked:after:bg-zinc-900 transition-colors"></div>
              </div>
              <span className="font-heading text-xs font-medium text-zinc-700 dark:text-zinc-300">
                ไม่สุ่มเมนูซ้ำในรอบนี้
              </span>
            </label>
            {noRepeatMode && (
              <span className="font-mono text-zinc-400">
                สุ่มแล้ว {usedFoodIds.size}/{eligibleFoods.length} เมนู
              </span>
            )}
          </div>
        </div>

        {/* History of recent picks */}
        {rollHistory.length > 1 && (
          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="font-heading text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
              ประวัติการสุ่มล่าสุด
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {rollHistory.map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  onClick={() => setCurrentFood(item)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    currentFood?.id === item.id
                      ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 font-semibold"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  <span className="font-body">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
