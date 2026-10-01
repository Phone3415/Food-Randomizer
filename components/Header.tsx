"use client";

import React from "react";
import { DiceIcon, PlusIcon, RestaurantIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  activeTab: "randomizer" | "catalog";
  onTabChange: (tab: "randomizer" | "catalog") => void;
  foodsCount: number;
}

export function Header({ activeTab, onTabChange, foodsCount }: HeaderProps) {
  return (
    <header className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shadow-xs select-none shrink-0">
          <RestaurantIcon className="text-xl" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
            สุ่มอาหาร
          </h1>
          <p className="font-body text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
            สุ่มเมนูอาหารจานโปรด • เพิ่มเมนูและแบ่งปันได้ทุกคน
          </p>
        </div>
      </div>

      {/* Navigation Controls & Theme Toggle */}
      <div className="flex items-center gap-2">
        {/* Segmented Control */}
        <nav aria-label="แถบการนำทาง" className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => onTabChange("randomizer")}
            className={`font-heading inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer leading-normal ${
              activeTab === "randomizer"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <DiceIcon className="text-base" />
            <span>สุ่มอาหาร</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("catalog")}
            className={`font-heading inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer leading-normal ${
              activeTab === "catalog"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <PlusIcon className="text-base" />
            <span>จัดการเมนู</span>
            <span className="ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 font-mono text-zinc-700 dark:text-zinc-300">
              {foodsCount}
            </span>
          </button>
        </nav>

        {/* Theme Switcher */}
        <ThemeToggle />
      </div>
    </header>
  );
}
