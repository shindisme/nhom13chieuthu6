import { useState, useMemo } from "react";
import useFetch from "../hooks/useFetch";
import luongService from "../services/luongService";
import { toast } from "react-toastify";
import { exportToExcel } from "../utils/exportUtils";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).replace("₫", "đ");

function QuanLyLuong() {
  const [search, setSearch] = useState("");
  const { data: luongData, loading, refetch } = useFetch("/luong");
  const { data: nvData } = useFetch("/nhan-vien");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLuong, setCurrentLuong] = useState(null);
  const [formData, setFormData] = useState({
    MaNV: "",
    LuongCoBan: 0,
    PhuCap: 0,
    HeSoLuong: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawRows = useMemo(() => {
    return Array.isArray(luongData) ? luongData : luongData?.data ?? [];
  }, [luongData]);

  const nhanViens = useMemo(() => {
    return Array.isArray(nvData) ? nvData : nvData?.data ?? [];
  }, [nvData]);

  const filteredRows = useMemo(() => {
    return rawRows.filter((row) =>
      [row.HoTen].some((value) => value && value.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, rawRows]);

  const handleExport = () => {
    if (filteredRows.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }
    const exportData = filteredRows.map((row) => ({
      "Mã Lương": row.MaLuong,
      "Tên Nhân Viên": row.HoTen,
      "Lương Cơ Bản": row.LuongCoBan,
      "Phụ Cấp": row.PhuCap,
      "Hệ Số Lương": row.HeSoLuong,
    }));
    exportToExcel(exportData, "DanhSachCauHinhLuong");
  };

  const openAddModal = () => {
    setCurrentLuong(null);
    setFormData({ MaNV: "", LuongCoBan: 0, PhuCap: 0, HeSoLuong: 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrentLuong(item);
    setFormData({
      MaNV: item.MaNV,
      LuongCoBan: item.LuongCoBan,
      PhuCap: item.PhuCap,
      HeSoLuong: item.HeSoLuong,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setCurrentLuong(null), 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.MaNV) {
      toast.warning("Vui lòng chọn nhân viên");
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentLuong) {
        await luongService.update(currentLuong.MaLuong, formData);
        toast.success("Cập nhật cấu hình lương thành công!");
      } else {
        await luongService.insert(formData);
        toast.success("Thêm cấu hình lương thành công!");
      }
      refetch();
      closeModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra, có thể nhân viên này đã được cấu hình lương!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa cấu hình lương này?")) return;
    try {
      await luongService.delete(id);
      toast.success("Xóa cấu hình lương thành công!");
      refetch();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Xóa thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 rounded-3xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Thiết Lập Lương Cơ Bản
            </h1>
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
              + Thiết lập mức lương
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-4xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 rounded-full bg-white shadow-sm px-4 py-3 min-w-[280px]">
            <input
              type="search"
              placeholder="Tìm theo tên nhân viên..."
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
                <th className="px-4 py-3">Nhân viên</th>
                <th className="px-4 py-3">Lương cơ bản</th>
                <th className="px-4 py-3">Phụ cấp</th>
                <th className="px-4 py-3">Hệ số</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="w-8 h-8 animate-spin text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <div className="text-sm">Đang tải dữ liệu...</div>
                    </div>
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-500">
                    <div>Không có dữ liệu thiết lập lương nào</div>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.MaLuong} className="bg-white rounded-3xl text-sm text-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <td className="whitespace-nowrap rounded-l-3xl bg-white px-4 py-4 font-semibold text-slate-900">
                      {row.HoTen} <span className="text-xs text-slate-400 font-normal ml-2">(#{row.MaNV})</span>
                    </td>
                    <td className="bg-white px-4 py-4 font-medium text-slate-700">
                      {formatMoney(row.LuongCoBan)}
                    </td>
                    <td className="bg-white px-4 py-4 font-medium text-emerald-600">
                      {formatMoney(row.PhuCap)}
                    </td>
                    <td className="bg-white px-4 py-4 font-medium text-indigo-600">
                      {row.HeSoLuong}
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
                          onClick={() => handleDelete(row.MaLuong)}
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {currentLuong ? "Cập nhật cấu hình lương" : "Thiết lập lương mới"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nhân viên <span className="text-rose-500">*</span></label>
                <select
                  value={formData.MaNV}
                  onChange={(e) => setFormData({ ...formData, MaNV: e.target.value })}
                  disabled={!!currentLuong}
                  className="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {nhanViens.map(nv => (
                    <option key={nv.MaNV} value={nv.MaNV}>{nv.HoTen} - #{nv.MaNV}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Lương cơ bản (VND)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.LuongCoBan}
                  onChange={(e) => setFormData({ ...formData, LuongCoBan: e.target.value })}
                  className="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Phụ cấp (VND)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.PhuCap}
                  onChange={(e) => setFormData({ ...formData, PhuCap: e.target.value })}
                  className="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Hệ số lương</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.HeSoLuong}
                  onChange={(e) => setFormData({ ...formData, HeSoLuong: e.target.value })}
                  className="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm border border-slate-100 hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang xử lý..." : "Lưu cài đặt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyLuong;
