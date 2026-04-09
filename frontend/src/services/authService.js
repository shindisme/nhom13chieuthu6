import api from "../api/axiosClient";

const authService = {
  async login(email, password) {
    const response = await api.post("/login", { email, password });

    if (response.success && response.token) {
      const userData = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        roleId: response.roleId,
        token: response.token,
      };

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("roleId", response.roleId);
    }

    return response;
  },

  async logout() {
    try {
      await api.post("/logout");
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      // Luôn xóa dữ liệu local lưu dù API gặp lỗi hay không
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("roleId");
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isLoggedIn() {
    return !!localStorage.getItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },
};

export default authService;
