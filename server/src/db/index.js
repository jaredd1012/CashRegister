import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.trim(),
  max: 10,
});

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        input_text TEXT NOT NULL,
        output_lines JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  } finally {
    client.release();
  }
}

export async function insertTransaction(inputText, outputLines) {
  const res = await pool.query(
    `INSERT INTO transactions (input_text, output_lines) VALUES ($1, $2) RETURNING id, input_text, output_lines, created_at`,
    [inputText, JSON.stringify(outputLines)]
  );
  return res.rows[0];
}

export async function listTransactions(limit = 50) {
  const res = await pool.query(
    `SELECT id, input_text, output_lines, created_at
     FROM transactions
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
  return res.rows;
}

export { pool };
