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

function columnToLetter(column: number): string {
  let temp = '';
  let col = column + 1;
  while (col > 0) {
    const remainder = (col - 1) % 26;
    temp = String.fromCharCode(65 + remainder) + temp;
    col = Math.floor((col - 1) / 26);
  }
  return temp;
}

async function processSheet() {
  const now = new Date();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetName,
  });

  const rows = res.data.values || [];
  if (rows.length === 0) return;

  const headers = rows[0];
  const idxTimestamp = headers.indexOf('timestamp_incoming_webhook');
  const idxTweet = headers.indexOf('tweet');
  const idxDate = headers.indexOf('tweet_date');
  let idxPosted = headers.indexOf('posted');

  if (idxPosted === -1) {
    idxPosted = headers.length;
    const headerRange = `${sheetName}!${columnToLetter(idxPosted)}1`;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: headerRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [['posted']] },
    });
  }

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const content = (idxTweet >= 0 ? row[idxTweet] : row[1]) || '';
    const dateStr =
      (idxDate >= 0 ? row[idxDate] : undefined) ??
      (idxTimestamp >= 0 ? row[idxTimestamp] : undefined) ??
      row[2] ?? '';
    const posted = row[idxPosted];

    if (posted && typeof posted === 'string' && posted.toLowerCase() === 'true') continue;
    if (!content || !dateStr) continue;
    const scheduled = new Date(dateStr);
    if (isNaN(scheduled.getTime())) continue;
    if (scheduled <= now) {
      try {
        await sendTweet(content);
        const updateRange = `${sheetName}!${columnToLetter(idxPosted)}${i + 1}`;
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: updateRange,
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
