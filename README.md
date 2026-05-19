# CragLog

A rock climbing session tracker I built because I wanted something I'd actually use. Every climbing app I found was either too minimal (just a logbook) or too bloated. I wanted something that actually shows me whether I'm progressing — not just a list of sessions.

## What It Does

- **Log sessions** — date, location (gym or outdoor crag), notes
- **Track routes** — grade, style (sport/trad/boulder/top rope), attempts, send or not
- **See your progress** — charts showing grade progression over time, success rate by grade, session volume
- **Real auth** — register and log in, your data is yours

Supports Yosemite (5.10a), V-Scale (V4), and French (6b) grading systems.

## Why I Built It

Mostly because I wanted something I'd actually use. It also gave me a reason to implement real authentication from scratch — I made some JWT mistakes early on (token expiry edge cases, refresh token rotation) that taught me a lot more than any tutorial would have. The stats module forced me to think seriously about SQL aggregation queries in a way that CRUD tutorials just don't.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (access + refresh token) |
| Charts | Recharts |

## Running Locally

### Prerequisites

- Node.js 18+
- PostgreSQL running locally (or a connection string from Render/Railway)

### Setup

```bash
# Clone the repo
git clone https://github.com/Norteez/craglog.git
cd craglog

# Server setup
cd server
cp .env.example .env       # fill in your DATABASE_URL and JWT secrets
npm install
npx prisma migrate dev     # runs migrations against your local DB
npm run dev                # starts on :3001

# Client setup (new terminal)
cd ../client
cp .env.local.example .env.local    # set VITE_API_URL=http://localhost:3001
npm install
npm run dev                          # starts on :5173
```

### Environment Variables

**server/.env**
```
DATABASE_URL=postgresql://user:password@localhost:5432/craglog
ACCESS_TOKEN_SECRET=your-secret-here
REFRESH_TOKEN_SECRET=your-other-secret-here
PORT=3001
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

**client/.env.local**
```
VITE_API_URL=http://localhost:3001
```

## API Overview

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/sessions
POST   /api/sessions
GET    /api/sessions/:id
PATCH  /api/sessions/:id
DELETE /api/sessions/:id

POST   /api/sessions/:id/routes
PATCH  /api/sessions/:id/routes/:routeId
DELETE /api/sessions/:id/routes/:routeId

GET    /api/stats/summary
GET    /api/stats/grades-over-time
GET    /api/stats/volume
GET    /api/stats/success-rate
```

## Project Structure

```
craglog/
├── client/          # React + Vite SPA
│   └── src/
│       ├── api/         # Axios client + per-resource modules
│       ├── components/  # Charts, session cards, layout
│       ├── context/     # Auth state
│       ├── hooks/       # useSessions, useStats, etc.
│       ├── pages/       # Dashboard, SessionLog, SessionDetail, etc.
│       └── types/       # Shared TypeScript interfaces
└── server/          # Node.js + Express API
    ├── prisma/          # Schema + migrations
    └── src/
        ├── config/      # Env validation, Prisma singleton
        ├── middleware/  # Auth, validation, error handling
        ├── modules/     # auth, sessions, routes, stats (feature-sliced)
        └── utils/       # JWT, bcrypt, grade sorting
```

## License

MIT
