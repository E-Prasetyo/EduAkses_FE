import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
import DetailForum from "./pages/DetailForum";

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
import EditCourse from "./pages/EditCourse";

// Error Pages
import NotFound from "./pages/NotFound";

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
            <Route path="/kursus/:id/belajar" element={<Learning />} />

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
                <ProtectedRoute>
                  <Learning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kuis/:quizId"
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
            <Route
              path="/forum/:id"
              element={
                <ProtectedRoute>
                  <DetailForum />
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
                <ProtectedRoute>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengajar/kursus/:courseId/modul/:moduleId/quiz/create"
              element={
                <ProtectedRoute>
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
  </React.StrictMode>
);
