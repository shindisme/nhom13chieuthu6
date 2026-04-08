import db from "../config/db.js";

export const getAllNhanVien = async (req, res) => {
    try {
        const connection = await db;
        const query = `
            SELECT nv.*, pb.TenPB 
            FROM nhanvien nv
            LEFT JOIN phongban pb ON nv.MaPB = pb.MaPB
        `;
        const [rows] = await connection.execute(query);

        return res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi lấy danh sách", error: error.message });
    }
};

export const getNhanVienById = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await db;
        const query = `
            SELECT nv.*, pb.TenPB, cv.TenCV
            FROM nhanvien nv
            LEFT JOIN phongban pb ON nv.MaPB = pb.MaPB
            LEFT JOIN chucvu cv ON nv.MaCV = cv.MaCV
            WHERE nv.MaNV = ?
        `;
        const [rows] = await connection.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhân viên có mã: " + id
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống khi lấy thông tin nhân viên",
            error: error.message
        });
    }
};

export const createNhanVien = async (req, res) => {
    const { HoTen, GioiTinh, NgaySinh, SDT, DiaChi, NgayBatDau, MaPB, MaCV } = req.body;

    try {
        const connection = await db;
        const query = `
            INSERT INTO nhanvien (HoTen, GioiTinh, NgaySinh, SDT, DiaChi, NgayBatDau, MaPB, MaCV) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await connection.execute(query,
            [HoTen, GioiTinh, NgaySinh, SDT, DiaChi, NgayBatDau, MaPB, MaCV]
        );

        return res.status(201).json({
            success: true,
            message: "Thêm nhân viên thành công",
            insertId: result.insertId
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi khi thêm", error: error.message });
    }
};


export const deleteNhanVien = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await db;
        const [result] = await connection.execute("DELETE FROM nhanvien WHERE MaNV = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Nhân viên không tồn tại" });
        }

        return res.status(200).json({ success: true, message: "Đã xóa nhân viên ID: " + id });
    } catch (error) {
        if (error.errno === 1451) {
            return res.status(400).json({ success: false, message: "Không thể xóa do nhân viên đã có dữ liệu lương/chấm công!" });
        }
        return res.status(500).json({ success: false, message: "Lỗi khi xóa", error: error.message });
    }
};

export const updateNhanVien = async (req, res) => {
    const { id } = req.params;
    const { HoTen, GioiTinh, NgaySinh, SDT, DiaChi, MaPB, MaCV, NgayBatDau } = req.body;

    try {
        const connection = await db;
        const query = `
            UPDATE nhanvien 
            SET HoTen=?, GioiTinh=?, NgaySinh=?, SDT=?, DiaChi=?, MaPB=?, MaCV=?, NgayBatDau=? 
            WHERE MaNV=?
        `;
        const [result] = await connection.execute(query,
            [HoTen, GioiTinh, NgaySinh, SDT, DiaChi, MaPB, MaCV, NgayBatDau, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên để cập nhật" });
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật nhân viên " + id + " thành công!"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi khi cập nhật", error: error.message });
    }
};