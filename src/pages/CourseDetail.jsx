import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const CourseDetail = () => {
  const { id } = useParams();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock course data - in real app this would come from API
  const course = {
    id: id,
    title: "JavaScript untuk Pemula",
    instructor: {
      name: "Ahmad Fulan",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      bio: "Full-stack developer dengan 8+ tahun pengalaman. Spesialis JavaScript, React, dan Node.js. Telah mengajar lebih dari 10,000 siswa di seluruh dunia.",
      rating: 4.9,
      courses: 12,
      students: 15420,
      experience: "8+ tahun",
      company: "Tech Innovators Inc.",
    },
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
    category: "Teknologi",
    duration: "8 Jam",
    students: 1256,
    rating: 4.8,
    reviews: 324,
    price: "free",
    originalPrice: 299000,
    level: "Pemula",
    language: "Bahasa Indonesia",
    lastUpdated: "Januari 2024",
    description: `Kursus komprehensif untuk mempelajari JavaScript dari dasar hingga mahir. Anda akan memahami konsep fundamental programming, manipulasi DOM, asynchronous programming, dan cara membangun aplikasi web interaktif. Kursus ini dirancang khusus untuk pemula dengan pendekatan step-by-step yang mudah dipahami.`,
    whatYouLearn: [
      "Menguasai sintaks dan konsep dasar JavaScript",
      "Memahami manipulasi DOM dan event handling",
      "Menguasai asynchronous programming (Promises, async/await)",
      "Mampu menggunakan JavaScript untuk interaksi web",
      "Memahami ES6+ features dan modern JavaScript",
      "Dapat membuat aplikasi web sederhana dengan JavaScript",
      "Memahami debugging dan best practices",
      "Siap untuk mempelajari framework seperti React atau Vue",
    ],
    modules: [
      {
        id: 1,
        title: "Pengenalan JavaScript",
        duration: "2 jam",
        lessons: 8,
        description:
          "Memahami dasar-dasar JavaScript dan persiapan environment",
        content: [
          "Apa itu JavaScript?",
          "Setup Development Environment",
          "Console dan Developer Tools",
          "Hello World pertama",
        ],
        isCompleted: false,
        videoPreview: "dQw4w9WgXcQ",
      },
      {
        id: 2,
        title: "Variabel dan Tipe Data",
        duration: "2 jam",
        lessons: 6,
        description:
          "Mempelajari cara deklarasi variabel dan berbagai tipe data",
        content: [
          "Var, Let, dan Const",
          "String, Number, Boolean",
          "Array dan Object",
          "Type Conversion",
        ],
        isCompleted: false,
      },
      {
        id: 3,
        title: "Control Flow dan Functions",
        duration: "2 jam",
        lessons: 7,
        description: "Memahami conditional statements, loops, dan functions",
        content: [
          "If/Else Statements",
          "Switch Case",
          "For dan While Loops",
          "Function Declaration vs Expression",
          "Arrow Functions",
        ],
        isCompleted: false,
      },
      {
        id: 4,
        title: "DOM Manipulation",
        duration: "2 jam",
        lessons: 5,
        description: "Belajar memanipulasi elemen HTML dengan JavaScript",
        content: [
          "Selecting Elements",
          "Modifying Content",
          "Event Listeners",
          "Form Handling",
        ],
        isCompleted: false,
      },
    ],
    requirements: [
      "Tidak memerlukan pengalaman programming sebelumnya",
      "Komputer atau laptop dengan browser modern",
      "Koneksi internet yang stabil",
      "Text editor (VS Code direkomendasikan)",
      "Motivasi tinggi untuk belajar",
    ],
    features: [
      "8+ jam video pembelajaran",
      "50+ latihan praktis",
      "Akses seumur hidup",
      "Sertifikat penyelesaian",
      "Forum diskusi eksklusif",
      "Download materi pembelajaran",
      "Update konten gratis",
      "Akses mobile dan desktop",
    ],
    reviews: [
      {
        id: 1,
        name: "Sari Indah",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
        rating: 5,
        date: "2 minggu lalu",
        comment:
          "Kursus yang sangat bagus! Penjelasan mudah dipahami dan step-by-step. Sekarang saya sudah bisa bikin website sederhana. Terima kasih!",
      },
      {
        id: 2,
        name: "Budi Pratama",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
        rating: 5,
        date: "1 bulan lalu",
        comment:
          "Kursus terbaik untuk belajar JavaScript! Instruktur menjelaskan dengan sangat detail dan ada banyak contoh praktis.",
      },
      {
        id: 3,
        name: "Maya Sari",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
        rating: 4,
        date: "1 bulan lalu",
        comment:
          "Materi sangat lengkap dan terstruktur. Cocok banget untuk pemula seperti saya. Highly recommended!",
      },
    ],
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    // Show success message
    alert("Selamat! Anda berhasil mendaftar kursus. Mulai belajar sekarang!");
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill={index < rating ? "#FFD700" : "#E5E5E5"}
      >
        <path d="M8 1L10.09 5.26L15 6L11.5 9.74L12.18 15L8 12.77L3.82 15L4.5 9.74L1 6L5.91 5.26L8 1Z" />
      </svg>
    ));
  };

  return (
    <div className="d-flex flex-column min-h-screen bg-light">
      <Header />

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="bg-white py-3 border-bottom">
        <div className="container">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-edu-primary">
                Beranda
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link
                to="/kursus"
                className="text-decoration-none text-edu-primary"
              >
                Kursus
              </Link>
            </li>
            <li className="breadcrumb-item active">{course.title}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="mb-3">
                <span className="badge bg-warning text-dark px-3 py-2">
                  {course.category}
                </span>
                <span className="badge bg-success ms-2 px-3 py-2">
                  {course.level}
                </span>
              </div>

              <h1 className="display-4 font-exo fw-bold mb-4">
                {course.title}
              </h1>

              <p className="lead font-jost mb-4">{course.description}</p>

              <div className="d-flex align-items-center gap-4 mb-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="rounded-circle"
                  width="50"
                  height="50"
                />
                <div>
                  <p className="mb-0 font-jost fw-medium">
                    oleh {course.instructor.name}
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    {/* <div className="d-flex">
                      {renderStars(Math.floor(course.instructor.rating))}
                    </div> */}
                    <small className="text-light">
                      {/* {course.instructor.rating} •{" "} */}
                      {course.instructor.students.toLocaleString()} siswa
                    </small>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-auto">
                  <div className="d-flex align-items-center text-light">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="me-2"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span>{course.duration} konten video</span>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="d-flex align-items-center text-light">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="me-2"
                    >
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h2c.83 0 1.5.67 1.5 1.5V18h2v2H4v-2z" />
                    </svg>
                    <span>{course.students.toLocaleString()} siswa</span>
                  </div>
                </div>
                {/* <div className="col-auto">
                  <div className="d-flex align-items-center text-light">
                    <div className="d-flex me-2">
                      {renderStars(Math.floor(course.rating))}
                    </div>
                    <span>
                      {course.rating} ({course.reviews.length} ulasan)
                    </span>
                  </div>
                </div> */}
              </div>

              <div className="d-flex align-items-center gap-4">
                {course.price === "free" ? (
                  <div>
                    <span className="h2 text-success fw-bold mb-0">GRATIS</span>
                    <br />
                    <small className="text-decoration-line-through text-light">
                      Rp {course.originalPrice.toLocaleString("id-ID")}
                    </small>
                  </div>
                ) : (
                  <span className="h2 text-warning fw-bold">
                    Rp {course.originalPrice.toLocaleString("id-ID")}
                  </span>
                )}

                <div>
                  {!isEnrolled ? (
                    <button
                      onClick={handleEnroll}
                      className="btn btn-light btn-lg font-jost fw-medium px-5"
                    >
                      🚀 Daftar Sekarang
                    </button>
                  ) : (
                    <Link
                      to={`/kursus/${id}/belajar`}
                      className="btn btn-success btn-lg font-jost fw-medium px-5"
                    >
                      📚 Mulai Belajar
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="position-relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="img-fluid rounded-3 shadow-lg"
                />
                <div className="position-absolute top-50 start-50 translate-middle">
                  <button
                    className="btn btn-light rounded-circle p-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <div className="position-absolute bottom-0 start-0 m-3">
                  <div className="bg-dark bg-opacity-75 text-white px-3 py-2 rounded">
                    <small>👁️ Preview Gratis</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow-1 py-5">
        <div className="container">
          <div className="row g-5">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Navigation Tabs */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-bottom-0">
                  <ul className="nav nav-pills" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                        onClick={() => setActiveTab("overview")}
                        type="button"
                      >
                        📖 Overview
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "curriculum" ? "active" : ""}`}
                        onClick={() => setActiveTab("curriculum")}
                        type="button"
                      >
                        📚 Kurikulum
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "instructor" ? "active" : ""}`}
                        onClick={() => setActiveTab("instructor")}
                        type="button"
                      >
                        👨‍🏫 Instruktur
                      </button>
                    </li>
                    {/* <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
                        onClick={() => setActiveTab("reviews")}
                        type="button"
                      >
                        ⭐ Ulasan
                      </button>
                    </li> */}
                  </ul>
                </div>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white">
                          <h5 className="card-title mb-0 font-exo fw-semibold">
                            Yang Akan Anda Pelajari
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            {course.whatYouLearn.map((item, index) => (
                              <div key={index} className="col-md-6">
                                <div className="d-flex align-items-start">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="#55BE24"
                                    className="me-3 mt-1 flex-shrink-0"
                                  >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                  </svg>
                                  <span className="font-jost">{item}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white">
                          <h5 className="card-title mb-0 font-exo fw-semibold">
                            Persyaratan
                          </h5>
                        </div>
                        <div className="card-body">
                          {course.requirements.map((requirement, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-start mb-3"
                            >
                              <div
                                className="bg-edu-primary rounded-circle flex-shrink-0 me-3 mt-1"
                                style={{ width: "8px", height: "8px" }}
                              ></div>
                              <span className="font-jost">{requirement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white">
                          <h5 className="card-title mb-0 font-exo fw-semibold">
                            Fitur Kursus
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            {course.features.map((feature, index) => (
                              <div key={index} className="col-md-6">
                                <div className="d-flex align-items-center">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="#FF782D"
                                    className="me-2"
                                  >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                  <span className="font-jost small">
                                    {feature}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="card-title mb-0 font-exo fw-semibold">
                        Kurikulum Kursus
                      </h5>
                    </div>
                    <div className="card-body p-0">
                      <div className="list-group list-group-flush">
                        {course.modules.map((module, index) => (
                          <div key={module.id} className="list-group-item">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center gap-3">
                                <div
                                  className="bg-edu-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  {index + 1}
                                </div>
                                <div>
                                  <h6 className="mb-1 font-exo fw-semibold">
                                    {module.title}
                                  </h6>
                                  <p className="mb-2 text-muted small">
                                    {module.description}
                                  </p>
                                  <div className="d-flex gap-3 text-muted small">
                                    <span>📚 {module.lessons} pelajaran</span>
                                    <span>⏱️ {module.duration}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-end">
                                {module.videoPreview && (
                                  <button className="btn btn-outline-primary btn-sm mb-2">
                                    ▶️ Preview
                                  </button>
                                )}
                                <div>
                                  <span className="badge bg-secondary">
                                    {module.isCompleted
                                      ? "✅ Selesai"
                                      : "🔒 Terkunci"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Module Content List */}
                            <div className="mt-3 ps-5">
                              <div className="row g-2">
                                {module.content.map((lesson, lessonIndex) => (
                                  <div key={lessonIndex} className="col-md-6">
                                    <div className="d-flex align-items-center text-muted small">
                                      <span className="me-2">
                                        {lessonIndex + 1}.
                                      </span>
                                      <span>{lesson}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === "instructor" && (
                  <div className="card border-0 shadow-sm">
                    <div className="card-body p-5">
                      <div className="row align-items-center g-4">
                        <div className="col-auto">
                          <img
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            className="rounded-circle"
                            width="120"
                            height="120"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="col">
                          <h3 className="font-exo fw-bold mb-2">
                            {course.instructor.name}
                          </h3>
                          <p className="text-muted mb-3">
                            {course.instructor.company}
                          </p>
                          <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="d-flex">
                              {renderStars(
                                Math.floor(course.instructor.rating),
                              )}
                            </div>
                            <span className="fw-medium">
                              {course.instructor.rating}
                            </span>
                            <span className="text-muted">
                              Rating Instruktur
                            </span>
                          </div>
                          <div className="row g-3">
                            <div className="col-auto">
                              <div className="text-center">
                                <div className="h4 fw-bold text-edu-primary mb-0">
                                  {course.instructor.courses}
                                </div>
                                <small className="text-muted">Kursus</small>
                              </div>
                            </div>
                            <div className="col-auto">
                              <div className="text-center">
                                <div className="h4 fw-bold text-edu-green mb-0">
                                  {course.instructor.students.toLocaleString()}
                                </div>
                                <small className="text-muted">Siswa</small>
                              </div>
                            </div>
                            <div className="col-auto">
                              <div className="text-center">
                                <div className="h4 fw-bold text-warning mb-0">
                                  {course.instructor.experience}
                                </div>
                                <small className="text-muted">Pengalaman</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="my-4" />
                      <p className="font-jost lh-lg">{course.instructor.bio}</p>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0 font-exo fw-semibold">
                        Ulasan Siswa ({course.reviews.length})
                      </h5>
                      <div className="d-flex align-items-center gap-2">
                        <div className="d-flex">
                          {renderStars(Math.floor(course.rating))}
                        </div>
                        <span className="fw-bold">{course.rating}</span>
                        <small className="text-muted">
                          dari {course.reviews.length} ulasan
                        </small>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row g-4">
                        {course.reviews.map((review) => (
                          <div key={review.id} className="col-12">
                            <div className="d-flex gap-3">
                              <img
                                src={review.avatar}
                                alt={review.name}
                                className="rounded-circle"
                                width="50"
                                height="50"
                              />
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <h6 className="mb-0 font-exo fw-semibold">
                                    {review.name}
                                  </h6>
                                  <small className="text-muted">
                                    {review.date}
                                  </small>
                                </div>
                                <div className="d-flex mb-2">
                                  {renderStars(review.rating)}
                                </div>
                                <p className="mb-0 font-jost">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                            {review.id !==
                              course.reviews[course.reviews.length - 1].id && (
                              <hr className="mt-4" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Sticky Course Info */}
              <div className="sticky-top" style={{ top: "2rem" }}>
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-edu-primary text-white">
                    <h5 className="card-title mb-0 font-exo fw-semibold">
                      Detail Kursus
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">👥 Total Siswa</span>
                        <span className="fw-medium">
                          {course.students.toLocaleString()}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">⏱️ Durasi</span>
                        <span className="fw-medium">{course.duration}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">📊 Level</span>
                        <span className="fw-medium">{course.level}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">🌐 Bahasa</span>
                        <span className="fw-medium">{course.language}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">📅 Update Terakhir</span>
                        <span className="fw-medium">{course.lastUpdated}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">🏆 Sertifikat</span>
                        <span className="fw-medium text-success">✅ Ya</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    {course.price === "free" && (
                      <div className="mb-3">
                        <div className="h3 text-success fw-bold mb-1">
                          GRATIS
                        </div>
                        <small className="text-muted text-decoration-line-through">
                          Rp {course.originalPrice.toLocaleString("id-ID")}
                        </small>
                      </div>
                    )}

                    {!isEnrolled ? (
                      <div className="d-grid gap-2">
                        <button
                          onClick={handleEnroll}
                          className="btn btn-edu-primary btn-lg font-jost fw-medium"
                        >
                          🚀 Daftar Sekarang
                        </button>
                        <button className="btn btn-outline-secondary">
                          🤍 Tambah ke Wishlist
                        </button>
                      </div>
                    ) : (
                      <div className="d-grid gap-2">
                        <Link
                          to={`/kursus/${id}/belajar`}
                          className="btn btn-success btn-lg font-jost fw-medium"
                        >
                          📚 Mulai Belajar
                        </Link>
                        <button className="btn btn-outline-primary">
                          📊 Lihat Progress
                        </button>
                      </div>
                    )}

                    <div className="mt-3">
                      <small className="text-muted">
                        💰 Jaminan uang kembali 30 hari
                        <br />
                        📱 Akses selamanya di mobile & desktop
                      </small>
                    </div>
                  </div>
                </div>

                {/* Share Course */}
                <div className="card border-0 shadow-sm mt-4">
                  <div className="card-body text-center">
                    <h6 className="font-exo fw-semibold mb-3">
                      Bagikan Kursus
                    </h6>
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-outline-primary btn-sm">
                        📘 Facebook
                      </button>
                      <button className="btn btn-outline-info btn-sm">
                        🐦 Twitter
                      </button>
                      <button className="btn btn-outline-success btn-sm">
                        💬 WhatsApp
                      </button>
                      <button className="btn btn-outline-secondary btn-sm">
                        🔗 Copy Link
                      </button>
                    </div>
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

export default CourseDetail;
