# Compass — AI Career Guidance for Tamil Nadu Students

**From assessment to offer letter.** Compass is an end-to-end career guidance platform that helps students and early-career professionals in Tamil Nadu discover their ideal career, build the skills employers demand, craft resumes, practice interviews, and apply to real jobs — all in one place.

Built for Smart India Hackathon.

## Why Compass

Most career platforms stop at a recommendation quiz. Compass takes the journey all the way through, using the student's assessment data to personalize every downstream step:

1. **Assess** — psychometric + aptitude + skills assessment builds a full candidate profile.
2. **Discover** — 100+ curated career paths scored against the profile.
3. **Learn** — skill-gap analysis with free courses and weekly roadmaps.
4. **Build** — AI-generated, ATS-scored resumes and cover letters.
5. **Practice** — mock interviews with live AI feedback (STAR analysis, scores).
6. **Apply** — live Tamil Nadu jobs from Adzuna + AI-drafted application emails sent via SMTP.
7. **Track** — pipeline, offers, and daily goals on a single dashboard.

## Features

- **Personalized assessments**: aptitude (quantitative, verbal, logical), psychometric, skills and interest mapping.
- **AI career advice**: LLM-generated recommendations with realistic Indian salary ranges and market-demand outlook, grounded in the candidate's actual skills.
- **Job matching**: live openings across Tamil Nadu fetched from Adzuna, ranked by skill/career/interest overlap. Falls back to a curated offline database if the live feed is unavailable — the demo never breaks.
- **Email campaigns**: one-click AI-written application drafts (SMTP) with a built-in setup wizard, bulk-send with concurrency limits, and send history.
- **Resume builder**: AI resume writing, ATS keyword scoring, and copy improvements.
- **Interview practice**: mock interview sessions (technical, HR, behavioral, managerial, panel, coding) with question-by-question evaluation.
- **Internship matching**: AI-ranked internship matches with learning roadmaps.
- **Accessibility & UX**: i18n (English/Tamil), guided page tours, loading skeletons, offline-friendly defaults.
- **Security**: JWT sessions (httpOnly cookies), bcrypt password hashing, IP+account rate limiting on auth, input validation, sanitized email HTML.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: Prisma + PostgreSQL (models: users, assessments, career paths, skill gaps, job applications, sent emails, internships)
- **AI**: Groq (Llama 3.3 70B / Llama 3.1 8B) with automatic Gemini fallback
- **Email**: Nodemailer (SMTP)
- **Jobs**: Adzuna Jobs API
- **Styling**: Tailwind CSS 4, Framer Motion, Recharts, lucide-react

## Getting Started

Prerequisites: Node.js 20+, a PostgreSQL database, and API keys for the integrations you want to enable.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Signs auth session tokens |
| `GROQ_API_KEY` | No | Primary LLM provider (falls back to Gemini) |
| `GEMINI_API_KEY` | No | Fallback LLM provider |
| `ADZUNA_APP_ID` / `ADZUNA_API_KEY` | No | Live job feed (Tamil Nadu) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | No | Automatic email sending (also configurable in-app) |

The app is intentionally resilient: missing job/email keys degrade to curated offline data and in-app setup wizards instead of crashing.

## Scripts

```bash
npm run dev       # development server
npm run build     # prisma generate + production build
npm run start     # start production server
npm run lint      # ESLint
```

## Deployment

Deploy on Vercel — Prisma migrations run during the build and route handlers use serverless functions with extended timeouts for bulk email jobs.

## License

Internal use for Smart India Hackathon.
