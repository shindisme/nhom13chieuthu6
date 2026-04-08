import express from "express";
import {
    getPhongBans,
    getPhongBanById,
    addPhongBan,
    editPhongBan,
    removePhongBan,
} from "../controllers/phongban.controller.js";

const router = express.Router();

router.get("/", getPhongBans);
router.get("/:id", getPhongBanById);
router.post("/", addPhongBan);
router.put("/:id", editPhongBan);
router.delete("/:id", removePhongBan);

export default router;