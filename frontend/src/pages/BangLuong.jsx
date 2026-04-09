import { useMemo, useState } from "react";

const sampleRows = [];

const tabs = [
  "Danh sách lương",
  "Phụ cấp & Thưởng",
  "Bảo hiểm & Thuế",
  "Lịch sử thanh toán",
];

const formatMoney = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

const statusMap = {
  "Chờ duyệt": "bg-amber-100 text-amber-700",
  "Đã duyệt": "bg-emerald-100 text-emerald-700",
  "Tạm giữ": "bg-red-100 text-red-700",
};

function BangLuong() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const filteredRows = useMemo(() => {
    return sampleRows.filter((row) =>
      [row.name, row.department, row.code].some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Bảng lương</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Bảng lương Tháng 3/2026</h1>
            <p className="mt-2 text-sm text-slate-500">Chu kỳ: 01/03/2026 - 31/03/2026</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button className="rounded-full border border-slate-200 bg-white px-5 py-2 text-slate-700 transition hover:bg-slate-50">
              Xuất bảng lương
            </button>
            <button className="rounded-full bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-700">
              Duyệt tất cả
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tổng lương chi trả</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">4.823.500.000 đ</p>
          <p className="mt-2 text-sm text-emerald-600">+2,1% so tháng trước</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Số nhân viên</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">247 người</p>
          <p className="mt-2 text-sm text-slate-500">4 mới / 0 nghỉ việc tháng này</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Trạng thái</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">Chờ duyệt</p>
          <p className="mt-2 text-sm text-slate-500">Hạn duyệt: 25/03/2026</p>
        </div>
      </div>

      <div className="rounded-4xl bg-white p-6 shadow-sm shadow-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
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
                <th className="px-4 py-3">Thưởng</th>
                <th className="px-4 py-3">Khấu trừ</th>
                <th className="px-4 py-3">Thực lĩnh</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-4xl">📊</div>
                      <div className="text-lg font-medium">Chưa có dữ liệu bảng lương</div>
                      <div className="text-sm">Dữ liệu sẽ hiển thị khi có nhân viên và thông tin lương</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="bg-slate-50 rounded-3xl text-sm text-slate-700 shadow-sm shadow-slate-100">
                    <td className="whitespace-nowrap rounded-l-3xl bg-white px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                          {row.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{row.name}</div>
                          <div className="text-xs text-slate-500">{row.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="bg-white px-4 py-4">{row.department}</td>
                    <td className="bg-white px-4 py-4">{formatMoney(row.basicSalary)}</td>
                    <td className="bg-white px-4 py-4 text-emerald-600">+{formatMoney(row.allowance)}</td>
                    <td className="bg-white px-4 py-4 text-emerald-600">+{formatMoney(row.bonus)}</td>
                    <td className="bg-white px-4 py-4 text-red-600">-{formatMoney(row.deduction)}</td>
                    <td className="bg-white px-4 py-4 font-semibold text-slate-900">{formatMoney(row.netSalary)}</td>
                    <td className="bg-white px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMap[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="rounded-r-3xl bg-white px-4 py-4">
                      <button className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700">
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-500">Hiển thị {filteredRows.length} / {sampleRows.length} nhân viên</div>
          <div className="flex items-center gap-2 text-sm">
            <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600 hover:bg-slate-100">Trước</button>
            <div className="flex items-center gap-2">
              <button className="rounded-full bg-slate-900 px-3 py-2 text-white">1</button>
              <button className="rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-100">2</button>
              <button className="rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-100">3</button>
            </div>
            <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600 hover:bg-slate-100">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BangLuong;
