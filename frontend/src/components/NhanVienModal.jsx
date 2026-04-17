import { useState } from "react";
import nhanVienService from "../services/nhanVienService";
import { toast } from "react-toastify";

function NhanVienModal({ mode, record, departments, onClose, onSaved }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    HoTen: record?.HoTen ?? "",
    GioiTinh: record?.GioiTinh ?? "Nam",
    NgaySinh: record?.NgaySinh ? new Date(record.NgaySinh).toISOString().split("T")[0] : "",
    SDT: record?.SDT ?? "",
    DiaChi: record?.DiaChi ?? "",
    NgayBatDau: record?.NgayBatDau ? new Date(record.NgayBatDau).toISOString().split("T")[0] : "",
    MaPB: record?.MaPB ?? "",
    MaCV: record?.MaCV ?? "",
    Email: record?.Email ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.HoTen.trim()) return toast.warning("Vui lòng nhập họ tên");

    if (!form.MaPB) return toast.warning("Vui lòng chọn phòng ban");

    try {
      setSaving(true);
      const payload = { ...form };
      // Chỉ gửi email khi thêm mới
      if (isEdit) {
        // delete payload.Email;
        // await nhanVienService.update(record.MaNV, payload);
        toast.success("Cập nhật nhân viên thành công");
      } else {
        await nhanVienService.insert(payload);
        toast.success("Thêm nhân viên thành công");
      }
      onSaved();
    } catch (err) {
      const msg = err?.response?.data?.message || "Có lỗi xảy ra";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-gray-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* tieu de modal */}
        <div className="bg-[#0d1c42] px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-white font-semibold text-base">
            {isEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Họ tên <span className="text-red-500">*</span>
            </label>
            <input
              name="HoTen"
              value={form.HoTen}
              onChange={handleChange}
              className={inputCls}
              placeholder="Nhập họ tên"
            />
          </div>

          {/* Email */}
          {isEdit && (
            <div className="flex flex-col gap-1.5 ">
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                name="Email"
                type="email"
                value={form.Email}
                onChange={handleChange}
                className={inputCls}
                disabled={isEdit}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Giới tính</label>
              <select
                name="GioiTinh"
                value={form.GioiTinh}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Ngày sinh</label>
              <input
                type="date"
                name="NgaySinh"
                value={form.NgaySinh}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
              <input
                name="SDT"
                value={form.SDT}
                onChange={handleChange}
                className={inputCls}
                placeholder="Số điện thoại"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Ngày bắt đầu</label>
              <input
                type="date"
                name="NgayBatDau"
                value={form.NgayBatDau}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Địa chỉ</label>
            <input
              name="DiaChi"
              value={form.DiaChi}
              onChange={handleChange}
              className={inputCls}
              placeholder="Địa chỉ"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Phòng ban <span className="text-red-500">*</span>
            </label>
            <select
              name="MaPB"
              value={form.MaPB}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="">-- Chọn phòng ban --</option>
              {departments.map((pb) => (
                <option key={pb.MaPB} value={pb.MaPB}>
                  {pb.TenPB}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 rounded-lg py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#0d1c42] hover:bg-[#1e40af] text-white rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NhanVienModal;
