import { Router } from 'express';
import {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { calculateBalances } from '../utils/balanceEngine.js';
import protect from '../middleware/authMiddleware.js';
import sanitize from '../middleware/sanitize.js';

const router = Router();

router.use(protect);
router.use(sanitize);

// ── Balance endpoint (must be BEFORE /:id to avoid route collision) ──
router.get('/balances', async (req, res) => {
  try {
    const balances = await calculateBalances(req.user._id);
    res.json(balances);
  } catch (error) {
    console.error('Balance error:', error.message);
    res.status(500).json({ error: 'Server error calculating balances' });
  }
});

// ── CRUD routes ──
router.route('/').post(createExpense).get(getExpenses);
router.route('/:id').get(getExpense).put(updateExpense).delete(deleteExpense);

export default router;
