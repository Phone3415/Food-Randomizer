export interface Food {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  createdAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

export type ActionResponse<T = unknown> =
  | { success: true; data: T; rateLimit: RateLimitResult }
  | { success: false; error: string; rateLimit?: RateLimitResult };
