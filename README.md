# Past Paper Hub

A full-stack web application for browsing, uploading, and managing past examination papers. Built with **React.js**, **Express.js**, and **PostgreSQL**.

## Features

- Three roles: **Student** (view/download), **Lecturer** (upload/manage), **Admin** (full system control)
- Browse papers by Department → Course → Year hierarchy
- Upload and download PDF, DOC, DOCX, PNG, JPG files
- Admin panel for managing departments, courses, and users

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 16+

### 1. Database Setup

```bash
# Create the database and tables
psql -U postgres -c "CREATE DATABASE past_paper_hub;"
psql -U postgres -d past_paper_hub -f database/schema.sql
psql -U postgres -d past_paper_hub -f database/seed.sql
```

### 2. Configure Database Connection

Edit `server/config/db.js` with your PostgreSQL credentials.

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

### 5. Open the App

Navigate to `http://localhost:5173`

## Deploy to Vercel

This repository now supports a single Vercel deployment for both the React client and the API.

### 1. Prepare the Database

Create or update your PostgreSQL database using `database/schema.sql`.

If you already have a database, make sure the `papers` table has a `file_data BYTEA NOT NULL` column.

### 2. Set Environment Variables in Vercel

Add these variables in the Vercel project settings:

- `DATABASE_URL`
- `SESSION_SECRET`
- `CLIENT_ORIGIN` if you use a custom domain

### 3. Import the Repository into Vercel

- Framework preset: Other
- Root directory: repository root
- Build command: handled by `vercel.json`
- Output directory: `client/dist`

### 4. Deploy

Vercel will:

- install root dependencies for the API
- install client dependencies
- build the Vite app
- serve the API from `/api/*`
- serve the React SPA with route rewrites

### 5. Verify

- Open the Vercel URL
- Log in and register
- Browse departments and courses
- Upload and download a paper

### Notes

- The backend now uses signed cookies instead of server sessions.
- Uploaded papers are stored in PostgreSQL, not on local disk.
- Relative `/api/*` calls from the client continue to work on Vercel.

## Seed Accounts

| Role     | Email                 | Password    |
|----------|-----------------------|-------------|
| Admin    | admin@zut.edu.zm      | password123 |
| Lecturer | lecturer@zut.edu.zm   | password123 |
| Student  | student@zut.edu.zm    | password123 |

## Tech Stack

- **Frontend**: React 18, React Router, Vite, Pure CSS
- **Backend**: Express.js, express-session, multer, bcryptjs
- **Database**: PostgreSQL with pg (node-postgres)
