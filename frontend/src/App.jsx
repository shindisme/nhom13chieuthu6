import NhanVien from "./pages/NhanVien.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import ChamCong from "./pages/ChamCong.jsx";
import BangLuong from "./pages/BangLuong.jsx";
import PhongBan from "./pages/PhongBan.jsx";
import QuanLyLuong from "./pages/QuanLyLuong.jsx";
import CaiDat from "./pages/CaiDat.jsx";
import Layout from "./Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setUnauthorizedHandler } from "./api/axiosClient";

function App() {
  return (
    <BrowserRouter>
      <AuthHandler />
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<Dashboard />} />
          <Route path="/nhan-vien" element={<NhanVien />} />
          <Route path="/cham-cong" element={<ChamCong />} />
          <Route path="/phong-ban" element={<PhongBan />} />
          <Route path="/quan-ly-luong" element={<QuanLyLuong />} />
          <Route path="/bang-luong" element={<BangLuong />} />
          <Route path="/cai-dat" element={<CaiDat />} />
        </Route>

        {/*redirect về login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </BrowserRouter>
  );
}

function AuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("roleId");
      toast.info("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      navigate("/login");
    });

    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  return null;
}

export default App;
