import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    const { email, password } = req.body;

    console.log("--- KIỂM TRA ĐĂNG NHẬP ---");
    console.log("Email:", email);

    try {
        // SỬA TRỰC TIẾP: Await db trước khi gọi execute
        const connection = await db;

        // Truy vấn tìm User và Role
        const [rows] = await connection.execute(
            `SELECT tk.*, tr.MaRole 
             FROM taikhoan tk 
             JOIN taikhoan_role tr ON tk.MaTK = tr.MaTK 
             WHERE tk.Email = ?`,
            [email]
        );

        if (rows.length === 0) {
            console.log("=> LỖI: Email không tồn tại.");
            return res.status(404).json({
                success: false,
                message: "Tài khoản không tồn tại"
            });
        }

        const user = rows[0];

        // So sánh mật khẩu (Kiệt check lại cột MatKhau trong DB nhé)
        const isMatch = await bcrypt.compare(password, user.MatKhau);

        if (!isMatch) {
            console.log("=> LỖI: Sai mật khẩu.");
            return res.status(400).json({
                success: false,
                message: "Mật khẩu không chính xác"
            });
        }

        // Tạo Token JWT
        const token = jwt.sign(
            { id: user.MaTK, roleId: user.MaRole, email: user.Email },
            process.env.JWT_SECRET || 'nhom13_secret_key',
            { expiresIn: '12h' }
        );

        console.log("=> ĐĂNG NHẬP THÀNH CÔNG!");

        res.json({
            success: true,
            message: "Đăng nhập thành công",
            token: token,
            roleId: user.MaRole,
            user: {
                id: user.MaTK,
                email: user.Email
            }
        });

    } catch (error) {
        console.error("=> LỖI HỆ THỐNG:", error.message);
        res.status(500).json({
            success: false,
            message: "Lỗi hệ thống: " + error.message
        });
    }
};