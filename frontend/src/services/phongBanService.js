import api from "../api/axiosClient";

const phongBanService = {
  getAll() {
    return api.get("/phong-ban");
  },
  getById(id) {
    return api.get(`/phong-ban/${id}`);
  },
  insert(data) {
    return api.post("/phong-ban", data);
  },
  update(id, data) {
    return api.put(`/phong-ban/${id}`, data);
  },
  delete(id) {
    return api.delete(`/phong-ban/${id}`);
  },
};

export default phongBanService;
