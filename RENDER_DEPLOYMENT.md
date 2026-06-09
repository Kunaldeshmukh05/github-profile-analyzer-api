# Render Deployment Guide

This guide covers deploying the GitHub Profile Analyzer API on [Render](https://render.com) with a managed MySQL database.

---

## Prerequisites

- GitHub account with this project pushed to a repository
- Render account (free tier is sufficient to start)
- A MySQL database (options below)

---

## Step 1 — Set Up MySQL Database

Render does not offer managed MySQL on the free tier, so use one of these free options:

### Option A — PlanetScale (Recommended)

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new database (e.g. `github-analyzer`)
3. Create a branch (the default `main` branch works)
4. Click **Connect** → choose **Node.js** → copy the connection string values
5. Run the schema against PlanetScale:
   - Go to **Console** in PlanetScale dashboard
   - Paste the contents of `database/schema.sql` (skip the `CREATE DATABASE` and `USE` lines — PlanetScale manages this)

### Option B — Aiven (also free tier)

1. Sign up at [aiven.io](https://aiven.io)
2. Create a **MySQL** service
3. Copy the host, user, password, port, and database name from the **Connection info** panel
4. Run `database/schema.sql` via the Aiven console or a local MySQL client connected to the remote host

---

## Step 2 — Deploy Backend on Render

1. Log into [render.com](https://render.com) and click **New → Web Service**
2. Connect your GitHub account and select this repository
3. Configure the service:

| Setting         | Value                        |
|-----------------|------------------------------|
| **Name**        | github-profile-analyzer      |
| **Region**      | Choose closest to your users |
| **Branch**      | main                         |
| **Runtime**     | Node                         |
| **Build Command** | `npm install`              |
| **Start Command** | `npm start`                |

4. Click **Add Environment Variable** and add each of the following:

| Key           | Value                         |
|---------------|-------------------------------|
| `PORT`        | `3000`                        |
| `DB_HOST`     | Your MySQL host               |
| `DB_USER`     | Your MySQL username           |
| `DB_PASSWORD` | Your MySQL password           |
| `DB_NAME`     | `github_analyzer`             |

5. Click **Create Web Service**

Render will install dependencies and start the server automatically. Your API will be live at:

```
https://github-profile-analyzer.onrender.com
```

---

## Step 3 — Verify Deployment

Hit the health check endpoint:

```bash
curl https://github-profile-analyzer.onrender.com/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

Then test a profile analysis:

```bash
curl -X POST https://github-profile-analyzer.onrender.com/api/github/analyze \
  -H "Content-Type: application/json" \
  -d '{"username": "octocat"}'
```

---

## Notes

- Render free-tier web services spin down after 15 minutes of inactivity. The first request after a cold start takes ~30 seconds.
- For always-on uptime, upgrade to a paid Render plan or use a service like [UptimeRobot](https://uptimerobot.com) to ping `/health` every 10 minutes.
- Never commit your `.env` file. Use Render's environment variable dashboard for all secrets.
