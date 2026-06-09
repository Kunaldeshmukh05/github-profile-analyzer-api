# GitHub Profile Analyzer API

A backend service that fetches GitHub user profiles via the GitHub Public API, computes useful insights, and stores everything in a MySQL database.

---

## Features

- Analyze any public GitHub user profile
- Auto-calculate account age, follower-to-repo ratio, and developer popularity
- Store and retrieve analyzed profiles via REST API
- Re-analyzing the same user updates their record (no duplicates)
- Centralized error handling with consistent JSON responses
- Morgan request logging

---

## Tech Stack

| Layer       | Technology         |
|-------------|--------------------|
| Runtime     | Node.js 18+        |
| Framework   | Express.js         |
| Database    | MySQL              |
| HTTP Client | Axios              |
| Logging     | Morgan             |

---

## Project Structure

```
github-profile-analyzer/
├── database/
│   └── schema.sql
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── githubController.js
│   ├── services/
│   │   └── githubService.js
│   ├── repositories/
│   │   └── githubRepository.js
│   ├── routes/
│   │   └── githubRoutes.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── githubAnalyzer.js
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/github-profile-analyzer.git
cd github-profile-analyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=github_analyzer
```

### 4. Set up the database

Log into MySQL and run the schema file:

```bash
mysql -u root -p < database/schema.sql
```

Or paste the contents of `database/schema.sql` directly into your MySQL client.

### 5. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server starts at: `http://localhost:3000`

---

## API Endpoints

### POST `/api/github/analyze`

Fetches the GitHub profile, computes insights, and stores the result.

**Request Body:**
```json
{
  "username": "octocat"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile analyzed successfully",
  "data": {
    "id": 1,
    "github_id": 583231,
    "username": "octocat",
    "name": "The Octocat",
    "bio": null,
    "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4",
    "profile_url": "https://github.com/octocat",
    "company": "@github",
    "location": "San Francisco, CA",
    "public_repos": 8,
    "followers": 14000,
    "following": 9,
    "account_created_at": "2011-01-25T18:44:36.000Z",
    "account_age_years": 14,
    "followers_to_repo_ratio": 1750.00,
    "developer_popularity": "Popular",
    "analyzed_at": "2025-01-01T10:00:00.000Z",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "GitHub user 'unknown_user' not found"
}
```

---

### GET `/api/github/profiles`

Returns all stored analyzed profiles, newest first.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profiles fetched successfully",
  "data": [ ... ]
}
```

---

### GET `/api/github/profiles/:id`

Returns a single profile by its database ID.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": { ... }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Profile with id '99' not found"
}
```

---

### GET `/health`

Health check endpoint.

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Calculated Insights

| Field                    | Logic                                     |
|--------------------------|-------------------------------------------|
| `account_age_years`      | Current year − GitHub account creation year |
| `followers_to_repo_ratio`| followers ÷ public_repos (0 if no repos) |
| `developer_popularity`   | "Popular" if followers > 100, else "Growing" |

---

## Deployment on Render

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for full deployment instructions.

---

## Environment Variables

| Variable      | Description                   |
|---------------|-------------------------------|
| `PORT`        | Port the server listens on    |
| `DB_HOST`     | MySQL host                    |
| `DB_USER`     | MySQL username                |
| `DB_PASSWORD` | MySQL password                |
| `DB_NAME`     | MySQL database name           |
