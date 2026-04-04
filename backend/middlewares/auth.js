const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Kiểm tra sự tồn tại của header Authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Cần token định dạng Bearer để truy cập" });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Gán thông tin user (bao gồm roleId) vào request để middleware sau sử dụng
        req.user = decoded;
        next();
    } catch (err) {
        // Trả về lỗi 401 để Frontend biết cần yêu cầu người dùng đăng nhập lại
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // Kiểm tra xem user đã qua bước verifyToken chưa và có quyền phù hợp không
        if (!req.user || !allowedRoles.includes(req.user.roleId)) {
            return res.status(403).json({
                message: "Bạn không có quyền truy cập khu vực dành cho " +
                    (allowedRoles.includes(1) ? "Admin" : "Bộ phận chuyên môn")
            });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };