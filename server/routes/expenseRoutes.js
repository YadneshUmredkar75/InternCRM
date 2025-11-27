// routes/expenseRoutes.js
import express from "express";
import {
  submitExpense,
  getMyExpenses,
  getAllExpenses,
  updateExpenseStatus,
getExpenseStats,
deleteMyExpense,
getMyExpenseStats,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";
import { protectEmployee } from "../middleware/authEmployee.js";
const router = express.Router();
// employee router
// router.use(protectEmployee);

// routes/expenseRoutes.js
router.post("/", protectEmployee, upload.single("receipt"), submitExpense);
router.get("/my", protectEmployee, getMyExpenses);
router.get("/my/stats", protectEmployee, getMyExpenseStats);
router.delete("/my/:id", protectEmployee, deleteMyExpense);

router.get("/", protect, getAllExpenses);           // Admin
router.get("/stats", protect, getExpenseStats);     // Admin
router.put("/:id/status", protect, updateExpenseStatus); // Admin
export default router;