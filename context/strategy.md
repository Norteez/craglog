# Strategy

## Current Focus Period

2-week MVP build sprint — started 2026-05-19

## Strategic Priorities

1. **Ship a working, deployed MVP** — Full auth, session CRUD, and at least 2 working charts live at a public URL. This is the portfolio artifact.

2. **Write production-quality code** — TypeScript throughout, Prisma for type-safe DB access, proper error handling, access/refresh token pattern. The code should hold up under a technical interview code review.

3. **Keep scope tight** — No social features, no image uploads, no native mobile app yet. Core loop only: log session → view progress → done.

4. **Learn by building** — Contribute key logic pieces myself (gradeUtils, stats queries, interceptor logic, form state management) rather than just accepting generated code.

## Build Phases

| Phase | Days | Goal |
|-------|------|------|
| Track 0 | Day 0 | Repo setup, context files, GitHub, README |
| Phase 1 | Days 1–2 | Server foundation: Express + Prisma schema + DB |
| Phase 2 | Days 3–4 | Auth API: register, login, refresh, logout |
| Phase 3 | Days 5–6 | Sessions + Routes API (full CRUD) |
| Phase 4 | Days 7–8 | Stats endpoints (chart-ready aggregations) |
| Phase 5 | Days 9–10 | React shell, AuthContext, auth pages |
| Phase 6 | Days 11–12 | Session log, detail, form, profile pages |
| Phase 7 | Days 13–14 | Dashboard charts, polish, deploy |

## What Success Looks Like

- App is live on a public URL
- A visitor can register, log a session with routes, and see progress on a chart
- Code is on GitHub with a strong README
- Can walk through every architectural decision in an interview

## Open Decisions / Tensions

- Whether to support multiple grade systems simultaneously in the UI (yes — design for it from day 1, even if Yosemite + V-scale dominate at launch)
- Mobile responsiveness: aim for responsive layout, do not optimize mobile-first for MVP
- Deployment target: Render or Railway for server + Postgres; Netlify or Vercel for client (decide at Phase 7)
