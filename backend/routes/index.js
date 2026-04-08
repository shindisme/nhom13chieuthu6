import express from "express";
import phongBanRoutes from "./phongban.routes.js";
import luongRoutes from "./luong.route.js";
import bangLuongRoutes from "./bangluong.route.js";
import chamCongRoutes from "./chamcong.route.js";
import authRoutes from "./auth.routes.js";
import nhanVienRoutes from "./nhanvien.routes.js";
const router = express.Router();

export function AppRouter(app) {
    router.use('/phong-ban', phongBanRoutes);
    router.use('/luong', luongRoutes);
    router.use('/bang-luong', bangLuongRoutes);
    router.use('/cham-cong', chamCongRoutes);
    router.use('/nhan-vien', nhanVienRoutes);
    router.use('/', authRoutes);
    app.use('/', router);
};
