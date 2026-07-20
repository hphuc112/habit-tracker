# Habit Tracker

A full-stack habit tracker with flexible scheduling, streak analytics, and a GitHub-style contribution heatmap. Built with Next.js App Router, Supabase, and Tailwind CSS v4.

**Live demo:** [habit-tracker.tranhoangphucttb.dev](https://habit-tracker.tranhoangphucttb.dev/)

## Features

- **Auth** — Email/password sign up and log in via Supabase
- **Flexible habits** — Daily, weekly (calendar week), or custom rolling 7-day targets with grace days
- **Streaks** — Current streak, best streak, and completion rate per habit
- **Contribution heatmap** — Visual overview of recent activity (recent weeks aligned to the right)
- **Insights** — Best day of the week, habit correlations, and 12-week trend charts
- **Dark / light mode** — Shared cream/sand design tokens with the portfolio site

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) — CSS-first `@theme` tokens
- [Supabase](https://supabase.com/) — Postgres, auth, Row Level Security
- [Recharts](https://recharts.org/) — Insights charts
- [date-fns](https://date-fns.org/) — Date utilities

## Getting started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com/) project with `habits` and `habit_logs` tables (RLS enabled)

### Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Project structure

```
src/
├── app/                  # Routes (dashboard, insights, auth)
├── components/
│   ├── charts/           # Insights charts
│   ├── habits/           # Habit form, list, edit
│   ├── heatmap/          # Contribution heatmap
│   └── layout/           # App shell, theme toggle
└── lib/
    ├── actions/          # Server actions (CRUD, logging)
    ├── insights.ts       # Analytics helpers
    ├── streaks.ts        # Streak calculation
    └── supabase/         # Supabase clients
```

## Deploy

Deploy to [Vercel](https://vercel.com). Set the same environment variables in your project settings and add your production URL to Supabase auth redirect allowlist.

## License

Private portfolio project.
