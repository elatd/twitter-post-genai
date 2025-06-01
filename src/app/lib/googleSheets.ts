import { google } from 'googleapis';

export async function appendTweetToSheet(tweet: string, date: string) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Sheet1';

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new Error('Google Sheets environment variables not configured');
  }

  const auth = new google.auth.JWT(
    clientEmail,
    undefined,
    privateKey.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:B`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[tweet, date]],
    },
  });
}

export interface ScheduledTweet {
  content: string;
  date: string;
  posted: boolean;
}

export interface WebhookTweet {
  tweet?: string;
  content?: string;
  date?: string;
  posted?: string | boolean;
  Posted?: string | boolean;
}

export async function getScheduledTweets(webhookUrl?: string): Promise<ScheduledTweet[]> {
  if (webhookUrl) {
    const response = await fetch(webhookUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch scheduled tweets via webhook');
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Unexpected data format from webhook');
    }
    return data.map((item: WebhookTweet) => {
      const postedValue = item.posted ?? item.Posted ?? false;
      const posted = typeof postedValue === 'string'
        ? postedValue.toLowerCase() === 'true'
        : Boolean(postedValue);
      return {
        content: item.tweet ?? item.content ?? '',
        date: item.date ?? '',
        posted,
      } as ScheduledTweet;
    });
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Sheet1';

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new Error('Google Sheets environment variables not configured');
  }

  const auth = new google.auth.JWT(
    clientEmail,
    undefined,
    privateKey.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
  );

  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:C`,
  });

  const rows = res.data.values || [];
  return rows.slice(1).map((row) => ({
    content: row[0] || '',
    date: row[1] || '',
    posted: (row[2] || '').toLowerCase() === 'true',
  }));
}

