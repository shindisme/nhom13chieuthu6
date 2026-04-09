import * as NhanVienModel from "../models/nhanvien.model.js";
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
        res.status(500).json({
            success: false,
            message: "Lỗi lấy danh sách nhân viên",
            error: error.message
        });
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

        res.status(201).json({
            success: true,
            message: "Thêm nhân viên thành công",
            insertId: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi thêm mới nhân viên",
            error: error.message
        });
    }
};

export const updateNhanVien = async (req, res) => {
    const { id } = req.params;
    try {
        const updateData = {
            ...req.body,
            NgaySinh: formatToMySQLDate(req.body.NgaySinh),
            NgayBatDau: formatToMySQLDate(req.body.NgayBatDau),
            MaPB: req.body.MaPB || null,
            MaCV: req.body.MaCV || null
        };

        const result = await NhanVienModel.updateNhanVienModel(id, updateData);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Nhân viên không tồn tại" });
        }

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