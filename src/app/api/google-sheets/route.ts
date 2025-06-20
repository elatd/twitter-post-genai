import { NextResponse } from "next/server";
import { appendTweetToSheet } from "../../lib/googleSheets";

export async function POST(req: Request) {
  const {
    timestamp_incoming_webhook,
    tweet,
    tweet_date,
    webhookUrl: clientWebhookUrl,
  } = await req.json();

  if (!timestamp_incoming_webhook || !tweet || !tweet_date) {
    return NextResponse.json(
      { message: "timestamp_incoming_webhook, tweet and tweet_date are required" },
      { status: 400 }
    );
  }

  const finalDate: string = tweet_date;
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
      body: JSON.stringify({
        timestamp_incoming_webhook,
        tweet,
        tweet_date: finalDate,
      }),
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

  // When no webhook is provided, ensure that Google Sheets credentials exist
  if (
    !process.env.GOOGLE_SHEETS_SPREADSHEET_ID ||
    !process.env.GOOGLE_SHEETS_CLIENT_EMAIL ||
    !process.env.GOOGLE_SHEETS_PRIVATE_KEY
  ) {
    return NextResponse.json(
      { message: "Google Sheets configuration not found" },
      { status: 500 }
    );
  }

  try {
    await appendTweetToSheet(
      timestamp_incoming_webhook,
      tweet,
      finalDate
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error exporting tweet to Google Sheets:", error);
    return NextResponse.json(
      { message: "Failed to export tweet" },
      { status: 500 }
    );
  }
}
