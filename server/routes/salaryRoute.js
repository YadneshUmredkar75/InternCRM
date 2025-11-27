// routes/salaryRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  paySalary,
  getSalaryHistory,
  getAllSalaryRecords,
  getSalaryRecordById,
  updateSalaryRecord,
  deleteSalaryRecord,
  getSalaryStatistics,
  getPendingSalaries
} from '../controllers/salaryController.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Pay salary to employee
router.post('/pay/:id', paySalary);

// Get pending salaries
router.get('/pending', getPendingSalaries);

// Get salary history for an employee
router.get('/history/:id', getSalaryHistory);

// Get all salary records with filters
router.get('/records', getAllSalaryRecords);

// Get salary record by ID
router.get('/record/:id', getSalaryRecordById);

// Update salary record
router.put('/record/:id', updateSalaryRecord);

// Delete salary record
router.delete('/record/:id', deleteSalaryRecord);

// Get salary statistics
router.get('/statistics', getSalaryStatistics);

export default router;