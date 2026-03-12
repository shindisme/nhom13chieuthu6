import express from "express";
import {
    getUsers,
    addUser,
    editUser,
    removeUser
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/users", getUsers);
router.post("/users", addUser);
router.put("/users/:id", editUser);
router.delete("/users/:id", removeUser);

export default router;