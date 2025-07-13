// Use the current origin for development
const API_BASE_URL = window.location.origin;

// Helper function to get headers
const getHeaders = () => {
  const token = localStorage.getItem('token'); // Assuming you store JWT in localStorage
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/json',
  };
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

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'API request failed');
  }
  return response.json();
};

export const courseAPI = {
  // Fetch course by ID or slug
  getCourse: async (courseId) => {
    if (!courseId) {
      console.error('CourseId is required');
      return null;
    }

    try {
      // For development, return mock data
      return {
        id: courseId,
        title: "React Fundamental",
        description: "Belajar dasar-dasar React",
        category: "Teknologi",
        coverImage: null,
        level: "Pemula",
        duration: "8 jam",
        price: "free",
        customPrice: "",
        status: "DRAFT",
        modules: [
          {
            id: 1,
            title: "Pengenalan React",
            description: "Memahami dasar React",
            lessons: [],
            quizzes: []
          }
        ]
      };

      // Uncomment below when backend is ready
      /*
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${courseId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
      */
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // Update course
  updateCourse: async (id, courseData) => {
    try {
      if (!id) throw new Error('Course ID is required');
      
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(courseData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating course:', error);
      return { error: error.message };
    }
  },

  // Add quiz to module
  addQuiz: async (courseId, moduleId, quizData) => {
    try {
      if (!courseId || !moduleId) throw new Error('Course ID and Module ID are required');
      
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules/${moduleId}/quizzes`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(quizData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding quiz:', error);
      return { error: error.message };
    }
  },

  // Update quiz
  updateQuiz: async (courseId, moduleId, quizId, quizData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules/${moduleId}/quizzes/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });
      if (!response.ok) throw new Error('Failed to update quiz');
      return await response.json();
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  // Delete quiz
  deleteQuiz: async (courseId, moduleId, quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules/${moduleId}/quizzes/${quizId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete quiz');
      return true;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  }
};
