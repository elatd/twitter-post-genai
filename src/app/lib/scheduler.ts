import cron from 'node-cron';
import { google } from 'googleapis';
import { sendTweet } from './twitterClient';

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

async function processSheet() {
  const now = new Date();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:C`,
  });
  const rows = res.data.values || [];
  for (let i = 1; i < rows.length; i++) {
    const [content, dateStr, posted] = rows[i];
    if (posted && posted.toLowerCase() === 'true') continue;
    if (!content || !dateStr) continue;
    const scheduled = new Date(dateStr);
    if (scheduled <= now) {
      try {
        await sendTweet(content);
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetName}!C${i + 1}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [['TRUE']] },
        });
      } catch (err) {
        console.error('Error posting tweet:', err);
      }
    }
  }
}

cron.schedule('*/5 * * * *', () => {
  processSheet().catch((e) => console.error(e));
});

processSheet().catch((e) => console.error(e));
