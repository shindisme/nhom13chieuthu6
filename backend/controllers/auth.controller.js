import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const validateLogin = (email, password) => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email.trim())) {
        errors.push("Email không hợp lệ.");
    }
    if (!password || password.length < 1) {
        errors.push("Vui lòng nhập mật khẩu.");
    }
    return errors;
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const errors = validateLogin(email, password);
    if (errors.length > 0) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
    }
    const cleanEmail = email.trim();
    try {
        const connection = await db;
        const query = `SELECT * FROM taikhoan WHERE Email = ?`;

        const [rows] = await connection.execute(query, [cleanEmail]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tài khoản không tồn tại!",
            });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.MatKhau);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Mật khẩu không chính xác.",
            });
        }

        const token = jwt.sign(
            { id: user.MaTK, roleId: user.role, email: user.Email },
            process.env.JWT_SECRET || "nhom13chieuthu6",
            { expiresIn: "24h" },
        );

        res.json({
            success: true,
            message: "Đăng nhập thành công.",
            token,
            roleId: user.role,
            user: {
                id: user.MaTK,
                email: user.Email,
                name: user.HoTen || user.TenTK || "Người dùng",
            },
        });
    } catch (error) {
        console.error("LỖI HỆ THỐNG:", error.message);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.stack,
            error: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Đăng xuất thành công.",
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Lỗi khi đăng xuất", error: error.message });
    }
};
