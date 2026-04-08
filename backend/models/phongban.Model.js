import db from "../config/db.js";

export const getAllPhongBan = () => {
    const sql = "SELECT * FROM phongban ORDER BY MaPB ASC";
    return db.promise().query(sql);
};

export const getPhongBanById = (id) => {
    const sql = "SELECT * FROM phongban WHERE MaPB = ?";
    return db.promise().query(sql, [id]);
};

export const findPhongBanByTen = (tenPB, excludeId = null) => {
    const sql = excludeId
        ? "SELECT * FROM phongban WHERE TenPB = ? AND MaPB != ?"
        : "SELECT * FROM phongban WHERE TenPB = ?";
    const params = excludeId ? [tenPB, excludeId] : [tenPB];
    return db.promise().query(sql, params);
};

export const createPhongBan = (tenPB) => {
    const sql = "INSERT INTO phongban (TenPB) VALUES (?)";
    return db.promise().query(sql, [tenPB]);
};

export const updatePhongBan = (id, tenPB) => {
    const sql = "UPDATE phongban SET TenPB = ? WHERE MaPB = ?";
    return db.promise().query(sql, [tenPB, id]);
};

export const deletePhongBan = (id) => {
    const sql = "DELETE FROM phongban WHERE MaPB = ?";
    return db.promise().query(sql, [id]);
};

// Kiểm tra phòng ban có nhân viên không
export const countNhanVienByPhongBan = (id) => {
    const sql = "SELECT COUNT(*) AS total FROM nhanvien WHERE MaPB = ?";
    return db.promise().query(sql, [id]);
};