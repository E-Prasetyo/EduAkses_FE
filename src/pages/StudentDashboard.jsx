import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { localStorageService } from "../services/localStorageService";
import { useAuth } from "../contexts/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (!user) return;
    // Load all data from localStorage
    const allCourses = localStorageService.getCourses() || [];
    const enrollments = localStorageService.getUserEnrollments(user.id) || [];
    const allProgress = localStorageService.getProgress() || [];
    // Get enrolled courses with details
    const studentCourses = enrollments.map(enrollment => {
      const course = allCourses.find(c => c.id === enrollment.courseId);
      if (!course) return null; // skip if course not found
      const courseProgress = allProgress.find(p => p.userId === user.id && p.courseId === course.id) || { progress: 0, completedLessons: [] };
      return {
        ...course,
        progress: courseProgress.progress,
        completedLessons: courseProgress.completedLessons,
        totalLessons: course.modules ? course.modules.reduce((acc, m) => acc + (m.lessons || m.content || []).length, 0) : 0,
        lastAccessed: enrollment.lastAccessedAt || enrollment.enrolledAt,
        completed: enrollment.completed
      };
    }).filter(Boolean); // filter out null
    setEnrolledCourses(studentCourses);
    setCourses(allCourses);
    setProgress(allProgress);
  }, [user]);

  // Function to save progress data
  const saveProgressData = (newProgress) => {
    localStorageService.saveProgress(newProgress);
  };

  // Function to save activity data
  const saveActivityData = (newActivity) => {
    const notifications = localStorageService.getNotifications() || [];
    localStorageService.saveNotifications([...notifications, newActivity]);
  };

  // Update course progress
  const updateCourseProgress = (courseId, newProgress, completedLessons) => {
    // Update progress in localStorage
    const allProgress = localStorageService.getProgress() || [];
    const updatedProgress = allProgress.map(p =>
      p.studentId === user.id && p.courseId === courseId
        ? { ...p, progress: newProgress, completedLessons }
        : p
    );

    if (!updatedProgress.some(p => p.studentId === user.id && p.courseId === courseId)) {
      updatedProgress.push({
        studentId: user.id,
        courseId,
        progress: newProgress,
        completedLessons,
        updatedAt: new Date().toISOString()
      });
    }

    // Update local state
    const updatedCourses = enrolledCourses.map(course =>
      course.id === courseId
        ? { ...course, progress: newProgress, completedLessons }
        : course
    );

    setEnrolledCourses(updatedCourses);
    saveProgressData(updatedProgress);
  };

  // Add new activity
  const addActivity = (type, courseId, details = {}) => {
    const activity = {
      id: Date.now(),
      userId: user.id,
      courseId,
      type,
      ...details,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    const updatedActivities = [activity, ...recentActivity];
    setRecentActivity(updatedActivities);
    saveActivityData(activity);
  };

  const totalProgress =
    enrolledCourses.reduce((acc, course) => acc + course.progress, 0) /
    enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(
    (course) => course.progress === 100,
  ).length;
  const inProgressCourses = enrolledCourses.filter(
    (course) => course.progress > 0 && course.progress < 100,
  ).length;

  const getActivityIcon = (type) => {
    switch (type) {
      case "lesson_completed":
        return "✅";
      case "quiz_completed":
        return "📝";
      case "course_completed":
        return "🎓";
      case "forum_post":
        return "💬";
      default:
        return "📚";
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">

      {/* Hero Section */}
      <section className="bg-gradient-primary py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-6 fw-bold text-white mb-3">
                Selamat Datang Kembali, {user?.name || 'Student'}! 👋
              </h1>
              <p className="lead text-white-50 mb-4">
                Lanjutkan perjalanan belajar Anda dan capai tujuan yang telah
                ditetapkan
              </p>
              <div className="d-flex gap-3">
                <Link to="/kursus" className="btn btn-light btn-lg">
                  <i className="fas fa-search me-2"></i>
                  Jelajahi Kursus
                </Link>
                <Link to="/profil" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-user me-2"></i>
                  Kelola Profil
                </Link>
              </div>
            </div>
            <div
              className="col-lg-4 text-center hide-statistics"
              style={{ display: "none" }}
            >
              <div className="row g-2">
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1 text-white">
                      {enrolledCourses.length}
                    </h3>
                    <small className="text-white-50">Kursus Diikuti</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1 text-white">
                      {completedCourses}
                    </h3>
                    <small className="text-white-50">Kursus Selesai</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1 text-white">
                      {Math.round(totalProgress)}%
                    </h3>
                    <small className="text-white-50">Progress Rata-rata</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1 text-white">
                      {inProgressCourses}
                    </h3>
                    <small className="text-white-50">Sedang Berjalan</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow-1 py-5">
        <div className="container">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Continue Learning Section */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="h4 fw-bold mb-0">Lanjutkan Belajar</h2>
                <Link to="/kursus" className="btn btn-outline-primary btn-sm">
                  Lihat Semua Kursus
                </Link>
              </div>

              <div className="row g-4 mb-5">
                {enrolledCourses
                  .filter(
                    (course) => course.progress > 0 && course.progress < 100,
                  )
                  .map((course) => (
                    <div key={course.id} className="col-md-6 mb-4">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="position-relative">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="card-img-top"
                            style={{ height: "160px", objectFit: "cover" }}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge bg-primary">
                              {course.category}
                            </span>
                          </div>
                        </div>
                        <div className="card-body">
                          <h5 className="card-title fw-bold">{course.title}</h5>
                          <p className="text-muted small mb-2">
                            oleh {course.instructor}
                          </p>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between small text-muted mb-1">
                              <span>Progress</span>
                              <span>
                                {course.completedLessons}/{course.totalLessons}{" "}
                                pelajaran
                              </span>
                            </div>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar bg-edu-primary"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <small className="text-muted">
                              {course.progress}% selesai
                            </small>
                          </div>

                          {course.nextLesson && (
                            <div className="mb-3">
                              <small className="text-muted d-block">
                                Pelajaran Selanjutnya:
                              </small>
                              <strong className="small">
                                {course.nextLesson}
                              </strong>
                            </div>
                          )}

                          <small className="text-muted d-block mb-3">
                            Terakhir diakses: {course.lastAccessed}
                          </small>

                          <Link
                            to={course.completed ? `/kursus/${course.id}` : `/belajar/${course.id}`}
                            className={`btn ${course.completed ? 'btn-outline-success' : 'btn-edu-primary'} w-100`}
                          >
                            {course.completed ? 'Lihat Course' : 'Lanjut Belajar'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Completed Courses */}
              {completedCourses > 0 && (
                <>
                  <h3 className="h5 fw-bold mb-3">
                    Kursus yang Telah Diselesaikan
                  </h3>
                  <div className="row g-3 mb-4">
                    {enrolledCourses
                      .filter((course) => course.progress === 100)
                      .map((course) => (
                        <div key={course.id} className="col-md-6">
                          <div className="card border-0 shadow-sm">
                            <div className="card-body">
                              <div className="d-flex align-items-start">
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="rounded me-3"
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "cover",
                                  }}
                                  onError={e => { e.target.style.display = 'none'; }}
                                />
                                <div className="flex-grow-1">
                                  <h6 className="fw-bold mb-1">
                                    {course.title}
                                  </h6>
                                  <small className="text-muted d-block">
                                    oleh {course.instructor}
                                  </small>
                                  <div className="d-flex align-items-center mt-2">
                                    <span className="badge bg-success me-2">
                                      <i className="fas fa-check me-1"></i>
                                      Selesai
                                    </span>
                                    <Link
                                      to={`/kursus/${course.id}`}
                                      className="btn btn-outline-primary btn-sm"
                                    >
                                      Belajar Lagi
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Quick Actions */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">Aksi Cepat</h5>
                  <div className="d-grid gap-2">
                    <Link to="/kursus" className="btn btn-outline-primary">
                      <i className="fas fa-search me-2"></i>
                      Cari Kursus Baru
                    </Link>
                    <Link to="/diskusi" className="btn btn-outline-secondary">
                      <i className="fas fa-comments me-2"></i>
                      Forum Diskusi
                    </Link>
                    <Link to="/profil" className="btn btn-outline-info">
                      <i className="fas fa-user-edit me-2"></i>
                      Edit Profil
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Activity - HIDDEN */}
              <div
                className="card border-0 shadow-sm hide-recent-activity"
                style={{ display: "none" }}
              >
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">Aktivitas Terbaru</h5>
                  <div className="list-group list-group-flush">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="list-group-item border-0 px-0"
                      >
                        <div className="d-flex align-items-start">
                          <span className="me-2" style={{ fontSize: "1.2em" }}>
                            {getActivityIcon(activity.type)}
                          </span>
                          <div className="flex-grow-1">
                            <div className="small">
                              {activity.type === "lesson_completed" && (
                                <>
                                  Menyelesaikan pelajaran{" "}
                                  <strong>{activity.lessonName}</strong> di{" "}
                                  {activity.courseName}
                                </>
                              )}
                              {activity.type === "quiz_completed" && (
                                <>
                                  Menyelesaikan {activity.lessonName} dengan
                                  skor <strong>{activity.score}</strong> di{" "}
                                  {activity.courseName}
                                </>
                              )}
                              {activity.type === "course_completed" && (
                                <>
                                  Menyelesaikan kursus{" "}
                                  <strong>{activity.courseName}</strong>
                                </>
                              )}
                              {activity.type === "forum_post" && (
                                <>
                                  Berpartisipasi dalam {activity.lessonName} di{" "}
                                  {activity.courseName}
                                </>
                              )}
                            </div>
                            <small className="text-muted">
                              {activity.timestamp}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default StudentDashboard;
