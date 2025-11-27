// routes/attendanceRoutes.js
import { Router } from "express";
import { protect } from "../middleware/auth.js";          // Admin middleware
import { protectEmployee } from "../middleware/authEmployee.js"; // Employee middleware
import {
  clockIn,
  clockOut,
  getDailyAttendance,
  getAttendanceHistory,
  addManualAttendance,
  getEmployeeAttendance,
  getEmployeesActiveStatus,
  getEmployeeActiveStatus,
  getTodayClockStatus,
} from "../controllers/attendanceController.js";

const router = Router();

/* ==============================
   EMPLOYEE ROUTES (Self Only)
   ============================== */
router.post("/clock-in", protectEmployee, clockIn);
router.post("/clock-out", protectEmployee, clockOut);

// Employee sees only their own data
router.get("/daily", protectEmployee, getDailyAttendance);
router.get("/history", protectEmployee, getAttendanceHistory);

/* ==============================
   ADMIN-ONLY ROUTES
   ============================== */

// Admin: View all employees' daily attendance
router.get("/admin/daily", protect, getDailyAttendance);
router.get("/admin/employee/:employeeId/attendance", protect, getEmployeeAttendance);
// Admin: View any employee's history
router.get("/admin/history", protect, getAttendanceHistory);
// Admin routes
// router.get("/employees/active-status", protect, getEmployeesActiveStatus);
// router.get("/:id/active-status", protect, getEmployeeActiveStatus);
router.get("/:employeeId/today", protect, getTodayClockStatus);
export default router;