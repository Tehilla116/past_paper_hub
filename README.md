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
