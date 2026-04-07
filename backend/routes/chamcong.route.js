import express from "express";
import * as  chamCongController from "../controllers/chamcong.controller.js";

const router = express.Router();

router.get("/", chamCongController.getAll);
router.get("/:id", chamCongController.getById);
router.post("/", chamCongController.addChamCong);
router.put("/:id", chamCongController.editChamCong);
router.delete("/:id", chamCongController.removeChamCong);

export default router;