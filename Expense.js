import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'paidBy user is required'],
    },
    splitWith: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        share: {
          type: Number,
          required: true,
          min: [0.01, 'Each share must be greater than 0'],
        },
      },
    ],
    category: {
      type: String,
      enum: ['food', 'transport', 'rent', 'utilities', 'entertainment', 'other'],
      default: 'other',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Index for fast lookups: "all expenses I paid" and "all expenses I'm part of"
expenseSchema.index({ paidBy: 1 });
expenseSchema.index({ 'splitWith.user': 1 });
expenseSchema.index({ createdBy: 1 });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
