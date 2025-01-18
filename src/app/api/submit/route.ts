import redis from "@/app/lib/redis";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Rate limit configuration
const RATE_LIMIT = 25; // maximum number of requests in window
const RATE_LIMIT_WINDOW = 60; // time in seconds

const API_KEY: string = process.env.GEMINI_AI_API_KEY || "";

export async function POST(req: Request) {
  const { description } = await req.json();

  if (!description) {
    return NextResponse.json(
      { message: "Description is required" },
      { status: 400 }
    );
  }

  // get the client's IP address:
  const ip = req.headers.get("x-forwarded-for");

  if (!ip) {
    return NextResponse.json(
      { message: "Unable to detect client IP" },
      { status: 400 }
    );
  }

  // define the Redis key:
  const rateLimitKey = `rate_limit:${ip}`;

  try {
    // check the current count of requests for this IP address(initially null):
    const currentCount = await redis.get(rateLimitKey);

    if (currentCount && parseInt(currentCount) >= RATE_LIMIT) {
      // if the limit is exceeded, return a 429 error:
      return NextResponse.json(
        { message: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // increment the request count for this IP:
    const newCount = await redis.incr(rateLimitKey);

    // Set the expiration time for the rate limit key (1 minute TTL)
    if (newCount === 1) {
      await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW); // Set TTL for 60 seconds
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a single engaging twitter tweet (of length at least 16 words) on the basis of this description: ${description}`;
    const result = await model.generateContent([prompt]);

    if (result && result.response) {
      const generatedTweet = result.response.text();
      return NextResponse.json({ tweet: generatedTweet });
    } else {
      throw new Error("Failed to generate tweet");
    }
  } catch (error: unknown) {
    console.error("Error generting tweet:", error);
    return NextResponse.json(
      { error: "Failed to generate tweet" },
      { status: 500 }
    );
  }
}
