const STORAGE_KEYS = {
  USERS: 'eduakses_users',
  ROLES: 'eduakses_roles',
  CATEGORIES: 'eduakses_categories',
  COURSES: 'eduakses_courses',
  QUIZZES: 'eduakses_quizzes',
  TEACHERS: 'eduakses_teachers',
  STUDENTS: 'eduakses_students',
  COURSE_DATA: 'eduakses_course_data_',
  DRAFT_DATA: 'eduakses_draft_data_',
  ENROLLMENTS: 'eduakses_enrollments',
  PROGRESS: 'eduakses_progress',
  NOTIFICATIONS: 'eduakses_notifications',
  USER_PREFERENCES: 'eduakses_user_preferences'
};

export const localStorageService = {
  // Generic CRUD operations
  saveData: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      return false;
    }
  },

  getData: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },

  removeData: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },

  // Users operations
  saveUsers: (users) => {
    return localStorageService.saveData(STORAGE_KEYS.USERS, users);
  },

  getUsers: () => {
    const users = localStorageService.getData(STORAGE_KEYS.USERS);
    if (!users) {
      // Initialize with default users if none exist
      const defaultUsers = [
        {
          id: 'admin1',
          name: 'Admin',
          email: 'admin@eduakses.com',
          password: 'admin123',
          role: 'admin',
          avatar: null,
          isActive: true
        },
        {
          id: 'teacher1',
          name: 'Ahmad Santoso',
          email: 'ahmad@eduakses.com',
          password: 'teacher123',
          role: 'teacher',
          specialization: 'Matematika',
          avatar: null,
          isActive: true,
          createdAt: '2024-01-15T00:00:00.000Z',
          joinDate: 'Januari 2024',
          status: 'active'
        },
        {
          id: 'student1',
          name: 'Budi Prakoso',
          email: 'budi@eduakses.com',
          password: 'student123',
          role: 'student',
          avatar: null,
          isActive: true,
          createdAt: '2024-01-15T00:00:00.000Z',
          joinDate: 'Januari 2024',
          status: 'active'
        }
      ];
      localStorageService.saveUsers(defaultUsers);
      return defaultUsers;
    }
    return users;
  },

  updateUser: (userId, userData) => {
    const users = localStorageService.getUsers();
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        // Gabungkan data user lama dengan data baru
        const updatedUser = { ...user, ...userData };
        console.log('Updating user:', userId, 'with data:', userData);
        console.log('Updated user:', updatedUser);
        return updatedUser;
      }
      return user;
    });
    
    const success = localStorageService.saveUsers(updatedUsers);
    console.log('Save users result:', success);
    return success;
  },

  // Categories operations
  saveCategories: (categories) => {
    return localStorageService.saveData(STORAGE_KEYS.CATEGORIES, categories);
  },

  getCategories: () => {
    const categories = localStorageService.getData(STORAGE_KEYS.CATEGORIES);
    if (!categories) {
      // Initialize with default categories if none exist
      const defaultCategories = [
        { id: 'cat1', name: 'Matematika', isActive: true },
        { id: 'cat2', name: 'Bahasa Inggris', isActive: true },
        { id: 'cat3', name: 'IPA', isActive: true },
        { id: 'cat4', name: 'IPS', isActive: true }
      ];
      localStorageService.saveCategories(defaultCategories);
      return defaultCategories;
    }
    return categories;
  },

  // Teachers operations
  saveTeachers: (teachers) => {
    return localStorageService.saveData(STORAGE_KEYS.TEACHERS, teachers);
  },

  getTeachers: () => {
    return localStorageService.getData(STORAGE_KEYS.TEACHERS) || [];
  },

  // Students operations
  saveStudents: (students) => {
    return localStorageService.saveData(STORAGE_KEYS.STUDENTS, students);
  },

  getStudents: () => {
    return localStorageService.getData(STORAGE_KEYS.STUDENTS) || [];
  },

  // Courses operations
  saveCourses: (courses) => {
    return localStorageService.saveData(STORAGE_KEYS.COURSES, courses);
  },

  getCourses: () => {
    const courses = localStorageService.getData(STORAGE_KEYS.COURSES);
    if (!courses || courses.length === 0) {
      // Jangan inisialisasi defaultCourses lagi
      return [];
    }
    return courses;
  },
  
  getCourseById: (courseId) => {
    const courses = localStorageService.getCourses();
    console.log("Searching for courseId:", courseId, "Type:", typeof courseId);
    console.log("Available courses:", courses.map(c => ({ id: c.id, type: typeof c.id, title: c.title })));
    
    // Try to find by string comparison first
    let course = courses.find(course => course.id === courseId);
    
    // If not found, try converting courseId to number
    if (!course && !isNaN(courseId)) {
      course = courses.find(course => course.id === parseInt(courseId));
    }
    
    // If still not found, try string comparison with course.id as string
    if (!course) {
      course = courses.find(course => String(course.id) === String(courseId));
    }
    
    console.log("Found course:", course);
    return course || null;
  },

  // Quizzes operations
  saveQuizzes: (quizzes) => {
    return localStorageService.saveData(STORAGE_KEYS.QUIZZES, quizzes);
  },

  getQuizzes: () => {
    return localStorageService.getData(STORAGE_KEYS.QUIZZES) || [];
  },

  // Enrollments operations
  saveEnrollments: (enrollments) => {
    return localStorageService.saveData(STORAGE_KEYS.ENROLLMENTS, enrollments);
  },

  getEnrollments: () => {
    return localStorageService.getData(STORAGE_KEYS.ENROLLMENTS) || [];
  },

  // Progress operations
  saveProgress: (progress) => {
    return localStorageService.saveData(STORAGE_KEYS.PROGRESS, progress);
  },

  getProgress: () => {
    return localStorageService.getData(STORAGE_KEYS.PROGRESS) || [];
  },

  // Notifications operations
  saveNotifications: (notifications) => {
    return localStorageService.saveData(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  getNotifications: () => {
    return localStorageService.getData(STORAGE_KEYS.NOTIFICATIONS) || [];
  },

  // User preferences operations
  saveUserPreferences: (userId, preferences) => {
    return localStorageService.saveData(`${STORAGE_KEYS.USER_PREFERENCES}_${userId}`, preferences);
  },

  getUserPreferences: (userId) => {
    return localStorageService.getData(`${STORAGE_KEYS.USER_PREFERENCES}_${userId}`) || {};
  },

  // Individual course operations
  saveCourseData: (courseId, data) => {
    try {
      localStorage.setItem(`${STORAGE_KEYS.COURSE_DATA}${courseId}`, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  getCourseData: (courseId) => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.COURSE_DATA}${courseId}`);
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
  
  // Get current user data
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user data:', error);
      return null;
    }
  },
  
  // Update current user data (for session management)
  updateCurrentUser: (userData) => {
    try {
      // Update current user data if it's the logged-in user
      const currentUser = localStorageService.getCurrentUser();
      if (currentUser && currentUser.id === userData.id) {
        localStorage.setItem("userData", JSON.stringify({
          ...currentUser,
          ...userData
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Error updating current user:', error);
      return false;
    }
  },

  // ENROLLMENT: Enroll student ke course
  enrollCourse: (userId, courseId) => {
    const enrollments = localStorageService.getEnrollments();
    if (enrollments.some(e => e.userId === userId && e.courseId === courseId)) return false;
    const newEnrollment = {
      id: Date.now().toString(),
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      completed: false
    };
    localStorageService.saveEnrollments([...enrollments, newEnrollment]);
    return true;
  },

  // Get all enrollments for a user
  getUserEnrollments: (userId) => {
    return (localStorageService.getEnrollments() || []).filter(e => e.userId === userId);
  },

  // Update progress for a course
  updateProgress: (userId, courseId, progress, completedLessons, completedQuizzes = []) => {
    const allProgress = localStorageService.getProgress() || [];
    let updated = false;
    const updatedProgress = allProgress.map(p => {
      if (p.userId === userId && p.courseId === courseId) {
        updated = true;
        return { 
          ...p, 
          progress, 
          completedLessons, 
          completedQuizzes,
          updatedAt: new Date().toISOString() 
        };
      }
      return p;
    });
    if (!updated) {
      updatedProgress.push({ 
        userId, 
        courseId, 
        progress, 
        completedLessons, 
        completedQuizzes,
        updatedAt: new Date().toISOString() 
      });
    }
    localStorageService.saveProgress(updatedProgress);
  },

  // Get progress for a user & course
  getCourseProgress: (userId, courseId) => {
    const allProgress = localStorageService.getProgress() || [];
    return allProgress.find(p => p.userId === userId && p.courseId === courseId) || { 
      progress: 0, 
      completedLessons: [],
      completedQuizzes: []
    };
  },

  // Mark course as completed
  completeCourse: (userId, courseId) => {
    // Mark enrollment as completed
    const enrollments = localStorageService.getEnrollments();
    const updatedEnrollments = enrollments.map(e =>
      e.userId === userId && e.courseId === courseId ? { ...e, completed: true, completedAt: new Date().toISOString() } : e
    );
    localStorageService.saveEnrollments(updatedEnrollments);
    // Mark progress as 100%
    const allProgress = localStorageService.getProgress() || [];
    const updatedProgress = allProgress.map(p =>
      p.userId === userId && p.courseId === courseId ? { ...p, progress: 100 } : p
    );
    localStorageService.saveProgress(updatedProgress);
  },

  // Get quiz for a course/module
  getCourseQuiz: (courseId, moduleId) => {
    const course = localStorageService.getCourseById(courseId);
    if (!course || !course.modules) return [];
    if (moduleId) {
      const module = course.modules.find(m => m.id === Number(moduleId) || m.id === moduleId);
      return module && module.quizzes ? module.quizzes : [];
    }
    // Return all quizzes in all modules
    return course.modules.flatMap(m => m.quizzes || []);
  }
};