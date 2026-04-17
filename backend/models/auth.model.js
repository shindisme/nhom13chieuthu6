import db from "../config/db.js";
export const getAllTaiKhoanModel = async () => {
    const connection = await db;
    const query = `
        SELECT
        tk.MaNV,
        nv.HoTen,
        tk.Email,
        tk.password,
        FROM taikhoan tk
        LEFT JOIN nhanvien nv ON tk.MaNV = nv.MaNV
    `;
    const [rows] = await connection.execute(query);
    return rows;
};
export const findUserByEmail = async (email) => {
    const connection = await db;
    const query = `
        SELECT tk.MaTK, tk.Email, tk.MatKhau, tk.role, tk.MaNV,
               nv.HoTen, nv.SDT, nv.GioiTinh, nv.MaPB,
               pb.TenPB
        FROM taikhoan tk
        LEFT JOIN nhanvien nv ON tk.MaNV = nv.MaNV
        LEFT JOIN phongban pb ON nv.MaPB = pb.MaPB
        WHERE tk.Email = ?
    `;
    return connection.execute(query, [email]);
};
export const createTaiKhoanModel = async (data) => {
    const connection = await db;
    const query = `
        INSERT INTO taikhoan (Email, MatKhau, MaNV, role) 
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
        data.Email,
        data.MatKhau,
        data.MaNV,
        data.role || 0
    ]);
    return result;
};
export const updatePasswordModel = async (maNV, hashedPathword) => {
    const connection = await db;
    const query = "UPDATE taikhoan SET MatKhau = ? WHERE MaNV = ?";
    const [result] = await connection.execute(query, [hashedPathword, maNV]);
    return result;
};
export const getTaiKhoanByMaNVModel = async (maNV) => {
    const connection = await db;
    const [rows] = await connection.execute("SELECT * FROM taikhoan WHERE MaNV = ?", [maNV]);
    return rows[0];
};
export const searchTaiKhoanModel = async (searchTerm) => {
    const connection = await db;
    const value = `%${searchTerm}%`;
    const query = `
        SELECT tk.MaTK, tk.Email, tk.role, tk.MaNV, nv.HoTen 
        FROM taikhoan tk
        LEFT JOIN nhanvien nv ON tk.MaNV = nv.MaNV
        WHERE nv.HoTen LIKE ? OR tk.Email LIKE ?
    `;
    const [rows] = await connection.execute(query, [value, value]);
    return rows;
};
export const deleteTaiKhoanModel = async (id) => {
    const connection = await db;
    const [result] = await connection.execute("DELETE FROM taikhoan WHERE MaTK = ?", [id]);
    return result;
};
export const resetPasswordModel = async (id, hashedPass) => {
    const connection = await db;
    const [result] = await connection.execute(
        "UPDATE taikhoan SET MatKhau = ? WHERE MaTK = ?",
        [hashedPass, id]
    );
    return result;
};