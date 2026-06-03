# Past Paper Hub

A full-stack web application for browsing, uploading, and managing past examination papers at Zambia University of Technology.

**Frontend:** React.js (hosted on Cloudflare Pages) · **Backend:** Express.js · **Database:** PostgreSQL / Supabase

## Features

- Three roles: **Student** (view/download), **Lecturer** (upload/manage), **Admin** (full system control)
- Browse papers by School → Course → Year hierarchy
- Upload and download PDF, DOC, DOCX, PNG, JPG files
- Admin panel for managing schools, courses, and users

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 16+ (local) — or a Supabase project

### 1. Database Setup

**Option A — Local PostgreSQL:**

```bash
initdb -D /tmp/pg_data --username=your_user --auth=trust
pg_ctl -D /tmp/pg_data -o "-p 5435 -k /tmp" start
createdb -h /tmp -p 5435 past_paper_hub
psql -h /tmp -p 5435 -d past_paper_hub -f database/schema.sql
```

**Option B — Supabase (recommended for persistence):**

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings → Database → Connection string
3. Copy the connection string (starts with `postgresql://...`)
4. Run the schema against it:
   ```bash
   psql "$YOUR_SUPABASE_CONNECTION_STRING" -f database/schema.sql
   ```

### 2. Seed the Database

```bash
# Generate a bcrypt hash for "password123" and run the INSERT
# or use your Supabase SQL editor to run database/seed.sql
```

### 3. Start the Backend

```bash
cd server
npm install

# For local Postgres (uses /tmp socket):
npm run dev

# For Supabase (uses DATABASE_URL env var):
DATABASE_URL="postgresql://..." npm run dev
```

### 4. Start the Frontend

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

## Deploying the Frontend — Cloudflare Pages

1. Push your repo to GitHub
2. In Cloudflare Dashboard → Pages → Connect to Git → select your repo
3. **Build command:** `cd client && npm install && npm run build`
4. **Build output:** `client/dist`
5. Deploy

## Deploying the Backend — Dokploy

The backend has a `server/Dockerfile` ready for Dokploy.

1. In Dokploy, create a new project and connect your GitHub repo
2. Set **Dockerfile path** to `server/Dockerfile`
3. Set **Port** to `3001`
4. Add environment variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Supabase connection string |
| `PORT` | `3001` |
| `SESSION_SECRET` | A random secret string |

5. Deploy

Once deployed, update `client/vite.config.js` to proxy `/api` to your Dokploy backend URL instead of `localhost:3001`.

## Seed Accounts

| Role     | Email                 | Password    |
|----------|-----------------------|-------------|
| Admin    | admin@zut.edu.zm      | password123 |
| Lecturer | lecturer@zut.edu.zm   | password123 |
| Student  | student@zut.edu.zm    | password123 |

## Tech Stack

- **Frontend:** React 18, React Router, Vite, Pure CSS — hosted on Cloudflare Pages
- **Backend:** Express.js, multer, bcryptjs
- **Database:** PostgreSQL (local or Supabase)
