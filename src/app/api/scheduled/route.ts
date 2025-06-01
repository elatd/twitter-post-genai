import { NextResponse } from "next/server";
import { getScheduledTweets } from "../../lib/googleSheets";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const webhookUrl = searchParams.get("webhookUrl") || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const tweets = await getScheduledTweets(webhookUrl || undefined);
    return NextResponse.json({ tweets });
  } catch (error) {
    console.error("Error fetching scheduled tweets:", error);
    return NextResponse.json(
      { message: "Failed to fetch scheduled tweets" },
      { status: 500 }
    );
  }
}
