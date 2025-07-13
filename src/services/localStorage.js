const STORAGE_KEYS = {
  COURSE_DATA: 'eduakses_course_data_',
  DRAFT_DATA: 'eduakses_draft_data_',
};

export const localStorageService = {
  // Save course data to localStorage
  saveCourseData: (courseId, data) => {
    try {
      localStorage.setItem(`course_${courseId}`, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  // Get course data from localStorage
  getCourseData: (courseId) => {
    try {
      const data = localStorage.getItem(`course_${courseId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  // Save draft data
  saveDraft: (courseId, data) => {
    try {
      localStorage.setItem(
        `${STORAGE_KEYS.DRAFT_DATA}${courseId}`,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Error saving draft to localStorage:', error);
    }
  },

  // Get draft data
  getDraft: (courseId) => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.DRAFT_DATA}${courseId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading draft from localStorage:', error);
      return null;
    }
  },

  // Clear draft data
  clearDraft: (courseId) => {
    try {
      localStorage.removeItem(`${STORAGE_KEYS.DRAFT_DATA}${courseId}`);
    } catch (error) {
      console.error('Error clearing draft from localStorage:', error);
    }
  },
};
