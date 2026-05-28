import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import departmentRoutes from './routes/departments.js';
import courseRoutes from './routes/courses.js';
import paperRoutes from './routes/papers.js';
import userRoutes from './routes/users.js';
import { attachAuth } from './middleware/auth.js';

const app = express();

const allowedOrigins = new Set(
  [
    'http://localhost:5173',
    process.env.CLIENT_ORIGIN,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean)
);

app.set('trust proxy', 1);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(attachAuth);

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/departments/:departmentId/courses', courseRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/users', userRoutes);

app.use((err, _req, res, _next) => {
  if (err.message && err.message.startsWith('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

export default app;