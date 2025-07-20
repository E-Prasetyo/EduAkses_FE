import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { localStorageService } from './services/localStorageService';

// Import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import Global CSS
import "./styles.css";

// Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Public Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Kursus from "./pages/Kursus";
import CourseDetail from "./pages/CourseDetail";

// Protected Pages
import Profile from "./pages/Profile";
import Learning from "./pages/Learning";
import Quiz from "./pages/Quiz";
import Diskusi from "./pages/Diskusi";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard";

// Teacher Pages
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateCourse from "./pages/CreateCourse";
import ManageCourse from "./pages/ManageCourse";
import CreateQuiz from "./pages/CreateQuiz";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import CategoryManagement from "./pages/CategoryManagement";
import TeacherManagement from "./pages/TeacherManagement";
import EditCourse from "./pages/EditCourse";

// Error Pages
import NotFound from "./pages/NotFound";

// MIGRASI DATA COURSE GAMBAR BLOB KE BASE64/DEFAULT
(function migrateCourseImages() {
  try {
    const courses = JSON.parse(localStorage.getItem('eduakses_courses')) || [];
    let changed = false;
    const migrated = courses.map(course => {
      let updated = { ...course };
      if (updated.thumbnail && typeof updated.thumbnail === 'string' && updated.thumbnail.startsWith('blob:')) {
        updated.thumbnail = '';
        changed = true;
      }
      if (updated.coverImage && typeof updated.coverImage === 'string' && updated.coverImage.startsWith('blob:')) {
        updated.coverImage = '';
        changed = true;
      }
      return updated;
    });
    if (changed) {
      localStorage.setItem('eduakses_courses', JSON.stringify(migrated));
    }
  } catch (e) { /* ignore */ }
})();

// Migration script untuk memperbaiki data course
const migrateCourseData = () => {
  try {
    // Uncomment baris di bawah ini untuk membersihkan localStorage dan membuat ulang data
    // localStorage.removeItem('eduakses_courses');
    // localStorage.removeItem('eduakses_users');
    
    const courses = localStorageService.getCourses();
    const users = localStorageService.getUsers();
    
    if (!courses || courses.length === 0) {
      // Komentari/hapus inisialisasi sampleCourse
      // localStorageService.saveCourses([sampleCourse]);
      // console.log('Sample course created with valid video URL');
      return;
    }

    let hasChanges = false;
    const updatedCourses = courses.map(course => {
      if (!course.modules) return course;

      const updatedModules = course.modules.map(module => {
        if (!module.lessons) return module;

        const updatedLessons = module.lessons.map(lesson => {
          let updatedLesson = { ...lesson };

          // Pastikan field yang diperlukan ada
          if (!updatedLesson.textContent) {
            updatedLesson.textContent = lesson.content || '';
          }
          if (!updatedLesson.videoUrl) {
            updatedLesson.videoUrl = lesson.videoUrl || '';
          }
          if (!updatedLesson.type) {
            updatedLesson.type = lesson.videoUrl ? 'video' : 'text';
          }

          // Jika ada perubahan, tandai
          if (JSON.stringify(updatedLesson) !== JSON.stringify(lesson)) {
            hasChanges = true;
          }

          return updatedLesson;
        });

        return { ...module, lessons: updatedLessons };
      });

      // Perbaiki teacherId jika tidak ada atau tidak sesuai
      let updatedCourse = { ...course, modules: updatedModules };
      
      // Hanya perbaiki jika course tidak memiliki teacherId atau instructor
      if (!updatedCourse.teacherId) {
        // Coba cari user berdasarkan instructor name
        const matchingUser = users.find(u => u.name === updatedCourse.instructor && u.role === 'teacher');
        if (matchingUser) {
          updatedCourse.teacherId = matchingUser.id;
          hasChanges = true;
        } else if (updatedCourse.instructor === 'Ahmad Santoso') {
          // Fallback untuk course lama
          updatedCourse.teacherId = 'teacher1';
          hasChanges = true;
        }
      }
      
      if (!updatedCourse.instructor && updatedCourse.teacherId) {
        // Coba cari instructor berdasarkan teacherId
        const matchingUser = users.find(u => u.id === updatedCourse.teacherId);
        if (matchingUser) {
          updatedCourse.instructor = matchingUser.name;
          hasChanges = true;
        }
      }

      return updatedCourse;
    });

    if (hasChanges) {
      localStorageService.saveCourses(updatedCourses);
      console.log('Course data migrated successfully');
    }
  } catch (error) {
    console.error('Error migrating course data:', error);
  }
};

// Jalankan migration saat aplikasi dimuat
migrateCourseData();

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/kursus" element={<Kursus />} />
            <Route path="/pengajar/kursus/:id" element={<CourseDetail />} />
            <Route path="/kursus/:id" element={<CourseDetail />} />
            {/* Removed duplicate Learning route as it should be protected */}

            {/* Protected Routes - All Authenticated Users */}
            <Route
              path="/profil"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/belajar/:courseId"
              element={
                <ProtectedRoute allowedRoles={["student", "teacher"]}>
                  <Learning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kuis/:courseId/:quizId"
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diskusi"
              element={
                <ProtectedRoute>
                  <Diskusi />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/pelajar/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Teacher Routes */}
            <Route
              path="/pengajar/dashboard"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kursus/buat"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <CreateCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengajar/kursus/:id/edit"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <EditCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kursus/kelola"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <ManageCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kuis/buat"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengajar/kursus/:courseId/quiz/create"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengajar/kursus/:courseId/modul/:moduleId/quiz/create"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengajar/kursus/:courseId/modul/:moduleId/quiz/:quizId/edit"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/kategori"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CategoryManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pengajar"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <TeacherManagement />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
