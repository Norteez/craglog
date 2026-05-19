# Current Data

## Build Status

| Phase | Item | Status |
|-------|------|--------|
| Track 0 | Context files updated | ✅ Done |
| Track 0 | Git repo initialized | Pending |
| Track 0 | GitHub repo created | Pending |
| Track 0 | README written | Pending |
| Phase 1 | Server npm init + tsconfig | Pending |
| Phase 1 | Prisma schema + migration | Pending |
| Phase 1 | Express app + /health endpoint | Pending |
| Phase 2 | jwt.ts + hash.ts utils | Pending |
| Phase 2 | gradeUtils.ts (human contribution) | Pending |
| Phase 2 | Auth module (register/login/refresh/logout) | Pending |
| Phase 2 | auth.middleware.ts | Pending |
| Phase 3 | Sessions + Routes CRUD | Pending |
| Phase 3 | validate.middleware + error.middleware | Pending |
| Phase 4 | Stats service (4 aggregation queries) | Pending |
| Phase 5 | Vite + React + TS client setup | Pending |
| Phase 5 | axiosClient + refresh interceptor (human contribution) | Pending |
| Phase 5 | AuthContext + AppRoutes + auth pages | Pending |
| Phase 6 | SessionLog, SessionDetail, SessionForm | Pending |
| Phase 6 | SessionForm route list management (human contribution) | Pending |
| Phase 7 | Dashboard charts (Recharts) | Pending |
| Phase 7 | Deploy (server + client) | Pending |

## Technical Decisions Made

- Database: PostgreSQL (over MongoDB) — relational data, complex GROUP BY for charts, real-app scalability
- ORM: Prisma — type safety, auto-generated types, migration management
- Auth: JWT access token in memory (15m) + refresh token in httpOnly cookie (7d, stored in DB)
- Grade storage: plain string + GradeSystem enum — supports all 3 systems without complex mapping
- API structure: modules pattern (auth, sessions, routes, stats) — feature-sliced, not layer-sliced
- Refresh token rotation: old token deleted on every use, new one issued

## Known Blockers

None. Pre-development.

## Key References

- Plan file: `/Users/orteez/.claude/plans/okay-help-me-plan-glowing-noodle.md`
- GitHub: `github.com/Norteez/craglog`
- Prisma docs: https://www.prisma.io/docs
- Recharts docs: https://recharts.org/en-US/api
- Render (server hosting): https://render.com
- Railway (alt server hosting): https://railway.app
