const db = require('../config/db');

exports.getMonthlyPayroll = async (req, res) => {
    const { month, year } = req.query;
    try {
        const [rows] = await db.execute(
            `SELECT bl.*, nv.HoTen, pb.TenPB 
             FROM bangluong bl
             JOIN nhanvien nv ON bl.MaNV = nv.MaNV
             JOIN phongban pb ON nv.MaPB = pb.MaPB
             WHERE bl.Thang = ? AND bl.Nam = ?`,
            [month, year]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSalaryBase = async (req, res) => {
    const { maNV, luongCB, phuCap, heSo } = req.body;
    try {
        await db.execute(
            `UPDATE luong SET LuongCoBan = ?, PhuCap = ?, HeSoLuong = ? WHERE MaNV = ?`,
            [luongCB, phuCap, heSo, maNV]
        );
        res.json({ message: "Cập nhật cấu hình lương thành công" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getDetailedPayroll = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                nv.HoTen, 
                pb.TenPB, 
                bl.TongCa, 
                bl.TongLuong, 
                l.LuongCoBan, 
                l.PhuCap
            FROM bangluong bl
            JOIN nhanvien nv ON bl.MaNV = nv.MaNV
            JOIN phongban pb ON nv.MaPB = pb.MaPB
            JOIN luong l ON nv.MaNV = l.MaNV
            WHERE bl.Thang = 4 AND bl.Nam = 2026
            ORDER BY bl.TongLuong DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};