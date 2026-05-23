import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    // forces redis to reconnect with server with little delay
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => console.log("🛢️  Redis connected successfully"));
redis.on("error", (err) => console.error("❌ Redis connection error:", err));



export const scanKeys = async (pattern: string): Promise<string[]> => {
  const keys: string[] = [];
  let cursor = "0"; // ioredis used strings for cursor
  do {
    // ioredis syntax: redis.scan(cursor, 'MATCH', pattern, 'COUNT', '100')
    const [nextCursor, batchKeys] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      "100"
    );

    cursor = nextCursor;
    keys.push(...batchKeys);
  } while (cursor !== "0"); // Loop until cursor is "0" again

  return keys;
};
