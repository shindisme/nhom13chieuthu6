import { useState } from "react";
import useFetch from "../hooks/useFetch";
import userService from "../services/nhanVienService";

const NhanVien = () => {
  const { data: users = [], loading, error, refetch } = useFetch("/nhan-vien");
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (id) => {
    await userService.delete(id);
    refetch();
  };

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-500">Lỗi: {error.message}</div>
    );

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p className="text-gray-500 mt-1">
              {users.length} nhân viên đang hoạt động trong hệ thống
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <button className="px-3 py-1 rounded-full bg-slate-50 text-sm">
                Tất cả ({users.length})
              </button>
              <button className="px-3 py-1 rounded-full bg-slate-50 text-sm">
                Kỹ thuật
              </button>
              <button className="px-3 py-1 rounded-full bg-slate-50 text-sm">
                Kinh doanh
              </button>
              <button className="px-3 py-1 rounded-full bg-slate-50 text-sm">
                Marketing
              </button>
              <button className="px-3 py-1 rounded-full bg-slate-50 text-sm">
                Hành chính
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden md:block">
              <input
                className="border rounded px-3 py-2 w-64"
                placeholder="Tìm nhân viên..."
              />
            </div>

            <button className="px-4 py-2 border rounded bg-white">
              Xuất Excel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              + Thêm nhân viên
            </button>
          </div>
        </div>

        {/* Cards grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  {u.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{u.name}</h3>
                      <p className="text-sm text-gray-400">
                        Chức vụ - Phòng ban
                      </p>
                    </div>
                    <div className="text-sm text-green-600">Đang làm</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-slate-50 px-2 py-1 rounded text-xs">
                      React
                    </span>
                    <span className="bg-slate-50 px-2 py-1 rounded text-xs">
                      TypeScript
                    </span>
                    <span className="bg-slate-50 px-2 py-1 rounded text-xs">
                      3 năm KN
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500">
                    <div>
                      <div className="text-xs text-slate-400">Chuyên cần</div>
                      <div className="font-semibold text-sm text-slate-700">
                        97%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">
                        Lương (triệu)
                      </div>
                      <div className="font-semibold text-sm text-slate-700">
                        28.5
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">
                        Ngày phép còn
                      </div>
                      <div className="font-semibold text-sm text-slate-700">
                        12
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleDelete(u.id)}
                  className="px-3 py-1 rounded bg-red-50 text-red-600"
                >
                  ✕
                </button>
                <button className="px-3 py-1 rounded bg-orange-50 text-orange-600">
                  ✏
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NhanVien;
