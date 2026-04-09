import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
function SideBar() {
  const location = useLocation();
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const menuItemStyles = {
    button: ({ active }) => ({
      backgroundColor: active ? "#1e40af" : "transparent",
      color: active ? "#fff " : "#ccd5e1",
      fontWeight: active ? "600" : "500",
      fontSize: "14px",
      "&:hover": {
        backgroundColor: "#1e3a8a",
        color: "#cbd5f5",
      },
    }),
    icon: {
      color: "#94a3b8",
    },
  };

  return (
    <aside className="sticky top-0 h-screen shrink-0">
      <Sidebar
        backgroundColor="#0d1c42"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRight: "none",
        }}
      >
        {/* logo */}
        <div className="p-6 text-center border-b border-slate-700">
          <h1 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Quản Lý Nhân Sự
          </h1>
        </div>

        {/* menu */}
        <div className="flex-1 overflow-y-auto">
          <Menu menuItemStyles={menuItemStyles}>
            <div className="px-4 py-3 mt-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tổng Quan
              </p>
            </div>
            <MenuItem
              active={location.pathname === "/"}
              component={<Link to="/" />}
            >
              <span>Dashboard</span>
            </MenuItem>

            <div className="px-4 py-3 mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Nhân Sự
              </p>
            </div>
            <MenuItem
              active={location.pathname === "/nhan-vien"}
              component={<Link to="/nhan-vien" />}
            >
              <span>Nhân viên</span>
            </MenuItem>
            <MenuItem
              active={location.pathname === "/cham-cong"}
              component={<Link to="/cham-cong" />}
            >
              <span>Chấm công</span>
            </MenuItem>
            <MenuItem
              active={location.pathname === "/bang-luong"}
              component={<Link to="/bang-luong" />}
            >
              <span>Bảng lương</span>
            </MenuItem>

            <div className="px-4 py-3 mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tiện Ích
              </p>
            </div>
            <MenuItem
              active={location.pathname === "/bao-cao"}
              component={<Link to="/bao-cao" />}
            >
              <span>Báo cáo</span>
            </MenuItem>
            <MenuItem
              active={location.pathname === "/cai-dat"}
              component={<Link to="/cai-dat" />}
            >
              <span>Cài đặt</span>
            </MenuItem>
          </Menu>
        </div>

        {/* user info - cố định ở cuối sidebar */}
        {user && (
          <div
            className="border-t border-slate-700 p-4 shrink-0"
            style={{ backgroundColor: "#0a1533" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user.name?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase() ||
                  "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.name || "Người dùng"}
                </p>
                <p className="text-xs text-slate-400">HR Manager</p>
              </div>
            </div>
          </div>
        )}
      </Sidebar>
    </aside>
  );
}

export default SideBar;
