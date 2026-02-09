import '../loadEnv.js';
import pg from 'pg';

const { Pool } = pg;

const SEED_TRANSACTIONS = [
  {
    input: `2.12,3.00

1.97,2.00

3.33,5.00`,
    output: ['3 quarters,1 dime,3 pennies', '3 pennies', '1 dollar,1 quarter,6 nickels,12 pennies'],
  },
  {
    input: '5.00,10.00',
    output: ['5 dollars'],
  },
  {
    input: `1.50,2.00
3.25,5.00`,
    output: ['2 quarters', '1 dollar,3 quarters'],
  },
  {
    input: '0.99,1.00',
    output: ['1 penny'],
  },
  {
    input: `7.77,10.00
12.34,15.00`,
    output: ['2 dollars,2 dimes,3 pennies', '2 dollars,2 quarters,1 dime,1 nickel,1 penny'],
  },
  {
    input: '4.50,5.00',
    output: ['2 quarters'],
  },
  {
    input: '9.99,20.00',
    output: ['10 dollars,1 penny'],
  },
  {
    input: `0.01,1.00
15.00,20.00
2.50,3.00`,
    output: ['3 quarters,2 dimes,4 pennies', '5 dollars', '2 quarters'],
  },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Add it to .env or app/.env');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        input_text TEXT NOT NULL,
        output_lines JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Insert seed data with staggered timestamps (oldest first)
    const now = new Date();
    for (let i = 0; i < SEED_TRANSACTIONS.length; i++) {
      const { input, output } = SEED_TRANSACTIONS[i];
      const createdAt = new Date(now - (SEED_TRANSACTIONS.length - i) * 3600000);
      await pool.query(
        `INSERT INTO transactions (input_text, output_lines, created_at)
         VALUES ($1, $2, $3)`,
        [input.trim(), JSON.stringify(output), createdAt.toISOString()]
      );
    }

    console.log(`Seeded ${SEED_TRANSACTIONS.length} transactions`);
  } catch (err) {
    console.error('Seed failed:', err.message || err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
