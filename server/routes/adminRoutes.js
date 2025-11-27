// src/routes/adminRoutes.js
import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerAdmin);      // dev only
router.post("/login", loginAdmin);

// Example protected admin route
router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.email}` });
});

export default router;