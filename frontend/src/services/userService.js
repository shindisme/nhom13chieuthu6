import api from "../config/api";

const userService = {
    async getAll() {
        return await api.get('/users');
    },
    async getById(id) {
        return await api.get(`/users/${id}`);
    },
    async insert(data) {
        return await api.post('/users', data);
    },
    async update(id, data) {
        return await api.put(`/users/${id}`, data);
    },
    async delete(id) {
        return await api.delete(`/users/${id}`);
    }
};

export default userService;