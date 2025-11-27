// src/routes/leaveRoutes.js
import express from "express";
import {
  // Employee Routes
  submitLeave,
  getMyLeaves,
  getMyLeaveStats,
  deleteMyLeave,

  // Admin Routes
  getAllLeavesAdmin,
  getLeaveStatsAdmin,
  getLeavesByEmployee,
  updateLeaveStatus,        // Approve / Reject
  deleteLeaveAdmin,         // Force delete any leave
} from "../controllers/leaveController.js";

import { protectEmployee } from "../middleware/authEmployee.js";
import { protect } from "../middleware/auth.js"; // Admin + Employee protect

const router = express.Router();

// ==================== EMPLOYEE ROUTES ====================
router.post("/submit", protectEmployee, submitLeave);
router.get("/my-leaves", protectEmployee, getMyLeaves);
router.get("/my-stats", protectEmployee, getMyLeaveStats);
router.delete("/my/:id", protectEmployee, deleteMyLeave);

// ==================== ADMIN ROUTES ====================
router.get("/all", protect, getAllLeavesAdmin);
router.get("/stats/admin", protect, getLeaveStatsAdmin);
router.get("/employee/:employeeId", protect, getLeavesByEmployee);
router.patch("/:id/status", protect, updateLeaveStatus);        // Approve / Reject
router.delete("/admin/:id", protect, deleteLeaveAdmin);         // Force delete

export default router;