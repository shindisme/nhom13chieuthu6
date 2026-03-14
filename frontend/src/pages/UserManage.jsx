import { useState } from "react";
import userService from "../services/userService";
import useFetch from "../hooks/useFetch";

const UsersManage = () => {

    const { data: users, loading, error, refetch } = useFetch("/users");
    const [id, setID] = useState("");
    const [name, setName] = useState("");
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // THÊM USER
    const handleAdd = async () => {
        if (!name.trim()) {
            alert("Vui lòng nhập tên");

            return;
        }
        try {
            await userService.insert({ id, name });
            setID("");
            setName("");
            setShowModal(false);
            refetch();
        } catch (error) {
            console.error("Lỗi thêm user:", error);
        }
    };

    // MỞ MODAL SỬA
    const handleEdit = (user) => {
        setName(user.name);
        setEditId(user.id);
        setShowModal(true);
    };

    // UPDATE USER
    const handleUpdate = async () => {
        await userService.update(editId, { name });
        setEditId(null);
        setName("");
        setShowModal(false);
        refetch();
    };

    // DELETE USER
    const handleDelete = async (id) => {
        await userService.delete(id);
        refetch();
    };

    if (loading) return <div className="p-6 text-center">Đang tải...</div>;
    if (error) return <div className="p-6 text-center text-red-500">Lỗi: {error.message}</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">Danh sách người dùng</h2>
                        <p className="text-gray-500 text-sm">
                            Tổng số: {users.length}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setEditId(null);
                            setID("");
                            setName("");
                            setShowModal(true);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        + Thêm
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 border-b text-left">STT</th>
                                <th className="p-3 border-b text-left">ID</th>
                                <th className="p-3 border-b text-left">Tên</th>
                                <th className="p-3 border-b text-left">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="p-3 border-b">{index + 1}</td>
                                    <td className="p-3 border-b">{user.id}</td>
                                    <td className="p-3 border-b">{user.name}</td>
                                    <td className="p-3 border-b flex gap-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="bg-orange-400 text-white px-3 py-1 rounded"
                                        >
                                            ✏
                                        </button>

                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

                    <div className="bg-white p-6 rounded-lg w-96">

                        <h2 className="text-lg font-semibold mb-4">
                            {editId ? "Sửa người dùng" : "Thêm người dùng"}
                        </h2>
                        <input
                            type="text"
                            placeholder="Mã người dùng"
                            value={id}
                            onChange={(e) => setID(e.target.value)}
                            className="w-full border p-2 rounded mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Tên người dùng"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border p-2 rounded mb-4"
                        />

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Hủy
                            </button>

                            {editId ? (
                                <button
                                    onClick={handleUpdate}
                                    className="bg-orange-500 text-white px-4 py-2 rounded"
                                >
                                    Cập nhật
                                </button>
                            ) : (
                                <button
                                    onClick={handleAdd}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Thêm
                                </button>
                            )}

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
};

export default UsersManage;