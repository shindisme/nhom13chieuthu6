import { useState } from "react";
import luongService from "../../services/luongService";
import { toast } from "react-toastify";

function LuongDeleteConfirm({ record, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await luongService.delete(record.MaLuong);
      toast.success("Đã xóa cấu hình lương thành công!");
      onDeleted();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Xóa thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="font-bold text-slate-800 text-base">Xóa cấu hình lương?</h3>
        <p className="text-sm text-slate-500 mt-2">
          Bạn có chắc chắn muốn xóa cấu hình lương của nhân viên <span className="font-semibold text-slate-700">{record.HoTen}</span> không?
        </p>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
            Hủy
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-50">
            {loading ? "Đang xóa…" : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LuongDeleteConfirm;
