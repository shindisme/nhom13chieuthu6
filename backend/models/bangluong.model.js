import db from "../config/db.js";

export const getAllBangLuong = (thang = null, nam = null) => {
    let sql = `
        SELECT bl.*, nv.HoTen 
        FROM bangluong bl 
        JOIN nhanvien nv ON bl.MaNV = nv.MaNV 
    `;
    const params = [];

    if (thang && nam) {
        sql += " WHERE bl.Thang = ? AND bl.Nam = ?";
        params.push(thang, nam);
    }

    sql += " ORDER BY bl.Nam DESC, bl.Thang DESC, bl.MaNV ASC";
    return db.promise().query(sql, params);
};

export const getBangLuongById = (id) => {
    const sql = `
        SELECT bl.*, nv.HoTen 
        FROM bangluong bl 
        JOIN nhanvien nv ON bl.MaNV = nv.MaNV 
        WHERE bl.MaBangLuong = ?
    `;
    return db.promise().query(sql, [id]);
};

// Cập nhật thủ công nếu cần can thiệp tay
export const updateBangLuong = (id, tongCa, tongLuong) => {
    const sql = "UPDATE bangluong SET TongCa = ?, TongLuong = ? WHERE MaBangLuong = ?";
    return db.promise().query(sql, [tongCa, tongLuong, id]);
};

export const deleteBangLuong = (id) => {
    const sql = "DELETE FROM bangluong WHERE MaBangLuong = ?";
    return db.promise().query(sql, [id]);
};