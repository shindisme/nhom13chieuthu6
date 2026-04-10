import api from "../api/axiosClient";

const luongService = {
  getAll() {
    return api.get("/luong");
  },
  getBangLuongThang() {
    return api.get("/bang-luong");
  },
  getById(id) {
    return api.get(`/luong/${id}`);
  },
  insert(data) {
    return api.post("/luong", data);
  },
  update(id, data) {
    return api.put(`/luong/${id}`, data);
  },
  delete(id) {
    return api.delete(`/luong/${id}`);
  },
};

export default luongService;
