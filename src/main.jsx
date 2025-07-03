import "./global.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Kursus from "./pages/Kursus";
import Diskusi from "./pages/Diskusi";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetail from "./pages/CourseDetail";
import Learning from "./pages/Learning";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import CreateCourse from "./pages/CreateCourse";
import ManageCourse from "./pages/ManageCourse";
import CreateQuiz from "./pages/CreateQuiz";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CategoryManagement from "./pages/CategoryManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/kursus" element={<Kursus />} />
        <Route path="/kursus/:id" element={<CourseDetail />} />
        <Route path="/kursus/:id/belajar" element={<Learning />} />
        <Route path="/kursus/:id/kuis/:quizId" element={<Quiz />} />
        <Route path="/kursus/buat" element={<CreateCourse />} />
        <Route path="/kursus/:id/kelola" element={<ManageCourse />} />
        <Route
          path="/kursus/:courseId/kuis/buat/:moduleId"
          element={<CreateQuiz />}
        />
        <Route path="/diskusi" element={<Diskusi />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/pelajar/dashboard" element={<StudentDashboard />} />
        <Route path="/pengajar/dashboard" element={<TeacherDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<CategoryManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")).render(<App />);
