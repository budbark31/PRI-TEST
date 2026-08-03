import Redis from 'ioredis';

const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
console.log('Testing Redis at', url);

const redis = new Redis(url);

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
  process.exit(1);
});

(async function main() {
  try {
    const key = 'smoke:pri:test';
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 600);
    const ttl = await redis.ttl(key);
    console.log(`INCR -> ${count}, TTL -> ${ttl}s`);
    await redis.quit();
    process.exit(0);
  } catch (err) {
    console.error('Redis smoke failed:', err);
    process.exit(1);
  }
})();
