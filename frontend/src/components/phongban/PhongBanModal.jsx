import { useState } from "react";
import phongBanService from "../../services/phongBanService";
import { toast } from "react-toastify";

function PhongBanModal({ currentPB, onClose, onSaved }) {
  const [formData, setFormData] = useState({ TenPB: currentPB?.TenPB || "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.TenPB.trim()) {
      toast.warning("Tên phòng ban không được để trống");
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentPB) {
        await phongBanService.update(currentPB.MaPB || currentPB.id, { TenPB: formData.TenPB });
        toast.success("Cập nhật phòng ban thành công!");
      } else {
        await phongBanService.insert({ TenPB: formData.TenPB });
        toast.success("Thêm phòng ban thành công!");
      }
      onSaved();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {currentPB ? "Cập nhật phòng ban" : "Thêm phòng ban mới"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tên phòng ban <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.TenPB}
              onChange={(e) => setFormData({ ...formData, TenPB: e.target.value })}
              placeholder="Nhập tên phòng ban"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? "Đang xử lý..." : currentPB ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PhongBanModal;
