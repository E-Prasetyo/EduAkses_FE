import axiosInstance from './axiosConfig';

const handleResponse = (response) => response.data;
const handleError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'User API request failed';
  console.error('User API Error:', errorMessage);
  throw new Error(errorMessage);
};

export const userAPI = {
  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/users');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Update user (admin only)
  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Get all teachers
  getAllTeachers: async () => {
    try {
      const response = await axiosInstance.get('/api/users/teachers');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Get all students
  getAllStudents: async () => {
    try {
      const response = await axiosInstance.get('/api/users/students');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

   // Get all teachers pending
  getAllTeachersPending: async () => {
    try {
      const response = await axiosInstance.get('/api/users/teacher/pending');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

   // Get all teachers active
  getAllTeachersActive: async () => {
    try {
      const response = await axiosInstance.get('/api/users/teacher/active');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Approve teacher (admin only)
  approveTeacher: async (teacherId) => {
    try {
      const response = await axiosInstance.put(`/api/users/${teacherId}/active`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  // Approve teacher (admin only)
  inactiveTeacher: async (teacherId) => {
    try {
      const response = await axiosInstance.put(`/api/users/${teacherId}/inactive`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Reject teacher (admin only)
  rejectTeacher: async (teacherId) => {
    try {
      const response = await axiosInstance.put(`/api/users/${teacherId}/reject`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

   // Reject teacher (admin only)
  getRoles: async () => {
    try {
      const response = await axiosInstance.get(`/api/roles/users`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getCategories: async () => {
    try {
      const response = await axiosInstance.get(`/api/categories`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getCategoriesAdmin: async () => {
    try {
      const response = await axiosInstance.get(`/api/categories/admin`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  postCategories: async (newCategory) => {
    try {
      const response = await axiosInstance.post(`/api/categories`,newCategory);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  
  putCategories: async (newCategory, idCat) => {
    try {
      const response = await axiosInstance.put(`/api/categories/${idCat}`,newCategory);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  putCategoriesActive: async (idCat) => {
    try {
      const response = await axiosInstance.put(`/api/categories/${idCat}/active`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  putCategoriesInactive: async (idCat) => {
    try {
      const response = await axiosInstance.put(`/api/categories/${idCat}/inactive`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getLevels: async () => {
    try {
      const response = await axiosInstance.get(`/api/levels`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }

};