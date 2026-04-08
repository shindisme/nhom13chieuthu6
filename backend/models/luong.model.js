import db from "../config/db.js";

export const getAllLuong = () => {
    const sql = `
        SELECT l.*, nv.HoTen 
        FROM luong l 
        JOIN nhanvien nv ON l.MaNV = nv.MaNV 
        ORDER BY l.MaLuong ASC
    `;
    return db.promise().query(sql);
};

export const getLuongById = (id) => {
    const sql = `
        SELECT l.*, nv.HoTen 
        FROM luong l 
        JOIN nhanvien nv ON l.MaNV = nv.MaNV 
        WHERE l.MaLuong = ?
    `;
    return db.promise().query(sql, [id]);
};

export const findLuongByMaNV = (maNV, excludeId = null) => {
    const sql = excludeId
        ? "SELECT * FROM luong WHERE MaNV = ? AND MaLuong != ?"
        : "SELECT * FROM luong WHERE MaNV = ?";
    const params = excludeId ? [maNV, excludeId] : [maNV];
    return db.promise().query(sql, params);
};

export const createLuong = (maNV, luongCoBan, phuCap, heSoLuong) => {
    const sql = "INSERT INTO luong (MaNV, LuongCoBan, PhuCap, HeSoLuong) VALUES (?, ?, ?, ?)";
    return db.promise().query(sql, [maNV, luongCoBan, phuCap, heSoLuong]);
};

export const updateLuong = (id, luongCoBan, phuCap, heSoLuong) => {
    const sql = "UPDATE luong SET LuongCoBan = ?, PhuCap = ?, HeSoLuong = ? WHERE MaLuong = ?";
    return db.promise().query(sql, [luongCoBan, phuCap, heSoLuong, id]);
};

export const deleteLuong = (id) => {
    const sql = "DELETE FROM luong WHERE MaLuong = ?";
    return db.promise().query(sql, [id]);
};