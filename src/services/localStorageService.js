const STORAGE_KEYS = {
  // Existing keys
  USERS: "eduakses_users",
  ROLES: "eduakses_roles",
  CATEGORIES: "eduakses_categories",
  COURSES: "eduakses_courses",
  QUIZZES: "eduakses_quizzes",
  TEACHERS: "eduakses_teachers",
  STUDENTS: "eduakses_students",
  COURSE_DATA: "eduakses_course_data_",
  DRAFT_DATA: "eduakses_draft_data_",
  ENROLLMENTS: "eduakses_enrollments",
  PROGRESS: "eduakses_progress",
  NOTIFICATIONS: "eduakses_notifications",
  USER_PREFERENCES: "eduakses_user_preferences",

  // New keys for forum/discussion
  FORUM_ITEMS: "eduakses_forum_items",
  FORUM_REPLIES: "eduakses_forum_replies",
  FORUM_DRAFTS: "eduakses_forum_drafts",
  FORUM_LIKES: "eduakses_forum_likes",
  FORUM_CATEGORIES: "eduakses_forum_categories",
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

  getData: (key, defaultValue = null) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
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

  clearAll: () => {
    try {
      // Clear all eduakses related data
      Object.values(STORAGE_KEYS).forEach((key) => {
        if (typeof key === "string") {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
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
          id: "admin1",
          name: "Admin",
          email: "admin@eduakses.com",
          password: "admin123",
          role: "admin",
          avatar: "https://i.pravatar.cc/80?img=1",
          isActive: true,
          createdAt: new Date().toISOString(),
          joinDate: new Date().toLocaleDateString("id-ID"),
        },
        {
          id: "teacher1",
          name: "Ahmad Santoso",
          email: "ahmad@eduakses.com",
          password: "teacher123",
          role: "teacher",
          specialization: "Matematika",
          avatar: "https://i.pravatar.cc/80?img=2",
          isActive: true,
          createdAt: "2024-01-15T00:00:00.000Z",
          joinDate: "Januari 2024",
          status: "active",
        },
        {
          id: "student1",
          name: "Budi Prakoso",
          email: "budi@eduakses.com",
          password: "student123",
          role: "student",
          avatar: "https://i.pravatar.cc/80?img=3",
          isActive: true,
          createdAt: "2024-01-15T00:00:00.000Z",
          joinDate: "Januari 2024",
          status: "active",
        },
        {
          id: "student2",
          name: "Siti Rahayu",
          email: "siti@eduakses.com",
          password: "student123",
          role: "student",
          avatar: "https://i.pravatar.cc/80?img=4",
          isActive: true,
          createdAt: "2024-02-01T00:00:00.000Z",
          joinDate: "Februari 2024",
          status: "active",
        },
      ];
      localStorageService.saveUsers(defaultUsers);
      return defaultUsers;
    }
    return users;
  },

  getUserById: (userId) => {
    const users = localStorageService.getUsers();
    return users.find((user) => user.id === userId) || null;
  },

  updateUser: (userId, userData) => {
    const users = localStorageService.getUsers();
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        const updatedUser = {
          ...user,
          ...userData,
          updatedAt: new Date().toISOString(),
        };
        console.log("Updating user:", userId, "with data:", userData);
        return updatedUser;
      }
      return user;
    });

    const success = localStorageService.saveUsers(updatedUsers);

    // Update current user session if it's the same user
    const currentUser = localStorageService.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorageService.updateCurrentUser(userData);
    }

    return success;
  },

  // Categories operations
  saveCategories: (categories) => {
    return localStorageService.saveData(STORAGE_KEYS.CATEGORIES, categories);
  },

  getCategories: () => {
    const categories = localStorageService.getData(STORAGE_KEYS.CATEGORIES);
    if (!categories) {
      const defaultCategories = [
        { id: "cat1", name: "Matematika", isActive: true },
        { id: "cat2", name: "Bahasa Inggris", isActive: true },
        { id: "cat3", name: "IPA", isActive: true },
        { id: "cat4", name: "IPS", isActive: true },
        { id: "cat5", name: "Bahasa Indonesia", isActive: true },
        { id: "cat6", name: "Pemrograman", isActive: true },
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
    return localStorageService.getData(STORAGE_KEYS.TEACHERS, []);
  },

  // Students operations
  saveStudents: (students) => {
    return localStorageService.saveData(STORAGE_KEYS.STUDENTS, students);
  },

  getStudents: () => {
    return localStorageService.getData(STORAGE_KEYS.STUDENTS, []);
  },

  // Courses operations
  saveCourses: (courses) => {
    return localStorageService.saveData(STORAGE_KEYS.COURSES, courses);
  },

  getCourses: () => {
    return localStorageService.getData(STORAGE_KEYS.COURSES, []);
  },

  getCourseById: (courseId) => {
    const courses = localStorageService.getCourses();
    console.log("Searching for courseId:", courseId, "Type:", typeof courseId);

    // Try multiple comparison methods
    let course = courses.find((course) => course.id === courseId);

    if (!course && !isNaN(courseId)) {
      course = courses.find((course) => course.id === parseInt(courseId));
    }

    if (!course) {
      course = courses.find((course) => String(course.id) === String(courseId));
    }

    console.log("Found course:", course);
    return course || null;
  },

  // Quizzes operations
  saveQuizzes: (quizzes) => {
    return localStorageService.saveData(STORAGE_KEYS.QUIZZES, quizzes);
  },

  getQuizzes: () => {
    return localStorageService.getData(STORAGE_KEYS.QUIZZES, []);
  },

  // Enrollments operations
  saveEnrollments: (enrollments) => {
    return localStorageService.saveData(STORAGE_KEYS.ENROLLMENTS, enrollments);
  },

  getEnrollments: () => {
    return localStorageService.getData(STORAGE_KEYS.ENROLLMENTS, []);
  },

  // Progress operations
  saveProgress: (progress) => {
    return localStorageService.saveData(STORAGE_KEYS.PROGRESS, progress);
  },

  getProgress: () => {
    return localStorageService.getData(STORAGE_KEYS.PROGRESS, []);
  },

  // Notifications operations
  saveNotifications: (notifications) => {
    return localStorageService.saveData(
      STORAGE_KEYS.NOTIFICATIONS,
      notifications
    );
  },

  getNotifications: () => {
    return localStorageService.getData(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  // User preferences operations
  saveUserPreferences: (userId, preferences) => {
    return localStorageService.saveData(
      `${STORAGE_KEYS.USER_PREFERENCES}_${userId}`,
      preferences
    );
  },

  getUserPreferences: (userId) => {
    return localStorageService.getData(
      `${STORAGE_KEYS.USER_PREFERENCES}_${userId}`,
      {}
    );
  },

  // Individual course operations
  saveCourseData: (courseId, data) => {
    return localStorageService.saveData(
      `${STORAGE_KEYS.COURSE_DATA}${courseId}`,
      data
    );
  },

  getCourseData: (courseId) => {
    return localStorageService.getData(
      `${STORAGE_KEYS.COURSE_DATA}${courseId}`
    );
  },

  // Save draft data
  saveDraft: (courseId, data) => {
    return localStorageService.saveData(
      `${STORAGE_KEYS.DRAFT_DATA}${courseId}`,
      data
    );
  },

  // Get draft data
  getDraft: (courseId) => {
    return localStorageService.getData(`${STORAGE_KEYS.DRAFT_DATA}${courseId}`);
  },

  // Clear draft data
  clearDraft: (courseId) => {
    return localStorageService.removeData(
      `${STORAGE_KEYS.DRAFT_DATA}${courseId}`
    );
  },

  // Get current user data
  getCurrentUser: () => {
    return localStorageService.getData("userData");
  },

  // Update current user data (for session management)
  updateCurrentUser: (userData) => {
    try {
      const currentUser = localStorageService.getCurrentUser();
      if (currentUser && currentUser.id === userData.id) {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      }
      return true;
    } catch (error) {
      console.error("Error updating current user:", error);
      return false;
    }
  },

  // ENROLLMENT: Enroll student ke course
  enrollCourse: (userId, courseId) => {
    const enrollments = localStorageService.getEnrollments();
    if (enrollments.some((e) => e.userId === userId && e.courseId === courseId))
      return false;

    const newEnrollment = {
      id: Date.now().toString(),
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      completed: false,
    };

    localStorageService.saveEnrollments([...enrollments, newEnrollment]);
    return true;
  },

  // Get all enrollments for a user
  getUserEnrollments: (userId) => {
    return localStorageService
      .getEnrollments()
      .filter((e) => e.userId === userId);
  },

  // Update progress for a course
  updateProgress: (
    userId,
    courseId,
    progress,
    completedLessons = [],
    completedQuizzes = []
  ) => {
    const allProgress = localStorageService.getProgress();
    let updated = false;

    const updatedProgress = allProgress.map((p) => {
      if (p.userId === userId && p.courseId === courseId) {
        updated = true;
        return {
          ...p,
          progress,
          completedLessons,
          completedQuizzes,
          updatedAt: new Date().toISOString(),
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    localStorageService.saveProgress(updatedProgress);
  },

  // Get progress for a user & course
  getCourseProgress: (userId, courseId) => {
    const allProgress = localStorageService.getProgress();
    return (
      allProgress.find(
        (p) => p.userId === userId && p.courseId === courseId
      ) || {
        progress: 0,
        completedLessons: [],
        completedQuizzes: [],
      }
    );
  },

  // Mark course as completed
  completeCourse: (userId, courseId) => {
    const enrollments = localStorageService.getEnrollments();
    const updatedEnrollments = enrollments.map((e) =>
      e.userId === userId && e.courseId === courseId
        ? { ...e, completed: true, completedAt: new Date().toISOString() }
        : e
    );
    localStorageService.saveEnrollments(updatedEnrollments);

    const allProgress = localStorageService.getProgress();
    const updatedProgress = allProgress.map((p) =>
      p.userId === userId && p.courseId === courseId
        ? { ...p, progress: 100, completedAt: new Date().toISOString() }
        : p
    );
    localStorageService.saveProgress(updatedProgress);
  },

  // Get quiz for a course/module
  getCourseQuiz: (courseId, moduleId = null) => {
    const course = localStorageService.getCourseById(courseId);
    if (!course || !course.modules) return [];

    if (moduleId) {
      const module = course.modules.find(
        (m) => m.id === Number(moduleId) || m.id === moduleId
      );
      return module && module.quizzes ? module.quizzes : [];
    }

    return course.modules.flatMap((m) => m.quizzes || []);
  },

  // =====================================================
  // FORUM/DISCUSSION OPERATIONS
  // =====================================================

  // Forum Items operations
  saveForumItems: (forumItems) => {
    return localStorageService.saveData(STORAGE_KEYS.FORUM_ITEMS, forumItems);
  },

  getForumItems: () => {
    const items = localStorageService.getData(STORAGE_KEYS.FORUM_ITEMS, []);
    // Ensure each item has proper structure
    return items.map((item) => ({
      ...item,
      balasan: item.balasan || [],
      jumlahBalasan:
        item.jumlahBalasan ||
        localStorageService.getTotalRepliesCount(item.balasan || []),
    }));
  },

  // Get forum item by ID
  getForumItemById: (id) => {
    const items = localStorageService.getForumItems();
    const item = items.find((item) => String(item.id) === String(id));

    if (item) {
      return {
        ...item,
        balasan: item.balasan || [],
        jumlahBalasan: localStorageService.getTotalRepliesCount(
          item.balasan || []
        ),
      };
    }

    return null;
  },

  // Add new forum item
  addForumItem: (newItem) => {
    const items = localStorageService.getForumItems();
    const currentUser = localStorageService.getCurrentUser();

    const itemWithDefaults = {
      id: newItem.id || Date.now(),
      judul: newItem.judul || "Pertanyaan Tanpa Judul",
      detail: newItem.detail || "",
      nama: newItem.nama || currentUser?.name || "User Anonymous",
      avatar:
        newItem.avatar ||
        currentUser?.avatar ||
        `https://i.pravatar.cc/40?random=${Date.now()}`,
      waktu: newItem.waktu || new Date().toISOString(),
      userId: newItem.userId || currentUser?.id || null,
      kategori: newItem.kategori || "umum",
      balasan: [],
      jumlahBalasan: 0,
      views: 0,
      likes: 0,
      isLocked: false,
      isPinned: false,
      tags: newItem.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedItems = [itemWithDefaults, ...items];
    localStorageService.saveForumItems(updatedItems);
    return itemWithDefaults;
  },

  // Update forum item
  updateForumItem: (id, updatedData) => {
    const items = localStorageService.getForumItems();
    const updatedItems = items.map((item) => {
      if (String(item.id) === String(id)) {
        return {
          ...item,
          ...updatedData,
          jumlahBalasan: localStorageService.getTotalRepliesCount(
            updatedData.balasan || item.balasan || []
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    localStorageService.saveForumItems(updatedItems);
    return localStorageService.getForumItemById(id);
  },

  // Delete forum item
  deleteForumItem: (id) => {
    const items = localStorageService.getForumItems();
    const filteredItems = items.filter(
      (item) => String(item.id) !== String(id)
    );
    return localStorageService.saveForumItems(filteredItems);
  },

  // Increment forum views (with session protection)
  incrementForumViews: (id) => {
    try {
      const item = localStorageService.getForumItemById(id);
      if (item) {
        return localStorageService.updateForumItem(id, {
          views: (item.views || 0) + 1,
          lastViewedAt: new Date().toISOString(),
        });
      }
      return false;
    } catch (error) {
      console.error("Error incrementing forum views:", error);
      return false;
    }
  },

  // Forum Categories operations
  saveForumCategories: (categories) => {
    return localStorageService.saveData(
      STORAGE_KEYS.FORUM_CATEGORIES,
      categories
    );
  },

  getForumCategories: () => {
    const categories = localStorageService.getData(
      STORAGE_KEYS.FORUM_CATEGORIES
    );
    if (!categories) {
      const defaultForumCategories = [
        {
          id: "umum",
          name: "Diskusi Umum",
          description: "Diskusi umum seputar pendidikan",
          color: "#007bff",
        },
        {
          id: "matematika",
          name: "Matematika",
          description: "Diskusi seputar matematika",
          color: "#28a745",
        },
        {
          id: "bahasa",
          name: "Bahasa",
          description: "Diskusi seputar bahasa",
          color: "#ffc107",
        },
        {
          id: "ipa",
          name: "IPA",
          description: "Diskusi seputar ilmu pengetahuan alam",
          color: "#dc3545",
        },
        {
          id: "ips",
          name: "IPS",
          description: "Diskusi seputar ilmu pengetahuan sosial",
          color: "#6f42c1",
        },
        {
          id: "teknologi",
          name: "Teknologi",
          description: "Diskusi seputar teknologi dan programming",
          color: "#fd7e14",
        },
        {
          id: "bantuan",
          name: "Bantuan",
          description: "Tanya jawab dan bantuan teknis",
          color: "#20c997",
        },
      ];
      localStorageService.saveForumCategories(defaultForumCategories);
      return defaultForumCategories;
    }
    return categories;
  },

  // Reply drafts operations
  saveReplyDrafts: (drafts) => {
    return localStorageService.saveData(STORAGE_KEYS.FORUM_DRAFTS, drafts);
  },

  getReplyDrafts: () => {
    return localStorageService.getData(STORAGE_KEYS.FORUM_DRAFTS, {});
  },

  setReplyDraft: (replyId, content) => {
    const drafts = localStorageService.getReplyDrafts();
    // Ensure content is always a string
    const stringContent =
      typeof content === "string" ? content : String(content || "");

    drafts[replyId] = {
      content: stringContent,
      savedAt: new Date().toISOString(),
    };
    return localStorageService.saveReplyDrafts(drafts);
  },

  removeReplyDraft: (replyId) => {
    const drafts = localStorageService.getReplyDrafts();
    delete drafts[replyId];
    return localStorageService.saveReplyDrafts(drafts);
  },

  // Calculate total replies count (including nested)
  getTotalRepliesCount: (replies) => {
    if (!Array.isArray(replies)) return 0;

    return replies.reduce((total, reply) => {
      return (
        total +
        1 +
        (reply.replies
          ? localStorageService.getTotalRepliesCount(reply.replies)
          : 0)
      );
    }, 0);
  },

  // Initialize sample forum data if needed
  initializeForumSampleData: () => {
    const existingData = localStorageService.getForumItems();

    if (!existingData || existingData.length === 0) {
      const users = localStorageService.getUsers();
      const sampleData = [
        {
          id: 1,
          avatar: "https://i.pravatar.cc/40?img=1",
          judul: "Bagaimana cara belajar Matematika dengan efektif?",
          detail:
            "Saya siswa kelas 10 dan merasa kesulitan memahami konsep matematika, terutama aljabar. Ada tips atau metode belajar yang efektif? Saya sudah mencoba berbagai cara tapi masih sulit memahami konsep dasarnya.",
          nama: users[2]?.name || "Budi Prakoso",
          userId: users[2]?.id || "student1",
          waktu: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 jam lalu
          kategori: "matematika",
          tags: ["matematika", "aljabar", "belajar", "tips"],
          balasan: [
            {
              id: 101,
              avatar: "https://i.pravatar.cc/40?img=2",
              nama: users[1]?.name || "Ahmad Santoso",
              userId: users[1]?.id || "teacher1",
              isi: "Untuk mempelajari matematika dengan efektif, saya sarankan:\n\n1. Mulai dari konsep dasar dan pastikan benar-benar paham sebelum lanjut\n2. Banyak latihan soal dari yang mudah ke yang sulit\n3. Jangan ragu bertanya ke guru atau teman\n4. Gunakan aplikasi atau video pembelajaran online\n\nUntuk aljabar khususnya, coba pahami dulu konsep variabel dan persamaan sederhana.",
              waktu: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              likes: 5,
              isLiked: false,
              replies: [
                {
                  id: 1011,
                  avatar: "https://i.pravatar.cc/40?img=3",
                  nama: users[3]?.name || "Siti Rahayu",
                  userId: users[3]?.id || "student2",
                  isi: "Terima kasih sarannya Pak Ahmad! Saya juga mengalami hal yang sama. Apakah ada rekomendasi buku atau aplikasi yang bagus untuk belajar aljabar?",
                  waktu: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                  likes: 2,
                  isLiked: true,
                  replies: [],
                },
              ],
            },
          ],
          views: 25,
          likes: 3,
        },
        {
          id: 2,
          avatar: "https://i.pravatar.cc/40?img=4",
          judul: "Diskusi tentang metode pembelajaran online vs offline",
          detail:
            "Dengan perkembangan teknologi, pembelajaran online semakin populer. Menurut kalian, apa kelebihan dan kekurangan masing-masing metode? Share pengalaman kalian yuk!",
          nama: users[3]?.name || "Siti Rahayu",
          userId: users[3]?.id || "student2",
          waktu: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 jam lalu
          kategori: "umum",
          tags: ["pembelajaran", "online", "offline", "teknologi", "diskusi"],
          balasan: [
            {
              id: 201,
              avatar: "https://i.pravatar.cc/40?img=1",
              nama: users[2]?.name || "Budi Prakoso",
              userId: users[2]?.id || "student1",
              isi: "Menurut saya pembelajaran online lebih fleksibel dan bisa diakses kapan saja. Tapi kadang sulit fokus karena banyak distraksi di rumah. Kalau offline lebih interaktif dengan guru dan teman-teman.",
              waktu: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              likes: 3,
              isLiked: false,
              replies: [],
            },
          ],
          views: 18,
          likes: 1,
        },
        {
          id: 3,
          avatar: "https://i.pravatar.cc/40?img=2",
          judul: "Tips mengajar yang menyenangkan untuk siswa",
          detail:
            "Sebagai guru, saya ingin mencari cara-cara baru untuk membuat pembelajaran lebih menarik dan menyenangkan. Ada yang punya tips atau pengalaman?",
          nama: users[1]?.name || "Ahmad Santoso",
          userId: users[1]?.id || "teacher1",
          waktu: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 hari lalu
          kategori: "umum",
          tags: ["mengajar", "tips", "guru", "pembelajaran", "menyenangkan"],
          balasan: [],
          views: 12,
          likes: 2,
        },
      ];

      localStorageService.saveForumItems(sampleData);
      console.log("Sample forum data initialized!");
    }

    // Ensure forum categories exist
    localStorageService.getForumCategories();
  },

  // Get forum statistics
  getForumStatistics: () => {
    const items = localStorageService.getForumItems();
    const totalTopics = items.length;
    const totalReplies = items.reduce(
      (sum, item) => sum + (item.jumlahBalasan || 0),
      0
    );
    const totalViews = items.reduce((sum, item) => sum + (item.views || 0), 0);

    // Get active users (users who posted in last 30 days)
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();
    const activeUsers = new Set();

    items.forEach((item) => {
      if (item.waktu > thirtyDaysAgo && item.userId) {
        activeUsers.add(item.userId);
      }
    });

    return {
      totalTopics,
      totalReplies,
      totalViews,
      activeUsers: activeUsers.size,
      categories: localStorageService.getForumCategories().length,
    };
  },

  // Search forum items
  searchForumItems: (query, category = null, sortBy = "newest") => {
    let items = localStorageService.getForumItems();

    // Filter by search query
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.judul.toLowerCase().includes(searchTerm) ||
          item.detail.toLowerCase().includes(searchTerm) ||
          item.nama.toLowerCase().includes(searchTerm) ||
          (item.tags &&
            item.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
      );
    }

    // Filter by category
    if (category && category !== "all") {
      items = items.filter((item) => item.kategori === category);
    }

    // Sort results
    switch (sortBy) {
      case "newest":
        items.sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
        break;
      case "oldest":
        items.sort((a, b) => new Date(a.waktu) - new Date(b.waktu));
        break;
      case "most_replies":
        items.sort((a, b) => (b.jumlahBalasan || 0) - (a.jumlahBalasan || 0));
        break;
      case "most_views":
        items.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "most_likes":
        items.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      default:
        break;
    }

    return items;
  },

  // Get user's forum activity
  getUserForumActivity: (userId) => {
    const items = localStorageService.getForumItems();

    // Count user's topics
    const userTopics = items.filter((item) => item.userId === userId);

    // Count user's replies (including nested replies)
    let userReplies = 0;
    const countRepliesInItem = (replies) => {
      if (!Array.isArray(replies)) return 0;
      let count = 0;
      replies.forEach((reply) => {
        if (reply.userId === userId) count++;
        if (reply.replies) count += countRepliesInItem(reply.replies);
      });
      return count;
    };

    items.forEach((item) => {
      userReplies += countRepliesInItem(item.balasan || []);
    });

    return {
      totalTopics: userTopics.length,
      totalReplies: userReplies,
      recentTopics: userTopics
        .slice(0, 5)
        .sort((a, b) => new Date(b.waktu) - new Date(a.waktu)),
    };
  },

  // Like/Unlike forum topic
  toggleForumLike: (forumId, userId) => {
    const likes = localStorageService.getData(STORAGE_KEYS.FORUM_LIKES, {});
    const likeKey = `${forumId}_${userId}`;

    if (likes[likeKey]) {
      // Unlike
      delete likes[likeKey];
      localStorageService.saveData(STORAGE_KEYS.FORUM_LIKES, likes);

      // Update forum item
      const item = localStorageService.getForumItemById(forumId);
      if (item) {
        localStorageService.updateForumItem(forumId, {
          likes: Math.max(0, (item.likes || 0) - 1),
        });
      }
      return false;
    } else {
      // Like
      likes[likeKey] = {
        forumId,
        userId,
        likedAt: new Date().toISOString(),
      };
      localStorageService.saveData(STORAGE_KEYS.FORUM_LIKES, likes);

      // Update forum item
      const item = localStorageService.getForumItemById(forumId);
      if (item) {
        localStorageService.updateForumItem(forumId, {
          likes: (item.likes || 0) + 1,
        });
      }
      return true;
    }
  },

  // Check if user liked a forum
  isForumLikedByUser: (forumId, userId) => {
    const likes = localStorageService.getData(STORAGE_KEYS.FORUM_LIKES, {});
    return !!likes[`${forumId}_${userId}`];
  },

  // Get trending topics (most active in last 7 days)
  getTrendingTopics: (limit = 5) => {
    const items = localStorageService.getForumItems();
    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    // Filter recent topics and sort by activity score
    const recentItems = items.filter((item) => item.waktu > sevenDaysAgo);

    // Calculate activity score based on replies, views, and likes
    const itemsWithScore = recentItems.map((item) => ({
      ...item,
      activityScore:
        (item.jumlahBalasan || 0) * 3 +
        (item.views || 0) * 0.1 +
        (item.likes || 0) * 2,
    }));

    return itemsWithScore
      .sort((a, b) => b.activityScore - a.activityScore)
      .slice(0, limit);
  },

  // Get latest forum activities for dashboard
  getLatestForumActivities: (limit = 10) => {
    const items = localStorageService.getForumItems();
    const activities = [];

    // Add topics as activities
    items.forEach((item) => {
      activities.push({
        type: "topic_created",
        id: `topic_${item.id}`,
        forumId: item.id,
        userId: item.userId,
        userName: item.nama,
        title: item.judul,
        timestamp: item.waktu,
        avatar: item.avatar,
      });

      // Add replies as activities
      const addRepliesAsActivities = (replies, topicTitle) => {
        if (!Array.isArray(replies)) return;

        replies.forEach((reply) => {
          activities.push({
            type: "reply_created",
            id: `reply_${reply.id}`,
            forumId: item.id,
            replyId: reply.id,
            userId: reply.userId,
            userName: reply.nama,
            title: `Membalas: ${topicTitle}`,
            content:
              reply.isi.substring(0, 100) +
              (reply.isi.length > 100 ? "..." : ""),
            timestamp: reply.waktu,
            avatar: reply.avatar,
          });

          // Add nested replies
          if (reply.replies) {
            addRepliesAsActivities(reply.replies, topicTitle);
          }
        });
      };

      addRepliesAsActivities(item.balasan || [], item.judul);
    });

    // Sort by timestamp and limit results
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  },

  // Moderate forum (for admin/teacher)
  moderateForumItem: (forumId, action, moderatorId) => {
    const item = localStorageService.getForumItemById(forumId);
    if (!item) return false;

    const updates = {
      moderatedBy: moderatorId,
      moderatedAt: new Date().toISOString(),
    };

    switch (action) {
      case "lock":
        updates.isLocked = true;
        break;
      case "unlock":
        updates.isLocked = false;
        break;
      case "pin":
        updates.isPinned = true;
        break;
      case "unpin":
        updates.isPinned = false;
        break;
      case "feature":
        updates.isFeatured = true;
        break;
      case "unfeature":
        updates.isFeatured = false;
        break;
      default:
        return false;
    }

    return localStorageService.updateForumItem(forumId, updates);
  },

  // Export forum data (for backup)
  exportForumData: () => {
    return {
      forumItems: localStorageService.getForumItems(),
      forumCategories: localStorageService.getForumCategories(),
      forumLikes: localStorageService.getData(STORAGE_KEYS.FORUM_LIKES, {}),
      replyDrafts: localStorageService.getReplyDrafts(),
      exportedAt: new Date().toISOString(),
    };
  },

  // Import forum data (for restore)
  importForumData: (data) => {
    try {
      if (data.forumItems) {
        localStorageService.saveForumItems(data.forumItems);
      }
      if (data.forumCategories) {
        localStorageService.saveForumCategories(data.forumCategories);
      }
      if (data.forumLikes) {
        localStorageService.saveData(STORAGE_KEYS.FORUM_LIKES, data.forumLikes);
      }
      if (data.replyDrafts) {
        localStorageService.saveReplyDrafts(data.replyDrafts);
      }
      return true;
    } catch (error) {
      console.error("Error importing forum data:", error);
      return false;
    }
  },

  // Clean up old drafts (older than 7 days)
  cleanupOldDrafts: () => {
    const drafts = localStorageService.getReplyDrafts();
    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    let cleaned = false;
    Object.keys(drafts).forEach((key) => {
      if (drafts[key].savedAt && drafts[key].savedAt < sevenDaysAgo) {
        delete drafts[key];
        cleaned = true;
      }
    });

    if (cleaned) {
      localStorageService.saveReplyDrafts(drafts);
    }

    return cleaned;
  },

  // Validate forum data integrity
  validateForumData: () => {
    const issues = [];
    const items = localStorageService.getForumItems();

    items.forEach((item, index) => {
      // Check required fields
      if (!item.id) issues.push(`Item ${index}: Missing ID`);
      if (!item.judul) issues.push(`Item ${item.id}: Missing title`);
      if (!item.nama) issues.push(`Item ${item.id}: Missing author name`);
      if (!item.waktu) issues.push(`Item ${item.id}: Missing timestamp`);

      // Check data types
      if (item.balasan && !Array.isArray(item.balasan)) {
        issues.push(`Item ${item.id}: Invalid replies format`);
      }

      // Validate replies structure
      const validateReplies = (replies, path = "") => {
        if (!Array.isArray(replies)) return;

        replies.forEach((reply, idx) => {
          const replyPath = `${path}/reply[${idx}]`;
          if (!reply.id)
            issues.push(`Item ${item.id}${replyPath}: Missing reply ID`);
          if (!reply.nama)
            issues.push(`Item ${item.id}${replyPath}: Missing reply author`);
          if (!reply.isi)
            issues.push(`Item ${item.id}${replyPath}: Missing reply content`);

          if (reply.replies) {
            validateReplies(reply.replies, replyPath);
          }
        });
      };

      validateReplies(item.balasan || []);
    });

    return {
      isValid: issues.length === 0,
      issues,
    };
  },

  // Initialize all sample data
  initializeAllSampleData: () => {
    // Initialize users first
    localStorageService.getUsers();

    // Initialize categories
    localStorageService.getCategories();

    // Initialize forum data
    localStorageService.initializeForumSampleData();

    console.log("All sample data initialized successfully!");
  },
};

// Export statement
export { STORAGE_KEYS };
export default localStorageService;
