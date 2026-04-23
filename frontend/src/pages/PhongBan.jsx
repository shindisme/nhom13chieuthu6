import { useState, useMemo } from "react";
import useFetch from "../hooks/useFetch";
import phongBanService from "../services/phongBanService";
import { toast } from "react-toastify";
import { exportToExcel } from "../utils/exportUtils";
import PhongBanModal from "../components/phongban/PhongBanModal";
import PhongBanDeleteConfirm from "../components/phongban/PhongBanDeleteConfirm";
import { removeAccents } from "../utils/helpers";

function PhongBan() {
  const [search, setSearch] = useState("");
  const { data: res, loading, refetch } = useFetch("/phong-ban");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPB, setCurrentPB] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const rawRows = useMemo(() => {
    return Array.isArray(res) ? res : res?.data ?? [];
  }, [res]);

  const filteredRows = useMemo(() => {
    return rawRows.filter((row) => {
      const term = removeAccents(search);
      return [row.TenPB].some((value) => value && removeAccents(value).includes(term));
    });
  }, [search, rawRows]);

  const totalDepartments = rawRows.length;

  const handleExport = () => {
    if (filteredRows.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }
    const exportData = filteredRows.map((row) => ({
      "Mã Phòng Ban": row.MaPB || row.id,
      "Tên Phòng Ban": row.TenPB,
    }));
    exportToExcel(exportData, "DanhSachPhongBan");
  };

  const openAddModal = () => {
    setCurrentPB(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pb) => {
    setCurrentPB(pb);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setCurrentPB(null), 200);
  };

  const handleModalSaved = () => {
    refetch();
    closeModal();
  };

  const handleDeleteClick = (pb) => {
    setDeleteTarget(pb);
  };

  const handleDeleted = () => {
    setDeleteTarget(null);
    refetch();
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 rounded-3xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mt-2 text-sm text-slate-500">
              Xem và quản lý thông tin các phòng ban trong công ty
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={handleExport}
              className="rounded-full bg-white shadow-sm hover:shadow-md px-5 py-2 text-slate-700 transition"
            >
              Xuất dữ liệu
            </button>
            <button
              onClick={openAddModal}
              className="rounded-full bg-slate-900 shadow-sm hover:shadow-md px-5 py-2 text-white transition hover:bg-slate-800"
            >
              + Thêm phòng ban
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="rounded-3xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Tổng số phòng ban
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {totalDepartments}
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Phòng ban hoạt động
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {totalDepartments}
          </p>
        </div>
      </div>

      <div className="rounded-4xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
          <div className="flex items-center gap-3 rounded-full bg-white shadow-sm px-4 py-3 min-w-[280px]">
            <input
              type="search"
              placeholder="Tìm theo tên phòng ban..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left">
            <thead>
              <tr className="text-sm text-slate-500">
                <th className="px-4 py-3">Mã PB</th>
                <th className="px-4 py-3">Tên phòng ban</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="w-8 h-8 animate-spin text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      <div className="text-sm">Đang tải dữ liệu...</div>
                    </div>
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-sm">Không có dữ liệu</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.MaPB || row.id}
                    className="bg-white rounded-3xl text-sm text-slate-700 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <td className="whitespace-nowrap rounded-l-3xl bg-white px-4 py-4 font-semibold text-slate-900">
                      {row.MaPB || row.id}
                    </td>
                    <td className="bg-white px-4 py-4 font-medium">
                      {row.TenPB}
                    </td>
                    <td className="rounded-r-3xl bg-white px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(row)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteClick(row)}
                          className="text-rose-600 hover:text-rose-800 font-medium px-2 py-1 transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-500">
            Hiển thị {filteredRows.length} / {totalDepartments} phòng ban
          </div>
        </div>
      </div>

      {/* Modal Thêm / Sửa */}
      {isModalOpen && (
        <PhongBanModal
          currentPB={currentPB}
          onClose={closeModal}
          onSaved={handleModalSaved}
        />
      )}

      {/* Modal Xác nhận Xóa */}
      {deleteTarget && (
        <PhongBanDeleteConfirm
          record={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}

export default PhongBan;
