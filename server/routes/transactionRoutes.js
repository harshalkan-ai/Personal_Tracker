import express from 'express';
import {
    getTransactions,
    addTransaction,
    deleteTransaction,
    getTransactionSummary,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to protect all routes in this file
router.use(protect);

// Transactions collection routes
router.route('/')
    .get(getTransactions)
    .post(addTransaction);

// Summary & stats route for charts/dashboard
router.get('/summary', getTransactionSummary);

// Individual transaction routes
router.route('/:id')
    .delete(deleteTransaction);

export default router;