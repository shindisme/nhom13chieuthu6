import * as NhanVienModel from "../models/nhanvien.model.js";
import { createTaiKhoanModel } from "../models/auth.model.js";
import db from "../config/db.js";
import bcrypt from "bcrypt";
const formatToMySQLDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return null;
    if (dateStr.includes('T')) return dateStr.split('T')[0];
    if (dateStr.includes('/')) return dateStr.split('/').reverse().join('-');

    return dateStr;
};

export const getAllNhanVien = async (req, res) => {
    try {
        const data = await NhanVienModel.getAllNhanVienModel();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi hệ thống", error: error.message });
    }
};

export const getNhanVienById = async (req, res) => {
    try {
        const data = await NhanVienModel.getNhanVienByIdModel(req.params.id);
        if (!data) {
            return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên" });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi hệ thống", error: error.message });
    }
};

export const createNhanVien = async (req, res) => {
    const { HoTen, GioiTinh, NgaySinh, SDT, DiaChi, NgayBatDau, MaPB, MaCV, Email } = req.body;

    if (!HoTen?.trim()) {
        return res.status(400).json({ success: false, message: "Họ tên không được để trống" });
    }

    if (!Email || !Email.trim()) {
        return res.status(400).json({ success: false, message: "Email không được để trống" });
    }

    try {
        // Kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Email.trim())) {
            return res.status(400).json({ success: false, message: "Email không hợp lệ" });
        }

        // Kiểm tra email trùng
        const connection = await db;
        const [rows] = await connection.execute(
            "SELECT COUNT(*) as count FROM taikhoan WHERE Email = ?",
            [Email.trim()]
        );
        if (rows[0].count > 0) {
            return res.status(400).json({ success: false, message: "Email đã tồn tại trong hệ thống" });
        }

        const autoEmail = Email.trim();

        const result = await NhanVienModel.createNhanVienModel({
            HoTen: HoTen.trim(),
            GioiTinh: (GioiTinh === 'Nu' || GioiTinh === 'Nữ') ? 'Nữ' : 'Nam',
            NgaySinh: formatToMySQLDate(NgaySinh),
            SDT: SDT || null,
            DiaChi: DiaChi || null,
            NgayBatDau: formatToMySQLDate(NgayBatDau),
            MaPB: MaPB || null,
            MaCV: MaCV || null
        });

        const newMaNV = result.insertId;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123456", salt);
        await createTaiKhoanModel({
            Email: autoEmail,
            MatKhau: hashedPassword,
            MaNV: newMaNV,
            role: 0
        });

        res.status(201).json({
            success: true,
            message: "Thêm nhân viên và tạo tài khoản thành công!",
            data: {
                MaNV: newMaNV,
                EmailCapPhat: autoEmail
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi hệ thống khi tạo nhân viên",
            error: error.message
        });
    }
};

export const updateNhanVien = async (req, res) => {
    const { id } = req.params;
    const { HoTen, GioiTinh, NgaySinh, SDT, DiaChi, NgayBatDau, MaPB, MaCV, Email } = req.body;
    try {
        if (!Email || !Email.trim()) {
            return res.status(400).json({ success: false, message: "Email không được để trống" });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Email.trim())) {
            return res.status(400).json({ success: false, message: "Email không hợp lệ" });
        }
        
        const connection = await db;
        const [rows] = await connection.execute(
            "SELECT COUNT(*) as count FROM taikhoan WHERE Email = ? AND MaNV != ?",
            [Email.trim(), id]
        );
        if (rows[0].count > 0) {
            return res.status(400).json({ success: false, message: "Email đã tồn tại trong hệ thống" });
        }

        const updateData = {
            HoTen: HoTen?.trim(),
            GioiTinh: (GioiTinh === 'Nu' || GioiTinh === 'Nữ') ? 'Nữ' : 'Nam',
            NgaySinh: formatToMySQLDate(NgaySinh),
            SDT: SDT || null,
            DiaChi: DiaChi || null,
            NgayBatDau: formatToMySQLDate(NgayBatDau),
            MaPB: MaPB || null,
            MaCV: MaCV || null
        };

        const result = await NhanVienModel.updateNhanVienModel(id, updateData);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Nhân viên không tồn tại" });
        }

        await connection.execute("UPDATE taikhoan SET Email = ? WHERE MaNV = ?", [Email.trim(), id]);

        res.status(200).json({
            success: true,
            message: `Cập nhật nhân viên ${id} thành công!`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi cập nhật dữ liệu",
            error: error.message
        });
    }
};

export const deleteNhanVien = async (req, res) => {
    try {
        const result = await NhanVienModel.deleteNhanVienModel(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Nhân viên không tồn tại" });
        }

        res.status(200).json({ success: true, message: "Đã xóa nhân viên thành công" });
    } catch (error) {
        const isForeignKeyError = error.errno === 1451;
        res.status(isForeignKeyError ? 400 : 500).json({
            success: false,
            message: isForeignKeyError
                ? "Không thể xóa do nhân viên này đang có dữ liệu liên quan (lương/chấm công)!"
                : "Lỗi khi xóa nhân viên",
            error: error.message
        });
    }
};