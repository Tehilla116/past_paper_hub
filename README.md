# Past Paper Hub

A full-stack web application for browsing, uploading, and managing past examination papers at Zambia University of Technology.

**Frontend:** React.js (Cloudflare Pages) · **Backend:** Express.js (Dokploy) · **Database:** PostgreSQL (auto-managed)

## Features

- Three roles: **Student** (view/download), **Lecturer** (upload/manage), **Admin** (full system control)
- Browse papers by School → Course → Year hierarchy
- Upload and download PDF, DOC, DOCX, PNG, JPG files
- Admin panel for managing schools, courses, and users

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 16+ installed (binaries available in PATH)

### 1. Start the Backend

```bash
cd server
npm install
npm run dev
```

This single command handles everything automatically:
- Starts PostgreSQL if not running
- Creates the `past_paper_hub` database
- Applies the schema and seed data
- Launches the Express server on port 3001

### 2. Start the Frontend

```bash
cd client
npm install
npm run dev
```

### 3. Open the app

Navigate to `http://localhost:5173`

## Seed Accounts

| Role     | Email                 | Password    |
|----------|-----------------------|-------------|
| Admin    | admin@zut.edu.zm      | password123 |
| Lecturer | lecturer@zut.edu.zm   | password123 |
| Student  | student@zut.edu.zm    | password123 |

## Deployment

### Frontend — Cloudflare Pages

1. Push repo to GitHub
2. Cloudflare Dashboard → Pages → Connect to Git → select repo
3. **Build command:** `cd client && npm install && npm run build`
4. **Build output:** `client/dist`
5. Deploy
6. Add environment variable: `VITE_API_URL` = your Dokploy backend URL
7. Redeploy

### Backend + Database — Dokploy (Docker Compose)

A `docker-compose.yml` is included at the project root.

1. In Dokploy, create a new project → **Compose** → **Import Compose**
2. Point it at `docker-compose.yml` from the repo
3. Add environment variables:

| Variable | Value |
|----------|-------|
| `DB_PASSWORD` | Choose a strong password |
| `SESSION_SECRET` | Run `openssl rand -hex 32` and paste |
| `CLIENT_ORIGIN` | Your Cloudflare Pages URL (e.g. `https://project.pages.dev`) |

4. Deploy

## Tech Stack

- **Frontend:** React 18, React Router, Vite, Pure CSS — Cloudflare Pages
- **Backend:** Express.js, multer, bcryptjs — Dokploy
- **Database:** PostgreSQL — auto-managed locally, Docker Compose in production
