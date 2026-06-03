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

## Deployment Guide

---

## 1. Deploy Backend + Database (Dokploy with Docker Compose)

A `docker-compose.yml` is included at the project root. This bundles both the Express backend and PostgreSQL into one stack.

### Step 1: Push to GitHub

```bash
git push origin main
```

### Step 2: Import the stack into Dokploy

1. Log into your Dokploy dashboard
2. Click **"Create a new project"** → name it `past-paper-hub`
3. Go to **"Compose"** → **"Import Compose"**
4. Connect your GitHub repo and select the `docker-compose.yml` file
5. Add these **environment variables** (they fill in the `${}` placeholders in the compose file):

| Variable | Value |
|----------|-------|
| `DB_PASSWORD` | Choose a strong password |
| `SESSION_SECRET` | Run `openssl rand -hex 32` and paste the output |

6. Click **"Deploy"**

Dokploy will:
- Spin up **PostgreSQL 16** with the schema automatically applied
- Build and start the **Express backend** (waits for the database to be healthy)
- Attach persistent volumes so data and uploads survive restarts

Your backend will be available at the URL Dokploy assigns it.

---

## 2. Deploy the Frontend (Cloudflare Pages)

### Step 1: Connect Cloudflare to GitHub

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages**
2. Click **"Connect to Git"** → select your repo → **"Begin setup"**

### Step 2: Configure build settings

| Setting | Value |
|---------|-------|
| **Build command** | `cd client && npm install && npm run build` |
| **Build output** | `client/dist` |

### Step 3: Deploy

Click **"Save and Deploy"**. Once done, you'll get a URL like `https://your-project.pages.dev`.

### Step 4: Point the frontend to your backend

The `vite.config.js` already supports a `VITE_API_URL` environment variable for production.

In Cloudflare Pages → your project → **Settings** → **Environment variables** → **Add variable**:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-dokploy-backend-url.com` |

Add it for **Production**, then go to the **Deployments** tab and redeploy. Done.

---

## Local Development with Docker Compose

Same compose file works locally — no Dokploy needed:

```bash
docker compose up --build
```

This starts PostgreSQL on port 5432 and the backend on port 3001. The frontend still runs separately:

```bash
cd client && npm run dev
```

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
