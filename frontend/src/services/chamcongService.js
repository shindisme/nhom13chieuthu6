import api from "../api/axiosClient";

const chamCongService = {
  async getAll() {
    return await api.get("/cham-cong");
  },
  async getById(id) {
    return await api.get(`/cham-cong/${id}`);
  },
  async insert(data) {
    return await api.post("/cham-cong", data);
  },
  async update(id, data) {
    return await api.put(`/cham-cong/${id}`, data);
  },
  async delete(id) {
    return await api.delete(`/cham-cong/${id}`);
  },
};

export default chamCongService;