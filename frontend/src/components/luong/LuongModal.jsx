import { useState } from "react";
import luongService from "../../services/luongService";
import { toast } from "react-toastify";

function LuongModal({ currentLuong, nhanViens, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    MaNV: currentLuong?.MaNV || "",
    LuongCoBan: currentLuong?.LuongCoBan || 0,
    PhuCap: currentLuong?.PhuCap || 0,
    HeSoLuong: currentLuong?.HeSoLuong || 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      onSaved();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra, có thể nhân viên này đã được cấu hình lương!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {currentLuong ? "Cập nhật cấu hình lương" : "Thiết lập lương mới"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
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
            <input type="number" min="0" value={formData.LuongCoBan}
              onChange={(e) => setFormData({ ...formData, LuongCoBan: e.target.value })}
              className="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phụ cấp (VND)</label>
            <input type="number" min="0" value={formData.PhuCap}
              onChange={(e) => setFormData({ ...formData, PhuCap: e.target.value })}
              className="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Hệ số lương</label>
            <input type="number" step="0.01" min="0" value={formData.HeSoLuong}
              onChange={(e) => setFormData({ ...formData, HeSoLuong: e.target.value })}
              className="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20" />
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm border border-slate-100 hover:bg-slate-50 transition">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? "Đang xử lý..." : "Lưu cài đặt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LuongModal;
