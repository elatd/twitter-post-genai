import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY: string = process.env.GEMINI_AI_API_KEY || "";

export async function POST(req: Request) {
  const { description } = await req.json();

  if (!description) {
    return NextResponse.json(
      { message: "Description is required" },
      { status: 400 }
    );
  }

  try {
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
