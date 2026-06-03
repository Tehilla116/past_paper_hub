# Past Paper Hub

A full-stack web application for browsing, uploading, and managing past examination papers at Zambia University of Technology.

**Frontend:** React.js (Cloudflare Pages) · **Backend:** Express.js (Dokploy) · **Database:** PostgreSQL (Dokploy)

## Features

- Three roles: **Student** (view/download), **Lecturer** (upload/manage), **Admin** (full system control)
- Browse papers by School → Course → Year hierarchy
- Upload and download PDF, DOC, DOCX, PNG, JPG files
- Admin panel for managing schools, courses, and users

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 16+ (local development)

### 1. Local Database Setup

```bash
initdb -D /tmp/pg_data --username=your_user --auth=trust
pg_ctl -D /tmp/pg_data -o "-p 5435 -k /tmp" start
createdb -h /tmp -p 5435 past_paper_hub
psql -h /tmp -p 5435 -d past_paper_hub -f database/schema.sql
```

### 2. Seed the Database

Run the seed script (generates bcrypt hashes and inserts sample data) or manually insert:

```bash
psql -h /tmp -p 5435 -d past_paper_hub -f database/seed.sql
```

### 3. Start the Backend

```bash
cd server
npm install
npm run dev
```

### 4. Start the Frontend

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

## Deploying

### Frontend — Cloudflare Pages

1. Push your repo to GitHub
2. Cloudflare Dashboard → Pages → Connect to Git → select your repo
3. **Build command:** `cd client && npm install && npm run build`
4. **Build output:** `client/dist`
5. Deploy

### Backend — Dokploy

The `server/Dockerfile` is ready for Dokploy.

1. In Dokploy, create a new project and connect your GitHub repo
2. Set **Dockerfile path** to `server/Dockerfile`
3. Set **Port** to `3001`

### Database — Dokploy PostgreSQL

1. In your Dokploy project, add a **PostgreSQL** database service
2. Note the internal hostname (usually `postgres`) and credentials
3. Add these environment variables to your backend service:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://user:password@postgres:5432/past_paper_hub` |
| `PORT` | `3001` |
| `SESSION_SECRET` | A random secret string |

4. Run the schema against the Dokploy database:
   ```bash
   psql "$DATABASE_URL" -f database/schema.sql
   ```

5. Deploy the backend

Once deployed, update `client/vite.config.js` to proxy `/api` to your Dokploy backend URL.

## Seed Accounts

| Role     | Email                 | Password    |
|----------|-----------------------|-------------|
| Admin    | admin@zut.edu.zm      | password123 |
| Lecturer | lecturer@zut.edu.zm   | password123 |
| Student  | student@zut.edu.zm    | password123 |

## Tech Stack

- **Frontend:** React 18, React Router, Vite, Pure CSS — Cloudflare Pages
- **Backend:** Express.js, multer, bcryptjs — Dokploy
- **Database:** PostgreSQL — Dokploy
