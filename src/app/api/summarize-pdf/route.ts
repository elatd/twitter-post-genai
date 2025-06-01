import { NextResponse } from "next/server";
import OpenAI from "openai";
import pdfParse from "pdf-parse";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const apiKey = formData.get("apiKey") as string | null;

  if (!file) {
    return NextResponse.json({ message: "PDF file is required" }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ message: "API key is required" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdfParse(buffer);
    const text = data.text.slice(0, 15000);

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You summarize PDF text and respond in JSON." },
        { role: "user", content: `Summarize the following text in one short paragraph and list 3-5 bullet points highlighting the key ideas. Respond in JSON with keys 'summary' and 'bullets'. Text:\n${text}` }
      ],
      temperature: 0.5,
    });

    const content = completion.choices[0].message?.content || "";
    let summary = "";
    let bullets: string[] = [];
    try {
      const parsed = JSON.parse(content);
      summary = parsed.summary;
      bullets = parsed.bullets;
    } catch {
      summary = content;
    }

    return NextResponse.json({ summary, bullets });
  } catch (error) {
    console.error("Error summarizing PDF:", error);
    return NextResponse.json({ message: "Failed to summarize PDF" }, { status: 500 });
  }
}
