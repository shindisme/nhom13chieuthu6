import api from "../api/axiosClient";

const userService = {
  async getAll() {
    return await api.get("/nhan-vien");
  },
  async getById(id) {
    return await api.get(`/nhan-vien/${id}`);
  },
  async insert(data) {
    return await api.post("/nhan-vien", data);
  },
  async update(id, data) {
    return await api.put(`/nhan-vien/${id}`, data);
  },
  async delete(id) {
    return await api.delete(`/nhan-vien/${id}`);
  },
};

export default userService;
