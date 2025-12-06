// src/setup.ts
import axios from 'axios';

// LOGIKA UTAMA: Tentukan URL Backend
const getBaseUrl = () => {
  // 1. Jika di Production (saat build npm run build), gunakan URL publik HTTPS
  if (import.meta.env.PROD) {
    return 'https://api.neverlandstudio.my.id'; 
  }
  
  // 2. Jika di Development (local), gunakan localhost
  return 'http://localhost:5000';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true, // Wajib agar cookie/session bekerja
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;