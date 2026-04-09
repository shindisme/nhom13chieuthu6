import {
  getAllBangLuong,
  getBangLuongById as findBangLuongById,
  updateBangLuong,
  deleteBangLuong,
} from "../models/bangluong.model.js";

export const getAll = async (req, res) => {
  // Có thể lọc theo tháng/năm qua query params: ?thang=4&nam=2026
  const { thang, nam } = req.query;

  try {
    const [rows] = await getAllBangLuong(thang, nam);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const getById = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id) || Number(id) <= 0) {
    return res.status(400).json({ message: "ID bảng lương không hợp lệ." });
  }

  try {
    const [rows] = await findBangLuongById(id);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Bản ghi lương không tồn tại." });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const editBangLuong = async (req, res) => {
  const { id } = req.params;
  const { TongCa, TongLuong } = req.body;

  if (isNaN(id) || Number(id) <= 0) {
    return res.status(400).json({ message: "ID bảng lương không hợp lệ." });
  }

  if (TongCa === undefined || isNaN(TongCa) || Number(TongCa) < 0) {
    return res.status(400).json({ message: "Tổng ca không hợp lệ." });
  }
  if (TongLuong === undefined || isNaN(TongLuong) || Number(TongLuong) < 0) {
    return res.status(400).json({ message: "Tổng lương không hợp lệ." });
  }

  try {
    const [existing] = await findBangLuongById(id);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Bản ghi lương không tồn tại." });
    }

    await updateBangLuong(id, TongCa, TongLuong);
    res.json({ message: "Cập nhật dữ liệu lương thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const removeBangLuong = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id) || Number(id) <= 0) {
    return res.status(400).json({ message: "ID bảng lương không hợp lệ." });
  }

  try {
    const [existing] = await findBangLuongById(id);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Bản ghi lương không tồn tại." });
    }

    await deleteBangLuong(id);
    res.json({ message: "Xóa bản ghi lương thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
