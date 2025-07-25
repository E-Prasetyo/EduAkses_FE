import axiosInstance from './axiosConfig';

const handleResponse = (response) => response.data;
const handleError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'Forum API request failed';
  console.error('Forum API Error:', errorMessage);
  throw new Error(errorMessage);
};

export const forumAPI = {
  // Get all forum items
  getAllForumItems: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/forum', { params });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Get forum item by ID
  getForumItemById: async (id) => {
    try {
      const response = await axiosInstance.get(`/forum/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Create new forum item
  createForumItem: async (forumData) => {
    try {
      const response = await axiosInstance.post('/forum', forumData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Update forum item
  updateForumItem: async (id, forumData) => {
    try {
      const response = await axiosInstance.put(`/forum/${id}`, forumData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Delete forum item
  deleteForumItem: async (id) => {
    try {
      const response = await axiosInstance.delete(`/forum/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Add reply to forum item
  addReply: async (forumId, replyData) => {
    try {
      const response = await axiosInstance.post(`/forum/${forumId}/replies`, replyData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Update reply
  updateReply: async (forumId, replyId, replyData) => {
    try {
      const response = await axiosInstance.put(`/forum/${forumId}/replies/${replyId}`, replyData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Delete reply
  deleteReply: async (forumId, replyId) => {
    try {
      const response = await axiosInstance.delete(`/forum/${forumId}/replies/${replyId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Like forum item
  likeForumItem: async (forumId) => {
    try {
      const response = await axiosInstance.post(`/forum/${forumId}/like`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Unlike forum item
  unlikeForumItem: async (forumId) => {
    try {
      const response = await axiosInstance.delete(`/forum/${forumId}/like`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Get forum categories
  getForumCategories: async () => {
    try {
      const response = await axiosInstance.get('/forum/categories');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Search forum items
  searchForumItems: async (query, category, sortBy) => {
    try {
      const params = { query };
      if (category && category !== 'all') params.category = category;
      if (sortBy) params.sortBy = sortBy;
      
      const response = await axiosInstance.get('/forum/search', { params });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Get trending topics
  getTrendingTopics: async (limit = 5) => {
    try {
      const response = await axiosInstance.get('/forum/trending', { params: { limit } });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};