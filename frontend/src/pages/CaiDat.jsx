import { useState } from "react";
import { toast } from "react-toastify";
import authService from "../services/authService";

/*  Icons   */
const Icon = {
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Database: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
};

/*  Toggle Switch  */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-[#1e40af]" : "bg-slate-200"
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"
          }`}
      />
    </button>
  );
}

/*  Section wrapper  */
function Section({ title, description, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800 text-base">{title}</h2>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/*  Field  */
function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
      <div className="sm:w-48 shrink-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

const inputCls =
  "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition";

/*  Tabs  */
const TABS = [
  { id: "profile", label: "Tài khoản", icon: Icon.User },
  { id: "security", label: "Bảo mật", icon: Icon.Lock },
  { id: "notifications", label: "Thông báo", icon: Icon.Bell },
  { id: "system", label: "Hệ thống", icon: Icon.Database },
];


function CaiDat() {
  const user = authService.getCurrentUser();
  const [activeTab, setActiveTab] = useState("profile");

  // state tai khoan
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    position: "HR Manager",
  });

  // state mat khau
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState({ current: false, newPass: false, confirm: false });

  // state thong bao
  const [notifs, setNotifs] = useState({
    emailLogin: true,
    emailPayroll: true,
    emailAttendance: false,
    browserPush: true,
    weeklyReport: true,
    monthlyReport: false,
  });

  // state he thong
  const [sysSettings, setSysSettings] = useState({
    workStart: "08:00",
    workEnd: "17:30",
    lunchBreak: "60",
    workDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "DD/MM/YYYY",
    currency: "VND",
  });

  /*  handlers  */
  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success("Cập nhật thông tin tài khoản thành công!");
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!passwords.current) return toast.warning("Vui lòng nhập mật khẩu hiện tại");
    if (passwords.newPass.length < 6) return toast.warning("Mật khẩu mới phải có ít nhất 6 ký tự");
    if (passwords.newPass !== passwords.confirm) return toast.error("Xác nhận mật khẩu không khớp");
    toast.success("Đổi mật khẩu thành công!");
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  const handleNotifSave = () => toast.success("Cài đặt thông báo đã được lưu!");
  const handleSystemSave = () => toast.success("Cài đặt hệ thống đã được lưu!");

  const dayLabels = { Mon: "T2", Tue: "T3", Wed: "T4", Thu: "T5", Fri: "T6", Sat: "T7", Sun: "CN" };
  const toggleDay = (d) =>
    setSysSettings((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(d)
        ? prev.workDays.filter((x) => x !== d)
        : [...prev.workDays, d],
    }));

  /*  render  */
  return (
    <div className="flex flex-col gap-6">
      {/* Page intro */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0d1c42] to-[#1e40af] flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <p className="text-slate-500 text-sm">Quản lý thông tin cá nhân và cấu hình hệ thống</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/*  Sidebar tabs  */}
        <div className="lg:w-56 shrink-0">
          <nav className="bg-white rounded-3xl shadow-md overflow-hidden p-2 flex lg:flex-col gap-1">
            {TABS.map(({ id, label, icon: IconComp }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition w-full text-left ${activeTab === id
                  ? "bg-[#0d1c42] text-white"
                  : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <span className={activeTab === id ? "text-white" : "text-slate-400"}>
                  <IconComp />
                </span>
                <span className="hidden sm:inline lg:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 flex flex-col gap-5">

          {activeTab === "profile" && (
            <>
              {/* Avatar card */}
              <div className="bg-white rounded-3xl shadow-md p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {(profile.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-slate-800 text-lg">{profile.name || "Người dùng"}</h3>
                    <p className="text-slate-500 text-sm">{profile.email}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                        {profile.position}
                      </span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                        Đang hoạt động
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition">
                    Đổi ảnh
                  </button>
                </div>
              </div>

              {/* Edit form */}
              <Section title="Thông tin cá nhân" description="Cập nhật họ tên, email và thông tin liên hệ">
                <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
                  <Field label="Họ và tên" hint="Tên hiển thị trong hệ thống">
                    <input
                      className={inputCls}
                      value={profile.name}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Nhập họ và tên..."
                    />
                  </Field>
                  <div className="border-t border-slate-50" />
                  <Field label="Email" hint="Dùng để đăng nhập hệ thống">
                    <input
                      className={inputCls + " opacity-60 cursor-not-allowed"}
                      value={profile.email}
                      readOnly
                    />
                    <p className="text-xs text-slate-400 mt-1.5">Liên hệ quản trị viên để thay đổi email.</p>
                  </Field>
                  <div className="border-t border-slate-50" />
                  <Field label="Số điện thoại">
                    <input
                      className={inputCls}
                      value={profile.phone}
                      onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="Nhập số điện thoại..."
                    />
                  </Field>
                  <div className="border-t border-slate-50" />
                  <Field label="Chức vụ">
                    <input className={inputCls + " opacity-60 cursor-not-allowed"} value={profile.position} readOnly />
                  </Field>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#0d1c42] hover:bg-[#1e40af] text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
                    >
                      <Icon.Check />
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </Section>
            </>
          )}

          {/* tab bao mat */}
          {activeTab === "security" && (
            <>
              <Section title="Đổi mật khẩu" description="Mật khẩu mới phải có ít nhất 6 ký tự">
                <form onSubmit={handlePasswordSave} className="flex flex-col gap-5">
                  {[
                    { key: "current", label: "Mật khẩu hiện tại" },
                    { key: "newPass", label: "Mật khẩu mới" },
                    { key: "confirm", label: "Xác nhận mật khẩu mới" },
                  ].map(({ key, label }) => (
                    <Field key={key} label={label}>
                      <div className="relative">
                        <input
                          type={showPw[key] ? "text" : "password"}
                          className={inputCls + " pr-10"}
                          value={passwords[key]}
                          onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((p) => ({ ...p, [key]: !p[key] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        >
                          {showPw[key] ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </Field>
                  ))}

                  {/* Password strength indicator */}
                  {passwords.newPass && (
                    <div className="ml-0 sm:ml-54">
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4].map((i) => {
                          const len = passwords.newPass.length;
                          const strength = len < 6 ? 1 : len < 8 ? 2 : len < 12 ? 3 : 4;
                          const colors = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-400"];
                          return (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? colors[strength] : "bg-slate-100"}`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {passwords.newPass.length < 6 ? "Yếu" : passwords.newPass.length < 8 ? "Trung bình" : passwords.newPass.length < 12 ? "Khá" : "Mạnh"}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#0d1c42] hover:bg-[#1e40af] text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
                    >
                      <Icon.Lock />
                      Đổi mật khẩu
                    </button>
                  </div>
                </form>
              </Section>


            </>
          )}

          {/*  tab thông báo  */}
          {activeTab === "notifications" && (
            <Section title="Cài đặt thông báo" description="Chọn loại thông báo bạn muốn nhận">
              <div className="flex flex-col gap-1">
                {[
                  { key: "emailLogin", label: "Thông báo đăng nhập", desc: "Gửi email khi có đăng nhập mới vào tài khoản", group: "Email" },
                  { key: "emailPayroll", label: "Bảng lương hàng tháng", desc: "Gửi email khi bảng lương được chốt", group: "Email" },
                  { key: "emailAttendance", label: "Cảnh báo chấm công", desc: "Gửi email khi nhân viên quên check-out", group: "Email" },
                  { key: "browserPush", label: "Thông báo trình duyệt", desc: "Nhận thông báo pop-up trên trình duyệt", group: "Hệ thống" },
                  { key: "weeklyReport", label: "Báo cáo tuần", desc: "Tự động tổng hợp dữ liệu cuối tuần", group: "Hệ thống" },
                  { key: "monthlyReport", label: "Báo cáo tháng", desc: "Tự động tổng hợp dữ liệu cuối tháng", group: "Hệ thống" },
                ].reduce((acc, item) => {
                  if (!acc.groups[item.group]) acc.groups[item.group] = [];
                  acc.groups[item.group].push(item);
                  return acc;
                }, { groups: {} }) &&
                  Object.entries(
                    [
                      { key: "emailLogin", label: "Thông báo đăng nhập", desc: "Gửi email khi có đăng nhập mới vào tài khoản", group: "Email" },
                      { key: "emailPayroll", label: "Bảng lương hàng tháng", desc: "Gửi email khi bảng lương được chốt", group: "Email" },
                      { key: "emailAttendance", label: "Cảnh báo chấm công", desc: "Gửi email khi nhân viên quên check-out", group: "Email" },
                      { key: "browserPush", label: "Thông báo trình duyệt", desc: "Nhận thông báo pop-up trên trình duyệt", group: "Hệ thống" },
                      { key: "weeklyReport", label: "Báo cáo tuần", desc: "Tự động tổng hợp dữ liệu cuối tuần", group: "Hệ thống" },
                      { key: "monthlyReport", label: "Báo cáo tháng", desc: "Tự động tổng hợp dữ liệu cuối tháng", group: "Hệ thống" },
                    ].reduce((acc, item) => {
                      if (!acc[item.group]) acc[item.group] = [];
                      acc[item.group].push(item);
                      return acc;
                    }, {})
                  ).map(([group, items]) => (
                    <div key={group} className="mb-6">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{group}</p>
                      <div className="flex flex-col gap-3">
                        {items.map(({ key, label, desc }) => (
                          <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                            <div>
                              <p className="text-sm font-medium text-slate-700">{label}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                            </div>
                            <Toggle
                              checked={notifs[key]}
                              onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                }
              </div>

              <div className="flex justify-end mt-2">
                <button
                  onClick={handleNotifSave}
                  className="px-6 py-2.5 bg-[#0d1c42] hover:bg-[#1e40af] text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
                >
                  <Icon.Check />
                  Lưu cài đặt
                </button>
              </div>
            </Section>
          )}

          {/* tab he thong */}
          {activeTab === "system" && (
            <>
              <Section title="Giờ làm việc" description="Cấu hình thời gian làm việc mặc định của công ty">
                <div className="flex flex-col gap-5">
                  <Field label="Giờ bắt đầu">
                    <input
                      type="time"
                      className={inputCls}
                      value={sysSettings.workStart}
                      onChange={(e) => setSysSettings((s) => ({ ...s, workStart: e.target.value }))}
                    />
                  </Field>
                  <div className="border-t border-slate-50" />
                  <Field label="Giờ kết thúc">
                    <input
                      type="time"
                      className={inputCls}
                      value={sysSettings.workEnd}
                      onChange={(e) => setSysSettings((s) => ({ ...s, workEnd: e.target.value }))}
                    />
                  </Field>
                  <div className="border-t border-slate-50" />
                  <Field label="Nghỉ trưa (phút)">
                    <input
                      type="number"
                      className={inputCls}
                      value={sysSettings.lunchBreak}
                      min={0}
                      max={120}
                      onChange={(e) => setSysSettings((s) => ({ ...s, lunchBreak: e.target.value }))}
                    />
                  </Field>
                  <div className="border-t border-slate-50" />
                  <Field label="Ngày làm việc" hint="Chọn các ngày trong tuần">
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(dayLabels).map(([key, label]) => {
                        const active = sysSettings.workDays.includes(key);
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => toggleDay(key)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition border ${active
                              ? "bg-[#0d1c42] text-white border-[#0d1c42]"
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                              }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              </Section>



              <div className="flex justify-end">
                <button
                  onClick={handleSystemSave}
                  className="px-6 py-2.5 bg-[#0d1c42] hover:bg-[#1e40af] text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
                >
                  <Icon.Check />
                  Lưu cài đặt hệ thống
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CaiDat;