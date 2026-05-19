# Business Info

## Project: CragLog

A rock climbing session tracker — currently a portfolio project with real-product potential.

## What It Does

Allows climbers to log sessions: location (gym or outdoor crag), routes attempted, grades, success/fail outcome per route, and notes. Surfaces progress over time through charts and aggregate stats. Multi-user with real JWT auth.

## Target User

Rock climbers who want to track progression seriously — gym climbers and outdoor sport/trad/boulder climbers. The gap: lifters have Strong, runners have Strava, cyclists have Komoot. Climbers have nothing purpose-built for session logging at this level of detail.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL (via Prisma ORM) |
| Auth | JWT — access token in memory, refresh token in httpOnly cookie |
| Charts | Recharts |
| Grade systems | Yosemite (5.10a), V-Scale (V4), French (6b) — all three at launch |

## GitHub

- Repo: `github.com/Norteez/craglog`
- Main branch: `main`

## Current Stage

Pre-launch. In active development. No users yet.

## Potential Business Direction (if productized)

Freemium model: free tier for basic session logging, paid tier for advanced analytics, export, and social/comparison features. Could expand to gym partnerships (route setters logging beta) or coaching tools.
