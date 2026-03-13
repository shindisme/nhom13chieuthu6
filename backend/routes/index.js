import express from "express";

import userRoutes from "./users.route.js";

const router = express.Router();

export function AppRouter(app) {
    router.use('/users', userRoutes);

    app.use('/', router);
};