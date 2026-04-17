import { useState } from "react";
import chamCongService from "../../services/chamcongService";
import { toast } from "react-toastify";

const pad = (n) => String(n).padStart(2, "0");

const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const WORK_START_HOUR = 8;
const WORK_START_MIN = 0;
const WORK_END_HOUR = 17;
const WORK_END_MIN = 30;

const fmtTime = (iso) =>
  iso ? new Date(iso).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "—";

const calcMinutes = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return null;
  const diff = (new Date(checkOut) - new Date(checkIn)) / 60000;
  return diff > 0 ? diff : null;
};

const fmtDuration = (mins) => {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  return h > 0 ? `${h}g ${m}p` : `${m}p`;
};

const isLate = (checkIn) => {
  if (!checkIn) return false;
  const d = new Date(checkIn);
  return d.getHours() > WORK_START_HOUR || (d.getHours() === WORK_START_HOUR && d.getMinutes() > WORK_START_MIN + 5);
};

const isEarlyLeave = (checkOut) => {
  if (!checkOut) return false;
  const d = new Date(checkOut);
  return d.getHours() < WORK_END_HOUR || (d.getHours() === WORK_END_HOUR && d.getMinutes() < WORK_END_MIN);
};

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] || AVATAR_COLORS[0];

function ChamCongModal({ mode, record, employees, onClose, onSaved }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState({
    MaNV: record?.MaNV ?? "",
    CheckIn: toLocalInput(record?.CheckIn) ?? "",
    CheckOut: toLocalInput(record?.CheckOut) ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.MaNV) return toast.warning("Vui lòng chọn nhân viên");
    if (!form.CheckIn) return toast.warning("Vui lòng nhập giờ vào");
    if (form.CheckOut && new Date(form.CheckOut) <= new Date(form.CheckIn))
      return toast.warning("Giờ ra phải sau giờ vào");
    try {
      setSaving(true);
      const toISO = (v) => (v ? new Date(v).toISOString() : null);
      if (isEdit) {
        await chamCongService.update(record.MaChamCong, {
          CheckIn: toISO(form.CheckIn),
          CheckOut: toISO(form.CheckOut),
        });
        toast.success("Cập nhật thành công");
      } else {
        await chamCongService.insert({
          MaNV: form.MaNV,
          CheckIn: toISO(form.CheckIn),
          CheckOut: toISO(form.CheckOut),
        });
        toast.success("Thêm chấm công thành công");
      }
      onSaved();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const previewMins = calcMinutes(form.CheckIn, form.CheckOut);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800 text-base">
              {isEdit ? "Chỉnh sửa chấm công" : "Thêm bản ghi chấm công"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit ? `Mã CC: #${record.MaChamCong}` : "Nhập thông tin chấm công mới"}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {!isEdit ? (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Nhân viên <span className="text-red-500">*</span>
              </label>
              <select name="MaNV" value={form.MaNV} onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition">
                <option value="">— Chọn nhân viên —</option>
                {employees.map((nv) => (
                  <option key={nv.MaNV} value={nv.MaNV}>{nv.HoTen}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${avatarColor(record.HoTen)}`}>
                {record.HoTen?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{record.HoTen}</p>
                <p className="text-xs text-slate-400">Mã NV: #{record.MaNV}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Giờ vào (Check-in) <span className="text-red-500">*</span>
              </label>
              <input type="datetime-local" name="CheckIn" value={form.CheckIn} onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Giờ ra (Check-out)
              </label>
              <input type="datetime-local" name="CheckOut" value={form.CheckOut} onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition" />
            </div>
          </div>

          {/* Preview */}
          {form.CheckIn && (
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                {
                  label: "Giờ vào",
                  val: fmtTime(form.CheckIn ? new Date(form.CheckIn).toISOString() : null),
                  sub: isLate(form.CheckIn) ? "⚠ Trễ" : "✓ Đúng giờ",
                  color: isLate(form.CheckIn) ? "text-orange-500" : "text-emerald-600",
                },
                {
                  label: "Giờ ra",
                  val: form.CheckOut ? fmtTime(new Date(form.CheckOut).toISOString()) : "—",
                  sub: form.CheckOut ? (isEarlyLeave(form.CheckOut) ? "↙ Về sớm" : "✓ Đủ giờ") : "Chưa nhập",
                  color: form.CheckOut && isEarlyLeave(form.CheckOut) ? "text-red-500" : "text-emerald-600",
                },
                {
                  label: "Giờ công",
                  val: previewMins ? fmtDuration(previewMins) : "—",
                  sub: previewMins >= 480 ? "✓ Đủ công" : previewMins ? "Thiếu giờ" : "",
                  color: previewMins >= 480 ? "text-emerald-600" : "text-amber-500",
                },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{item.label}</p>
                  <p className="text-lg font-bold text-slate-800 mt-1">{item.val}</p>
                  <p className={`text-[10px] font-medium mt-0.5 ${item.color}`}>{item.sub}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Hủy
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#0d1c42] hover:bg-[#1e40af] text-white rounded-xl py-3 text-sm font-semibold transition disabled:opacity-50">
              {saving ? "Đang lưu…" : isEdit ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChamCongModal;
