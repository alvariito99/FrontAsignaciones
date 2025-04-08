import api from './api';

export default {
  getEmpresas(params = {}) {
    return api.get('/empresas', { params });
  },
  getEmpresa(id) {
    return api.get(`/empresas/${id}`);
  },
  createEmpresa(data) {
    return api.post('/empresas', data);
  },
  updateEmpresa(id, data) {
    return api.put(`/empresas/${id}`, data);
  },
  deleteEmpresa(id) {
    return api.delete(`/empresas/${id}`);
  },
};