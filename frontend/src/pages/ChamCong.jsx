import { useState, useCallback, useMemo } from "react";
import { Search, Plus, ListFilter, FileText, CheckCircle, Clock, AlertCircle, ShieldAlert, Edit2, Trash2 } from 'lucide-react';
import useFetch from "../hooks/useFetch";
import { toast } from "react-toastify";
import ChamCongModal from "../components/chamcong/ChamCongModal";
import ChamCongDeleteConfirm from "../components/chamcong/ChamCongDeleteConfirm";
import { formatShortMoney, removeAccents } from "../utils/helpers";

/*  Constants  */
const WORK_START_HOUR = 8;
const WORK_START_MIN = 0;
const WORK_END_HOUR = 17;
const WORK_END_MIN = 30;
const PAGE_SIZE = 12;

/*  Helpers  */
const pad = (n) => String(n).padStart(2, "0");


const fmt = (iso, opts) =>
  iso
    ? new Date(iso).toLocaleString("vi-VN", opts)
    : "—";

const fmtDate = (iso) =>
  fmt(iso, { day: "2-digit", month: "2-digit", year: "numeric" });

const fmtTime = (iso) =>
  fmt(iso, { hour: "2-digit", minute: "2-digit" });


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
  return (
    d.getHours() > WORK_START_HOUR ||
    (d.getHours() === WORK_START_HOUR && d.getMinutes() > WORK_START_MIN + 5)
  );
};

const isEarlyLeave = (checkOut) => {
  if (!checkOut) return false;
  const d = new Date(checkOut);
  return (
    d.getHours() < WORK_END_HOUR ||
    (d.getHours() === WORK_END_HOUR && d.getMinutes() < WORK_END_MIN)
  );
};

import AvatarInitials from "../components/common/AvatarInitials";
/*  Status badge  */
function StatusBadge({ record }) {
  if (!record.CheckOut)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
        Đang làm
      </span>
    );

  const late = isLate(record.CheckIn);
  const early = isEarlyLeave(record.CheckOut);

  if (!late && !early)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
        Đúng giờ
      </span>
    );

  return (
    <div className="flex flex-col gap-1">
      {late && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-200">
          Đi trễ
        </span>
      )}
      {early && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
          Về sớm
        </span>
      )}
    </div>
  );
}

/*  Hours bar  */
function HoursBar({ checkIn, checkOut }) {
  const mins = calcMinutes(checkIn, checkOut);
  if (!mins) return <span className="text-slate-400 text-xs">—</span>;
  const pct = Math.min(100, (mins / 510) * 100); // 8.5h = 510min standard
  const color = mins >= 480 ? "bg-emerald-500" : mins >= 420 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
        {fmtDuration(mins)}
      </span>
    </div>
  );
}

/* Modals extracted to components/chamcong/ */

/*  Stat card  */
function StatCard({ label, value, sub, icon, color }) {
  return (
    <div className="bg-white rounded-3xl shadow-md px-5 py-4 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
        {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/*  Main Page  */
function ChamCong() {
  const { data: records = [], loading, error, refetch } = useFetch("/cham-cong");
  const { data: employeeRes } = useFetch("/nhan-vien");

  const employees = Array.isArray(employeeRes)
    ? employeeRes
    : employeeRes?.data ?? [];

  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState(""); // YYYY-MM-DD
  const [filterMonth, setFilterMonth] = useState(""); // YYYY-MM
  const [page, setPage] = useState(1);


  const handleSaved = useCallback(() => { setModal(null); refetch(); }, [refetch]);
  const handleDeleted = useCallback(() => { setDeleteTarget(null); refetch(); }, [refetch]);

  const allRecords = useMemo(() => Array.isArray(records) ? records : [], [records]);

  /*  Filter  */
  const filtered = useMemo(() => {
    return allRecords.filter((r) => {
      const term = removeAccents(search);
      const val = removeAccents(r.HoTen);
      const matchSearch = !search || val.includes(term);
      const matchStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "done"
            ? !!r.CheckOut
            : filterStatus === "working"
              ? !r.CheckOut
              : filterStatus === "late"
                ? isLate(r.CheckIn)
                : filterStatus === "early"
                  ? r.CheckOut && isEarlyLeave(r.CheckOut)
                  : true;
      const matchDate = filterDate
        ? getDateKey(r.CheckIn) === filterDate
        : true;
      const matchMonth = filterMonth
        ? r.CheckIn?.startsWith(filterMonth)
        : true;
      return matchSearch && matchStatus && matchDate && matchMonth;
    });
  }, [allRecords, search, filterStatus, filterDate, filterMonth]);

  /*  Stats  */
  const stats = useMemo(() => {
    const total = allRecords.length;
    const done = allRecords.filter((r) => r.CheckOut).length;
    const working = total - done;
    const late = allRecords.filter((r) => isLate(r.CheckIn)).length;
    const earlyLeave = allRecords.filter((r) => r.CheckOut && isEarlyLeave(r.CheckOut)).length;

    const totalMins = allRecords
      .map((r) => calcMinutes(r.CheckIn, r.CheckOut) || 0)
      .reduce((a, b) => a + b, 0);
    const avgHours = done > 0 ? (totalMins / done / 60).toFixed(1) : "0";

    return { total, done, working, late, earlyLeave, avgHours };
  }, [allRecords]);

  /*  Pagination  */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-sm">Đang tải dữ liệu chấm công…</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center text-red-500">
          <p className="font-semibold">Không thể tải dữ liệu</p>
          <p className="text-sm text-slate-500 mt-1">{error.message}</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-5">

      {/*  Stats row  */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          label="Tổng bản ghi"
          value={stats.total}
          sub="toàn hệ thống"
          icon={<FileText className="w-5 h-5 text-slate-500" />}
          color="bg-slate-100"
        />
        <StatCard
          label="Hoàn thành"
          value={stats.done}
          sub={`${stats.done > 0 ? ((stats.done / stats.total) * 100).toFixed(0) : 0}% tổng số`}
          icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
          color="bg-emerald-50"
        />
        <StatCard
          label="Đang làm việc"
          value={stats.working}
          sub="chưa check-out"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          color="bg-amber-50"
        />
        <StatCard
          label="Đi trễ"
          value={stats.late}
          sub="lượt trong tháng"
          icon={<AlertCircle className="w-5 h-5 text-orange-600" />}
          color="bg-orange-50"
        />
        <StatCard
          label="Giờ công TB"
          value={`${stats.avgHours}g`}
          sub="trên mỗi ca làm"
          icon={<ShieldAlert className="w-5 h-5 text-blue-600" />}
          color="bg-blue-50"
        />
      </div>

      {/*  Table card  */}
      <div className="bg-white rounded-3xl shadow-md overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Left: search + date filters */}
            <div className="flex flex-wrap gap-2 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Tìm nhân viên…"
                  className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-48 transition"
                />
              </div>

              <input
                type="date"
                value={filterDate}
                onChange={(e) => { setFilterDate(e.target.value); setFilterMonth(""); setPage(1); }}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                title="Lọc theo ngày"
              />

              <input
                type="month"
                value={filterMonth}
                onChange={(e) => { setFilterMonth(e.target.value); setFilterDate(""); setPage(1); }}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                title="Lọc theo tháng"
              />

              {(filterDate || filterMonth || search) && (
                <button
                  onClick={() => { setSearch(""); setFilterDate(""); setFilterMonth(""); setPage(1); }}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1"
                >
                  ✕ Xóa lọc
                </button>
              )}
            </div>

            {/* Right: status tabs + add button */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-slate-100 rounded-xl p-0.5 gap-0.5">
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "done", label: "Hoàn thành" },
                  { key: "working", label: "Đang làm" },
                  { key: "late", label: "Đi trễ" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => { setFilterStatus(f.key); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filterStatus === f.key
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setModal({ mode: "add" })}
                className="px-4 py-2 bg-[#0d1c42] hover:bg-[#1e40af] text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Thêm mới
              </button>
            </div>
          </div>
        </div>

        {/* Result summary */}
        {(filterDate || filterMonth || search || filterStatus !== "all") && (
          <div className="px-5 py-2.5 bg-blue-50/60 border-b border-blue-100 text-xs text-blue-700 font-medium flex items-center gap-2">
            <ListFilter className="w-3.5 h-3.5" />
            Đang lọc — hiển thị {filtered.length} trong {allRecords.length} bản ghi
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-10">STT</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Nhân viên</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Ngày</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Check-in</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Check-out</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Giờ công</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <svg className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-sm font-medium">Không có dữ liệu chấm công</p>
                      <p className="text-xs">Thử thay đổi bộ lọc hoặc thêm bản ghi mới</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((r, idx) => (
                  <tr
                    key={r.MaChamCong}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* STT */}
                    <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>

                    {/* Nhân viên */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <AvatarInitials name={r.HoTen} size="md" id={r.MaNV} />
                        <div>
                          <p className="font-semibold text-slate-800 text-sm leading-none">
                            {r.HoTen}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            ID #{r.MaNV} · CC #{r.MaChamCong}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Ngày */}
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {fmtDate(r.CheckIn)}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {r.CheckIn
                            ? new Date(r.CheckIn).toLocaleDateString("vi-VN", { weekday: "long" })
                            : ""}
                        </p>
                      </div>
                    </td>

                    {/* Check-in */}
                    <td className="px-5 py-3.5">
                      <div className={`inline-flex flex-col items-start`}>
                        <span
                          className={`text-sm font-bold ${isLate(r.CheckIn) ? "text-orange-600" : "text-slate-700"
                            }`}
                        >
                          {fmtTime(r.CheckIn)}
                        </span>
                        {isLate(r.CheckIn) && (
                          <span className="text-[10px] text-orange-500 font-medium">
                            +{(() => {
                              const d = new Date(r.CheckIn);
                              const minsLate =
                                (d.getHours() - WORK_START_HOUR) * 60 +
                                d.getMinutes() -
                                WORK_START_MIN;
                              return fmtDuration(minsLate);
                            })()}{" "}
                            so giờ quy định
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Check-out */}
                    <td className="px-5 py-3.5">
                      {r.CheckOut ? (
                        <div className="inline-flex flex-col items-start">
                          <span
                            className={`text-sm font-bold ${isEarlyLeave(r.CheckOut) ? "text-red-600" : "text-slate-700"
                              }`}
                          >
                            {fmtTime(r.CheckOut)}
                          </span>
                          {isEarlyLeave(r.CheckOut) && (
                            <span className="text-[10px] text-red-500 font-medium">
                              Về sớm
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                          Chưa ra
                        </span>
                      )}
                    </td>

                    {/* Giờ công */}
                    <td className="px-5 py-3.5">
                      <HoursBar checkIn={r.CheckIn} checkOut={r.CheckOut} />
                    </td>

                    {/* Trạng thái */}
                    <td className="px-5 py-3.5">
                      <StatusBadge record={r} />
                    </td>

                    {/* Thao tác */}
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setModal({ mode: "edit", record: r })}
                          title="Chỉnh sửa"
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
                          title="Xóa"
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {filtered.length === 0
              ? "Không có bản ghi"
              : `Hiển thị ${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                page * PAGE_SIZE,
                filtered.length
              )} trong ${filtered.length} bản ghi`}
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition text-sm"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - page) <= 1
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && arr[i - 1] !== p - 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === "..." ? (
                    <span key={`e${i}`} className="w-8 text-center text-slate-400 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      className={`w-8 h-8 rounded-lg border text-sm font-medium transition ${page === item
                        ? "bg-[#0d1c42] text-white border-[#0d1c42]"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition text-sm"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <ChamCongModal
          mode={modal.mode}
          record={modal.record}
          employees={employees}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {deleteTarget && (
        <ChamCongDeleteConfirm
          record={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}

export default ChamCong;