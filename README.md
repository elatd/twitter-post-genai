# AI-Powered Tweet Generator

An AI-driven tool that generates creative and engaging tweet ideas based on user-provided descriptions. This app leverages Google's generative AI model to quickly craft impactful tweets for various themes and tones. With a focus on speed and ease of use, it helps users create viral content effortlessly for social media platforms.

## Features

- 📝 Generate engaging tweets instantly.
- 🤖 Powered by advanced generative AI.
- ⏱️ Fast tweet suggestions in seconds.
- 🎨 Customizable tweet tone options.
- 🔒 Secure and private user data.
- 🚀 Built-in rate limiting for fair use.
- 🛠️ Easy integration via REST API.

## Tech Stack

**Client:** NextJS, Typescript, TailwindCSS

**Server:** NextJS, Typecript, Redis, Gemini

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

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```shell
GEMINI_AI_API_KEY = "Your gemini api key"
REDIS_PORT =
REDIS_HOST =
REDIS_PASSWORD =
NEXT_PUBLIC_BASE_URL = "Enter base url of you deployment"
GOOGLE_SHEETS_WEBHOOK_URL = "Webhook URL for saving tweets to Google Sheets (optional)"
GOOGLE_SHEETS_SPREADSHEET_ID = "Google Spreadsheet ID"
GOOGLE_SHEETS_CLIENT_EMAIL = "Service account client email"
GOOGLE_SHEETS_PRIVATE_KEY = "Service account private key"
GOOGLE_SHEETS_SHEET_NAME = "Worksheet name (optional, defaults to Sheet1)"
```

If `GOOGLE_SHEETS_WEBHOOK_URL` is omitted, the API route uses the Google Sheets API
with the above credentials to append each tweet to the first empty row of the
specified worksheet.

## Screenshots

![App Home](/public/App_home.png)
![App Working](/public/App_working.png)

## Authors

- [@Heismanish](https://www.github.com/Heismanish)

## Contributing

Contributions are always welcome!
