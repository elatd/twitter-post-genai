// import redis from "@/app/lib/redis";
import OpenAI from "openai";
import { NextResponse } from "next/server";

// // rate limit configuration
// const RATE_LIMIT = 25; // maximum number of requests in window
// const RATE_LIMIT_WINDOW = 60; // time in seconds

interface ResponseType {
  description :string,
  options: Record<string,string>,
  apiKey: string,
  platform: "twitter" | "youtube"
}
export async function POST(req: Request) {
  const { description, options={}, apiKey, platform } :ResponseType = await req.json();

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
    let prompt = platform === "twitter" 
      ? `Generate 3 engaging twitter tweets (of length at least 16 words), make sure to separate each tweet with "###".\n` +
        `Follow these style rules:\n` +
        `- Be specific and anchor every tweet to at least one concrete detail (number, quote, micro-story, snippet).\n` +
        `- Mix the formats so the three tweets include styles like a single-liner, a thread opener ("1/"), a stat-drop, a question or a mini-story.\n` +
        `- Skip empty hype, avoiding terms such as "game-changer", "revolutionary" or "next-level".\n` +
        `- Talk in first-person unless a thread benefits from third-person.\n` +
        `- Use an informal, conversational tone and avoid corporate jargon.\n` +
        `- Do not include hashtags or emojis.\n` +
        `- Keep each tweet under 280 characters including thread numbers.\n` +
        `- Replace long dashes with simple hyphens.`
      : `Generate 3 engaging YouTube video topics and outlines, make sure to separate each topic with "###".\n` +
        `Follow these style rules:\n` +
        `- Include a catchy title that would work well for YouTube.\n` +
        `- Provide a brief outline of key points to cover.\n` +
        `- Include specific examples, statistics, or demonstrations to reference.\n` +
        `- Suggest visual elements or B-roll footage ideas.\n` +
        `- Keep the content focused and engaging for the target audience.\n` +
        `- Avoid clickbait while maintaining viewer interest.\n` +
        `- Include a hook or opening that grabs attention in the first 30 seconds.`;
    
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
      const generatedContent = result.choices[0].message.content.trim().split('###').map(content => content.trim());

      return NextResponse.json({ content: generatedContent });
    } else {
      throw new Error(`Failed to generate ${platform} content`);
    }
  } catch (error: unknown) {
    console.error(`Error generating ${platform} content:`, error);
    return NextResponse.json(
      { error: `Failed to generate ${platform} content` },
      { status: 500 }
    );
  }
}
