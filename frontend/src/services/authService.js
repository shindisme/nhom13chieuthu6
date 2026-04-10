import api from "../api/axiosClient";

const EMAIL_TO_NV_MAP = {
  "admin@gmail.com": { maNv: 8, name: "Nguyễn Tiến Dũng", phone: "0978819356" },
  "kiet@admin.com": { maNv: 13, name: "Trần Anh Kiệt", phone: "097881935" }
};

const authService = {
  async login(email, password) {
    const response = await api.post("/login", { email, password });

    if (response.success && response.token) {
      const emailLower = response.user.email?.toLowerCase();
      const mapped = EMAIL_TO_NV_MAP[emailLower] || {};

      const userData = {
        id: response.user.id,
        maNv: mapped.maNv || response.user.maNv,
        email: response.user.email,
        name: mapped.name || response.user.name,
        phone: mapped.phone || response.user.phone,
        image: response.user.image,
        roleId: response.roleId,
        token: response.token,
      };

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("roleId", response.roleId);
    }

    return response;
  },

  async changePassword(currentPassword, newPassword) {
    return await api.put("/change-password", { currentPassword, newPassword });
  },

  async logout() {
    try {
      await api.post("/logout");
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("roleId");
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    const user = JSON.parse(userStr);

    const emailLower = user.email?.toLowerCase();
    const mapped = EMAIL_TO_NV_MAP[emailLower];
    if (mapped) {
      if (!user.maNv) user.maNv = mapped.maNv;
      if (user.name === "Người dùng" || !user.name) user.name = mapped.name;
      if (!user.phone) user.phone = mapped.phone;
    } else if (user.name === "Người dùng" && user.email) {
      user.name = user.email.split("@")[0];
    }

    return user;
  },

  isLoggedIn() {
    return !!localStorage.getItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },
};

export default authService;
