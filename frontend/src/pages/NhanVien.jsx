import { useState } from "react";
import useFetch from "../hooks/useFetch";
import NhanVienModal from "../components/NhanVienModal";
import DeleteConfirm from "../components/DeleteConfirm";
import EmployeeCard, { AddEmployeeCard } from "../components/nhanvien/EmployeeCard";
import EmployeeTable from "../components/nhanvien/EmployeeTable";
import { exportToExcel } from "../utils/exportUtils";
import { formatDate, removeAccents } from "../utils/helpers";
import { getEmployeeStatus } from "../components/nhanvien/EmployeeCard";

const NhanVien = () => {
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
  const [viewMode, setViewMode] = useState("grid");

  const handleSaved = () => {
    setModal(null);
    refetch();
  };

  const handleDeleted = () => {
    setDeleteTarget(null);
    refetch();
  };

  // đếm nhân viên theo phòng ban
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

  // filter
  const filtered = employees.filter((nv) => {
    const searchTerm = removeAccents(search);
    const itemName = removeAccents(nv.HoTen);
    const matchSearch = itemName.includes(searchTerm);
    const matchTab = activeTab === "all" ? true : String(nv.MaPB) === activeTab;
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
      {/*  Page Title + Actions  */}
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

      {/*  Tabs + Search   */}
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
        <EmployeeTable
          employees={filtered}
          luongData={luongData}
          onEdit={(nv) => setModal({ mode: "edit", record: nv })}
          onDelete={(nv) => setDeleteTarget(nv)}
        />
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
