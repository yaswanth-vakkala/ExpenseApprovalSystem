import express from 'express';
const router = express.Router();
import {
  getExpenses,
  getExpenseById,
  createExpense,
  deleteExpense,
  updateExpense,
  getExpenseHistory,
  getReport,
  getProjectReport,
  updateExpenseById,
} from '../controllers/ExpenseController.js';
import {
  employeeOnly,
  protect,
  userWithAccess,
  directorOnly,
  FinanceDepartmentOrHR,
} from '../middleware/authMiddleware.js';

router
  .route('/')
  .get(protect, getExpenses)
  .post(protect, employeeOnly, createExpense);
router.route('/history').get(protect, getExpenseHistory);
router.route('/report').post(protect, userWithAccess, getReport);
router.route('/projectReport').post(protect, userWithAccess, getProjectReport);

router
  .route('/:id')
  .delete(protect, employeeOnly, deleteExpense)
  .patch(protect, userWithAccess, updateExpense)
  .post(protect, FinanceDepartmentOrHR, updateExpenseById)
  .get(protect, userWithAccess, getExpenseById);

export default router;
