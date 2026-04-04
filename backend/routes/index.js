import express from "express";
import userRoutes from "./users.route.js";
import authRoutes from "./auth.routes.js";

const router = express.Router();

export function AppRouter(app) {

    router.use('/users', userRoutes);
    router.use('/auth', authRoutes);
    app.use('/api', router);
};