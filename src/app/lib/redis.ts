import Redis from "ioredis";

const redisPort = process.env.REDIS_PORT
  ? Number(process.env.REDIS_PORT)
  : 6379;

// log to check if redisPort is a valid number (to check redis connection error in prod)
if (isNaN(redisPort) || redisPort < 0 || redisPort >= 65536) {
  console.error(`Invalid Redis port: ${process.env.REDIS_PORT}`);
  throw new Error(`Invalid Redis port: ${process.env.REDIS_PORT}`);
}

const redis = new Redis({
  host: process.env.REDIS_HOST!,
  port: redisPort,
  password: process.env.REDIS_PASSWORD!,
  db: 0,
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("connect", () => {
  // Redis connected
});

export default redis;
