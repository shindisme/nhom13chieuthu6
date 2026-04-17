import api from "../api/axiosClient";

const authService = {
  async login(email, password) {
    const response = await api.post("/login", { email, password });

    if (response.success && response.token) {
      const userData = {
        id: response.user.id,
        maNv: response.user.maNv,
        email: response.user.email,
        name: response.user.name,
        phone: response.user.phone || "",
        department: response.user.department || "",
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
    return await api.put("/update-password", {
      matKhauCu: currentPassword,
      matKhauMoi: newPassword,
    });
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
    return JSON.parse(userStr);
  },

  isLoggedIn() {
    return !!localStorage.getItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },
};

export default authService;
