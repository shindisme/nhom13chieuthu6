import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import authService from "../services/authService";

const CELL_SIZE = 150;

function useGrid() {
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const calculate = () => {
      const cols = Math.ceil(window.innerWidth / CELL_SIZE);
      const rows = Math.ceil(window.innerHeight / CELL_SIZE);

      setGrid({ cols, rows });
    };

    calculate();
    window.addEventListener("resize", calculate);

    return () => window.removeEventListener("resize", calculate);
  }, []);

  return grid;
}

function Login() {
  const navigate = useNavigate();
  const { cols, rows } = useGrid();
  const count = cols * rows;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const res = await authService.login(form.email, form.password);

      if (res?.success) {
        toast.success("Đăng nhập thành công!");

        setTimeout(() => navigate("/"), 800);
      } else {
        toast.error(res?.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      const message = err?.response?.data?.message;
      toast.error(message || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-linear-to-br from-[#020617] to-[#0f172a]">
      {/* GRID */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="
              w-full h-full
              border border-white/10
              bg-slate-900/30

              transition-all duration-200

              hover:bg-yellow-400/80
              hover:border-yellow-400/80
              hover:shadow-[0_0_25px_rgba(221,221,45,0.6)]
            "
          />
        ))}
      </div>

      {/* LOGIN BOX */}
      <form
        onSubmit={handleSubmit}
        className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          z-10 w-105 max-w-[90%]
          p-10 flex flex-col gap-6
          bg-white text-black
          rounded-2xl border border-black/10
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]

          max-[480px]:w-full
          max-[480px]:h-full
          max-[480px]:rounded-none
          max-[480px]:justify-center
          max-[480px]:p-8
          max-[480px]:border-none
        "
      >
        <div className="text-center mb-2">
          <h2 className="text-[28px] max-[480px]:text-2xl font-bold text-slate-800">
            Đăng Nhập
          </h2>
          <h2 className="text-3xl mt-2 font-bold text-cyan-800">
            Hệ Thống Quản Lý Nhân Sự
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-slate-700">
            Tài khoản
          </label>
          <input
            type="text"
            name="email"
            placeholder="Nhập tài khoản..."
            value={form.email}
            onChange={handleChange}
            className="
              px-4 py-3 rounded-lg border border-slate-200
              bg-slate-50 text-slate-800 text-sm
              outline-none transition
              placeholder:opacity-70
              focus:border-indigo-500
              focus:bg-white
              focus:ring-2 focus:ring-indigo-500/10
            "
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-slate-700">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu..."
            value={form.password}
            onChange={handleChange}
            className="
              px-4 py-3 rounded-lg border border-slate-200
              bg-slate-50 text-slate-800 text-sm
              outline-none transition
              placeholder:opacity-70
              focus:border-indigo-500
              focus:bg-white
              focus:ring-2 focus:ring-indigo-500/10
            "
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            mt-2 py-3 rounded-lg
            bg-[rgba(15,32,67,0.9)] text-white font-bold text-sm
            shadow-[0_4px_12px_rgba(99,102,241,0.4)]
            hover:bg-slate-800 transition
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

export default Login;
