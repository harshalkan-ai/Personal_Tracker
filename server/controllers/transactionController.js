import Transaction from '../models/Transaction.js';

/**
 * @desc   Get all transactions for the logged-in user (with optional filters)
 * @route  GET /api/transactions
 * @access Private
 */
export const getTransactions = async (req, res, next) => {
    try {
        const { type, category, startDate, endDate } = req.query;

        // Filter by the authenticated user's ID
        const query = { userId: req.userId };

        // Optional filters
        if (type) query.type = type;
        if (category) query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Fetch transactions sorted by date descending (latest first)
        const transactions = await Transaction.find(query).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc   Create a new transaction
 * @route  POST /api/transactions
 * @access Private
 */
export const addTransaction = async (req, res, next) => {
    try {
        const { title, amount, type, category, date, notes } = req.body;

        const transaction = await Transaction.create({
            userId: req.userId,
            title,
            amount,
            type,
            category,
            date: date || Date.now(),
            notes,
        });

        res.status(201).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc   Delete a transaction
 * @route  DELETE /api/transactions/:id
 * @access Private
 */
export const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }

        // Ensure the transaction belongs to the logged-in user
        if (transaction.userId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this transaction',
            });
        }

        await transaction.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Transaction successfully deleted',
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc   Get financial summary (totals & category breakdown for charts)
 * @route  GET /api/transactions/summary
 * @access Private
 */
export const getTransactionSummary = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ userId: req.userId });

        let totalIncome = 0;
        let totalExpense = 0;
        const categoryTotals = {};

        transactions.forEach((item) => {
            if (item.type === 'income') {
                totalIncome += item.amount;
            } else {
                totalExpense += item.amount;

                // Group expense amounts by category for Pie Charts
                categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
            }
        });

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                categoryTotals,
            },
        });
    } catch (error) {
        next(error);
    }
};