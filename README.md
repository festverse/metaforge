# ⚡ MetaForge: Meta Tag Generator & Auditor

A free, open-source tool for generating and auditing HTML meta tags for SEO and social media sharing. Built with Next.js (App Router) and deployed on Vercel.

## Features

### 🛠️ Generate Mode
- Fill in your page title, meta description, canonical URL, site name, OG image, and Twitter handle
- **Live previews** — see exactly how your page will appear on Google, Twitter/X, and Facebook/LinkedIn
- **Character counters** with color-coded status (green/yellow/red) for title and description
- **One-click copy** of the complete `<head>` code snippet with all OG and Twitter meta tags

### 🔍 Audit Mode
- Enter any live URL to fetch and analyze its meta tags
- Detects missing or malformed tags: title, description, Open Graph, Twitter Card, and canonical
- Displays clear, actionable issues with severity indicators
- **"Fix it" button** copies the audited data into the Generate form so you can correct and re-export

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (dark mode, glassmorphism design)
- **HTML Parsing**: [cheerio](https://cheerio.js.org/) (server-side only)
- **Deployment**: [Vercel](https://vercel.com/) (free Hobby plan)

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── api/audit/route.ts    → Serverless audit endpoint
├── globals.css           → Design system & all styles
├── layout.tsx            → Root layout + font + footer
└── page.tsx              → Tab shell (Generate / Audit)
components/
├── AuditPanel.tsx        → URL input, results, "Fix it" button
├── CodeOutput.tsx        → Generated <head> code + copy button
├── Footer.tsx            → Mandatory compliance footer
├── GeneratorForm.tsx     → Input fields + character counters
└── PreviewCards.tsx      → Google / Twitter / Facebook previews
```

## Deployment

This app is designed for Vercel's free Hobby plan. Connect the repo and every push auto-deploys.

The only serverless function is `POST /api/audit`, which fetches a URL server-side (to avoid CORS) and parses its meta tags with cheerio.

## License

MIT
