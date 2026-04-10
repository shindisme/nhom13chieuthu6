import { useMemo } from "react";
import useFetch from "../hooks/useFetch";
import authService from "../services/authService";
import { Link } from "react-router-dom";

const STATUS_MAP = {
  "Đang làm": { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500", border: "border-emerald-100" },
  "Nghỉ phép": { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500", border: "border-amber-100" },
  "Nghỉ việc": { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", border: "border-red-100" },
  "Thử việc": { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500", border: "border-blue-100" },
};

const getEmployeeStatus = (nv) => {
  if (nv.NgayNghi) return "Nghỉ việc";
  return "Đang làm";
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

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name.charAt(0) || "U").toUpperCase();
};

const formatMoney = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).replace("₫", "đ");

function Dashboard() {
  const user = authService.getCurrentUser();

  const { data: nvRes, loading: loadingNv } = useFetch("/nhan-vien");
  const { data: bgRes, loading: loadingBg } = useFetch("/bang-luong");
  const { data: ccRes, loading: loadingCc } = useFetch("/cham-cong");


  const nhanViens = useMemo(() => Array.isArray(nvRes) ? nvRes : nvRes?.data ?? [], [nvRes]);
  const bangLuongs = useMemo(() => Array.isArray(bgRes) ? bgRes : bgRes?.data ?? [], [bgRes]);
  const chamCongs = useMemo(() => Array.isArray(ccRes) ? ccRes : ccRes?.data ?? [], [ccRes]);

  const totalEmployees = nhanViens.length;

  // Lương tháng này 
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const totalSalary = useMemo(() => {

    // lấy bảng lương hiện tại
    const currentMonthData = bangLuongs.filter(bl => bl.Thang === currentMonth && bl.Nam === currentYear);
    const sum = currentMonthData.reduce((acc, bl) => acc + (parseFloat(bl.TongLuong) || 0), 0);
    // tính temp và lấy tất cả
    return sum > 0 ? sum : bangLuongs.reduce((acc, bl) => acc + (parseFloat(bl.TongLuong) || 0), 0);
  }, [bangLuongs, currentMonth, currentYear]);

  // Khảo sát chấm công hôm nay
  const todayDateObj = new Date();
  todayDateObj.setMinutes(todayDateObj.getMinutes() - todayDateObj.getTimezoneOffset());
  const todayStr = todayDateObj.toISOString().split("T")[0];

  const presentToday = useMemo(() => {
    const todayCheckins = chamCongs.filter(cc => cc.CheckIn && cc.CheckIn.startsWith(todayStr));
    const uniquePresent = new Set(todayCheckins.map(cc => cc.MaNV));
    return uniquePresent.size;
  }, [chamCongs, todayStr]);

  const presentPercentage = totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(1) : 0;

  // Chưa ghi nhận / Vắng
  const missingToday = totalEmployees > 0 ? totalEmployees - presentToday : 0;

  // Cơ cấu phòng ban
  const deptStats = useMemo(() => {
    const counts = {};
    nhanViens.forEach(nv => {
      const pb = nv.TenPB || "Khác";
      counts[pb] = (counts[pb] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [nhanViens]);

  const newestEmployees = useMemo(() => {
    return [...nhanViens]
      .sort((a, b) => new Date(b.NgayBatDau || 0) - new Date(a.NgayBatDau || 0))
      .slice(0, 7);
  }, [nhanViens]);

  const isLoading = loadingNv || loadingBg || loadingCc;

  const todayDisplay = new Date().toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[70vh] items-center justify-center">
        <svg className="w-10 h-10 animate-spin text-slate-300" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  const formatShortMoney = (value) => {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(1).replace(".", ",") + " tỷ đ";
    }
    if (value >= 1e6) {
      return (value / 1e6).toFixed(1).replace(".", ",") + " tr. đ";
    }
    return formatMoney(value);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-7 rounded-4xl shadow-md">
        <div>
          <p className="text-sm text-slate-500 mt-1">{todayDisplay} — Tổng quan nhân sự hôm nay</p>
        </div>
        <Link to="/nhan-vien" className="rounded-full bg-[#0d1c42] hover:bg-blue-900 px-6 py-2.5 text-white font-medium text-sm transition shadow-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm nhân viên
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-indigo-100 p-6 rounded-4xl shadow-md text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[5px]"></div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Tổng nhân viên</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold text-slate-900">{totalEmployees}</h2>
            <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
              Toàn hệ thống
            </div>
          </div>
        </div>

        <div className="bg-green-100 p-6 rounded-4xl shadow-md text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[5px]"></div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Có mặt hôm nay</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold text-slate-900">{presentToday}</h2>
            <div className="text-emerald-600 text-sm font-bold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {presentPercentage}% tỉ lệ
            </div>
          </div>
        </div>

        <div className="bg-orange-200 p-6 rounded-4xl shadow-md text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[5px]"></div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Chưa ghi nhận / Vắng</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold text-slate-900">{missingToday}</h2>
            <div className="text-amber-600 text-sm font-bold flex items-center gap-1">
              Hôm nay
            </div>
          </div>
        </div>

        <div className="bg-red-200 p-6 rounded-4xl shadow-md text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[5px] "></div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Tổng chi thực lĩnh</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{formatShortMoney(totalSalary)}</h2>
            {totalSalary === 0 && <span className="text-xs font-medium text-slate-400">Chưa chốt</span>}
          </div>
        </div>
      </div>

      {/* Main Content  */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Col: Nhân viên mới nhất */}
        <div className="xl:col-span-2 bg-white rounded-3xl shadow-md flex flex-col overflow-hidden">
          <div className="p-6 bg-slate-50/50 flex justify-between items-center shadow-inner">
            <h3 className="text-lg font-bold text-slate-900">Nhân viên mới nhất</h3>
            <Link to="/nhan-vien" className="text-sm text-[#0d1c42] hover:underline font-bold">Xem tất cả &rarr;</Link>
          </div>
          <div className="p-0 overflow-x-auto">
            {newestEmployees.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-10">Chưa có nhân viên nào</p>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white">
                  <tr className="text-slate-400 uppercase text-[11px] font-bold tracking-widest shadow-[0_1px_0_0_rgba(241,245,249,1)]">
                    <th className="px-6 py-4">Nhân viên</th>
                    <th className="px-6 py-4">Phòng ban</th>
                    <th className="px-6 py-4">Ngày vào</th>
                    <th className="px-6 py-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {newestEmployees.map((nv) => {
                    const status = getEmployeeStatus(nv);
                    const statusStyle = STATUS_MAP[status];
                    return (
                      <tr key={nv.MaNV} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-10 h-10 rounded-xl ${getAvatarColor(nv.MaNV)} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                              {getInitials(nv.HoTen)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{nv.HoTen}</p>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">{nv.SDT || "Chưa cập nhật SĐT"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-600">{nv.TenPB || "Chưa xếp"}</td>
                        <td className="px-6 py-4 font-medium text-slate-600 flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {nv.NgayBatDau ? new Date(nv.NgayBatDau).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                            <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Col: Cơ cấu phòng ban */}
        <div className="bg-white rounded-3xl shadow-md flex flex-col overflow-hidden">
          <div className="p-6 bg-slate-50/50 shadow-inner">
            <h3 className="text-lg font-bold text-slate-900">Cơ cấu phòng ban</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-6">
            {deptStats.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">Chưa có dữ liệu phòng ban</p>
            ) : (
              deptStats.map((dept, idx) => {
                const percent = totalEmployees > 0 ? ((dept.value / totalEmployees) * 100).toFixed(0) : 0;
                const barColors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500", "bg-blue-500", "bg-violet-500"];
                const progressColor = barColors[idx % barColors.length];

                return (
                  <div key={dept.name} className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-bold text-slate-700">{dept.name}</span>
                      <span className="text-slate-900 font-bold">{dept.value} <span className="text-slate-400 font-semibold ml-1">({percent}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                      <div className={`h-full ${progressColor} rounded-full`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;