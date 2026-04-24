import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

function Layout() {
  const { pathname } = useLocation();

  // const [rtl, setRtl] = useState(() => localStorage.getItem("rtl") === "true");
  useEffect(() => {
    const handleStorageChange = () => {
      // setRtl(localStorage.getItem("rtl") === "true");
    };
    window.addEventListener("storage", handleStorageChange);

    window.addEventListener("rtlChanged", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("rtlChanged", handleStorageChange);
    };
  }, []);

  const routeTitleMap = {
    "/": "Dashboard",
    "/nhan-vien": "Quản lý nhân viên",
    "/cham-cong": "Chấm công",
    "/phong-ban": "Quản lý phòng ban",
    "/quan-ly-luong": "Quản lý lương",
    "/bang-luong": "Quản lý bảng lương",
    "/bao-cao": "Báo cáo",
    "/cai-dat": "Cài đặt",
  };

  const title = routeTitleMap[pathname] || "";

  return (
    <div className={`flex min-h-screen bg-slate-100 text-slate-800`}
    // dir={rtl ? "rtl" : "ltr"}
    >
      <SideBar />
      <main className="flex-1 overflow-auto">
        {title && <Header title={title} />}

        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto px-2 md:px-4">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Layout;
