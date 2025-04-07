import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});
export default {
  getAlumnos(params = {}) {
    return api.get('/alumnos', { params });
  },
  getAlumno(id) {
    return api.get(`/alumnos/${id}`);
  },
  createAlumno(data) {
    return api.post('/alumnos', data);
  },
  updateAlumno(id, data) {
    return api.put(`/alumnos/${id}`, data);
  },
  deleteAlumno(id) {
    return api.delete(`/alumnos/${id}`);
  },
};