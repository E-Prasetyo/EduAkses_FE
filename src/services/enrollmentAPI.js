import axiosInstance from './axiosConfig';

const handleResponse = (response) => response.data;
const handleError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'Enrollment API request failed';
  console.error('Enrollment API Error:', errorMessage);
  throw new Error(errorMessage);
};

export const enrollmentAPI = {
  // Enroll in a course
  postEnrollCourse: async (courseId) => {
    try {
      const response = await axiosInstance.post(`/api/users/enroll/${courseId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Get user enrollments by course
  getContentEnrollments: async (courseId) => {
    try {
      const response = await axiosInstance.get(`/api/users/enroll/${courseId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Get user enrollments
  getUserEnrollments: async () => {
    try {
      const response = await axiosInstance.get('/api/users/enroll');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Get course progress
  getCourseProgress: async (courseId) => {
    try {
      const response = await axiosInstance.get(`/enrollments/courses/${courseId}/progress`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Update course progress
  updateProgress: async (courseId, progressData) => {
    try {
      const response = await axiosInstance.put(`/enrollments/courses/${courseId}/progress`, progressData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Complete course
  completeCourse: async (courseId) => {
    try {
      const response = await axiosInstance.put(`/enrollments/courses/${courseId}/complete`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};