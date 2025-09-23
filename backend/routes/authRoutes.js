import express from "express";
import { register, login, logout, getProfile } from "../controllers/authController.js";
import { isAuthenticated, authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getProfile);
router.get("/profile", authenticateUser, getProfile);

export default router;