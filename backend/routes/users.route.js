import express from "express";
import {
    getUsers,
    getUserById,
    addUser,
    editUser,
    removeUser
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", addUser);
router.put("/:id", editUser);
router.delete("/:id", removeUser);

export default router;