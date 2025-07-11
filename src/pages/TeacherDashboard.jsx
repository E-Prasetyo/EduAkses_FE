import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [myCourses] = useState([
    {
      id: "javascript-pemula",
      title: "JavaScript untuk Pemula",
      status: "PUBLISHED",
      students: 1250,
      rating: 4.8,
      reviews: 156,
      revenue: 2850000,
      price: "free",
      lastUpdated: "2024-01-15",
      thumbnail:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&h=120&fit=crop",
      completion: 78,
      views: 3456,
    },
    {
      id: "react-fundamental",
      title: "React JS Fundamental",
      status: "PUBLISHED",
      students: 890,
      rating: 4.9,
      reviews: 124,
      revenue: 4200000,
      price: "paid",
      lastUpdated: "2024-01-12",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=120&fit=crop",
      completion: 85,
      views: 2890,
    },
    {
      id: "python-data-science",
      title: "Python untuk Data Science",
      status: "PENDING_REVIEW",
      students: 0,
      rating: 0,
      reviews: 0,
      revenue: 0,
      price: "paid",
      lastUpdated: "2024-01-20",
      thumbnail:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=200&h=120&fit=crop",
      completion: 0,
      views: 145,
    },
    {
      id: "ui-ux-design",
      title: "UI/UX Design Fundamentals",
      status: "DRAFT",
      students: 0,
      rating: 0,
      reviews: 0,
      revenue: 0,
      price: "paid",
      lastUpdated: "2024-01-18",
      thumbnail:
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=200&h=120&fit=crop",
      completion: 0,
      views: 89,
    },
    {
      id: "nodejs-backend",
      title: "Node.js Backend Development",
      status: "REJECTED",
      students: 0,
      rating: 0,
      reviews: 0,
      revenue: 0,
      price: "paid",
      lastUpdated: "2024-01-10",
      thumbnail:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=120&fit=crop",
      completion: 0,
      views: 234,
    },
  ]);

  const [notifications] = useState([
    {
      id: 1,
      type: "review",
      message: "Kursus 'Python Data Science' sedang direview admin",
      time: "2 jam yang lalu",
      read: false,
    },
    {
      id: 2,
      type: "rating",
      message: "Review baru (5 bintang) untuk 'JavaScript Pemula'",
      time: "5 jam yang lalu",
      read: false,
    },
    {
      id: 3,
      type: "student",
      message: "15 siswa baru mendaftar hari ini",
      time: "1 hari yang lalu",
      read: true,
    },
    {
      id: 4,
      type: "rejected",
      message: "Kursus 'Node.js Backend' ditolak. Silakan perbaiki",
      time: "2 hari yang lalu",
      read: false,
    },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-success";
      case "PENDING_REVIEW":
        return "bg-warning";
      case "DRAFT":
        return "bg-secondary";
      case "REJECTED":
        return "bg-danger";
      default:
        return "bg-light";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "Diterbitkan";
      case "PENDING_REVIEW":
        return "Review";
      case "DRAFT":
        return "Draft";
      case "REJECTED":
        return "Ditolak";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "✅";
      case "PENDING_REVIEW":
        return "⏱️";
      case "DRAFT":
        return "📝";
      case "REJECTED":
        return "❌";
      default:
        return "📄";
    }
  };

  // Calculate statistics
  const totalStudents = myCourses.reduce(
    (sum, course) => sum + course.students,
    0,
  );
  const publishedCourses = myCourses.filter(
    (course) => course.status === "PUBLISHED",
  ).length;
  const totalRevenue = myCourses.reduce(
    (sum, course) => sum + course.revenue,
    0,
  );
  const avgRating =
    myCourses
      .filter((course) => course.rating > 0)
      .reduce((sum, course) => sum + course.rating, 0) /
    myCourses.filter((course) => course.rating > 0).length;

  const totalViews = myCourses.reduce((sum, course) => sum + course.views, 0);

  return (
    <div className="d-flex flex-column min-h-screen bg-light">
      <Header />

      {/* Hero Section */}
      <section className="hero-gradient text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 font-exo fw-bold mb-3">
                Dashboard Pengajar
              </h1>
              <p className="lead font-jost mb-4">
                Selamat datang kembali! Kelola kursus dan pantau progress siswa
                Anda dengan mudah.
              </p>
              <div className="d-flex gap-3">
                <Link
                  to="/kursus/buat"
                  className="btn btn-light btn-lg font-jost fw-medium"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="me-2"
                  >
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  Buat Kursus Baru
                </Link>
                <Link
                  to="/pengajar/analytics"
                  className="btn btn-outline-light btn-lg font-jost fw-medium"
                >
                  📊 Lihat Analytics
                </Link>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <div className="row g-2">
                <div className="col-6">
                  <small>Total Kursus</small>
                  <div
                    className="bg-white bg-opacity-20 rounded"
                    style={{ padding: "16px 16px 20px" }}
                  >
                    <span style={{ color: "rgb(0, 0, 0)" }}>
                      {myCourses.length}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1">
                      <span style={{ color: "rgb(0, 0, 0)" }}>
                        {totalStudents}
                      </span>
                    </h3>
                    <small>
                      <span style={{ color: "rgb(0, 0, 0)" }}>Total Siswa</span>
                    </small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1">
                      <span style={{ color: "rgb(0, 0, 0)" }}>
                        {avgRating ? avgRating.toFixed(1) : "0.0"}
                      </span>
                    </h3>
                    <small>
                      <span style={{ color: "rgb(0, 0, 0)" }}>Rating Avg</span>
                    </small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1">
                      <span style={{ color: "rgb(0, 0, 0)" }}>
                        Rp {(totalRevenue / 1000000).toFixed(1)}M
                      </span>
                    </h3>
                    <small>
                      <span style={{ color: "rgb(0, 0, 0)" }}>
                        Total Revenue
                      </span>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-edu-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h3 className="h2 font-exo fw-bold text-edu-primary mb-2">
                    {myCourses.length}
                  </h3>
                  <p className="text-muted font-jost mb-0">Total Kursus</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-edu-green rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h2c.83 0 1.5.67 1.5 1.5V18h2v2H4v-2z" />
                    </svg>
                  </div>
                  <h3 className="h2 font-exo fw-bold text-edu-green mb-2">
                    {totalStudents}
                  </h3>
                  <p className="text-muted font-jost mb-0">Total Siswa</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 16 16"
                      fill="white"
                    >
                      <path d="M8 1L10.09 5.26L15 6L11.5 9.74L12.18 15L8 12.77L3.82 15L4.5 9.74L1 6L5.91 5.26L8 1Z" />
                    </svg>
                  </div>
                  <h3 className="h2 font-exo fw-bold text-warning mb-2">
                    {avgRating ? avgRating.toFixed(1) : "0.0"}
                  </h3>
                  <p className="text-muted font-jost mb-0">Rating Rata-rata</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <h3 className="h2 font-exo fw-bold text-info mb-2">
                    {totalViews}
                  </h3>
                  <p className="text-muted font-jost mb-0">Total Views</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom-0">
              <ul className="nav nav-pills" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                    onClick={() => setActiveTab("overview")}
                    type="button"
                  >
                    📊 Overview
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "courses" ? "active" : ""}`}
                    onClick={() => setActiveTab("courses")}
                    type="button"
                  >
                    📚 Kursus Saya
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "analytics" ? "active" : ""}`}
                    onClick={() => setActiveTab("analytics")}
                    type="button"
                  >
                    📈 Analytics
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "notifications" ? "active" : ""}`}
                    onClick={() => setActiveTab("notifications")}
                    type="button"
                  >
                    🔔 Notifikasi{" "}
                    <span className="badge bg-danger ms-1">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="card-title mb-0 font-exo fw-semibold">
                        Kursus Terbaru
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        {myCourses.slice(0, 3).map((course) => (
                          <div key={course.id} className="col-12">
                            <div className="d-flex align-items-center p-3 bg-light rounded">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="rounded me-3"
                                width="80"
                                height="60"
                                style={{ objectFit: "cover" }}
                              />
                              <div className="flex-grow-1">
                                <h6 className="mb-1 font-exo fw-semibold">
                                  {course.title}
                                </h6>
                                <div className="d-flex align-items-center gap-3 text-muted small">
                                  <span>
                                    {getStatusIcon(course.status)}{" "}
                                    {getStatusText(course.status)}
                                  </span>
                                  <span>👥 {course.students} siswa</span>
                                  {course.rating > 0 && (
                                    <span>⭐ {course.rating}</span>
                                  )}
                                </div>
                              </div>
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                >
                                  Aksi
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`/kursus/${course.id}/kelola`}
                                    >
                                      ✏️ Edit
                                    </Link>
                                  </li>
                                  {course.status === "PUBLISHED" && (
                                    <li>
                                      <Link
                                        className="dropdown-item"
                                        to={`/kursus/${course.id}`}
                                      >
                                        👁️ Lihat
                                      </Link>
                                    </li>
                                  )}
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`/pengajar/kursus/${course.id}/analytics`}
                                    >
                                      📊 Analytics
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="row g-4">
                    {/* Quick Actions */}
                    <div className="col-12">
                      <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white">
                          <h5 className="card-title mb-0 font-exo fw-semibold">
                            Aksi Cepat
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="d-grid gap-2">
                            <Link
                              to="/kursus/buat"
                              className="btn btn-edu-primary text-start"
                            >
                              ➕ Buat Kursus Baru
                            </Link>
                            <Link
                              to="/profil"
                              className="btn btn-outline-secondary text-start"
                            >
                              👤 Edit Profil
                            </Link>
                            <Link
                              to="/pengajar/bantuan"
                              className="btn btn-outline-secondary text-start"
                            >
                              ❓ Panduan Pengajar
                            </Link>
                            <Link
                              to="/pengajar/settings"
                              className="btn btn-outline-secondary text-start"
                            >
                              ⚙️ Pengaturan
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="col-12">
                      <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white">
                          <h5 className="card-title mb-0 font-exo fw-semibold">
                            Aktivitas Terbaru
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="timeline">
                            <div className="timeline-item mb-3">
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <div
                                    className="bg-success rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: "32px", height: "32px" }}
                                  >
                                    <span className="text-white small">👥</span>
                                  </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <p className="mb-1 small">
                                    <strong>25 siswa baru</strong> mendaftar
                                    kursus JavaScript
                                  </p>
                                  <p className="text-muted small mb-0">
                                    2 jam yang lalu
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="timeline-item mb-3">
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <div
                                    className="bg-warning rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: "32px", height: "32px" }}
                                  >
                                    <span className="text-white small">⭐</span>
                                  </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <p className="mb-1 small">
                                    <strong>Review baru (5 bintang)</strong>{" "}
                                    untuk React JS
                                  </p>
                                  <p className="text-muted small mb-0">
                                    5 jam yang lalu
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="timeline-item">
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <div
                                    className="bg-info rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: "32px", height: "32px" }}
                                  >
                                    <span className="text-white small">📊</span>
                                  </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <p className="mb-1 small">
                                    <strong>Report bulanan</strong> tersedia
                                    untuk download
                                  </p>
                                  <p className="text-muted small mb-0">
                                    1 hari yang lalu
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === "courses" && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 font-exo fw-semibold">
                    Semua Kursus Saya
                  </h5>
                  <Link
                    to="/kursus/buat"
                    className="btn btn-edu-primary btn-sm"
                  >
                    + Buat Baru
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Kursus</th>
                          <th>Status</th>
                          <th>Siswa</th>
                          <th>Rating</th>
                          <th>Views</th>
                          <th>Revenue</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myCourses.map((course) => (
                          <tr key={course.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="rounded me-3"
                                  width="60"
                                  height="40"
                                  style={{ objectFit: "cover" }}
                                />
                                <div>
                                  <h6 className="mb-0 font-exo fw-semibold">
                                    {course.title}
                                  </h6>
                                  <small className="text-muted">
                                    Update: {course.lastUpdated}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span
                                className={`badge ${getStatusBadge(course.status)} font-jost`}
                              >
                                {getStatusText(course.status)}
                              </span>
                            </td>
                            <td>
                              <span className="fw-medium">
                                {course.students}
                              </span>
                            </td>
                            <td>
                              {course.rating > 0 ? (
                                <div className="d-flex align-items-center">
                                  <span className="me-1">⭐</span>
                                  <span className="fw-medium">
                                    {course.rating}
                                  </span>
                                  <small className="text-muted ms-1">
                                    ({course.reviews})
                                  </small>
                                </div>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <span className="text-muted">{course.views}</span>
                            </td>
                            <td>
                              {course.revenue > 0 ? (
                                <span className="text-success fw-medium">
                                  Rp {course.revenue.toLocaleString("id-ID")}
                                </span>
                              ) : (
                                <span className="text-muted">
                                  {course.price === "free" ? "Gratis" : "-"}
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                >
                                  Aksi
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`/kursus/${course.id}/kelola`}
                                    >
                                      ✏️ Edit
                                    </Link>
                                  </li>
                                  {course.status === "PUBLISHED" && (
                                    <>
                                      <li>
                                        <Link
                                          className="dropdown-item"
                                          to={`/kursus/${course.id}`}
                                        >
                                          👁️ Lihat
                                        </Link>
                                      </li>
                                      <li>
                                        <Link
                                          className="dropdown-item"
                                          to={`/pengajar/kursus/${course.id}/analytics`}
                                        >
                                          📊 Analytics
                                        </Link>
                                      </li>
                                    </>
                                  )}
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li>
                                    <button className="dropdown-item text-danger">
                                      🗑️ Hapus
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="card-title mb-0 font-exo fw-semibold">
                        Performance Overview
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="text-center p-4 bg-light rounded">
                            <h3 className="text-primary">85%</h3>
                            <p className="mb-0">Completion Rate</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="text-center p-4 bg-light rounded">
                            <h3 className="text-success">4.8/5</h3>
                            <p className="mb-0">Average Rating</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="text-center p-4 bg-light rounded">
                            <h3 className="text-info">12,450</h3>
                            <p className="mb-0">Total Enrollments</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="text-center p-4 bg-light rounded">
                            <h3 className="text-warning">Rp 7.2M</h3>
                            <p className="mb-0">Total Revenue</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="card-title mb-0 font-exo fw-semibold">
                        Top Performing
                      </h5>
                    </div>
                    <div className="card-body">
                      {myCourses
                        .filter((course) => course.students > 0)
                        .sort((a, b) => b.students - a.students)
                        .slice(0, 3)
                        .map((course, index) => (
                          <div
                            key={course.id}
                            className="d-flex align-items-center mb-3"
                          >
                            <div className="me-3">
                              <span
                                className={`badge ${index === 0 ? "bg-warning" : index === 1 ? "bg-secondary" : "bg-light text-dark"} rounded-pill`}
                              >
                                #{index + 1}
                              </span>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0 small">{course.title}</h6>
                              <small className="text-muted">
                                {course.students} siswa
                              </small>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 font-exo fw-semibold">
                    Notifikasi
                  </h5>
                  <button className="btn btn-sm btn-outline-secondary">
                    Tandai Semua Dibaca
                  </button>
                </div>
                <div className="card-body p-0">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`d-flex align-items-start p-4 border-bottom ${!notification.read ? "bg-light" : ""}`}
                    >
                      <div className="me-3">
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center ${
                            notification.type === "review"
                              ? "bg-warning"
                              : notification.type === "rating"
                                ? "bg-success"
                                : notification.type === "student"
                                  ? "bg-info"
                                  : "bg-danger"
                          }`}
                          style={{ width: "40px", height: "40px" }}
                        >
                          <span className="text-white">
                            {notification.type === "review"
                              ? "📝"
                              : notification.type === "rating"
                                ? "⭐"
                                : notification.type === "student"
                                  ? "👥"
                                  : "❌"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1">{notification.message}</p>
                        <small className="text-muted">
                          {notification.time}
                        </small>
                      </div>
                      {!notification.read && (
                        <div className="ms-2">
                          <span
                            className="bg-primary rounded-circle d-inline-block"
                            style={{ width: "8px", height: "8px" }}
                          ></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeacherDashboard;
