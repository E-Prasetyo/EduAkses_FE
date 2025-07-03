import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([
    {
      id: 1,
      title: "React untuk Pemula",
      instructor: "Ahmad Rizki",
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      category: "Programming",
      thumbnail: "/api/placeholder/300/200",
      nextLesson: "Component State Management",
      lastAccessed: "2 hari yang lalu",
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      instructor: "Sarah Wijaya",
      progress: 45,
      totalLessons: 16,
      completedLessons: 7,
      category: "Design",
      thumbnail: "/api/placeholder/300/200",
      nextLesson: "User Research Methods",
      lastAccessed: "1 minggu yang lalu",
    },
    {
      id: 3,
      title: "Digital Marketing Strategy",
      instructor: "Budi Santoso",
      progress: 100,
      totalLessons: 10,
      completedLessons: 10,
      category: "Marketing",
      thumbnail: "/api/placeholder/300/200",
      nextLesson: null,
      lastAccessed: "3 hari yang lalu",
    },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    {
      type: "lesson_completed",
      courseName: "React untuk Pemula",
      lessonName: "useState Hook",
      timestamp: "2 jam yang lalu",
    },
    {
      type: "quiz_completed",
      courseName: "UI/UX Design Fundamentals",
      lessonName: "Design Principles Quiz",
      score: 85,
      timestamp: "1 hari yang lalu",
    },
    {
      type: "course_completed",
      courseName: "Digital Marketing Strategy",
      timestamp: "3 hari yang lalu",
    },
    {
      type: "forum_post",
      courseName: "React untuk Pemula",
      lessonName: "Diskusi tentang Hooks",
      timestamp: "5 hari yang lalu",
    },
  ]);

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
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-primary py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-6 fw-bold text-white mb-3">
                Selamat Datang Kembali, Randi! 👋
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
            <div className="col-lg-4 text-center">
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
                    <div key={course.id} className="col-md-6">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="position-relative">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="card-img-top"
                            style={{ height: "160px", objectFit: "cover" }}
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
                            to={`/kursus/${course.id}/belajar`}
                            className="btn btn-edu-primary w-100"
                          >
                            Lanjut Belajar
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
                                      Beri Rating
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

              {/* Recent Activity */}
              <div className="card border-0 shadow-sm">
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

      <Footer />
    </div>
  );
};

export default StudentDashboard;
