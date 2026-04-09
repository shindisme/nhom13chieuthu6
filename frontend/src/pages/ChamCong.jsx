import { useState, useCallback } from "react";
import useFetch from "../hooks/useFetch";
import chamCongService from "../services/chamcongService";
import { toast } from "react-toastify";

/* helpers  */
const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDateTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calcDuration = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return null;
  const diff = (new Date(checkOut) - new Date(checkIn)) / 1000 / 60;
  if (diff <= 0) return null;
  const h = Math.floor(diff / 60);
  const m = Math.floor(diff % 60);
  return `${h}h ${m}m`;
};

const statusBadge = (checkOut) =>
  checkOut ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      Hoàn thành
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
      Đang làm
    </span>
  );

/* Modal */
function Modal({ mode, record, employees, onClose, onSaved }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    MaNV: record?.MaNV ?? "",
    CheckIn: toLocalInput(record?.CheckIn) ?? "",
    CheckOut: toLocalInput(record?.CheckOut) ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.MaNV) return toast.warning("Vui lòng chọn nhân viên");
    if (!form.CheckIn) return toast.warning("Vui lòng nhập giờ vào");
    if (form.CheckOut && new Date(form.CheckOut) <= new Date(form.CheckIn))
      return toast.warning("Giờ ra phải sau giờ vào");

    try {
      setSaving(true);
      const payload = {
        MaNV: form.MaNV,
        CheckIn: form.CheckIn ? new Date(form.CheckIn).toISOString() : undefined,
        CheckOut: form.CheckOut ? new Date(form.CheckOut).toISOString() : null,
      };

      if (isEdit) {
        await chamCongService.update(record.MaChamCong, {
          CheckIn: payload.CheckIn,
          CheckOut: payload.CheckOut,
        });
        toast.success("Cập nhật chấm công thành công");
      } else {
        await chamCongService.insert(payload);
        toast.success("Thêm chấm công thành công");
      }
      onSaved();
    } catch (err) {
      const msg = err?.response?.data?.message || "Có lỗi xảy ra";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* header */}
        <div className="bg-gradient-to-r from-[#0d1c42] to-[#1e40af] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">
            {isEdit ? "Chỉnh sửa chấm công" : "Thêm chấm công mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Nhân viên */}
          {!isEdit && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Nhân viên <span className="text-red-500">*</span>
              </label>
              <select
                name="MaNV"
                value={form.MaNV}
                onChange={handleChange}
                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map((nv) => (
                  <option key={nv.MaNV} value={nv.MaNV}>
                    {nv.HoTen}
                  </option>
                ))}
              </select>
            </div>
          )}
          {isEdit && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Nhân viên</label>
              <div className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-100 text-slate-600">
                {record.HoTen}
              </div>
            </div>
          )}

          {/* Giờ vào */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Giờ vào (Check-in) <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="CheckIn"
              value={form.CheckIn}
              onChange={handleChange}
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          {/* Giờ ra */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Giờ ra (Check-out)
              <span className="text-slate-400 font-normal ml-1">(tuỳ chọn)</span>
            </label>
            <input
              type="datetime-local"
              name="CheckOut"
              value={form.CheckOut}
              onChange={handleChange}
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          {/* Preview thời gian */}
          {form.CheckIn && form.CheckOut && (
            <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-700 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Thời gian làm việc: <strong>{calcDuration(form.CheckIn, form.CheckOut) || "—"}</strong>
            </div>
          )}

          <div className="flex gap-3 pt-1">
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

/* Delete Confirm */
function DeleteConfirm({ record, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await chamCongService.delete(record.MaChamCong);
      toast.success("Đã xóa bản ghi chấm công");
      onDeleted();
    } catch (err) {
      const msg = err?.response?.data?.message || "Xóa thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-slate-800">Xác nhận xóa</h3>
          <p className="text-sm text-slate-500 mt-1">
            Xóa bản ghi chấm công của <strong>{record.HoTen}</strong>?
            <br />
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-200 rounded-lg py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}

/*Main Page */
function ChamCong() {
  const { data: records = [], loading, error, refetch } = useFetch("/cham-cong");
  const { data: employeeRes } = useFetch("/nhan-vien");

  // employeeRes có thể là { data: [...] } hoặc trực tiếp là array
  const employees = Array.isArray(employeeRes)
    ? employeeRes
    : employeeRes?.data ?? [];

  const [modal, setModal] = useState(null); // null | { mode: 'add' | 'edit', record?: {} }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all | done | working
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const handleSaved = useCallback(() => {
    setModal(null);
    refetch();
  }, [refetch]);

  const handleDeleted = useCallback(() => {
    setDeleteTarget(null);
    refetch();
  }, [refetch]);

  /* Filter */
  const filtered = (Array.isArray(records) ? records : []).filter((r) => {
    const matchSearch = r.HoTen?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "done"
          ? !!r.CheckOut
          : !r.CheckOut;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Stats */
  const total = (Array.isArray(records) ? records : []).length;
  const done = (Array.isArray(records) ? records : []).filter((r) => r.CheckOut).length;
  const working = total - done;

  if (loading)
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <svg className="w-6 h-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Đang tải...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        Lỗi tải dữ liệu: {error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {/*Stats*/}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Tổng bản ghi", value: total, color: "bg-blue-50 text-blue-700 border-blue-100" },
          { label: "Hoàn thành", value: done, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { label: "Đang làm việc", value: working, color: "bg-amber-50 text-amber-700 border-amber-100" },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border px-5 py-4 flex items-center justify-between ${s.color}`}
          >
            <span className="text-sm font-medium">{s.label}</span>
            <span className="text-2xl font-bold">{s.value}</span>
          </div>
        ))}
      </div>

      {/*Table card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "Tất cả" },
              { key: "done", label: "Hoàn thành" },
              { key: "working", label: "Đang làm" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => { setFilterStatus(f.key); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filterStatus === f.key
                  ? "bg-[#0d1c42] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm theo tên nhân viên..."
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 w-full md:w-56"
            />
            <button
              onClick={() => setModal({ mode: "add" })}
              className="px-4 py-2 bg-[#0d1c42] hover:bg-[#1e40af] text-white rounded-lg text-sm font-medium transition whitespace-nowrap flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm mới
            </button>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["STT", "Nhân viên", "Giờ vào", "Giờ ra", "Thời gian làm", "Trạng thái", "Thao tác"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                    Không có bản ghi nào
                  </td>
                </tr>
              ) : (
                paginated.map((r, idx) => (
                  <tr key={r.MaChamCong} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {r.HoTen?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800">{r.HoTen}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {formatDateTime(r.CheckIn)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {formatDateTime(r.CheckOut)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {calcDuration(r.CheckIn, r.CheckOut) ?? (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{statusBadge(r.CheckOut)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setModal({ mode: "edit", record: r })}
                          className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                          title="Xóa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <span>
              Hiển thị {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length} bản ghi
            </span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <>
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span key={`ellipsis-${p}`} className="px-2 py-1.5 text-slate-400">…</span>
                    )}
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 rounded-lg border transition ${page === p
                        ? "bg-[#0d1c42] text-white border-[#0d1c42]"
                        : "border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                      {p}
                    </button>
                  </>
                ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal && (
        <Modal
          mode={modal.mode}
          record={modal.record}
          employees={employees}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          record={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}

export default ChamCong;