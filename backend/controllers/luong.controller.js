import {
    getAllLuong,
    getLuongById as findLuongById,
    findLuongByMaNV,
    createLuong,
    updateLuong,
    deleteLuong,
} from "../models/luong.model.js";

const validateLuongData = (data) => {
    const errors = [];

    if (!data.MaNV || isNaN(data.MaNV) || Number(data.MaNV) <= 0) {
        errors.push("Mã nhân viên (MaNV) không hợp lệ.");
    }
    if (data.LuongCoBan === undefined || isNaN(data.LuongCoBan) || Number(data.LuongCoBan) < 0) {
        errors.push("Lương cơ bản không hợp lệ.");
    }
    if (data.PhuCap === undefined || isNaN(data.PhuCap) || Number(data.PhuCap) < 0) {
        errors.push("Phụ cấp không hợp lệ.");
    }
    if (data.HeSoLuong === undefined || isNaN(data.HeSoLuong) || Number(data.HeSoLuong) < 0) {
        errors.push("Hệ số lương không hợp lệ.");
    }

    return errors;
};

export const getAll = async (req, res) => {
    try {
        const [rows] = await getAllLuong();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

export const getById = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id) || Number(id) <= 0) {
        return res.status(400).json({ message: "ID cấu hình lương không hợp lệ." });
    }

    try {
        const [rows] = await findLuongById(id);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Cấu hình lương không tồn tại." });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

export const addLuong = async (req, res) => {
    const { MaNV, LuongCoBan, PhuCap, HeSoLuong } = req.body;

    const errors = validateLuongData(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
    }

    try {
        const [existing] = await findLuongByMaNV(MaNV);
        if (existing.length > 0) {
            return res.status(409).json({ message: `Nhân viên có mã ${MaNV} đã được cấu hình lương.` });
        }

        await createLuong(MaNV, LuongCoBan, PhuCap, HeSoLuong);
        res.status(201).json({ message: "Thêm cấu hình lương thành công." });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

export const editLuong = async (req, res) => {
    const { id } = req.params;
    const { LuongCoBan, PhuCap, HeSoLuong } = req.body;

    if (isNaN(id) || Number(id) <= 0) {
        return res.status(400).json({ message: "ID cấu hình lương không hợp lệ." });
    }

    const errors = [];
    if (LuongCoBan === undefined || isNaN(LuongCoBan) || Number(LuongCoBan) < 0) errors.push("Lương cơ bản không hợp lệ.");
    if (PhuCap === undefined || isNaN(PhuCap) || Number(PhuCap) < 0) errors.push("Phụ cấp không hợp lệ.");
    if (HeSoLuong === undefined || isNaN(HeSoLuong) || Number(HeSoLuong) < 0) errors.push("Hệ số lương không hợp lệ.");

    if (errors.length > 0) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
    }

    try {
        const [existing] = await findLuongById(id);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Cấu hình lương không tồn tại." });
        }

        await updateLuong(id, LuongCoBan, PhuCap, HeSoLuong);
        res.json({ message: "Cập nhật cấu hình lương thành công." });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

export const removeLuong = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id) || Number(id) <= 0) {
        return res.status(400).json({ message: "ID cấu hình lương không hợp lệ." });
    }

    try {
        const [existing] = await findLuongById(id);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Cấu hình lương không tồn tại." });
        }

        await deleteLuong(id);
        res.json({ message: "Xóa cấu hình lương thành công." });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};