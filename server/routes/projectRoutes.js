// routes/projectRoutes.js
import { Router } from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getMyAssignedProjects,
  getMyProjectById
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";           // Admin only
import { protectEmployee } from "../middleware/authEmployee.js"; // Employee only

const router = Router();

// Admin routes (protected by protect middleware)
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

// Employee route – only for logged-in employees

router.get("/projects",protectEmployee, getMyAssignedProjects);           
router.get("/projects/:id",protectEmployee, getMyProjectById);

export default router;