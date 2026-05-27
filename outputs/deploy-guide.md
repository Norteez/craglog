# CragLog Deploy Guide

Two services to deploy: the server (Node + Postgres) and the client (React SPA).
Recommended: **Render** for the server + database, **Netlify** for the client.
Both have free tiers that work for a portfolio app.

---

## Step 1 — Install PostgreSQL locally (to run migrations)

```bash
brew install postgresql@16
brew services start postgresql@16
```

Then create the database and run the migration:

```bash
cd server
createdb craglog
npx prisma migrate dev --name init
```

This creates all four tables in your local DB. Confirm with:

```bash
npx prisma studio   # opens a browser GUI at localhost:5555
```

---

## Step 2 — Deploy server to Render

1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repo (`Norteez/craglog`)
3. Settings:
   - **Root directory:** `server`
   - **Build command:** `npm install && npm run build && npx prisma generate`
   - **Start command:** `node dist/server.js`
   - **Environment:** Node

4. Add environment variables (Render dashboard → Environment):
   ```
   DATABASE_URL        (from the Render Postgres instance — see below)
   ACCESS_TOKEN_SECRET (generate: openssl rand -base64 32)
   REFRESH_TOKEN_SECRET (generate: openssl rand -base64 32)
   NODE_ENV            production
   CLIENT_ORIGIN       https://your-netlify-app.netlify.app
   PORT                (Render sets this automatically — leave unset)
   ```

5. Create a **Postgres** instance on Render (New → PostgreSQL), copy the Internal Database URL into `DATABASE_URL` above.

6. After the first deploy, run the migration against production:
   - In Render's shell tab for the web service:
   ```bash
   npx prisma migrate deploy
   ```

---

## Step 3 — Deploy client to Netlify

1. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
2. Connect `Norteez/craglog`
3. Settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`

4. Add environment variable:
   ```
   VITE_API_URL    https://your-render-app.onrender.com
   ```
   (This is the URL of your Render web service.)

5. Deploy. Netlify gives you a URL like `https://craglog-abc123.netlify.app`.

6. Go back to Render and update `CLIENT_ORIGIN` to that Netlify URL, then redeploy the server.

---

## Step 4 — Verify end-to-end

1. Open the Netlify URL in a fresh browser (no prior session)
2. Register a new account
3. Log a session with 2-3 routes
4. Navigate to Dashboard — confirm the charts render with your data
5. Close the tab, reopen — confirm you're still logged in (silent refresh works)
6. Log out — confirm you're redirected to `/login`

---

## Custom domain (optional)

Both Render and Netlify support custom domains on the free tier.
Add your domain in their dashboards and point your DNS records as instructed.
Update `CLIENT_ORIGIN` on Render and `VITE_API_URL` on Netlify to the custom URLs.

---

## README update

Once deployed, add the live URL to the top of `README.md`:

```markdown
**Live:** https://craglog.netlify.app
```
