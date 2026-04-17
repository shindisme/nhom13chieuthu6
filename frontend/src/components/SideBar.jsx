import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Building, FileClock, Cog, CreditCard, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import AvatarInitials from "./common/AvatarInitials";

function SideBar({ rtl = false }) {
  const location = useLocation();
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Persist collapse state
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  const toggleCollapse = () => setCollapsed((prev) => !prev);

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
        collapsed={collapsed}
        rtl={rtl}
        backgroundColor="#0d1c42"
        rootStyles={{
          height: "100%",
          borderRight: "none",
          borderLeft: "none",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header*/}
          <button
            onClick={toggleCollapse}
            className="p-4 text-center border-b border-slate-700 shrink-0 flex items-center justify-between gap-2 hover:bg-[#1a2d5e] transition-colors cursor-pointer w-full"
            title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {!collapsed && (
              <h1 className="text-sm font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap">
                Quản Lý Nhân Sự
              </h1>
            )}
            <span className="text-slate-400 shrink-0 mx-auto">
              {collapsed ? (
                rtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />
              ) : (
                rtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />
              )}
            </span>
          </button>

          <div style={{ flex: 1, overflowY: "auto" }}>
            <Menu menuItemStyles={menuItemStyles}>
              {!collapsed && (
                <div className="px-4 py-3 mt-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Tổng Quan
                  </p>
                </div>
              )}
              <MenuItem
                active={location.pathname === "/"}
                component={<Link to="/" />}
                icon={<Home size={20} />}
              >
                <span>Dashboard</span>
              </MenuItem>

              {!collapsed && (
                <div className="px-4 py-3 mt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Nhân Sự
                  </p>
                </div>
              )}
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

              {!collapsed && (
                <div className="px-4 py-3 mt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Tiện Ích
                  </p>
                </div>
              )}
              <MenuItem
                active={location.pathname === "/cai-dat"}
                component={<Link to="/cai-dat" />}
                icon={<Settings size={20} />}
              >
                <span>Cài đặt</span>
              </MenuItem>
            </Menu>
          </div>

          {/* User info footer */}
          {user && (
            <div
              style={{
                borderTop: "1px solid rgba(148, 163, 184, 0.2)",
                padding: collapsed ? "12px 8px" : "16px",
                backgroundColor: "#0a1533",
                flexShrink: 0,
              }}
            >
              {/* <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                <AvatarInitials
                  name={user.name || user.email || "Người dùng"}
                  id={user.maNv || user.id}
                  image={user.image}
                  size="md"
                  className="bg-orange-500!"
                />
                {!collapsed && (
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.name || user.email || "Người dùng"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {user.roleId === 1 ? "Admin" : "Nhân viên"}
                    </p>
                  </div>
                )}
              </div> */}
            </div>
          )}
        </div>
      </Sidebar>
    </aside>
  );
}

export default SideBar;
