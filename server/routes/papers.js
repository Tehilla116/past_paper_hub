import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, DOC, DOCX, PNG, JPG'));
    }
  },
});

const router = Router();

router.get('/course/:courseId', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.title, p.year, p.exam_type, p.file_name, p.file_type, p.created_at,
              u.name as uploaded_by_name
       FROM papers p
       JOIN users u ON p.uploaded_by = u.id
       WHERE p.course_id = $1
       ORDER BY p.year DESC, p.created_at DESC`,
      [req.params.courseId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/download', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT file_path, file_name FROM papers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Paper not found' });
    const paper = result.rows[0];
    res.download(paper.file_path, paper.file_name);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireRole('lecturer', 'admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File is required' });
    const { course_id, title, year, exam_type } = req.body;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const result = await pool.query(
      `INSERT INTO papers (course_id, uploaded_by, title, year, exam_type, file_name, file_path, file_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [course_id, req.session.userId, title, year, exam_type, req.file.originalname, req.file.path, ext]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', requireRole('lecturer', 'admin'), async (req, res) => {
  try {
    const { title, year, exam_type } = req.body;
    const result = await pool.query(
      'UPDATE papers SET title = $1, year = $2, exam_type = $3 WHERE id = $4 RETURNING *',
      [title, year, exam_type, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Paper not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireRole('lecturer', 'admin'), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM papers WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Paper not found' });
    res.json({ message: 'Paper deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
