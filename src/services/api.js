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
  getAllCourses: async (query = "") => {
    try {
      const response = await axiosInstance.get(`/api/contents${query}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Fetch all courses TOP
  getAllCoursesTOP: async () => {
    try {
      const response = await axiosInstance.get(`/api/contents/top`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Fetch all courses Pending
  getAllCoursesPending: async () => {
    try {
      const response = await axiosInstance.get(`/api/contents/pending`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

   // Fetch all courses Publish
  getAllCoursesPublish: async () => {
    try {
      const response = await axiosInstance.get(`/api/contents/publish`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

   // Fetch all courses Reject
  getAllCoursesReject: async () => {
    try {
      const response = await axiosInstance.get(`/api/contents/reject `);
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
      const response = await axiosInstance.get(`/api/contents/${courseId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Fetch course by ID or slug
  getCourseDetail: async (courseId) => {
    if (!courseId) {
      console.error('CourseId is required');
      return null;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/api/contents/${courseId}/materials`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  },

  approveCourse: async (courseId) => {
    try {
      const response = await axiosInstance.put(`/api/contents/${courseId}/publish`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  rejectCourse: async (courseId, remark) => {
    try {
      const response = await axiosInstance.put(`/api/contents/${courseId}/reject`, {
        remark: remark
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};
