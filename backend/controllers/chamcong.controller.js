import {
    getAllChamCong,
    getChamCongById as findChamCongById,
    getChamCongByMaNV,
    createChamCong,
    updateChamCong,
    deleteChamCong
} from "../models/chamcong.model.js";

// Hàm hỗ trợ kiểm tra định dạng ngày giờ hợp lệ (YYYY-MM-DD HH:MM:SS)
const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

export const getAll = async (req, res) => {
    try {
        const [rows] = await getAllChamCong();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

export const getById = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id) || Number(id) <= 0) {
        return res.status(400).json({ message: "ID chấm công không hợp lệ." });
    }

    try {
        const [rows] = await findChamCongById(id);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Bản ghi chấm công không tồn tại." });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

export const getChamCongByNV = async (req, res) => {
    const { maNV } = req.params;

    if (isNaN(maNV) || Number(maNV) <= 0) {
        return res.status(400).json({ message: "Mã nhân viên không hợp lệ." });
    }

    try {
        const [rows] = await getChamCongByMaNV(maNV);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

export const addChamCong = async (req, res) => {
    const { MaNV, CheckIn, CheckOut } = req.body;

    const errors = [];
    if (!MaNV || isNaN(MaNV) || Number(MaNV) <= 0) {
        errors.push("Mã nhân viên không hợp lệ.");
    }
    if (!isValidDate(CheckIn)) {
        errors.push("Thời gian CheckIn không hợp lệ hoặc bị trống.");
    }
    if (CheckOut && !isValidDate(CheckOut)) {
        errors.push("Thời gian CheckOut không hợp lệ.");
    }
    // Nếu có cả CheckIn và CheckOut, CheckOut phải diễn ra sau CheckIn
    if (isValidDate(CheckIn) && isValidDate(CheckOut) && new Date(CheckOut) <= new Date(CheckIn)) {
        errors.push("CheckOut phải diễn ra sau CheckIn.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
    }

    try {
        await createChamCong(MaNV, CheckIn, CheckOut || null);
        // Lưu ý: Lúc này Trigger trong DB đã chạy ngầm và tạo/cập nhật bảng lương luôn rồi
        res.status(201).json({ message: "Chấm công thành công." });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

export const editChamCong = async (req, res) => {
    const { id } = req.params;
    const { CheckIn, CheckOut } = req.body;

    if (isNaN(id) || Number(id) <= 0) {
        return res.status(400).json({ message: "ID chấm công không hợp lệ." });
    }

    const errors = [];
    if (!isValidDate(CheckIn)) errors.push("Thời gian CheckIn không hợp lệ.");
    if (CheckOut && !isValidDate(CheckOut)) errors.push("Thời gian CheckOut không hợp lệ.");
    if (isValidDate(CheckIn) && isValidDate(CheckOut) && new Date(CheckOut) <= new Date(CheckIn)) {
        errors.push("CheckOut phải diễn ra sau CheckIn.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
    }

    try {
        const [existing] = await findChamCongById(id);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Bản ghi chấm công không tồn tại." });
        }

        await updateChamCong(id, CheckIn, CheckOut || null);
        res.json({ message: "Cập nhật bản ghi chấm công thành công." });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

export const removeChamCong = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id) || Number(id) <= 0) {
        return res.status(400).json({ message: "ID chấm công không hợp lệ." });
    }

    try {
        const [existing] = await findChamCongById(id);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Bản ghi chấm công không tồn tại." });
        }

        await deleteChamCong(id);
        res.json({ message: "Xóa bản ghi chấm công thành công." });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};