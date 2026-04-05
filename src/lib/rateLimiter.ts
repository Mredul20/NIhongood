/**
 * In-memory rate limiter for API endpoints
 * Tracks requests per user per endpoint
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
};

/**
 * Check if a request is rate limited
 * @param userId - User ID or IP address
 * @param endpoint - API endpoint path
 * @param config - Rate limit configuration
 * @returns { isLimited: boolean; remaining: number; resetAt: number }
 */
export function checkRateLimit(
  userId: string,
  endpoint: string,
  config: Partial<RateLimitConfig> = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const key = `${userId}:${endpoint}`;
  const now = Date.now();

  if (!store[key]) {
    store[key] = { count: 1, resetAt: now + finalConfig.windowMs };
    return {
      isLimited: false,
      remaining: finalConfig.maxRequests - 1,
      resetAt: store[key].resetAt,
    };
  }

  const entry = store[key];

  // Reset if window has passed
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + finalConfig.windowMs;
    return {
      isLimited: false,
      remaining: finalConfig.maxRequests - 1,
      resetAt: entry.resetAt,
    };
  }

  // Check if limited
  entry.count++;
  const isLimited = entry.count > finalConfig.maxRequests;
  const remaining = Math.max(0, finalConfig.maxRequests - entry.count);

  return {
    isLimited,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Reset rate limit for a user/endpoint combination
 */
export function resetRateLimit(userId: string, endpoint: string) {
  const key = `${userId}:${endpoint}`;
  delete store[key];
}

/**
 * Cleanup old entries (call periodically to prevent memory leak)
 */
export function cleanupExpiredLimits() {
  const now = Date.now();
  let cleaned = 0;

  for (const key in store) {
    if (store[key].resetAt < now) {
      delete store[key];
      cleaned++;
    }
  }

  return cleaned;
}

// Run cleanup every 5 minutes — only in server/Node environments.
// In a browser bundle this would fire on every page load and is unnecessary
// (the store is per-request in a serverless context anyway).
if (typeof window === "undefined") {
  setInterval(() => {
    const cleaned = cleanupExpiredLimits();
    if (cleaned > 0) {
      console.log(`[RateLimiter] Cleaned up ${cleaned} expired entries`);
    }
  }, 5 * 60 * 1000);
}
