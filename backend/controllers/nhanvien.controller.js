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
const generateBaseEmail = (hoTen) => {
    if (!hoTen) return "user";
    const nameWithoutAccent = hoTen.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D");
    const parts = nameWithoutAccent.toLowerCase().trim().split(/\s+/);
    if (parts.length < 2) return parts[0];
    const ten = parts.pop();
    const hoLot = parts.join("");
    return `${ten}.${hoLot}`;
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
    const { HoTen, GioiTinh, NgaySinh, SDT, DiaChi, NgayBatDau, MaPB, MaCV } = req.body;

    if (!HoTen?.trim()) {
        return res.status(400).json({ success: false, message: "Họ tên không được để trống" });
    }

    try {
        const connection = await db;
        
        // --- LOGIC TỰ ĐỘNG TẠO EMAIL VÀ CHECK TRÙNG ---
        const baseEmail = generateBaseEmail(HoTen);
        const domain = "@company.com";
        let autoEmail = baseEmail + domain;
        let counter = 1;

        while (true) {
            const [rows] = await connection.execute(
                "SELECT COUNT(*) as count FROM taikhoan WHERE Email = ?",
                [autoEmail]
            );
            
            if (rows[0].count === 0) break; // Email này dùng được!

            // Nếu đã tồn tại, cộng thêm số (vd: dung.nguyenvy2@company.com)
            counter++;
            autoEmail = `${baseEmail}${counter}${domain}`;
        }
        // ----------------------------------------------

        // Lưu thông tin nhân viên
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

        // Tạo tài khoản với Email tự sinh
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
                HoTen: HoTen.trim(),
                EmailCapPhat: autoEmail, // Trả về để Admin biết email là gì
                MatKhauMặcĐịnh: "123456"
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