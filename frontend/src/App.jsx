import NhanVien from "./pages/NhanVien.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import ChamCong from "./pages/ChamCong.jsx";
import BangLuong from "./pages/BangLuong.jsx";
import BaoCao from "./pages/BaoCao.jsx";
import CaiDat from "./pages/CaiDat.jsx";
import Layout from "./Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { Bounce, ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/nhan-vien" element={<NhanVien />} />
          <Route path="/cham-cong" element={<ChamCong />} />
          <Route path="/bang-luong" element={<BangLuong />} />
          <Route path="/bao-cao" element={<BaoCao />} />
          <Route path="/cai-dat" element={<CaiDat />} />
        </Route>

        {/* Catch all - redirect về login */}
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

export default App;
