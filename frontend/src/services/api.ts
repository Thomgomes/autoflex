import axios from 'axios';

const api = axios.create({
  baseURL: 'https://autoflex-api-lsgq.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;