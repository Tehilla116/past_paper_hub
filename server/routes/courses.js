import { Router } from 'express';
import pool from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get('/', requireAuth, async (req, res) => {
  try {
    const { departmentId } = req.params;
    if (departmentId) {
      const result = await pool.query(
        'SELECT id, department_id, name, code, slug FROM courses WHERE department_id = $1 ORDER BY name',
        [departmentId]
      );
      return res.json(result.rows);
    }
    const result = await pool.query('SELECT id, department_id, name, code, slug FROM courses ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT c.*, d.name as department_name FROM courses c JOIN departments d ON c.department_id = d.id WHERE c.id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Course not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const { department_id, name, code, slug } = req.body;
    const result = await pool.query(
      'INSERT INTO courses (department_id, name, code, slug) VALUES ($1, $2, $3, $4) RETURNING *',
      [department_id, name, code, slug]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', requireRole('admin'), async (req, res) => {
  try {
    const { name, code, slug, department_id } = req.body;
    const result = await pool.query(
      'UPDATE courses SET name = $1, code = $2, slug = $3, department_id = $4 WHERE id = $5 RETURNING *',
      [name, code, slug, department_id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Course not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
