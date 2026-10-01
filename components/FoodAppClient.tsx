"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Food, RateLimitResult } from "../lib/types";
import { Header } from "./Header";
import { FoodRandomizer } from "./FoodRandomizer";
import { FoodCatalogCrud } from "./FoodCatalogCrud";
import {
  getClientCachedFoods,
  setClientCachedFoods,
} from "../lib/client-cache";

interface FoodAppClientProps {
  initialFoods: Food[];
  initialCategories: string[];
  initialRateLimit: RateLimitResult;
}

export function FoodAppClient({
  initialFoods,
  initialRateLimit,
}: FoodAppClientProps) {
  // Initialize with client-side cache if valid (2 min window), otherwise initialFoods
  const [foods, setFoods] = useState<Food[]>(() => {
    if (typeof window !== "undefined") {
      const cached = getClientCachedFoods();
      if (cached && cached.length > 0) return cached;
    }
    return initialFoods;
  });
  const [activeTab, setActiveTab] = useState<"randomizer" | "catalog">("randomizer");

  // Keep client-side cache in sync
  useEffect(() => {
    if (foods && foods.length > 0) {
      setClientCachedFoods(foods);
    }
  }, [foods]);

  // Dynamically compute unique categories from current foods
  const categories = useMemo(() => {
    const set = new Set<string>();
    foods.forEach((f) => set.add(f.category));
    return Array.from(set).sort();
  }, [foods]);

  const handleFoodsChange = (updatedFoods: Food[]) => {
    setFoods(updatedFoods);
    setClientCachedFoods(updatedFoods);
  };

  return (
    <div className="w-full">
      {/* Decoupled Header with Theme Switcher & Navigation Tabs */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        foodsCount={foods.length}
      />

      {/* Main Tab Content */}
      <main>
        {activeTab === "randomizer" ? (
          <FoodRandomizer foods={foods} categories={categories} />
        ) : (
          <FoodCatalogCrud
            foods={foods}
            categories={categories}
            initialRateLimit={initialRateLimit}
            onFoodsChange={handleFoodsChange}
          />
        )}
      </main>
    </div>
  );
}

