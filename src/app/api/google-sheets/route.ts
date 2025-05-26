import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { tweet } = await req.json();
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { message: "Google Sheets webhook URL not configured" },
      { status: 500 }
    );
  }

  if (!tweet) {
    return NextResponse.json(
      { message: "Tweet text is required" },
      { status: 400 }
    );
  }

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
