import express from "express";
import { login, logout, updatePassword, getAllTaiKhoan, deleteTaiKhoan, resetPassword } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.put("/update-password", verifyToken, updatePassword);
router.get("/tai-khoan", verifyToken, getAllTaiKhoan);
router.delete("/tai-khoan/:id", verifyToken, deleteTaiKhoan);
router.put("/tai-khoan/:id/reset-password", verifyToken, resetPassword);
export default router;