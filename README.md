# CareerOS

An AI career copilot for mapping evidence to a target role, building a learning plan, practicing skills, and comparing a profile with job descriptions.

## Run locally

```bash
npm install
npm run dev
```

The app works in local-demo mode without API credentials. Profile changes are saved in this browser.

## Connect Gemini

Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`. The key is used only by the server route at `/api/coach`; it is never exposed to the browser. The app uses Gemini for resume evidence extraction, job-description comparison, project planning, and interview feedback. If the key is missing, the app uses a clearly labeled local keyword scan where applicable.

## Connect Supabase

1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
2. Enable anonymous sign-ins in the Supabase Auth settings.
3. Run `supabase/schema.sql` in the Supabase SQL editor.

The browser creates an anonymous Supabase user and the table's row-level security policy restricts each profile to that user. Without these settings, the app remains local-first.

## Trust and scoring

Resume skill percentages are AI-estimated proficiency signals based on evidence, not objective measurements. Assessment history is shown separately as progress evidence. Job-match percentages describe overlap with the specific pasted description and are not a prediction of hiring outcomes. This MVP does not claim live job-market monitoring or execute submitted code.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
