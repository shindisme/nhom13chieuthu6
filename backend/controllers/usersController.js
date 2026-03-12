import {
    getAllUsers,
    getUserById as findUserById,
    createUser,
    updateUser,
    deleteUser
} from "../models/usersModel.js";

export const getUsers = async (req, res) => {
    try {
        const [rows] = await getAllUsers();
        res.json(rows);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getUserById = async (req, res) => {
    try {
        const [rows] = await findUserById(req.params.id);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User không tồn tại" });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const addUser = async (req, res) => {
    const { id, name } = req.body;

    try {
        await createUser(id, name);
        res.json({ message: "Thêm user thành công" });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const editUser = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        await updateUser(id, name);
        res.json({ message: "Cập nhật thành công" });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const removeUser = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteUser(id);
        res.json({ message: "Xóa user thành công" });
    } catch (error) {
        res.status(500).json(error);
    }
};