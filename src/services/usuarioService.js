import api from './api';

export default {
  getUsuarios(params = {}) {
    return api.get('/usuarios', { params });
  },
  getUsuario(id) {
    return api.get(`/usuarios/${id}`);
  },
  createUsuario(data) {
    return api.post('/usuarios', data);
  },
  updateUsuario(id, data) {
    return api.put(`/usuarios/${id}`, data);
  },
  deleteUsuario(id) {
    return api.delete(`/usuarios/${id}`);
  },
};