import { execSync } from 'child_process';
import { existsSync, writeFileSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PG_PORT = process.env.DB_PORT || '5435';
const PG_DATA = process.env.PG_DATA || '/tmp/pg_data';
const PG_USER = process.env.DB_USER || 'tehilla_chiwama';
const PG_DB = process.env.DB_NAME || 'past_paper_hub';

function run(sql, db = 'postgres') {
  execSync(
    `psql -U ${PG_USER} -h /tmp -p ${PG_PORT} -d ${db} -c "${sql.replace(/"/g, '\\"')}"`,
    { env: { ...process.env, PGUSER: PG_USER }, stdio: 'pipe' }
  );
}

function findPg() {
  const candidates = ['/usr/lib/postgresql/18/bin', '/usr/lib/postgresql/16/bin', '/usr/lib/postgresql/14/bin'];
  for (const dir of candidates) {
    if (existsSync(`${dir}/pg_ctl`)) return dir;
  }
  // Try PATH
  try {
    execSync('pg_ctl --version', { stdio: 'pipe' });
    return '';
  } catch {
    return null;
  }
}

export default function ensureDatabase() {
  const pgDir = findPg();
  if (!pgDir) {
    console.warn('⚠ PostgreSQL not found. Start it manually, then run the server.');
    return;
  }

  const origPath = process.env.PATH;
  if (pgDir) process.env.PATH = `${pgDir}:${origPath}`;

  try {
    execSync(`pg_ctl -D ${PG_DATA} status`, { stdio: 'pipe' });
    console.log(`✓ PostgreSQL already running on port ${PG_PORT}`);
  } catch {
    console.log('Starting PostgreSQL...');
    if (!existsSync(PG_DATA)) {
      execSync(`initdb -D ${PG_DATA} --username=${PG_USER} --auth=trust`, { stdio: 'pipe' });
      console.log('  Initialized database cluster');
    }
    execSync(`pg_ctl -D ${PG_DATA} -l /tmp/pg_logfile -o "-p ${PG_PORT} -k /tmp" start`, { stdio: 'pipe' });
    console.log(`  PostgreSQL started on port ${PG_PORT}`);
  }

  try {
    run('CREATE ROLE "\"' + process.env.USER + '\"" WITH LOGIN SUPERUSER;');
  } catch { /* already exists */ }

  try {
    run(`CREATE DATABASE ${PG_DB};`);
    console.log(`  Database '${PG_DB}' created`);
  } catch { /* already exists */ }

  try {
    run('SELECT 1 FROM departments LIMIT 1', PG_DB);
    console.log(`  Schema already applied`);
  } catch {
    const schemaPath = resolve(__dirname, '..', 'database', 'schema.sql');
    execSync(`psql -U ${PG_USER} -h /tmp -p ${PG_PORT} -d ${PG_DB} -f "${schemaPath}"`, {
      env: { ...process.env, PGUSER: PG_USER },
      stdio: 'pipe',
    });
    console.log(`  Schema applied`);
  }

  try {
    const result = execSync(
      `psql -U ${PG_USER} -h /tmp -p ${PG_PORT} -d ${PG_DB} -t -A -c "SELECT count(*) FROM users;"`,
      { env: { ...process.env, PGUSER: PG_USER }, encoding: 'utf8', stdio: 'pipe' }
    ).trim();
    if (result !== '0') {
      console.log(`  Seed data already exists`);
    } else {
      seedDatabase();
    }
  } catch {
    seedDatabase();
  }

  if (pgDir) process.env.PATH = origPath;
}

function seedDatabase() {
  const tmpFile = `/tmp/seed-${crypto.randomBytes(4).toString('hex')}.sql`;
  try {
    const hash = bcrypt.hashSync('password123', 10);
    const sql = `INSERT INTO departments (name, slug) VALUES
      ('School of Engineering', 'engineering'),
      ('School of Business', 'business'),
      ('School of Information Technology', 'it'),
      ('School of Health Sciences', 'health-sciences')
      ON CONFLICT (slug) DO NOTHING;
    INSERT INTO courses (department_id, name, code, slug) VALUES
      (1, 'Civil Engineering', 'CIV101', 'civil-engineering'),
      (1, 'Electrical Engineering', 'ELE201', 'electrical-engineering'),
      (1, 'Mechanical Engineering', 'MEC301', 'mechanical-engineering'),
      (2, 'Business Administration', 'BUS101', 'business-administration'),
      (2, 'Accounting', 'ACC201', 'accounting'),
      (2, 'Marketing', 'MKT301', 'marketing'),
      (3, 'Computer Science', 'CS101', 'computer-science'),
      (3, 'Information Systems', 'IS201', 'information-systems'),
      (3, 'Software Engineering', 'SE301', 'software-engineering'),
      (4, 'Nursing', 'NUR101', 'nursing'),
      (4, 'Public Health', 'PH201', 'public-health')
      ON CONFLICT (department_id, code) DO NOTHING;
    INSERT INTO users (name, email, password_hash, role) VALUES
      ('System Admin', 'admin@zut.edu.zm', '${hash}', 'admin'),
      ('Dr. Lecturer', 'lecturer@zut.edu.zm', '${hash}', 'lecturer'),
      ('Student User', 'student@zut.edu.zm', '${hash}', 'student')
      ON CONFLICT (email) DO NOTHING;`;
    writeFileSync(tmpFile, sql);
    execSync(`psql -U ${PG_USER} -h /tmp -p ${PG_PORT} -d ${PG_DB} -f "${tmpFile}"`, {
      env: { ...process.env, PGUSER: PG_USER },
      stdio: 'pipe',
    });
    console.log(`  Seed data inserted`);
  } catch (err) {
    console.warn('  Seed skipped:', err.message);
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}
