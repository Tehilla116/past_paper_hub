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

## Deploying to Cloudflare Pages

### Via Dashboard (easiest)

1. Push your repo to GitHub
2. In Cloudflare Dashboard → Pages → Connect to Git
3. Select your repo
4. Set build settings:
   - **Build command:** `cd client && npm install && npm run build`
   - **Build output:** `client/dist`
5. Deploy

### Via Wrangler CLI

```bash
npm install -g wrangler
wrangler pages deploy client/dist --branch main
```

Your frontend will be live at `https://your-project.pages.dev`. Update the Vite proxy in `client/vite.config.js` to point to your deployed backend URL in production.

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
