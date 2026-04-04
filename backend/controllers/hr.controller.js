const db = require('../config/db');

// Lấy danh sách toàn bộ nhân viên kèm phòng ban và chức vụ
exports.getAllEmployees = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT nv.*, pb.TenPB, cv.TenCV 
            FROM nhanvien nv
            LEFT JOIN phongban pb ON nv.MaPB = pb.MaPB
            LEFT JOIN chucvu cv ON nv.MaCV = cv.MaCV
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm nhân viên mới
exports.addEmployee = async (req, res) => {
    const { HoTen, GioiTinh, NgaySinh, SDT, DiaChi, MaPB, MaCV } = req.body;
    try {
        const [result] = await db.execute(
            `INSERT INTO nhanvien (HoTen, GioiTinh, NgaySinh, SDT, DiaChi, MaPB, MaCV, NgayBatDau) 
             VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`,
            [HoTen, GioiTinh, NgaySinh, SDT, DiaChi, MaPB, MaCV]
        );
        res.status(201).json({ message: "Thêm nhân viên thành công", MaNV: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Cập nhật phòng ban hoặc chức vụ (Khi nhân viên thăng cấp/điều chuyển)
exports.updateEmployeePosition = async (req, res) => {
    const { MaNV, MaPB, MaCV } = req.body;
    try {
        await db.execute(
            `UPDATE nhanvien SET MaPB = ?, MaCV = ? WHERE MaNV = ?`,
            [MaPB, MaCV, MaNV]
        );
        res.json({ message: "Cập nhật vị trí nhân sự thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa nhân viên (Khi nghỉ việc - Xóa mềm hoặc xóa cứng)
exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        // Lưu ý: Phải xóa dữ liệu liên quan ở bảng luong/taikhoan trước hoặc dùng CASCADE
        await db.execute(`DELETE FROM nhanvien WHERE MaNV = ?`, [id]);
        res.json({ message: "Đã xóa nhân viên khỏi hệ thống." });
    } catch (error) {
        res.status(500).json({ message: "Không thể xóa do vướng ràng buộc dữ liệu." });
    }
};