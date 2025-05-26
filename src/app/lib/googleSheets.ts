import { google } from 'googleapis';

export async function appendTweetToSheet(tweet: string) {
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
    range: `${sheetName}!A:A`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[tweet]],
    },
  });
}
