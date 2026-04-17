import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as TaiKhoanModel from "../models/auth.model.js";
import { findUserByEmail } from "../models/auth.model.js";

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
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ.", errors
        });
    }

    const cleanEmail = email.trim();
    try {
        const [rows] = await findUserByEmail(cleanEmail);

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
            {
                id: user.MaTK,
                roleId: user.role,
                email: user.Email,
                MaNV: user.MaNV
            },
            process.env.JWT_SECRET || 'nhom13chieuthu6',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: "Đăng nhập thành công.",
            token,
            roleId: user.role,
            user: {
                id: user.MaTK,
                maNv: user.MaNV,
                email: user.Email,
                name: user.HoTen || "Người dùng",
                phone: user.SDT || "",
                department: user.TenPB || "",
            },
        });
    } catch (error) {
        console.error("LỖI HỆ THỐNG:", error.message);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
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
        res.status(500).json({
            message: "Lỗi khi đăng xuất",
            error: error.message
        });
    }
};
export const updatePassword = async (req, res) => {
    const { matKhauCu, matKhauMoi } = req.body;
    const maNV = req.user?.MaNV;

    if (!maNV) {
        return res.status(400).json({
            success: false,
            message: "Không tìm thấy mã nhân viên trong Token. Hãy đăng nhập lại!"
        });
    }

    try {
        const user = await TaiKhoanModel.getTaiKhoanByMaNVModel(maNV);
        if (!user) {
            return res.status(404).json({ success: false, message: "Tài khoản không tồn tại" });
        }

        const isMatch = await bcrypt.compare(matKhauCu, user.MatKhau);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Mật khẩu cũ không chính xác" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(matKhauMoi, salt);
        await TaiKhoanModel.updatePasswordModel(maNV, hashedPassword);

        res.status(200).json({ success: true, message: "Đổi mật khẩu thành công!" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi hệ thống", error: error.message });
    }
};

export const getAllTaiKhoan = async (req, res) => {
    const { search } = req.query;
    try {
        const data = await TaiKhoanModel.searchTaiKhoanModel(search || "");
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi tìm kiếm", error: error.message });
    }
};


export const deleteTaiKhoan = async (req, res) => {
    try {
        const result = await TaiKhoanModel.deleteTaiKhoanModel(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        res.status(200).json({ success: true, message: "Xóa tài khoản thành công" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123456", salt);
        
        const result = await TaiKhoanModel.resetPasswordModel(req.params.id, hashedPassword);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        
        res.status(200).json({ success: true, message: "Đã reset mật khẩu về 123456" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};