import Redis from "ioredis";
console.log(process.env.REDIS_PORT);
const redis = new Redis({
  host: process.env.REDIS_HOST!, // Replace with your Redis host
  port: Number(process.env.REDIS_PORT!), // Default Redis port
  password: process.env.REDIS_PASSWORD!, // Optional password
  db: 0, // Default DB (you can change it if needed)
});

export default redis;
