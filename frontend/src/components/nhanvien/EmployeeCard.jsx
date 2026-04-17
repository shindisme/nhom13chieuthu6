import { getInitials, getAvatarColor, formatDate } from "../../utils/helpers";

const STATUS_MAP = {
  "Đang làm": {
    bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500",
  },
  "Thử việc": {
    bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400",
  },
  "Nghỉ phép": {
    bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-500",
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

const calcYearsWorked = (startDate) => {
  if (!startDate) return 0;
  const now = new Date();
  const start = new Date(startDate);
  return Math.max(0, Math.floor((now - start) / (365.25 * 24 * 60 * 60 * 1000)));
};

const formatSalary = (luong) => {
  if (!luong) return "—";
  const base = parseFloat(luong.LuongCoBan) || 0;
  const factor = parseFloat(luong.HeSoLuong) || 1;
  const allowance = parseFloat(luong.PhuCap) || 0;
  const total = base * factor + allowance;
  return total.toLocaleString("vi-VN") + " đ";
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP["Đang làm"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

function EmployeeCard({ nv, luongData, onEdit, onDelete }) {
  const status = getEmployeeStatus(nv);
  const avatarColor = getAvatarColor(nv.MaNV);
  const initials = getInitials(nv.HoTen);
  const yearsWorked = calcYearsWorked(nv.NgayBatDau);
  const luong = luongData.find((l) => l.MaNV === nv.MaNV);
  const luongDisplay = formatSalary(luong);

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 p-5 flex flex-col gap-4 group">
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

      {/* Stats */}
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
    </div>
  );
}

export function AddEmployeeCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#1e40af] hover:bg-blue-50/30 transition-all duration-300 p-5 flex flex-col items-center justify-center gap-3 min-h-[280px] group cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-[#0d1c42] flex items-center justify-center transition-colors duration-300">
        <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="text-sm font-medium text-slate-400 group-hover:text-[#0d1c42] transition-colors duration-300">
        Thêm nhân viên mới
      </span>
    </button>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { getEmployeeStatus, STATUS_MAP, formatSalary };
export default EmployeeCard;
