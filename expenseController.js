import Expense from '../models/Expense.js';

// ── POST /api/expenses ──
export const createExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, splitWith, category, date } = req.body;

    // Validate that shares sum to amount
    if (splitWith && splitWith.length > 0) {
      const totalShares = splitWith.reduce((sum, s) => sum + (s.share || 0), 0);
      if (Math.abs(totalShares - amount) > 0.01) {
        return res.status(400).json({
          error: `Split shares (${totalShares}) must equal total amount (${amount})`,
        });
      }
    }

    const expense = await Expense.create({
      description,
      amount,
      paidBy: paidBy || req.user._id,
      splitWith: splitWith || [],
      category,
      date,
      createdBy: req.user._id, // Always from authenticated user — never trust client
    });

    // Populate user names for the response
    await expense.populate([
      { path: 'paidBy', select: 'name email' },
      { path: 'splitWith.user', select: 'name email' },
    ]);

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error.message);
    res.status(500).json({ error: 'Server error creating expense' });
  }
};

// ── GET /api/expenses ──
export const getExpenses = async (req, res) => {
  try {
    // Return expenses where the user is involved
    const expenses = await Expense.find({
      $or: [
        { createdBy: req.user._id },
        { paidBy: req.user._id },
        { 'splitWith.user': req.user._id },
      ],
    })
      .populate('paidBy', 'name email')
      .populate('splitWith.user', 'name email')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error.message);
    res.status(500).json({ error: 'Server error fetching expenses' });
  }
};

// ── GET /api/expenses/:id ──
export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('paidBy', 'name email')
      .populate('splitWith.user', 'name email');

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Row-level access: must be creator, payer, or in splitWith
    const userId = req.user._id.toString();
    const isInvolved =
      expense.createdBy.toString() === userId ||
      expense.paidBy._id.toString() === userId ||
      expense.splitWith.some((s) => s.user._id.toString() === userId);

    if (!isInvolved) {
      return res.status(403).json({ error: 'Not authorized to view this expense' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Get expense error:', error.message);
    res.status(500).json({ error: 'Server error fetching expense' });
  }
};

// ── PUT /api/expenses/:id ──
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // BOLA check: only the creator can update
    if (expense.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to modify this expense' });
    }

    const { description, amount, paidBy, splitWith, category, date } = req.body;

    // Re-validate shares if both amount and splitWith are provided
    const newAmount = amount || expense.amount;
    const newSplits = splitWith || expense.splitWith;

    if (newSplits && newSplits.length > 0) {
      const totalShares = newSplits.reduce((sum, s) => sum + (s.share || 0), 0);
      if (Math.abs(totalShares - newAmount) > 0.01) {
        return res.status(400).json({
          error: `Split shares (${totalShares}) must equal total amount (${newAmount})`,
        });
      }
    }

    // Apply updates
    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    if (paidBy) expense.paidBy = paidBy;
    if (splitWith) expense.splitWith = splitWith;
    if (category) expense.category = category;
    if (date) expense.date = date;

    await expense.save();

    await expense.populate([
      { path: 'paidBy', select: 'name email' },
      { path: 'splitWith.user', select: 'name email' },
    ]);

    res.json(expense);
  } catch (error) {
    console.error('Update expense error:', error.message);
    res.status(500).json({ error: 'Server error updating expense' });
  }
};

// ── DELETE /api/expenses/:id ──
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // BOLA check: only the creator can delete
    if (expense.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to modify this expense' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error.message);
    res.status(500).json({ error: 'Server error deleting expense' });
  }
};
