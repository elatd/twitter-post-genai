import { google } from 'googleapis';

export async function appendTweetToSheet(
  timestamp: string,
  tweet: string,
  tweetDate: string
) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Sheet1';
  const dateSheetName = process.env.GOOGLE_SHEETS_DATE_SHEET_NAME || 'tweet_date';

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

  const requiredHeaders = [
    'timestamp_incoming_webhook',
    'tweet',
    'tweet_date',
  ];

  // Ensure headers exist and are correct
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:C1`,
  });
  const currentHeaders = headerRes.data.values?.[0] || [];
  const headersMismatch = requiredHeaders.some(
    (h, i) => currentHeaders[i] !== h
  );
  if (headersMismatch) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:C1`,
      valueInputOption: 'RAW',
      requestBody: { values: [requiredHeaders] },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:C`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[timestamp, tweet, tweetDate]],
    },
  });

  // Ensure the tweet_date sheet exists
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetExists = spreadsheet.data.sheets?.some(
    (s) => s.properties?.title === dateSheetName
  );

  if (!sheetExists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: { title: dateSheetName },
            },
          },
        ],
      },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${dateSheetName}!A:C`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[timestamp, tweet, tweetDate]],
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
  timestamp_incoming_webhook?: string;
  posted?: string | boolean;
  Posted?: string | boolean;
}

export async function getScheduledTweets(webhookUrl?: string): Promise<ScheduledTweet[]> {
  if (webhookUrl) {
    console.log('Attempting to fetch tweets from webhook URL:', webhookUrl);
    try {
      const response = await fetch(webhookUrl);
      console.log('Webhook response status:', response.status);
      
      if (!response.ok) {
        console.error('Webhook response not OK:', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error('Failed to fetch scheduled tweets via webhook');
      }
      
      const data = await response.json();
      console.log('Received data from webhook:', data);
      
      // Handle both direct array and object containing tweets array
      let tweetsArray: WebhookTweet[];
      if (Array.isArray(data)) {
        tweetsArray = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.tweets)) {
        tweetsArray = data.tweets;
      } else {
        console.error('Unexpected data format:', data);
        throw new Error('Unexpected data format from webhook');
      }
      
      console.log('Processing webhook data...');
      return tweetsArray.map((item: WebhookTweet) => {
        const postedValue = item.posted ?? item.Posted ?? false;
        const posted = typeof postedValue === 'string'
          ? postedValue.toLowerCase() === 'true'
          : Boolean(postedValue);
        const tweet = {
          content: item.tweet ?? item.content ?? '',
          date: item.date ?? item.timestamp_incoming_webhook ?? '',
          posted,
        } as ScheduledTweet;
        console.log('Processed tweet:', tweet);
        return tweet;
      });
    } catch (error) {
      console.error('Error in getScheduledTweets:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
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
    range: sheetName,
  });

  const rows = res.data.values || [];
  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0];
  const idxTimestamp = headers.indexOf('timestamp_incoming_webhook');
  const idxTweet = headers.indexOf('tweet');
  const idxTweetDate = headers.indexOf('tweet_date');
  const idxPosted = headers.indexOf('posted');

  return rows.slice(1).map((row) => {
    const content =
      (idxTweet >= 0 ? row[idxTweet] : undefined) ?? row[0] ?? '';
    const date =
      (idxTweetDate >= 0 ? row[idxTweetDate] : undefined) ??
      (idxTimestamp >= 0 ? row[idxTimestamp] : undefined) ??
      row[1] ?? '';
    const postedVal =
      (idxPosted >= 0 ? row[idxPosted] : undefined) ?? row[2] ?? '';
    const posted = String(postedVal).toLowerCase() === 'true';
    return { content, date, posted } as ScheduledTweet;
  });
}