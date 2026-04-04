
const db = require('../config/db');

exports.getGlobalStats = async (req, res) => {
    try {
        // 1. Thống kê nhân sự theo phòng ban (Để vẽ Pie Chart)
        const [deptStats] = await db.execute(`
            SELECT pb.TenPB as name, COUNT(nv.MaNV) as value 
            FROM phongban pb 
            LEFT JOIN nhanvien nv ON pb.MaPB = nv.MaPB 
            GROUP BY pb.MaPB`);

        // 2. Tổng quỹ lương tháng hiện tại (Dữ liệu từ Trigger)
        const [salaryStats] = await db.execute(`
            SELECT SUM(TongLuong) as totalMonthlyBudget 
            FROM bangluong 
            WHERE Thang = MONTH(CURRENT_DATE) AND Nam = YEAR(CURRENT_DATE)`);

        // 3. Tỷ lệ cấp bậc (Junior/Senior...) để đánh giá trình độ công ty
        const [levelStats] = await db.execute(`
            SELECT cv.TenCV as level, COUNT(nv.MaNV) as count 
            FROM chucvu cv 
            JOIN nhanvien nv ON cv.MaCV = nv.MaCV 
            GROUP BY cv.MaCV`);

        res.json({
            departmentDistribution: deptStats,
            monthlyBudget: salaryStats[0].totalMonthlyBudget || 0,
            levelDistribution: levelStats,
            totalStaff: 55
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};