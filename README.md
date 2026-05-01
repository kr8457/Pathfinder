# PathFinder AI

PathFinder AI is an intelligent tool that helps students find the best university programs and internships using AI-driven recommendations.

## Environment Setup

To run this project, you need to set up your environment variables. 

1.  **Create a `.env.local` file** in the root directory.
2.  **Copy the contents** of `.env.example` into `.env.local`.
3.  **Fill in your API keys**:
    *   `GOOGLE_GENERATIVE_AI_API_KEY`: Get your free key from [Google AI Studio](https://aistudio.google.com/).
    *   `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Found in your [Supabase Dashboard](https://supabase.com/) under Project Settings > API.
    *   `EMBED_SECRET_KEY`: A random string for internal security (ask the project lead if you need a specific one).

> [!IMPORTANT]
> Never commit your `.env.local` file to GitHub. It is already included in `.gitignore`.

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
