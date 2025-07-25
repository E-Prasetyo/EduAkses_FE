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
      const response = await axiosInstance.put(`/users/${userId}`, userData);
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
      const response = await axiosInstance.get('/users/teachers');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Get all students
  getAllStudents: async () => {
    try {
      const response = await axiosInstance.get('/users/students');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Approve teacher (admin only)
  approveTeacher: async (teacherId) => {
    try {
      const response = await axiosInstance.put(`/users/teachers/${teacherId}/approve`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Reject teacher (admin only)
  rejectTeacher: async (teacherId) => {
    try {
      const response = await axiosInstance.put(`/users/teachers/${teacherId}/reject`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};