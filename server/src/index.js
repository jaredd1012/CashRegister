import './loadEnv.js';
import cors from 'cors';
import express from 'express';
import { initDb, insertTransaction, listTransactions } from './db/index.js';
import { processInputLines } from './services/changeCalculator.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.text({ type: '*/*', limit: '1mb' }));

app.post('/api/change', async (req, res) => {
  try {
    const text = req.body ?? '';
    const lines = processInputLines(text);
    if (process.env.DATABASE_URL) {
      try {
        await insertTransaction(text.trim(), lines);
      } catch (dbErr) {
        console.error('Failed to save transaction:', dbErr.message);
        // Still return result — don't fail the request for DB issues
      }
    }
    res.json({ lines });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process input' });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json([]);
    }
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const rows = await listTransactions(limit);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

async function start() {
  if (process.env.DATABASE_URL) {
    try {
      await initDb();
      console.log('Database initialized — transactions will be saved');
    } catch (err) {
      console.warn(
        'Could not connect to PostgreSQL — transactions will not be saved.\n',
        '  Is Postgres running? Try: brew services start postgresql (macOS)\n',
        '  Error:',
        err.code === 'ECONNREFUSED'
          ? 'Connection refused (Postgres not running or wrong host/port)'
          : err.message
      );
      delete process.env.DATABASE_URL;
    }
  } else {
    console.warn(
      'DATABASE_URL not set — transactions will not be persisted. Add it to .env or app/.env'
    );
  }
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
