# Past Paper Hub — Design Document

## Understanding Summary

1. A past paper repository web app for Zambia University of Technology.
2. Two primary actions: students browse/download past exams; lecturers/admin upload/manage them.
3. Three roles: student (view/download), lecturer (upload/edit/delete papers), admin (full system management).
4. Organization: Department → Course → Year hierarchy.
5. Tech stack: React.js, Express.js, PostgreSQL (per course requirements).
6. All content behind authentication (no public access).
7. Final course project — one-time submission for grading, not a production deployment.

## Assumptions

- Scale: ~50+ papers, entire university user base (demo-ready).
- Auth: simple email/password with session-based cookies. No SSO/OAuth.
- Files stored on local filesystem via multer (10MB cap). No cloud storage.
- Pure CSS for styling (no Tailwind/Bootstrap).
- Seed data loaded via SQL script for demo.
- File types allowed: PDF, DOC, DOCX, PNG, JPG.

## Decision Log

| Decision | Alternatives | Reason |
|---|---|---|
| Monolith (single server serving API + client) | Decoupled API + client | Simplest to build and grade; single repo |
| Session-based auth | JWT | Less boilerplate for a demo |
| Local file storage (multer) | Cloud storage | No cloud setup needed |
| Department → Course → Year hierarchy | Flat course listing | Maps to university structure |
| Pure CSS | Bootstrap, Tailwind, MUI | No extra deps; demonstrates CSS skill |
| Three roles (student, lecturer, admin) | Two roles | Covers real university workflow |
| Direct upload (no approval) | Moderated upload | Simpler; lecturers are trusted |
| Seed data via SQL script | Admin seeding UI | Fast setup for demo day |

## Final Design

### Database Schema

- **users**: id, name, email, password_hash, role (student|lecturer|admin), active, created_at
- **departments**: id, name, slug
- **courses**: id, department_id (FK), name, code, slug
- **papers**: id, course_id (FK), uploaded_by (FK), title, year, exam_type, file_name, file_path, file_type, created_at

### API Routes

- **Auth**: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
- **Departments**: GET, POST (admin), PUT (admin), DELETE (admin)
- **Courses**: GET (by department or all), GET/:id, POST (admin), PUT (admin), DELETE (admin)
- **Papers**: GET /course/:id, GET /:id/download, POST (lecturer/admin), PUT (lecturer/admin), DELETE (lecturer/admin)
- **Users**: GET (admin), PUT /:id/role (admin), PUT /:id/deactivate (admin)

### Frontend Pages

- Login / Register
- Departments list (cards)
- Courses list (per department)
- Papers table (per course) with download
- Upload Paper form (lecturer/admin)
- Admin Panel (tabs: Users, Departments, Courses)
- 404 page

### Auth Middleware

- `requireAuth` — blocks unauthenticated requests
- `requireRole(...roles)` — restricts to specific roles

### Error Handling

- File type/size validation on upload
- Empty states for courses/papers with no data
- 401 redirect to login, 403 "not authorized" message
- Delete confirmation dialog
- 404 page for unmatched routes
