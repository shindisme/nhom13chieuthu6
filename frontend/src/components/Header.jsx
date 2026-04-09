import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "react-toastify";

const Header = ({ title }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = authService.getCurrentUser();
  const name = user?.name || "Người dùng";

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Đăng xuất thành công");
    navigate("/login");
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-30 bg-amber-50 text-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between h-12">
          <div>
            <h1 className="text-lg md:text-2xl font-semibold">{title}</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-xl"
              aria-expanded={open}
            >
              <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-semibold">
                {name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline max-w-40 truncate">{name}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 bg-amber-50 text-black border rounded shadow w-44 z-50">
                <button
                  onClick={() => {
                    setOpen(false);
                    toast.info("Thông tin tài khoản chưa có chức năng");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  Thông tin tài khoản
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 bg-red-50 hover:bg-red-300 text-red-600"
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
