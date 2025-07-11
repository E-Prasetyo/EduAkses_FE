import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const [pendingCourses, setPendingCourses] = useState([
    {
      id: 1,
      title: "Machine Learning untuk Pemula",
      instructor: "Dr. Ahmad Santoso",
      instructorEmail: "ahmad@email.com",
      category: "Programming",
      submittedDate: "2024-01-15",
      description:
        "Kursus pembelajaran mesin comprehensive untuk pemula dengan contoh praktis",
      duration: "40 jam",
      modules: 8,
      lessons: 32,
      status: "PENDING_REVIEW",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 2,
      title: "Digital Marketing Strategy",
      instructor: "Siti Nurhaliza",
      instructorEmail: "siti@email.com",
      category: "Marketing",
      submittedDate: "2024-01-14",
      description: "Strategi pemasaran digital terkini untuk bisnis modern",
      duration: "25 jam",
      modules: 6,
      lessons: 24,
      status: "PENDING_REVIEW",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: "Budi Raharjo",
      instructorEmail: "budi@email.com",
      category: "Design",
      submittedDate: "2024-01-13",
      description: "Dasar-dasar desain UI/UX dengan tools industry standard",
      duration: "35 jam",
      modules: 7,
      lessons: 28,
      status: "PENDING_REVIEW",
      thumbnail: "/api/placeholder/300/200",
    },
  ]);

  const [approvedCourses, setApprovedCourses] = useState([
    {
      id: 4,
      title: "React untuk Pemula",
      instructor: "Ahmad Rizki",
      category: "Programming",
      approvedDate: "2024-01-10",
      students: 156,
      rating: 4.8,
      status: "PUBLISHED",
    },
    {
      id: 5,
      title: "Python Fundamentals",
      instructor: "Lisa Wong",
      category: "Programming",
      approvedDate: "2024-01-08",
      students: 203,
      rating: 4.6,
      status: "PUBLISHED",
    },
  ]);

  const [rejectedCourses, setRejectedCourses] = useState([
    {
      id: 6,
      title: "Basic HTML Course",
      instructor: "John Doe",
      category: "Programming",
      rejectedDate: "2024-01-12",
      reason: "Konten tidak memenuhi standar kualitas minimum",
      status: "REJECTED",
    },
  ]);

  const handleCourseAction = (courseId, action, reason = "") => {
    const course = pendingCourses.find((c) => c.id === courseId);
    if (!course) return;

    if (action === "PUBLISHED") {
      setApprovedCourses((prev) => [
        ...prev,
        {
          ...course,
          approvedDate: new Date().toISOString().split("T")[0],
          students: 0,
          rating: 0,
          status: "PUBLISHED",
        },
      ]);
    } else if (action === "REJECTED") {
      setRejectedCourses((prev) => [
        ...prev,
        {
          ...course,
          rejectedDate: new Date().toISOString().split("T")[0],
          reason: reason || "Tidak memenuhi standar kualitas",
          status: "REJECTED",
        },
      ]);
    }

    setPendingCourses((courses) => courses.filter((c) => c.id !== courseId));
  };

  const handleApprove = (courseId) => {
    if (window.confirm("Apakah Anda yakin ingin menyetujui kursus ini?")) {
      handleCourseAction(courseId, "PUBLISHED");
    }
  };

  const handleReject = (courseId) => {
    const reason = prompt("Masukkan alasan penolakan:");
    if (reason) {
      handleCourseAction(courseId, "REJECTED", reason);
    }
  };

  const totalPending = pendingCourses.length;
  const totalPublished = approvedCourses.length;
  const totalRejected = rejectedCourses.length;
  const totalStudents = approvedCourses.reduce(
    (sum, course) => sum + course.students,
    0,
  );

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-primary py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-6 fw-bold text-white mb-3">
                Admin Dashboard
              </h1>
              <p className="lead text-white-50 mb-4">
                Kelola kursus, verifikasi konten, dan pantau aktivitas platform
              </p>
              <div className="d-flex gap-3">
                <Link to="/admin/categories" className="btn btn-light btn-lg">
                  <i className="fas fa-tags me-2"></i>
                  Kelola Kategori
                </Link>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <div className="row g-2">
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1 text-white">
                      {totalPending}
                    </h3>
                    <small className="text-white-50">Pending Review</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1 text-white">
                      {totalPublished}
                    </h3>
                    <small className="text-white-50">Published</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1 text-white">
                      {totalStudents}
                    </h3>
                    <small className="text-white-50">Total Students</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1 text-white">
                      {totalRejected}
                    </h3>
                    <small className="text-white-50">Rejected</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Navigation Tabs */}
          <ul className="nav nav-tabs nav-fill mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                <i className="fas fa-clock me-2"></i>
                Pending Review ({totalPending})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "published" ? "active" : ""}`}
                onClick={() => setActiveTab("published")}
              >
                <i className="fas fa-check-circle me-2"></i>
                Published ({totalPublished})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "rejected" ? "active" : ""}`}
                onClick={() => setActiveTab("rejected")}
              >
                <i className="fas fa-times-circle me-2"></i>
                Rejected ({totalRejected})
              </button>
            </li>
          </ul>

          {/* Pending Courses Tab */}
          {activeTab === "pending" && (
            <div className="tab-content">
              {pendingCourses.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-clipboard-check fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">
                    Tidak ada kursus yang menunggu review
                  </h5>
                  <p className="text-muted">Semua kursus telah diproses</p>
                </div>
              ) : (
                <div className="row g-4">
                  {pendingCourses.map((course) => (
                    <div key={course.id} className="col-lg-6">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="row g-0 h-100">
                          <div className="col-md-4">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="img-fluid rounded-start h-100"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <div className="col-md-8">
                            <div className="card-body d-flex flex-column h-100">
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h6 className="card-title fw-bold mb-1">
                                    {course.title}
                                  </h6>
                                  <span className="badge bg-warning">
                                    Pending
                                  </span>
                                </div>
                                <p className="text-muted small mb-2">
                                  oleh <strong>{course.instructor}</strong>
                                </p>
                                <p className="card-text small text-muted mb-2">
                                  {course.description}
                                </p>
                                <div className="row g-2 mb-3">
                                  <div className="col-6">
                                    <small className="text-muted d-block">
                                      Kategori
                                    </small>
                                    <span className="badge bg-primary">
                                      {course.category}
                                    </span>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">
                                      Durasi
                                    </small>
                                    <small className="fw-medium">
                                      {course.duration}
                                    </small>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">
                                      Modul
                                    </small>
                                    <small className="fw-medium">
                                      {course.modules} modul
                                    </small>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">
                                      Pelajaran
                                    </small>
                                    <small className="fw-medium">
                                      {course.lessons} pelajaran
                                    </small>
                                  </div>
                                </div>
                                <small className="text-muted">
                                  Diajukan:{" "}
                                  {new Date(
                                    course.submittedDate,
                                  ).toLocaleDateString("id-ID")}
                                </small>
                              </div>
                              <div className="d-flex gap-2 mt-3">
                                <button
                                  onClick={() => handleApprove(course.id)}
                                  className="btn btn-success btn-sm flex-fill"
                                >
                                  <i className="fas fa-check me-1"></i>
                                  Setujui
                                </button>
                                <button
                                  onClick={() => handleReject(course.id)}
                                  className="btn btn-danger btn-sm flex-fill"
                                >
                                  <i className="fas fa-times me-1"></i>
                                  Tolak
                                </button>
                                <Link
                                  to={`/kursus/${course.id}`}
                                  className="btn btn-outline-primary btn-sm"
                                >
                                  <i className="fas fa-eye"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Published Courses Tab */}
          {activeTab === "published" && (
            <div className="tab-content">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Kursus</th>
                          <th>Instruktur</th>
                          <th>Kategori</th>
                          <th className="text-center">Students</th>
                          <th className="text-center">Rating</th>
                          <th>Tanggal Disetujui</th>
                          <th className="text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedCourses.map((course) => (
                          <tr key={course.id}>
                            <td>
                              <div className="fw-bold">{course.title}</div>
                            </td>
                            <td>
                              <small className="text-muted">
                                {course.instructor}
                              </small>
                            </td>
                            <td>
                              <span className="badge bg-primary">
                                {course.category}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-success">
                                {course.students}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-warning">
                                <i className="fas fa-star me-1"></i>
                                {course.rating || "N/A"}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">
                                {new Date(
                                  course.approvedDate,
                                ).toLocaleDateString("id-ID")}
                              </small>
                            </td>
                            <td className="text-center">
                              <Link
                                to={`/kursus/${course.id}`}
                                className="btn btn-outline-primary btn-sm"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rejected Courses Tab */}
          {activeTab === "rejected" && (
            <div className="tab-content">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Kursus</th>
                          <th>Instruktur</th>
                          <th>Alasan Penolakan</th>
                          <th>Tanggal Ditolak</th>
                          <th className="text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rejectedCourses.map((course) => (
                          <tr key={course.id}>
                            <td>
                              <div className="fw-bold">{course.title}</div>
                            </td>
                            <td>
                              <small className="text-muted">
                                {course.instructor}
                              </small>
                            </td>
                            <td>
                              <small className="text-danger">
                                {course.reason}
                              </small>
                            </td>
                            <td>
                              <small className="text-muted">
                                {new Date(
                                  course.rejectedDate,
                                ).toLocaleDateString("id-ID")}
                              </small>
                            </td>
                            <td className="text-center">
                              <button className="btn btn-outline-success btn-sm me-2">
                                <i className="fas fa-redo me-1"></i>
                                Review Ulang
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
