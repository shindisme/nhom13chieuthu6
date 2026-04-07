import express from "express";

import userRoutes from "./users.route.js";
import phongBanRoutes from "./phongban.Routes.js";
const router = express.Router();

export function AppRouter(app) {
    router.use('/users', userRoutes);
    router.use('/phong-ban', phongBanRoutes);
    app.use('/', router);
};