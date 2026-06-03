import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  : new pg.Pool({
      host: process.env.DB_HOST || '/tmp',
      port: process.env.DB_PORT || 5435,
      database: process.env.DB_NAME || 'past_paper_hub',
      user: process.env.DB_USER || 'tehilla_chiwama',
    });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
