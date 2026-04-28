import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

// ── Load environment variables FIRST ──
dotenv.config();

const app = express();

// ── Security & Parsing Middleware ──
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));

// ── Routes ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// ── Global error handler ──
app.use((err, _req, res, _next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Connect DB & Start Server ──
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 SplitIt server running on http://localhost:${PORT}`);
  });
});
