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

## 1. Deploy the Database (Dokploy)

This must be done **first** — the backend needs a database to connect to.

### Step 1: Create a PostgreSQL service in Dokploy

1. Log into your Dokploy dashboard
2. Click **"Create a new project"** → give it a name (e.g. `past-paper-hub`)
3. Inside the project, click **"Databases"** → **"Create Database"**
4. Choose **PostgreSQL** and fill in:
   - **Database name:** `past_paper_hub`
   - **User:** `postgres` (or whatever you prefer)
   - **Password:** type a password and **save it somewhere**
5. Click **Create**. Dokploy will spin up a PostgreSQL container.
6. Once it's running, click on the database service to see its details. Note the **internal hostname** — it's usually the service name you gave it, e.g. `postgres` (this is the Docker DNS name other containers use to reach it).

### Step 2: Run the schema against it

From your local machine (with `psql` installed), connect using the Dokploy database's **external** connection string:

```bash
psql "postgresql://postgres:YOUR_PASSWORD@YOUR_DOKPLOY_IP:5432/past_paper_hub" -f database/schema.sql
```

You can get the external IP and port from the Dokploy database service details page.

---

## 2. Deploy the Backend (Dokploy)

### Step 1: Add the backend service

1. In your same Dokploy project, click **"Services"** → **"Create Service"**
2. Choose **"Docker"** and connect your GitHub repository
3. Set the following:

| Setting | Value |
|---------|-------|
| Service name | `server` |
| Dockerfile path | `server/Dockerfile` |
| Port | `3001` |
| Protocol | HTTP |

### Step 2: Add environment variables

In the **Environment** section, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://postgres:YOUR_PASSWORD@postgres:5432/past_paper_hub` |
| `PORT` | `3001` |
| `SESSION_SECRET` | (generate a random string — e.g. `openssl rand -hex 32`) |

**Important:** The hostname `postgres` in the DATABASE_URL is the **Docker internal hostname** of your Dokploy PostgreSQL service (not your local machine). If you named the database service something else, use that name instead.

### Step 3: Deploy

Click **"Deploy"**. Dokploy will build the Docker image from `server/Dockerfile`, start the container, and connect it to the database.

Once deployed, note the **URL** Dokploy gives you (e.g. `https://server-your-project.dokploy.app` or an IP:port). You'll need this for the frontend.

---

## 3. Deploy the Frontend (Cloudflare Pages)

### Step 1: Push your repo to GitHub

```bash
git push origin main
```

### Step 2: Connect Cloudflare to your GitHub repo

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages**
2. Click **"Connect to Git"** → choose your GitHub repo
3. Click **"Begin setup"**

### Step 3: Configure build settings

Set these exactly:

| Setting | Value |
|---------|-------|
| **Build command** | `cd client && npm install && npm run build` |
| **Build output** | `client/dist` |
| **Root directory** | (leave blank — keep default) |

### Step 4: Deploy

Click **"Save and Deploy"**. Cloudflare will build and publish your site.

Once done, you'll get a URL like `https://your-project.pages.dev`.

### Step 5: Point the frontend to your backend

Your local `vite.config.js` proxies `/api` to `localhost:3001` for development. On Cloudflare, you need the frontend to call your Dokploy backend instead.

**Option A — Update the proxy URL (recommended for now):**

In `client/vite.config.js`, change the proxy target to your Dokploy backend URL:

```js
server: {
  proxy: {
    '/api': {
      target: 'https://server-your-project.dokploy.app',
      changeOrigin: true,
    },
  },
},
```

Then rebuild and redeploy on Cloudflare Pages.

**Option B — Use an environment variable (more flexible):**

Replace the proxy config with:

```js
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_API_URL || 'http://localhost:3001',
      changeOrigin: true,
    },
  },
},
```

Then in Cloudflare Pages → your project → **Settings** → **Environment variables**, add:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://server-your-project.dokploy.app` |

Add this to both **Production** and **Preview** environments. Redeploy. No code changes needed next time.

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
