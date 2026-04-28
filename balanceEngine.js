import Expense from '../models/Expense.js';
import User from '../models/User.js';

export const calculateBalances = async (userId) => {
  const userIdStr = userId.toString();

  const expenses = await Expense.find({
    $or: [{ paidBy: userId }, { 'splitWith.user': userId }],
  });


  const balanceMap = {};

  for (const expense of expenses) {
    const payerId = expense.paidBy.toString();

    if (payerId === userIdStr) {
      for (const split of expense.splitWith) {
        const memberId = split.user.toString();
        if (memberId === userIdStr) continue; 
        balanceMap[memberId] = (balanceMap[memberId] || 0) + split.share;
      }
    } else {

      const userSplit = expense.splitWith.find(
        (s) => s.user.toString() === userIdStr
      );
      if (userSplit) {
        balanceMap[payerId] = (balanceMap[payerId] || 0) - userSplit.share;
      }
    }
  }

  const balanceEntries = [];
  for (const [counterpartyId, amount] of Object.entries(balanceMap)) {
    if (Math.abs(amount) < 0.01) continue; 
    const user = await User.findById(counterpartyId).select('name email');
    if (!user) continue;

    balanceEntries.push({
      user: { id: user._id, name: user.name, email: user.email },
      amount: Math.abs(Math.round(amount * 100) / 100), // Round to 2 decimals
      direction: amount > 0 ? 'owes_you' : 'you_owe',
    });
  }


  balanceEntries.sort((a, b) => b.amount - a.amount);

  return balanceEntries;
};
