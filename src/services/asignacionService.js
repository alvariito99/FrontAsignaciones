import api from './api';

export default {
  getAsignaciones(params = {}) {
    return api.get('/asignaciones', { params });
  },
  getAsignacion(id) {
    return api.get(`/asignaciones/${id}`);
  },
  createAsignacion(data) {
    return api.post('/asignaciones', data);
  },
  updateAsignacion(id, data) {
    return api.put(`/asignaciones/${id}`, data);
  },
  deleteAsignacion(id) {
    return api.delete(`/asignaciones/${id}`);
  },
};
