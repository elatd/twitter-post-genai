// import redis from "@/app/lib/redis";
import OpenAI from "openai";
import { NextResponse } from "next/server";

// // rate limit configuration
// const RATE_LIMIT = 25; // maximum number of requests in window
// const RATE_LIMIT_WINDOW = 60; // time in seconds

const API_KEY: string = process.env.OPENAI_API_KEY || "";
interface ResponseType {
  description :string,
  options: Record<string,string>,
  apiKey: string
}
export async function POST(req: Request) {
  const { description, options={}, apiKey } :ResponseType = await req.json();

  if (!apiKey) {
    return NextResponse.json(
      { message: "API key is required" },
      { status: 400 }
    );
  }

  if (!description && !Object.values(options).some(value => value.trim() !== "")) {
    return NextResponse.json(
      { message: "Input is required" },
      { status: 400 }
    );
  }

  // // get the client's IP address:
  // const ip = req.headers.get("x-forwarded-for");

  // if (!ip) {
  //   return NextResponse.json(
  //     { message: "Unable to detect client IP" },
  //     { status: 400 }
  //   );
  // }

  // // define the Redis key:
  // const rateLimitKey = `rate_limit:${ip}`;

  try {
    // // check the current count of requests for this IP address(initially null):
    // const currentCount = await redis.get(rateLimitKey);

    // if (currentCount && parseInt(currentCount) >= RATE_LIMIT) {
    //   // if the limit is exceeded, return a 429 error:
    //   return NextResponse.json(
    //     { message: "Rate limit exceeded. Please try again later." },
    //     { status: 429 }
    //   );
    // }

    // // increment the request count for this IP:
    // const newCount = await redis.incr(rateLimitKey);

    // // set the expiration time for the rate limit key (1 minute TTL)
    // if (newCount === 1) {
    //   await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW); // Set TTL for 60 seconds
    // }

    const openai = new OpenAI({ apiKey });
    let prompt = `Generate 3 engaging twitter tweets (of length at least 16 words), make sure to separate each tweet with "###".\n` +
      `Follow these style rules:\n` +
      `- Be specific and anchor every tweet to at least one concrete detail (number, quote, micro-story, snippet).\n` +
      `- Mix the formats so the three tweets include styles like a single-liner, a thread opener ("1/"), a stat-drop, a question or a mini-story.\n` +
      `- Skip empty hype, avoiding terms such as "game-changer", "revolutionary" or "next-level".\n` +
      `- Talk in first-person unless a thread benefits from third-person.\n` +
      `- Use an informal, conversational tone and avoid corporate jargon.\n` +
      `- Do not include hashtags or emojis.\n` +
      `- Keep each tweet under 280 characters including thread numbers.\n` +
      `- Replace long dashes with simple hyphens.`;
    
    if(description) {
      prompt += ` The tweet should be based on this description: "${description}".`;
    }

  const selectedOptions = options ? Object.entries(options)
    .filter(([_, value]) => value.trim() !== "")
      .map(([key, value]) => `${key}: "${value}"`)
      .join(", ") : "";

    if (selectedOptions !== "") {
      prompt += ` Additionally, consider these aspects: ${selectedOptions}.`;
    }

    const result = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    if (result.choices[0]?.message?.content) {
      const generatedTweet = result.choices[0].message.content.trim().split('###').map(tweet => tweet.trim());

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
