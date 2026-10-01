"use client";

import { Food } from "./types";

// Front-end in-memory cache with 2-minute (120s) expiration
const CLIENT_CACHE_TTL_MS = 2 * 60 * 1000;

interface ClientMemoryCache {
  data: Food[] | null;
  timestamp: number;
}

let clientCache: ClientMemoryCache = {
  data: null,
  timestamp: 0,
};

/**
 * Returns cached food list if still within the 2-minute window.
 */
export function getClientCachedFoods(): Food[] | null {
  const now = Date.now();
  if (clientCache.data && now - clientCache.timestamp < CLIENT_CACHE_TTL_MS) {
    return clientCache.data;
  }
  return null;
}

/**
 * Updates the front-end in-memory cache with timestamp.
 */
export function setClientCachedFoods(foods: Food[]): void {
  clientCache = {
    data: foods,
    timestamp: Date.now(),
  };
}

/**
 * Invalidates the front-end in-memory cache.
 */
export function invalidateClientCache(): void {
  clientCache = {
    data: null,
    timestamp: 0,
  };
}
