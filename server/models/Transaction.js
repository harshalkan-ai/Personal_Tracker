import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Please add a transaction title/description'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        amount: {
            type: Number,
            required: [true, 'Please add an amount'],
            min: [0.01, 'Amount must be greater than zero'],
        },
        type: {
            type: String,
            enum: {
                values: ['income', 'expense'],
                message: '{VALUE} is not a valid transaction type (must be income or expense)',
            },
            required: [true, 'Transaction type is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [500, 'Notes cannot exceed 500 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Optimize queries for dashboard stats & charts sorted by latest date
transactionSchema.index({ userId: 1, date: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;