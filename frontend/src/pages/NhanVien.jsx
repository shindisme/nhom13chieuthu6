import { useState } from "react";
import useFetch from "../hooks/useFetch";
import NhanVienModal from "../components/NhanVienModal";
import DeleteConfirm from "../components/DeleteConfirm";
import { exportToExcel } from "../utils/exportUtils";

// ham tien ich
const AVATAR_COLORS = [
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-orange-500",
  "bg-rose-500",
  "bg-cyan-600",
  "bg-violet-600",
  "bg-amber-600",
  "bg-teal-600",
];

const getAvatarColor = (id) => AVATAR_COLORS[(id ?? 0) % AVATAR_COLORS.length];

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name.charAt(0) || "U").toUpperCase();
};

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const calcYearsWorked = (startDate) => {
  if (!startDate) return 0;
  const now = new Date();
  const start = new Date(startDate);
  return Math.max(0, Math.floor((now - start) / (365.25 * 24 * 60 * 60 * 1000)));
};

// tinh tong luong va format thanh VND
const formatSalary = (luong) => {
  if (!luong) return "—";
  const base = parseFloat(luong.LuongCoBan) || 0;
  const factor = parseFloat(luong.HeSoLuong) || 1;
  const allowance = parseFloat(luong.PhuCap) || 0;
  const total = base * factor + allowance;
  return total.toLocaleString("vi-VN") + " đ";
};

const STATUS_MAP = {
  "Đang làm": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  "Thử việc": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  "Nghỉ phép": {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    dot: "bg-red-500",
  },
};

const getEmployeeStatus = (nv) => {
  if (!nv.NgayBatDau) return "Đang làm";
  const start = new Date(nv.NgayBatDau);
  const now = new Date();
  const monthsWorked = (now - start) / (30 * 24 * 60 * 60 * 1000);
  if (monthsWorked < 3) return "Thử việc";
  return "Đang làm";
};

// badge trang thai
const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP["Đang làm"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

// Deleted modal code

// card nhan vien
function EmployeeCard({ nv, luongData, onEdit, onDelete }) {
  const status = getEmployeeStatus(nv);
  const avatarColor = getAvatarColor(nv.MaNV);
  const initials = getInitials(nv.HoTen);
  const yearsWorked = calcYearsWorked(nv.NgayBatDau);

  // tinh luong
  const luong = luongData.find((l) => l.MaNV === nv.MaNV);
  const luongDisplay = formatSalary(luong);

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 p-5 flex flex-col gap-4 group">
      {/* Avatar + Info + Status */}
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-800 truncate">{nv.HoTen}</h3>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {nv.TenPB ? `Phòng ${nv.TenPB}` : "Chưa phân phòng"}
              </p>
            </div>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {nv.GioiTinh && (
          <span className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-xs font-medium">
            {nv.GioiTinh}
          </span>
        )}
        {nv.SDT && (
          <span className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-xs font-medium">
            {nv.SDT}
          </span>
        )}
        {yearsWorked > 0 && (
          <span className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-xs font-medium">
            {yearsWorked} năm KN
          </span>
        )}
      </div>

      {/* Stats - chi du lieu thuc tu DB */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2 border-t border-slate-100">
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lương</div>
          <div className="text-sm font-bold text-slate-700 mt-0.5">{luongDisplay}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Ngày vào</div>
          <div className="text-sm font-bold text-slate-700 mt-0.5">{formatDate(nv.NgayBatDau)}</div>
        </div>
      </div>

      {/* Hover actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(nv)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs font-medium transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Sửa
        </button>
        <button
          onClick={() => onDelete(nv)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Xóa
        </button>
      </div>
    </div >
  );
}

// card them nhan vien moi
function AddEmployeeCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#1e40af] hover:bg-blue-50/30 transition-all duration-300 p-5 flex flex-col items-center justify-center gap-3 min-h-[280px] group cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-[#0d1c42] flex items-center justify-center transition-colors duration-300">
        <svg
          className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="text-sm font-medium text-slate-400 group-hover:text-[#0d1c42] transition-colors duration-300">
        Thêm nhân viên mới
      </span>
    </button>
  );
}

// trang chinh nhan vien
const NhanVien = () => {
  // goi api lay du lieu
  const { data: employeeRes, loading, error, refetch } = useFetch("/nhan-vien");
  const { data: deptRes } = useFetch("/phong-ban");
  const { data: luongRes } = useFetch("/luong");

  const employees = Array.isArray(employeeRes) ? employeeRes : employeeRes?.data ?? [];
  const departments = Array.isArray(deptRes) ? deptRes : deptRes?.data ?? [];
  const luongData = Array.isArray(luongRes) ? luongRes : luongRes?.data ?? [];

  // state
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  // xu ly sau khi luu/xoa
  const handleSaved = () => {
    setModal(null);
    refetch();
  };

  const handleDeleted = () => {
    setDeleteTarget(null);
    refetch();
  };

  // dem nhan vien theo phong ban
  const deptCounts = {};
  employees.forEach((nv) => {
    const dept = nv.TenPB || "Khác";
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });

  const tabs = [
    { key: "all", label: "Tất cả", count: employees.length },
    ...departments.map((d) => ({
      key: String(d.MaPB),
      label: d.TenPB,
      count: deptCounts[d.TenPB] || 0,
    })),
  ];

  // loc danh sach
  const filtered = employees.filter((nv) => {
    const matchSearch = nv.HoTen?.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      activeTab === "all" ? true : String(nv.MaPB) === activeTab;
    return matchSearch && matchTab;
  });

  const handleExport = () => {
    if (filtered.length === 0) return;
    const exportData = filtered.map((nv, idx) => ({
      "STT": idx + 1,
      "Mã NV": `NV-${String(nv.MaNV).padStart(3, '0')}`,
      "Họ tên": nv.HoTen,
      "Giới tính": nv.GioiTinh || "—",
      "SĐT": nv.SDT || "—",
      "Ngày sinh": formatDate(nv.NgaySinh),
      "Ngày bắt đầu": formatDate(nv.NgayBatDau),
      "Phòng ban": nv.TenPB || "Chưa phân phòng",
      "Trạng thái": getEmployeeStatus(nv),
    }));
    exportToExcel(exportData, "DanhSachNhanVien");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <svg className="w-6 h-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Đang tải dữ liệu nhân viên...
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
      {/* ── Page Title + Actions  */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="text-slate-500 mt-1 text-sm">
            {employees.length} nhân viên đang hoạt động trong hệ thống
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Xuất Excel
          </button>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0d1c42] hover:bg-[#1e40af] text-white rounded-xl text-sm font-medium transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm nhân viên
          </button>
        </div>
      </div>

      {/* ── Tabs + Search Row  */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Department tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition border ${activeTab === tab.key
                ? "bg-[#0d1c42] text-white border-[#0d1c42]"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search + View toggle */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm nhân viên..."
              className="border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 w-56"
            />
          </div>

          {/* View toggle */}
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition ${viewMode === "grid" ? "bg-[#0d1c42] text-white" : "bg-white text-slate-400 hover:text-slate-600"}`}
              title="Dạng lưới"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition ${viewMode === "list" ? "bg-[#0d1c42] text-white" : "bg-white text-slate-400 hover:text-slate-600"}`}
              title="Dạng danh sách"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid / List Table */}
      {filtered.length === 0 && !loading ? (
        <div className="bg-white rounded-3xl shadow-md p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">Không tìm thấy nhân viên nào</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((nv) => (
            <EmployeeCard
              key={nv.MaNV}
              nv={nv}
              luongData={luongData}
              onEdit={(nv) => setModal({ mode: "edit", record: nv })}
              onDelete={(nv) => setDeleteTarget(nv)}
            />
          ))}
          <AddEmployeeCard onClick={() => setModal({ mode: "add" })} />
        </div>
      ) : (
        /*  list view / table view  */
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["STT", "Nhân viên", "Phòng ban", "Trạng thái", "SĐT", "Lương", "Ngày vào", "Thao tác"].map(
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
                {filtered.map((nv, idx) => {
                  const avatarColor = getAvatarColor(nv.MaNV);
                  const initials = getInitials(nv.HoTen);
                  const status = getEmployeeStatus(nv);
                  const statusStyle = STATUS_MAP[status] || STATUS_MAP["Đang làm"];
                  const luong = luongData.find((l) => l.MaNV === nv.MaNV);
                  const luongDisplay = formatSalary(luong);

                  return (
                    <tr key={nv.MaNV} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3 text-slate-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {initials}
                          </div>
                          <span className="font-medium text-slate-800">{nv.HoTen}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {nv.TenPB || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {nv.SDT || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-semibold">{luongDisplay}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {formatDate(nv.NgayBatDau)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setModal({ mode: "edit", record: nv })}
                            className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition"
                            title="Chỉnh sửa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(nv)}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/*  Modals  */}
      {modal && (
        <NhanVienModal
          mode={modal.mode}
          record={modal.record}
          departments={departments}
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
};

export default NhanVien;
