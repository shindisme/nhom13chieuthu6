import db from "../config/db.js";

export const getAllChamCong = () => {
    // Kết hợp (JOIN) với bảng nhanvien để lấy thêm tên hiển thị cho trực quan
    const sql = `
        SELECT cc.*, nv.HoTen 
        FROM chamcong cc 
        JOIN nhanvien nv ON cc.MaNV = nv.MaNV 
        ORDER BY cc.CheckIn DESC
    `;
    return db.promise().query(sql);
};

export const getChamCongById = (id) => {
    const sql = `
        SELECT cc.*, nv.HoTen 
        FROM chamcong cc 
        JOIN nhanvien nv ON cc.MaNV = nv.MaNV 
        WHERE cc.MaChamCong = ?
    `;
    return db.promise().query(sql, [id]);
};

export const getChamCongByMaNV = (maNV) => {
    const sql = "SELECT * FROM chamcong WHERE MaNV = ? ORDER BY CheckIn DESC";
    return db.promise().query(sql, [maNV]);
};

export const createChamCong = (maNV, checkIn, checkOut = null) => {
    // Lệnh INSERT này sẽ đánh thức Trigger 'trg_chamcong_tinhluong' trong DB
    const sql = "INSERT INTO chamcong (MaNV, CheckIn, CheckOut) VALUES (?, ?, ?)";
    return db.promise().query(sql, [maNV, checkIn, checkOut]);
};

export const updateChamCong = (id, checkIn, checkOut = null) => {
    const sql = "UPDATE chamcong SET CheckIn = ?, CheckOut = ? WHERE MaChamCong = ?";
    return db.promise().query(sql, [checkIn, checkOut, id]);
};

export const deleteChamCong = (id) => {
    const sql = "DELETE FROM chamcong WHERE MaChamCong = ?";
    return db.promise().query(sql, [id]);
};