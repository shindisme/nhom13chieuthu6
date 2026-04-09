import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

function Layout() {
  const { pathname } = useLocation();

  const routeTitleMap = {
    "/": "Dashboard",
    "/nhan-vien": "Quản lý nhân viên",
    "/cham-cong": "Chấm công",
    "/bang-luong": "Bảng lương",
    "/bao-cao": "Báo cáo",
    "/cai-dat": "Cài đặt",
  };

  const title = routeTitleMap[pathname] || "";

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />
        <main className="flex-1 overflow-auto">
          {title && <Header title={title} />}

          <div className="p-6">
            <div className="max-w-7xl mx-auto px-4">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Layout;
