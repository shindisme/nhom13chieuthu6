import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "react-toastify";
import AvatarInitials from "./common/AvatarInitials";

const Header = ({ title }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = authService.getCurrentUser();
  const name = user?.name || "Người dùng";
  const roleName = user?.roleId === 1 ? "Admin" : "Nhân viên HR";

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Đăng xuất thành công");
    navigate("/login");
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-30 bg-white text-black border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between h-12">
          <div>
            <h1 className="text-lg md:text-2xl font-semibold text-slate-800">{title}</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-3 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 transition shadow-sm"
              aria-expanded={open}
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-800 leading-tight">{name}</span>
                <span className="text-[10px] text-slate-500 font-medium">{roleName}</span>
              </div>
              <AvatarInitials
                name={name}
                id={user?.maNv || user?.id}
                image={user?.image}
                size="sm"
                className="w-9! h-9! bg-orange-500!"
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 bg-white text-slate-800 border border-slate-200 rounded-lg shadow-lg w-44 z-50">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/cai-dat");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700"
                >
                  Thông tin tài khoản
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;