# Auto-Trigger Course Extraction Backend

## Overview

This is a Node.js backend written in TypeScript for crawling, extracting, and monitoring online courses specifically from [courseopera]([https://courseopera.com](https://courspora.my.id/)) website. The system automates the scraping of course titles and URLs, leveraging Puppeteer for full-page JavaScript rendering, then processes the HTML with Cheerio for parsing. It additionally supports email notifications and can be triggered externally via API.

### Additional notes
- **Personal project**, primarily built for automating course updates.
- Suitable for deployment on **Vercel** with lightweight Chromium (`@sparticuz/chromium`).

***

## Features

- **Dynamic content rendering** with Puppeteer (or `@sparticuz/chromium` for serverless).
- Extracts specific course titles and URLs **without needing `ul`** entries explicitly.
- Sends email notifications with course information via **Nodemailer**.
- Provides an **API endpoint** (`/trigger-crawl`) to trigger crawling remotely.
- Supports **cross-origin requests** (limited to your extension or trusted sources).

***

## Tech Stack

- TypeScript
- Node.js
- Puppeteer / @sparticuz/chromium (for headless Chrome)
- Cheerio (DOM parsing)
- Express.js (API server)
- Nodemailer (email notifications)
- dotenv (manage secrets)
- CORS (secure cross-origin API calls)

***

## Getting Started

### Requirements

- Node.js >= 18
- pnpm (or npm/yarn)
- Gmail SMTP credentials (for email alerts)

### Setup

Clone the repository:

```bash
git clone https://github.com/KPorus/Auto-Trigger-course-extraction-backend.git
cd Auto-Trigger-course-extraction-backend
```

Install dependencies:

```bash
pnpm install
```

Configure environment variables:

```bash
# .env file
GMAIL=your-email@gmail.com
APP_PASS=your-app-password
EXTENSION_ID=your-extension-id-if-needed
```

### Run locally

```bash
pnpm run build
pnpm start
```

This starts an API server on port 4000, listening for external triggers or scheduled tasks.

***

## Usage

- **Trigger crawl manually**
  
  POST `http://localhost:4000/trigger-crawl`

- **Configure your extension or scheduler** to call this endpoint for automated updates.

- **Monitor output logs** for course extraction and email sent status.

***

## Deployment

### To Vercel

- Use [`@sparticuz/chromium`](https://github.com/Sparticuz/chromium) for Chromium in serverless.
- Prepare `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    { "src": "index.ts", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "index.ts" }
  ]
}
```
- Bundle with the regular production build process.

### Notes:
- Use environment variables to avoid secrets.
- Configure CORS for trusted origins/extensions.

***

## Customization & Personal Use

This repo is optimized for **personal automation tasks**:
- Focuses solely on **courseopera.com**, but can be extended.
- You can modify selectors without affecting core logic.
- Great for personal tracking or learning projects.

***

## License

MIT License — feel free to fork, modify, and deploy your own version!

***

## Conclusion

This repository automates course monitoring from a specific JavaScript-heavy website, ideal for personal use, educational projects, or lightweight automation. For larger-scale or production use, consider additional error handling, scheduling, and secure environment management.
