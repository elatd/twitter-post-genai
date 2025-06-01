# AI-Powered Tweet Generator

An AI-driven tool that generates creative and engaging tweet ideas based on user-provided descriptions. This app leverages OpenAI's GPT-4 model to quickly craft impactful tweets for various themes and tones. With a focus on speed and ease of use, it helps users create viral content effortlessly for social media platforms.

## Features

- 📝 Generate engaging tweets instantly.
 - 🤖 Powered by OpenAI's GPT-4.
- ⏱️ Fast tweet suggestions in seconds.
- 🎨 Customizable tweet tone options.
- 🔒 Secure and private user data.
- 🚀 Built-in rate limiting for fair use.
- 🛠️ Easy integration via REST API.
- 📅 View scheduled tweets saved in your Google Sheet.

## Tech Stack

**Client:** NextJS, Typescript, TailwindCSS

**Server:** NextJS, TypeScript, Redis, OpenAI

## API Reference

#### Generate tweet

```http
  POST /api/submit
```

| Parameter     | Type     | Description                              |
| :------------ | :------- | :--------------------------------------- |
| `description` | `string` | Specify your requirements for the tweet. |

## Run Locally

1. Clone the project

```bash
  git clone https://github.com/Heismanish/twitter-post-genai
```

2. Go to the project directory

```bash
  cd twitter-post-genai
```

3. Install dependencies

```bash
  npm install
```

4. Start the server

```bash
 npm run dev
```

5. Start the scheduler (optional)

```bash
  npm run start:scheduler
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```shell
OPENAI_API_KEY = "Your OpenAI API key"
REDIS_PORT =
REDIS_HOST =
REDIS_PASSWORD =
NEXT_PUBLIC_BASE_URL = "Base url of your deployment (optional)"
GOOGLE_SHEETS_WEBHOOK_URL = "Webhook URL for saving tweets to Google Sheets (optional)"
GOOGLE_SHEETS_SPREADSHEET_ID = "Google Spreadsheet ID"
GOOGLE_SHEETS_CLIENT_EMAIL = "Service account client email"
GOOGLE_SHEETS_PRIVATE_KEY = "Service account private key"
GOOGLE_SHEETS_SHEET_NAME = "Worksheet name (optional, defaults to Sheet1)"
GOOGLE_SHEETS_DATE_SHEET_NAME = "Sheet name for tweet dates (optional, defaults to tweet_date)"
TWITTER_API_KEY = "Twitter API key"
TWITTER_API_SECRET = "Twitter API secret"
TWITTER_ACCESS_TOKEN = "Twitter access token"
TWITTER_ACCESS_SECRET = "Twitter access secret"
```

If `NEXT_PUBLIC_BASE_URL` is not provided, the frontend uses relative paths for API requests.

If `GOOGLE_SHEETS_WEBHOOK_URL` is omitted, the API route uses the Google Sheets API
with the above credentials to append each tweet to the first empty row of the
specified worksheet.

The scheduler uses the Twitter environment variables above to post tweets
automatically based on entries in your Google Sheet.

The web app now includes a **Scheduled** tab where you can view upcoming tweets
from your spreadsheet. When you provide a Google Sheets webhook on the Generate
page, the URL is stored locally so the Scheduled tab can fetch tweets from the
same sheet.

## Screenshots

![App Home](/public/App_home.png)
![App Working](/public/App_working.png)

## Authors

- [@Heismanish](https://www.github.com/Heismanish)

## Contributing

Contributions are always welcome!
