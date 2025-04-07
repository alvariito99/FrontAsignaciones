import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Cambia esta URL según tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;