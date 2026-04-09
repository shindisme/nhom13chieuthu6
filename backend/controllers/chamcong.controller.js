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
        console.error("Lỗi lấy danh sách chấm công:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
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
        console.error(`Lỗi lấy chấm công ID ${id}:`, error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const getChamCongByNV = async (req, res) => {
    const { maNV } = req.params;

    // Lưu ý: Nếu Mã NV của bạn là chuỗi (VD: "NV01"), hãy bỏ dòng kiểm tra isNaN này
    if (isNaN(maNV) || Number(maNV) <= 0) {
        return res.status(400).json({ message: "Mã nhân viên không hợp lệ." });
    }

    try {
        const [rows] = await getChamCongByMaNV(maNV);
        res.json(rows);
    } catch (error) {
        console.error(`Lỗi lấy chấm công của NV ${maNV}:`, error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
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
        // Ép kiểu chuỗi ISO từ React thành đối tượng Date để thư viện mysql2 tự động xử lý
        const parsedCheckIn = new Date(CheckIn);
        const parsedCheckOut = CheckOut ? new Date(CheckOut) : null;

        await createChamCong(MaNV, parsedCheckIn, parsedCheckOut);
        
        // Lưu ý: Lúc này Trigger trong DB đã chạy ngầm và tạo/cập nhật bảng lương luôn rồi
        res.status(201).json({ message: "Chấm công thành công." });
    } catch (error) {
        console.error("Lỗi thêm chấm công:", error); // In lỗi ra Terminal để debug
        res.status(500).json({ message: "Lỗi server", error: error.message });
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

        // Tương tự, ép kiểu dữ liệu trước khi gửi vào database
        const parsedCheckIn = new Date(CheckIn);
        const parsedCheckOut = CheckOut ? new Date(CheckOut) : null;

        await updateChamCong(id, parsedCheckIn, parsedCheckOut);
        res.json({ message: "Cập nhật bản ghi chấm công thành công." });
    } catch (error) {
        console.error(`Lỗi cập nhật chấm công ID ${id}:`, error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
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
        console.error(`Lỗi xóa chấm công ID ${id}:`, error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};