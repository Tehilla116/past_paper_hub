import pool from '../config/db.js';
import { readSessionToken } from '../lib/session.js';

export async function attachAuth(req, _res, next) {
  try {
    const token = readSessionToken(req.headers.cookie);
    if (!token) {
      req.user = null;
      return next();
    }

    const result = await pool.query(
      'SELECT id, name, email, role, active FROM users WHERE id = $1 AND active = true',
      [token.userId]
    );

    if (result.rows.length === 0) {
      req.user = null;
      return next();
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
