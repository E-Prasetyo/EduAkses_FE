import axiosInstance from './axiosConfig';
import { localStorageService } from './localStorageService';

const handleResponse = (response) => response.data;
const handleError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'Authentication failed';
  console.error('Auth API Error:', errorMessage);
  throw new Error(errorMessage);
};

export const authAPI = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      return handleResponse(response);
    } catch (error) {
      // Fallback ke localStorage jika koneksi ke backend gagal
      if (error.isLocalFallback) {
        console.log('Using localStorage fallback for login');
        const users = localStorageService.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          // Generate dummy token
          const token = `dummy-token-${Date.now()}`;
          return { user, token };
        } else {
          throw new Error('Email atau password salah');
        }
      }
      return handleError(error);
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return handleResponse(response);
    } catch (error) {
      // Fallback ke localStorage jika koneksi ke backend gagal
      if (error.isLocalFallback) {
        console.log('Using localStorage fallback for register');
        const users = localStorageService.getUsers();
        
        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
          throw new Error('Email sudah terdaftar');
        }
        
        // Create new user
        const newUser = {
          id: `user${Date.now()}`,
          ...userData,
          createdAt: new Date().toISOString(),
          joinDate: new Date().toLocaleDateString('id-ID'),
          isActive: true
        };
        
        localStorageService.saveUsers([...users, newUser]);
        return { user: newUser, token: `dummy-token-${Date.now()}` };
      }
      return handleError(error);
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return handleResponse(response);
    } catch (error) {
      // Fallback ke localStorage jika koneksi ke backend gagal
      if (error.isLocalFallback) {
        console.log('Using localStorage fallback for getCurrentUser');
        const userData = localStorageService.getCurrentUser();
        if (userData) {
          return userData;
        } else {
          throw new Error('User tidak ditemukan');
        }
      }
      return handleError(error);
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return handleResponse(response);
    } catch (error) {
      // Untuk logout, kita tidak perlu fallback karena logout bisa dilakukan secara lokal
      // Cukup hapus data dari localStorage/sessionStorage di AuthContext
      console.log('Logout handled locally');
      return { success: true };
    }
  },

  // Update profile
  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put('/auth/profile', userData);
      return handleResponse(response);
    } catch (error) {
      // Fallback ke localStorage jika koneksi ke backend gagal
      if (error.isLocalFallback) {
        console.log('Using localStorage fallback for updateProfile');
        const currentUser = localStorageService.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          // Update user in localStorage users collection
          const users = localStorageService.getUsers();
          const updatedUsers = users.map(u => 
            u.id === currentUser.id ? { ...u, ...userData } : u
          );
          localStorageService.saveUsers(updatedUsers);
          // Update current user data
          localStorageService.updateCurrentUser(updatedUser);
          return updatedUser;
        } else {
          throw new Error('User tidak ditemukan');
        }
      }
      return handleError(error);
    }
  }
};