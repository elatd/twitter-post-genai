import { NextResponse } from "next/server";
import { getScheduledTweets } from "../../lib/googleSheets";

export async function GET() {
  try {
    const tweets = await getScheduledTweets();
    return NextResponse.json({ tweets });
  } catch (error) {
    console.error("Error fetching scheduled tweets:", error);
    return NextResponse.json(
      { message: "Failed to fetch scheduled tweets" },
      { status: 500 }
    );
  }
}
