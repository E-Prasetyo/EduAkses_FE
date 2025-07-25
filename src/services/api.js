import axiosInstance from './axiosConfig';

// Helper function to handle API responses
const handleResponse = (response) => response.data;

// Helper function to handle API errors
const handleError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'API request failed';
  console.error('API Error:', errorMessage);
  throw new Error(errorMessage);
};

// Helper function to extract course ID from slug
const extractCourseId = (slug) => {
  if (!slug) return null;
  // Handle different URL formats
  if (slug.includes('react-fundamental')) {
    return '1'; // Temporary hardcoded ID for development
  }
  return slug;
};

export const courseAPI = {
  // Fetch all courses
  getAllCourses: async () => {
    try {
      const response = await axiosInstance.get('/courses');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Fetch course by ID or slug
  getCourse: async (courseId) => {
    if (!courseId) {
      console.error('CourseId is required');
      return null;
    }

    try {
      const response = await axiosInstance.get(`/courses/${courseId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Create new course
  createCourse: async (courseData) => {
    try {
      const response = await axiosInstance.post('/courses', courseData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Update course
  updateCourse: async (id, courseData) => {
    try {
      if (!id) throw new Error('Course ID is required');
      
      const response = await axiosInstance.put(`/courses/${id}`, courseData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Delete course
  deleteCourse: async (id) => {
    try {
      if (!id) throw new Error('Course ID is required');
      
      const response = await axiosInstance.delete(`/courses/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Add quiz to module
  addQuiz: async (courseId, moduleId, quizData) => {
    try {
      if (!courseId || !moduleId) throw new Error('Course ID and Module ID are required');
      
      const response = await axiosInstance.post(`/courses/${courseId}/modules/${moduleId}/quizzes`, quizData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Update quiz
  updateQuiz: async (courseId, moduleId, quizId, quizData) => {
    try {
      const response = await axiosInstance.put(`/courses/${courseId}/modules/${moduleId}/quizzes/${quizId}`, quizData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Delete quiz
  deleteQuiz: async (courseId, moduleId, quizId) => {
    try {
      const response = await axiosInstance.delete(`/courses/${courseId}/modules/${moduleId}/quizzes/${quizId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};
