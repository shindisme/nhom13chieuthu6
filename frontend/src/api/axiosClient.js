import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
});

let onUnauthorized = null;

export const setUnauthorizedHandler = (callback) => {
  onUnauthorized = callback;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (!error.response) {
      console.log("Network error");
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("roleId");

      if (onUnauthorized) onUnauthorized();
    }

    return Promise.reject(error);
  },
);

export default api;
