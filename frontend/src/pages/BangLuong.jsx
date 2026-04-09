import { useMemo, useState } from "react";
import useFetch from "../hooks/useFetch";

const formatMoney = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).replace("₫", "đ");

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name.charAt(0) || "U").toUpperCase();
};

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

function BangLuong() {
  const [search, setSearch] = useState("");

  // Fetch data
  const { data: bgRes, loading: loading1 } = useFetch("/bang-luong");
  const { data: nvRes, loading: loading2 } = useFetch("/nhan-vien");
  const { data: luongRes, loading: loading3 } = useFetch("/luong");

  const rawRows = useMemo(() => {
    const bangLuongs = Array.isArray(bgRes) ? bgRes : bgRes?.data ?? [];
    const nhanViens = Array.isArray(nvRes) ? nvRes : nvRes?.data ?? [];
    const luongs = Array.isArray(luongRes) ? luongRes : luongRes?.data ?? [];

    if (bangLuongs.length === 0) return [];

    return bangLuongs.map((bl) => {
      const nv = nhanViens.find(n => n.MaNV === bl.MaNV) || {};
      const l = luongs.find(x => x.MaNV === bl.MaNV) || {};

      const basicSalary = (parseFloat(l.LuongCoBan) || 0) * (parseFloat(l.HeSoLuong) || 1);
      const allowance = parseFloat(l.PhuCap) || 0;
      const netSalary = parseFloat(bl.TongLuong) || 0;

      const name = nv.HoTen || bl.HoTen || "Unknown";
      const year = bl.Nam || new Date().getFullYear();

      return {
        id: bl.MaBangLuong,
        maNv: bl.MaNV,
        avatar: getInitials(name),
        name,
        code: `NV-${year}-${String(bl.MaNV).padStart(3, '0')}`,
        department: nv.TenPB || "Khác",
        basicSalary,
        allowance,
        totalShifts: bl.TongCa || 0,
        netSalary
      };
    });
  }, [bgRes, nvRes, luongRes]);

  const filteredRows = useMemo(() => {
    return rawRows.filter((row) =>
      [row.name, row.department, row.code].some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, rawRows]);

  const totalSalary = rawRows.reduce((sum, row) => sum + row.netSalary, 0);
  const totalEmployees = rawRows.length;
  const totalShiftsAll = rawRows.reduce((sum, row) => sum + row.totalShifts, 0);

  const isLoading = loading1 || loading2 || loading3;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Bảng lương</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Bảng lương Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</h1>
            <p className="mt-2 text-sm text-slate-500">Xem lương nhân viên theo tháng và năm</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button className="rounded-full border border-slate-200 bg-white px-5 py-2 text-slate-700 transition hover:bg-slate-50">
              Xuất bảng lương
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tổng lương chi trả</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatMoney(totalSalary)}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Số nhân viên</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{totalEmployees} người</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tổng số ca làm</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{totalShiftsAll} ca</p>
        </div>
      </div>

      <div className="rounded-4xl bg-white p-6 shadow-sm shadow-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 min-w-[280px]">
            <input
              type="search"
              placeholder="Tìm nhân viên..."
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
                <th className="px-4 py-3">Phòng ban</th>
                <th className="px-4 py-3">Lương cơ bản</th>
                <th className="px-4 py-3">Phụ cấp</th>
                <th className="px-4 py-3">Tổng ca</th>
                <th className="px-4 py-3 font-semibold text-slate-900">Thực lĩnh</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <div className="text-sm">Đang tải dữ liệu...</div>
                    </div>
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-sm">Không có dữ liệu</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="bg-slate-50 rounded-3xl text-sm text-slate-700 shadow-sm shadow-slate-100 hover:bg-slate-100 transition">
                    <td className="whitespace-nowrap rounded-l-3xl bg-white px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(row.maNv)}`}>
                          {row.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{row.name}</div>
                          <div className="text-xs text-slate-500">{row.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="bg-white px-4 py-4">{row.department}</td>
                    <td className="bg-white px-4 py-4 font-medium text-slate-700">{formatMoney(row.basicSalary)}</td>
                    <td className="bg-white px-4 py-4 font-medium text-emerald-600">+{formatMoney(row.allowance)}</td>
                    <td className="bg-white px-4 py-4 font-medium text-indigo-600">{row.totalShifts} ca</td>
                    <td className="rounded-r-3xl bg-white px-4 py-4 font-bold text-slate-900 text-base">{formatMoney(row.netSalary)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-500">Hiển thị {filteredRows.length} / {totalEmployees} nhân viên</div>
          {filteredRows.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600 hover:bg-slate-100 transition">Trước</button>
              <div className="flex items-center gap-2">
                <button className="rounded-full bg-slate-900 px-3 py-2 text-white">1</button>
              </div>
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600 hover:bg-slate-100 transition">Sau</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BangLuong;
