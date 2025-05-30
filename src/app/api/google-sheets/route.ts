import { NextResponse } from "next/server";
import { appendTweetToSheet } from "../../lib/googleSheets";

export async function POST(req: Request) {
  const { tweet, webhookUrl: clientWebhookUrl } = await req.json();
  const webhookUrl = clientWebhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!tweet) {
    return NextResponse.json(
      { message: "Tweet text is required" },
      { status: 400 }
    );
  }

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tweet }),
      });

      if (!response.ok) {
        throw new Error(`Failed to export tweet: ${response.statusText}`);
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error exporting tweet to Google Sheets:", error);
      return NextResponse.json(
        { message: "Failed to export tweet" },
        { status: 500 }
      );
    }
  }

  try {
    await appendTweetToSheet(tweet);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error exporting tweet to Google Sheets:", error);
    return NextResponse.json(
      { message: "Failed to export tweet" },
      { status: 500 }
    );
  }
}
