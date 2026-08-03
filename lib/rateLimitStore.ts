import Redis from "ioredis";

const WINDOW_SECONDS = 10 * 60; // 10 minutes

let redis: Redis | null = null;
const useLocalRedis = process.env.USE_LOCAL_REDIS === "true" || !!process.env.REDIS_URL;
if (useLocalRedis) {
  const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";
  try {
    redis = new Redis(url);
    // Allow ioredis to attempt connection; we'll gracefully fall back if commands fail.
  } catch {
    // If Redis is not available, keep redis = null and fall back to in-memory store
    redis = null;
  }
}

type Entry = { count: number; resetAt: number };
const inMemory = new Map<string, Entry>();

export async function incr(key: string): Promise<Entry> {
  const now = Date.now();

  if (redis) {
    try {
      const fullKey = `rl:${key}`;
      const count = await redis.incr(fullKey);
      if (count === 1) {
        await redis.expire(fullKey, WINDOW_SECONDS);
      }
      const ttl = await redis.ttl(fullKey); // seconds
      const resetAt = now + Math.max(0, ttl) * 1000;
      return { count, resetAt };
    } catch (error) {
      // If redis command fails, fall back to in-memory store
      console.warn("Redis unavailable, falling back to in-memory rate store:", error);
    }
  }

  // In-memory fallback
  const existing = inMemory.get(key);
  if (!existing || existing.resetAt <= now) {
    const entry = { count: 1, resetAt: now + WINDOW_SECONDS * 1000 };
    inMemory.set(key, entry);
    return entry;
  }

  existing.count += 1;
  inMemory.set(key, existing);
  return existing;
}

export async function getTTL(key: string): Promise<number> {
  const now = Date.now();
  if (redis) {
    try {
      const fullKey = `rl:${key}`;
      const ttl = await redis.ttl(fullKey);
      return Math.max(0, ttl);
    } catch {
      // fall through
    }
  }
  const entry = inMemory.get(key);
  if (!entry) return 0;
  return Math.max(0, Math.ceil((entry.resetAt - now) / 1000));
}
