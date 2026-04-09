import {
  getAllPhongBan,
  getPhongBanById as findPhongBanById,
  findPhongBanByTen,
  createPhongBan,
  updatePhongBan,
  deletePhongBan,
  countNhanVienByPhongBan,
} from "../models/phongban.model.js";

const validateTenPB = (tenPB) => {
  const errors = [];

  if (!tenPB || typeof tenPB !== "string") {
    errors.push("Tên phòng ban không được để trống.");
  } else {
    const trimmed = tenPB.trim();
    if (trimmed.length === 0) {
      errors.push("Tên phòng ban không được để trống.");
    } else if (trimmed.length < 2) {
      errors.push("Tên phòng ban phải có ít nhất 2 ký tự.");
    } else if (trimmed.length > 100) {
      errors.push("Tên phòng ban không được vượt quá 100 ký tự.");
    } else if (!/^[\p{L}\p{N}\s]+$/u.test(trimmed)) {
      errors.push("Tên phòng ban chỉ được chứa chữ cái, số và khoảng trắng.");
    }
  }

  return errors;
};

export const getPhongBans = async (req, res) => {
  try {
    const [rows] = await getAllPhongBan();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const getPhongBanById = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id) || Number(id) <= 0) {
    return res.status(400).json({ message: "ID phòng ban không hợp lệ." });
  }

  try {
    const [rows] = await findPhongBanById(id);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Phòng ban không tồn tại." });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const addPhongBan = async (req, res) => {
  const { TenPB } = req.body;

  const errors = validateTenPB(TenPB);
  if (errors.length > 0) {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
  }

  const tenPBTrimmed = TenPB.trim();

  try {
    // Kiểm tra trùng tên
    const [existing] = await findPhongBanByTen(tenPBTrimmed);
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: `Phòng ban "${tenPBTrimmed}" đã tồn tại.` });
    }

    await createPhongBan(tenPBTrimmed);
    res.status(201).json({ message: "Thêm phòng ban thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const editPhongBan = async (req, res) => {
  const { id } = req.params;
  const { TenPB } = req.body;

  if (isNaN(id) || Number(id) <= 0) {
    return res.status(400).json({ message: "ID phòng ban không hợp lệ." });
  }

  const errors = validateTenPB(TenPB);
  if (errors.length > 0) {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ.", errors });
  }

  const tenPBTrimmed = TenPB.trim();

  try {
    // Kiểm tra phòng ban tồn tại
    const [existing] = await findPhongBanById(id);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Phòng ban không tồn tại." });
    }

    // Kiểm tra trùng tên
    const [duplicate] = await findPhongBanByTen(tenPBTrimmed, id);
    if (duplicate.length > 0) {
      return res.status(409).json({
        message: `Tên "${tenPBTrimmed}" đã được dùng bởi phòng ban khác.`,
      });
    }

    await updatePhongBan(id, tenPBTrimmed);
    res.json({ message: "Cập nhật phòng ban thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const removePhongBan = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id) || Number(id) <= 0) {
    return res.status(400).json({ message: "ID phòng ban không hợp lệ." });
  }

  try {
    // Kiểm tra phòng ban tồn tại
    const [existing] = await findPhongBanById(id);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Phòng ban không tồn tại." });
    }

    // Kiểm tra còn nhân viên trong phòng ban không
    const [countResult] = await countNhanVienByPhongBan(id);
    const total = countResult[0]?.total ?? 0;
    if (total > 0) {
      return res.status(400).json({
        message: `Không thể xóa. Phòng ban đang có ${total} nhân viên.`,
      });
    }

    await deletePhongBan(id);
    res.json({ message: "Xóa phòng ban thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
