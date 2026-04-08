import express from "express";
import * as  luongController from "../controllers/luong.controller.js";

const router = express.Router();

router.get("/", luongController.getAll);
router.get("/:id", luongController.getById);
router.post("/", luongController.addLuong);
router.put("/:id", luongController.editLuong);
router.delete("/:id", luongController.removeLuong);

export default router;