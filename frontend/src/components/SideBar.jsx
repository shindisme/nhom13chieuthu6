import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Building, FileClock, Cog, CreditCard, Settings } from "lucide-react";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name.charAt(0) || "U").toUpperCase();
};

function SideBar() {
  const location = useLocation();
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const menuItemStyles = {
    button: ({ active }) => ({
      backgroundColor: active ? "#1e40af" : "transparent",
      color: active ? "#fff" : "#ccd5e1",
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
        rootStyles={{
          height: "100%",
          borderRight: "none",
        }}
      >
        {/* Wrapper de ep footer xuong bottom theo flex */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* logo */}
          <div className="p-6 text-center border-b border-slate-700 shrink-0">
            <h1 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Quản Lý Nhân Sự
            </h1>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            <Menu menuItemStyles={menuItemStyles}>
              <div className="px-4 py-3 mt-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Tổng Quan
                </p>
              </div>
              <MenuItem
                active={location.pathname === "/"}
                component={<Link to="/" />}
                icon={<Home size={20} />}
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
                icon={<Users size={20} />}
              >
                <span>Nhân viên</span>
              </MenuItem>
              <MenuItem
                active={location.pathname === "/phong-ban"}
                component={<Link to="/phong-ban" />}
                icon={<Building size={20} />}
              >
                <span>Phòng ban</span>
              </MenuItem>
              <MenuItem
                active={location.pathname === "/cham-cong"}
                component={<Link to="/cham-cong" />}
                icon={<FileClock size={20} />}
              >
                <span>Chấm công</span>
              </MenuItem>
              <MenuItem
                active={location.pathname === "/quan-ly-luong"}
                component={<Link to="/quan-ly-luong" />}
                icon={<Cog size={20} />}
              >
                <span>Quản lý lương</span>
              </MenuItem>
              <MenuItem
                active={location.pathname === "/bang-luong"}
                component={<Link to="/bang-luong" />}
                icon={<CreditCard size={20} />}
              >
                <span>Bảng lương</span>
              </MenuItem>

              <div className="px-4 py-3 mt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Tiện Ích
                </p>
              </div>
              {/* <MenuItem
                active={location.pathname === "/bao-cao"}
                component={<Link to="/bao-cao" />}
              >
                <span>Báo cáo</span>
              </MenuItem> */}
              <MenuItem
                active={location.pathname === "/cai-dat"}
                component={<Link to="/cai-dat" />}
                icon={<Settings size={20} />}
              >
                <span>Cài đặt</span>
              </MenuItem>
            </Menu>
          </div>

          {user && (
            <div
              style={{
                borderTop: "1px solid rgba(148, 163, 184, 0.2)",
                padding: "16px",
                backgroundColor: "#0a1533",
                flexShrink: 0,
              }}
            >
              <div className="flex items-center gap-3">
                {user.image ? (
                  <img src={user.image} alt="Avatar" className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {getInitials(user.name || user.email || "Người dùng")}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user.name || "Người dùng"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {user.roleId === 1 ? "Admin" : "Nhân viên HR"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Sidebar>
    </aside>
  );
}

export default SideBar;
