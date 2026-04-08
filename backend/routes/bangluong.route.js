import express from "express";
import * as  bangLuongController from "../controllers/bangluong.controller.js";

const router = express.Router();

router.get("/", bangLuongController.getAll);
router.get("/:id", bangLuongController.getById);
router.put("/:id", bangLuongController.editBangLuong);
router.delete("/:id", bangLuongController.removeBangLuong);

export default router;