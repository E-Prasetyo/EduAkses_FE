import axios from 'axios';

// Gunakan URL API lokal untuk development dengan localStorage
const baseURL = 'http://localhost:5173/api';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor untuk menambahkan token ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handling error
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika error koneksi ke backend, gunakan localStorage sebagai fallback
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.warn('Backend connection failed, using localStorage fallback');
      // Implementasi fallback akan ditangani di masing-masing API service
      return Promise.reject({ isLocalFallback: true, originalError: error });
    }
    
    // Handle 404 dan 500 errors dengan fallback ke localStorage
    if (error.response && (error.response.status === 404 || error.response.status === 500)) {
      console.warn(`API error (${error.response.status}), using localStorage fallback`);
      return Promise.reject({ isLocalFallback: true, originalError: error });
    }
    
    const { response } = error;
    
    // Handle session expiration
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;