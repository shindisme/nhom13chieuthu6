import db from "../config/db.js";
export const getAllNhanVienModel = async () => {
    const connection = await db;
    const query = `
        SELECT 
            nv.MaNV, 
            nv.HoTen, 
            nv.GioiTinh, 
            DATE_FORMAT(nv.NgaySinh, '%Y-%m-%d') as NgaySinh, 
            nv.SDT, 
            nv.DiaChi, 
            DATE_FORMAT(nv.NgayBatDau, '%Y-%m-%d') as NgayBatDau,
            nv.MaPB, 
            nv.MaCV,
            pb.TenPB 
        FROM nhanvien nv
        LEFT JOIN phongban pb ON nv.MaPB = pb.MaPB
    `;
    const [rows] = await connection.execute(query);
    return rows;
};

export const getNhanVienByIdModel = async (id) => {
    const connection = await db;
    const query = `
        SELECT 
            nv.MaNV, 
            nv.HoTen, 
            nv.GioiTinh, 
            DATE_FORMAT(nv.NgaySinh, '%Y-%m-%d') as NgaySinh, 
            nv.SDT, 
            nv.DiaChi, 
            DATE_FORMAT(nv.NgayBatDau, '%Y-%m-%d') as NgayBatDau,
            nv.MaPB, 
            nv.MaCV,
            pb.TenPB, 
            cv.TenCV
        FROM nhanvien nv
        LEFT JOIN phongban pb ON nv.MaPB = pb.MaPB
        LEFT JOIN chucvu cv ON nv.MaCV = cv.MaCV
        WHERE nv.MaNV = ?
    `;
    const [rows] = await connection.execute(query, [id]);
    return rows[0];
};

export const createNhanVienModel = async (data) => {
    const connection = await db;
    const query = `
        INSERT INTO nhanvien (HoTen, GioiTinh, NgaySinh, SDT, DiaChi, NgayBatDau, MaPB, MaCV) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
        data.HoTen,
        data.GioiTinh,
        data.NgaySinh,
        data.SDT,
        data.DiaChi,
        data.NgayBatDau,
        data.MaPB,
        data.MaCV
    ]);
    return result;
};


export const updateNhanVienModel = async (id, data) => {
    const connection = await db;
    const query = `
        UPDATE nhanvien 
        SET HoTen=?, GioiTinh=?, NgaySinh=?, SDT=?, DiaChi=?, MaPB=?, MaCV=?, NgayBatDau=? 
        WHERE MaNV=?
    `;
    const [result] = await connection.execute(query, [
        data.HoTen,
        data.GioiTinh,
        data.NgaySinh,
        data.SDT,
        data.DiaChi,
        data.MaPB,
        data.MaCV,
        data.NgayBatDau,
        id
    ]);
    return result;
};


export const deleteNhanVienModel = async (id) => {
    const connection = await db;
    const [result] = await connection.execute("DELETE FROM nhanvien WHERE MaNV = ?", [id]);
    return result;
};