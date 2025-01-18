import Redis from "ioredis";

// Log the environment variables to verify that they are being loaded correctly
console.log("Redis Host:", process.env.REDIS_HOST);
console.log("Redis Port:", process.env.REDIS_PORT);

const redisPort = process.env.REDIS_PORT
  ? Number(process.env.REDIS_PORT)
  : 6379;

// Log to check if redisPort is a valid number
if (isNaN(redisPort) || redisPort < 0 || redisPort >= 65536) {
  console.error(`Invalid Redis port: ${process.env.REDIS_PORT}`);
  throw new Error(`Invalid Redis port: ${process.env.REDIS_PORT}`);
}

const redis = new Redis({
  host: process.env.REDIS_HOST!, // Replace with your Redis host
  port: redisPort, // Default Redis port
  password: process.env.REDIS_PASSWORD!, // Optional password
  db: 0, // Default DB (you can change it if needed)
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

export default redis;
