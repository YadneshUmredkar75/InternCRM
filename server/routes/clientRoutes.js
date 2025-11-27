// routes/clientRoutes.js
import { Router } from "express";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
import { validateQuery } from "../middleware/validate.middleware.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Protect all routes
router.use(protect);

// Public (authenticated users)
router.get("/", validateQuery, getClients);
router.get("/:id", getClientById);

// Admin only
router.post("/", protect, createClient);
router.put("/:id", protect, updateClient);
router.delete("/:id", protect, deleteClient);

export default router;