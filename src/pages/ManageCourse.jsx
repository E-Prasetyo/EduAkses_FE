import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

const ManageCourse = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState({
    title: "JavaScript untuk Pemula",
    description:
      "Belajar dasar-dasar JavaScript dari nol hingga bisa membuat aplikasi web sederhana. Kursus ini cocok untuk pemula yang ingin memulai karir sebagai web developer.",
    category: "Teknologi",
    coverImage: null,
    level: "Pemula",
    duration: "8 Jam",
    price: "free",
    customPrice: "",
    status: "PUBLISHED",
  });

  const [modules, setModules] = useState([
    {
      id: 1,
      title: "Pengenalan JavaScript",
      description: "Memahami dasar-dasar JavaScript dan persiapan environment",
      lessons: [
        {
          id: 1,
          title: "Apa itu JavaScript?",
          type: "text",
          textContent:
            "<h3>JavaScript adalah bahasa pemrograman</h3><p>JavaScript adalah bahasa pemrograman tingkat tinggi yang digunakan untuk membuat halaman web menjadi interaktif.</p><ul><li>Mudah dipelajari untuk pemula</li><li>Berjalan di browser dan server</li><li>Bahasa yang paling populer di dunia</li></ul>",
          videoUrl: "",
          duration: "10 menit",
        },
        {
          id: 2,
          title: "Setup Development Environment",
          type: "video",
          textContent: "",
          videoUrl: "dQw4w9WgXcQ",
          duration: "15 menit",
        },
      ],
    },
    {
      id: 2,
      title: "Variabel dan Tipe Data",
      description: "Belajar tentang variabel, tipe data, dan operator dasar",
      lessons: [
        {
          id: 1,
          title: "Deklarasi Variabel",
          type: "text",
          textContent:
            "<h3>Cara mendeklarasikan variabel</h3><p>Ada tiga cara mendeklarasikan variabel di JavaScript:</p><ul><li><strong>var</strong> - cara lama</li><li><strong>let</strong> - cara modern untuk variabel yang bisa berubah</li><li><strong>const</strong> - untuk konstanta</li></ul>",
          videoUrl: "",
          duration: "12 menit",
        },
      ],
    },
  ]);

  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "Kuis JavaScript Dasar",
      timeLimit: 10,
      passingScore: 70,
      questions: [
        {
          id: 1,
          question: "Apa itu JavaScript?",
          options: [
            "Bahasa pemrograman untuk web",
            "Framework CSS",
            "Database management system",
            "Operating system",
          ],
          correctAnswer: 0,
          explanation:
            "JavaScript adalah bahasa pemrograman tingkat tinggi yang digunakan untuk membuat halaman web interaktif dan aplikasi.",
        },
      ],
    },
  ]);

  const [currentQuiz, setCurrentQuiz] = useState({
    title: "",
    timeLimit: 10,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      },
    ],
  });

  const [activeTab, setActiveTab] = useState("basic");

  const categories = [
    "Teknologi",
    "Pengembangan Diri",
    "Literasi & Kewirausahaan",
    "Bahasa",
    "Seni & Desain",
    "Bisnis",
  ];

  const extractYouTubeId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const handleInputChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData({
        ...courseData,
        coverImage: file,
      });
    }
  };

  const addModule = () => {
    const newModule = {
      id: modules.length + 1,
      title: "",
      description: "",
      lessons: [
        {
          id: 1,
          title: "",
          type: "text",
          textContent: "",
          videoUrl: "",
          duration: "",
        },
      ],
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (moduleIndex, field, value) => {
    const updatedModules = modules.map((module, index) =>
      index === moduleIndex ? { ...module, [field]: value } : module,
    );
    setModules(updatedModules);
  };

  const addLesson = (moduleIndex) => {
    const updatedModules = modules.map((module, index) => {
      if (index === moduleIndex) {
        const newLesson = {
          id: module.lessons.length + 1,
          title: "",
          type: "text",
          textContent: "",
          videoUrl: "",
          duration: "",
        };
        return {
          ...module,
          lessons: [...module.lessons, newLesson],
        };
      }
      return module;
    });
    setModules(updatedModules);
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = modules.map((module, mIndex) => {
      if (mIndex === moduleIndex) {
        const updatedLessons = module.lessons.map((lesson, lIndex) => {
          if (lIndex === lessonIndex) {
            if (field === "videoUrl") {
              value = extractYouTubeId(value);
            }
            return { ...lesson, [field]: value };
          }
          return lesson;
        });
        return { ...module, lessons: updatedLessons };
      }
      return module;
    });
    setModules(updatedModules);
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = modules.map((module, mIndex) => {
      if (mIndex === moduleIndex) {
        const updatedLessons = module.lessons.filter(
          (_, lIndex) => lIndex !== lessonIndex,
        );
        return { ...module, lessons: updatedLessons };
      }
      return module;
    });
    setModules(updatedModules);
  };

  const removeModule = (moduleIndex) => {
    const updatedModules = modules.filter((_, index) => index !== moduleIndex);
    setModules(updatedModules);
  };

  // Quiz functions
  const addQuestion = () => {
    const newQuestion = {
      id: currentQuiz.questions.length + 1,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    };
    setCurrentQuiz({
      ...currentQuiz,
      questions: [...currentQuiz.questions, newQuestion],
    });
  };

  const updateQuestion = (questionIndex, field, value) => {
    const updatedQuestions = currentQuiz.questions.map((question, index) =>
      index === questionIndex ? { ...question, [field]: value } : question,
    );
    setCurrentQuiz({
      ...currentQuiz,
      questions: updatedQuestions,
    });
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = currentQuiz.questions.map((question, qIndex) => {
      if (qIndex === questionIndex) {
        const updatedOptions = question.options.map((option, oIndex) =>
          oIndex === optionIndex ? value : option,
        );
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setCurrentQuiz({
      ...currentQuiz,
      questions: updatedQuestions,
    });
  };

  const removeQuestion = (questionIndex) => {
    const updatedQuestions = currentQuiz.questions.filter(
      (_, index) => index !== questionIndex,
    );
    setCurrentQuiz({
      ...currentQuiz,
      questions: updatedQuestions,
    });
  };

  const saveQuiz = () => {
    if (currentQuiz.title && currentQuiz.questions.length > 0) {
      setQuizzes([...quizzes, { ...currentQuiz, id: quizzes.length + 1 }]);
      setCurrentQuiz({
        title: "",
        timeLimit: 10,
        passingScore: 70,
        questions: [
          {
            id: 1,
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
            explanation: "",
          },
        ],
      });
    }
  };

  const editQuiz = (quizIndex) => {
    const quiz = quizzes[quizIndex];
    setCurrentQuiz(quiz);
    const updatedQuizzes = quizzes.filter((_, index) => index !== quizIndex);
    setQuizzes(updatedQuizzes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Course Data:", courseData);
    console.log("Updated Modules:", modules);
    console.log("Updated Quizzes:", quizzes);
    alert("Perubahan kursus berhasil disimpan!");
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PUBLISHED: "bg-success",
      PENDING_REVIEW: "bg-warning",
      DRAFT: "bg-secondary",
      REJECTED: "bg-danger",
    };

    const statusTexts = {
      PUBLISHED: "Diterbitkan",
      PENDING_REVIEW: "Menunggu Review",
      DRAFT: "Draft",
      REJECTED: "Ditolak",
    };

    return (
      <span className={`badge ${statusStyles[status]} font-jost`}>
        {statusTexts[status]}
      </span>
    );
  };

  return (
    <div className="d-flex flex-column min-h-screen bg-light">
      <Header />

      <section className="bg-dark text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link
                      to="/pengajar/dashboard"
                      className="text-decoration-none text-warning"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item active text-white">
                    Edit Kursus
                  </li>
                </ol>
              </nav>
              <h1 className="display-4 font-exo fw-bold mb-3">Edit Kursus</h1>
              <p className="lead font-jost mb-0">
                Kelola dan perbarui konten kursus Anda dengan mudah
              </p>
            </div>
            <div className="col-lg-4 text-end">
              <div className="d-flex flex-column align-items-end gap-3">
                {getStatusBadge(courseData.status)}
                <div className="d-flex gap-2">
                  <Link
                    to={`/kursus/${id}`}
                    className="btn btn-outline-light btn-sm"
                  >
                    👁️ Preview
                  </Link>
                  <Link
                    to={`/pengajar/kursus/${id}/analytics`}
                    className="btn btn-warning btn-sm"
                  >
                    📊 Analytics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Navigation Tabs */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom-0">
              <ul className="nav nav-pills" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "basic" ? "active" : ""}`}
                    onClick={() => setActiveTab("basic")}
                    type="button"
                  >
                    📝 Informasi Dasar
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
                    className={`nav-link ${activeTab === "quiz" ? "active" : ""}`}
                    onClick={() => setActiveTab("quiz")}
                    type="button"
                  >
                    🧪 Kuis
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
                    onClick={() => setActiveTab("settings")}
                    type="button"
                  >
                    ⚙️ Pengaturan
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0 font-exo fw-semibold">
                    Informasi Dasar Kursus
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-lg-8">
                      <div className="row g-4">
                        <div className="col-12">
                          <label className="form-label fw-medium">
                            Judul Kursus *
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={courseData.title}
                            onChange={handleInputChange}
                            required
                            className="form-control h-12"
                            placeholder="Masukkan judul kursus yang menarik"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-medium">
                            Kategori *
                          </label>
                          <select
                            name="category"
                            value={courseData.category}
                            onChange={handleInputChange}
                            required
                            className="form-select h-12"
                          >
                            <option value="">Pilih kategori</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-medium">Level</label>
                          <select
                            name="level"
                            value={courseData.level}
                            onChange={handleInputChange}
                            className="form-select h-12"
                          >
                            <option value="Pemula">Pemula</option>
                            <option value="Menengah">Menengah</option>
                            <option value="Lanjutan">Lanjutan</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-medium">
                            Estimasi Durasi
                          </label>
                          <input
                            type="text"
                            name="duration"
                            value={courseData.duration}
                            onChange={handleInputChange}
                            className="form-control h-12"
                            placeholder="Contoh: 8 Jam"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-medium">
                            Tipe Kursus
                          </label>
                          <select
                            name="price"
                            value={courseData.price}
                            onChange={handleInputChange}
                            className="form-select h-12"
                          >
                            <option value="free">Gratis</option>
                            <option value="paid">Berbayar</option>
                          </select>
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-medium">
                            Deskripsi Kursus *
                          </label>
                          <textarea
                            name="description"
                            value={courseData.description}
                            onChange={handleInputChange}
                            required
                            rows={5}
                            className="form-control"
                            placeholder="Jelaskan secara detail tentang kursus ini, apa yang akan dipelajari siswa, dan manfaat yang didapat..."
                          />
                          <div className="form-text">
                            Deskripsi yang baik akan membantu siswa memahami
                            value dari kursus Anda.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <label className="form-label fw-medium">
                        Gambar Sampul Kursus
                      </label>
                      <div className="border border-2 border-dashed rounded p-4 text-center">
                        {courseData.coverImage ? (
                          <div>
                            <img
                              src={URL.createObjectURL(courseData.coverImage)}
                              alt="Preview"
                              className="img-fluid rounded mb-3"
                              style={{ maxHeight: "200px", objectFit: "cover" }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setCourseData({
                                  ...courseData,
                                  coverImage: null,
                                })
                              }
                              className="btn btn-danger btn-sm"
                            >
                              Hapus Gambar
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div
                              className="bg-light rounded d-flex align-items-center justify-content-center mb-3"
                              style={{ height: "200px" }}
                            >
                              <div className="text-center">
                                <svg
                                  width="48"
                                  height="48"
                                  viewBox="0 0 48 48"
                                  fill="none"
                                  className="text-muted mb-2"
                                >
                                  <path
                                    d="M24 4V44M4 24H44"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                </svg>
                                <p className="text-muted mb-0">
                                  Gambar Saat Ini
                                </p>
                              </div>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="d-none"
                              id="coverImage"
                            />
                            <label
                              htmlFor="coverImage"
                              className="btn btn-edu-primary"
                            >
                              📷 Ganti Gambar
                            </label>
                            <div className="form-text mt-2">
                              Ukuran yang disarankan: 800x600px
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === "curriculum" && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 font-exo fw-semibold">
                    Kurikulum Kursus
                  </h5>
                  <button
                    type="button"
                    onClick={addModule}
                    className="btn btn-edu-green"
                  >
                    + Tambah Modul
                  </button>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    {modules.map((module, moduleIndex) => (
                      <div key={module.id} className="col-12">
                        <div className="card border">
                          <div className="card-header bg-light">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="bg-edu-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                                style={{ width: "40px", height: "40px" }}
                              >
                                {moduleIndex + 1}
                              </div>
                              <input
                                type="text"
                                value={module.title}
                                onChange={(e) =>
                                  updateModule(
                                    moduleIndex,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                placeholder="Judul Modul"
                                className="form-control"
                              />
                              {modules.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeModule(moduleIndex)}
                                  className="btn btn-outline-danger btn-sm"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="card-body">
                            <div className="mb-4">
                              <label className="form-label fw-medium">
                                Deskripsi Modul
                              </label>
                              <textarea
                                value={module.description}
                                onChange={(e) =>
                                  updateModule(
                                    moduleIndex,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Jelaskan apa yang akan dipelajari di modul ini"
                                rows={2}
                                className="form-control"
                              />
                            </div>

                            <div className="border-top pt-4">
                              <h6 className="fw-semibold mb-3">
                                Pelajaran dalam Modul
                              </h6>
                              <div className="row g-3">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <div key={lesson.id} className="col-12">
                                    <div className="card bg-light border-0">
                                      <div className="card-body p-3">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                          <span className="badge bg-secondary">
                                            Pelajaran {lessonIndex + 1}
                                          </span>
                                          <input
                                            type="text"
                                            value={lesson.title}
                                            onChange={(e) =>
                                              updateLesson(
                                                moduleIndex,
                                                lessonIndex,
                                                "title",
                                                e.target.value,
                                              )
                                            }
                                            placeholder="Judul Pelajaran"
                                            className="form-control form-control-sm"
                                          />
                                          <select
                                            value={lesson.type}
                                            onChange={(e) =>
                                              updateLesson(
                                                moduleIndex,
                                                lessonIndex,
                                                "type",
                                                e.target.value,
                                              )
                                            }
                                            className="form-select form-select-sm"
                                            style={{ width: "120px" }}
                                          >
                                            <option value="text">
                                              📝 Teks
                                            </option>
                                            <option value="video">
                                              🎥 Video
                                            </option>
                                          </select>
                                          {module.lessons.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                removeLesson(
                                                  moduleIndex,
                                                  lessonIndex,
                                                )
                                              }
                                              className="btn btn-outline-danger btn-sm"
                                            >
                                              ❌
                                            </button>
                                          )}
                                        </div>

                                        {lesson.type === "text" ? (
                                          <div>
                                            <label className="form-label small fw-medium">
                                              Konten Pelajaran
                                            </label>
                                            <Editor
                                              key={`lesson-${moduleIndex}-${lessonIndex}`}
                                              tinymceScriptSrc="/tinymce/tinymce.min.js"
                                              value={lesson.textContent}
                                              onEditorChange={(content) =>
                                                updateLesson(
                                                  moduleIndex,
                                                  lessonIndex,
                                                  "textContent",
                                                  content,
                                                )
                                              }
                                              init={{
                                                height: 300,
                                                menubar: false,
                                                readonly: false,
                                                disabled: false,
                                                mode: "exact",
                                                plugins: [
                                                  "advlist",
                                                  "autolink",
                                                  "lists",
                                                  "link",
                                                  "image",
                                                  "charmap",
                                                  "preview",
                                                  "anchor",
                                                  "searchreplace",
                                                  "visualblocks",
                                                  "code",
                                                  "fullscreen",
                                                  "insertdatetime",
                                                  "media",
                                                  "table",
                                                  "help",
                                                  "wordcount",
                                                ],
                                                toolbar:
                                                  "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | removeformat | help",
                                                content_style:
                                                  "body { font-family: Jost, sans-serif; font-size: 14px; padding: 10px; }",
                                                branding: false,
                                                statusbar: false,
                                                setup: function (editor) {
                                                  editor.on(
                                                    "init",
                                                    function () {
                                                      editor.setMode("design");
                                                      const body =
                                                        editor.getBody();
                                                      if (body) {
                                                        body.setAttribute(
                                                          "contenteditable",
                                                          "true",
                                                        );
                                                      }
                                                    },
                                                  );
                                                },
                                              }}
                                            />
                                          </div>
                                        ) : (
                                          <div className="row g-3">
                                            <div className="col-md-8">
                                              <label className="form-label small fw-medium">
                                                URL YouTube
                                              </label>
                                              <input
                                                type="text"
                                                value={lesson.videoUrl}
                                                onChange={(e) =>
                                                  updateLesson(
                                                    moduleIndex,
                                                    lessonIndex,
                                                    "videoUrl",
                                                    e.target.value,
                                                  )
                                                }
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                className="form-control form-control-sm"
                                              />
                                              {lesson.videoUrl && (
                                                <div className="mt-2">
                                                  <div className="ratio ratio-16x9">
                                                    <iframe
                                                      src={`https://www.youtube.com/embed/${lesson.videoUrl}`}
                                                      title="YouTube video preview"
                                                      frameBorder="0"
                                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                      allowFullScreen
                                                      className="rounded"
                                                    ></iframe>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                            <div className="col-md-4">
                                              <label className="form-label small fw-medium">
                                                Durasi
                                              </label>
                                              <input
                                                type="text"
                                                value={lesson.duration}
                                                onChange={(e) =>
                                                  updateLesson(
                                                    moduleIndex,
                                                    lessonIndex,
                                                    "duration",
                                                    e.target.value,
                                                  )
                                                }
                                                placeholder="15 menit"
                                                className="form-control form-control-sm"
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                <div className="col-12">
                                  <button
                                    type="button"
                                    onClick={() => addLesson(moduleIndex)}
                                    className="btn btn-outline-primary w-100 border-2 border-dashed"
                                  >
                                    + Tambah Pelajaran
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === "quiz" && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 font-exo fw-semibold">
                    Manajemen Kuis
                  </h5>
                  <button
                    type="button"
                    onClick={saveQuiz}
                    disabled={
                      !currentQuiz.title || currentQuiz.questions.length === 0
                    }
                    className="btn btn-edu-green"
                  >
                    💾 Simpan Kuis
                  </button>
                </div>
                <div className="card-body p-4">
                  {/* Quiz Settings */}
                  <div className="row g-4 mb-4">
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Judul Kuis</label>
                      <input
                        type="text"
                        value={currentQuiz.title}
                        onChange={(e) =>
                          setCurrentQuiz({
                            ...currentQuiz,
                            title: e.target.value,
                          })
                        }
                        placeholder="Kuis Modul 1"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">
                        Waktu (menit)
                      </label>
                      <input
                        type="number"
                        value={currentQuiz.timeLimit}
                        onChange={(e) =>
                          setCurrentQuiz({
                            ...currentQuiz,
                            timeLimit: parseInt(e.target.value),
                          })
                        }
                        min="1"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">
                        Nilai Lulus (%)
                      </label>
                      <input
                        type="number"
                        value={currentQuiz.passingScore}
                        onChange={(e) =>
                          setCurrentQuiz({
                            ...currentQuiz,
                            passingScore: parseInt(e.target.value),
                          })
                        }
                        min="0"
                        max="100"
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="border-top pt-4">
                    <h6 className="fw-semibold mb-3">Pertanyaan Kuis</h6>
                    <div className="row g-4">
                      {currentQuiz.questions.map((question, questionIndex) => (
                        <div key={question.id} className="col-12">
                          <div className="card border">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                              <h6 className="mb-0">
                                Pertanyaan {questionIndex + 1}
                              </h6>
                              {currentQuiz.questions.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeQuestion(questionIndex)}
                                  className="btn btn-outline-danger btn-sm"
                                >
                                  🗑️ Hapus
                                </button>
                              )}
                            </div>

                            <div className="card-body">
                              <div className="mb-4">
                                <label className="form-label fw-medium">
                                  Pertanyaan
                                </label>
                                <Editor
                                  key={`question-${questionIndex}`}
                                  tinymceScriptSrc="/tinymce/tinymce.min.js"
                                  value={question.question}
                                  onEditorChange={(content) =>
                                    updateQuestion(
                                      questionIndex,
                                      "question",
                                      content,
                                    )
                                  }
                                  init={{
                                    height: 200,
                                    menubar: false,
                                    readonly: false,
                                    disabled: false,
                                    mode: "exact",
                                    plugins: ["lists", "link", "image", "code"],
                                    toolbar:
                                      "bold italic | bullist numlist | link image | code",
                                    content_style:
                                      "body { font-family: Jost, sans-serif; font-size: 14px; padding: 10px; }",
                                    branding: false,
                                    statusbar: false,
                                    setup: function (editor) {
                                      editor.on("init", function () {
                                        editor.setMode("design");
                                        const body = editor.getBody();
                                        if (body) {
                                          body.setAttribute(
                                            "contenteditable",
                                            "true",
                                          );
                                        }
                                      });
                                    },
                                  }}
                                />
                              </div>

                              <div className="mb-4">
                                <label className="form-label fw-medium">
                                  Pilihan Jawaban
                                </label>
                                <div className="row g-2">
                                  {question.options.map(
                                    (option, optionIndex) => (
                                      <div key={optionIndex} className="col-12">
                                        <div className="input-group">
                                          <div className="input-group-text">
                                            <input
                                              type="radio"
                                              name={`correct-${questionIndex}`}
                                              checked={
                                                question.correctAnswer ===
                                                optionIndex
                                              }
                                              onChange={() =>
                                                updateQuestion(
                                                  questionIndex,
                                                  "correctAnswer",
                                                  optionIndex,
                                                )
                                              }
                                            />
                                          </div>
                                          <span className="input-group-text">
                                            {String.fromCharCode(
                                              65 + optionIndex,
                                            )}
                                          </span>
                                          <input
                                            type="text"
                                            value={option}
                                            onChange={(e) =>
                                              updateQuestionOption(
                                                questionIndex,
                                                optionIndex,
                                                e.target.value,
                                              )
                                            }
                                            placeholder={`Pilihan ${String.fromCharCode(65 + optionIndex)}`}
                                            className="form-control"
                                          />
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                                <div className="form-text">
                                  Pilih radio button untuk menandai jawaban yang
                                  benar
                                </div>
                              </div>

                              <div>
                                <label className="form-label fw-medium">
                                  Penjelasan (Opsional)
                                </label>
                                <textarea
                                  value={question.explanation}
                                  onChange={(e) =>
                                    updateQuestion(
                                      questionIndex,
                                      "explanation",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Jelaskan mengapa jawaban ini benar..."
                                  rows={3}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="col-12">
                        <button
                          type="button"
                          onClick={addQuestion}
                          className="btn btn-outline-primary w-100 border-2 border-dashed py-3"
                        >
                          + Tambah Pertanyaan
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Saved Quizzes */}
                  {quizzes.length > 0 && (
                    <div className="border-top pt-4 mt-4">
                      <h6 className="fw-semibold mb-3">Kuis Tersimpan</h6>
                      <div className="row g-3">
                        {quizzes.map((quiz, index) => (
                          <div key={quiz.id} className="col-md-6">
                            <div className="card bg-light border-0">
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h6 className="card-title mb-0">
                                    {quiz.title}
                                  </h6>
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
                                        <button
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => editQuiz(index)}
                                        >
                                          ✏️ Edit
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item text-danger"
                                          type="button"
                                          onClick={() => {
                                            const updatedQuizzes =
                                              quizzes.filter(
                                                (_, i) => i !== index,
                                              );
                                            setQuizzes(updatedQuizzes);
                                          }}
                                        >
                                          🗑️ Hapus
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="small text-muted">
                                  <div>
                                    📝 {quiz.questions.length} pertanyaan
                                  </div>
                                  <div>⏱️ {quiz.timeLimit} menit</div>
                                  <div>🎯 Lulus: {quiz.passingScore}%</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0 font-exo fw-semibold">
                    Pengaturan Kursus
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-lg-6">
                      <h6 className="fw-semibold mb-3">Status Publikasi</h6>
                      <div className="mb-3">
                        <label className="form-label">Status Saat Ini</label>
                        <div>{getStatusBadge(courseData.status)}</div>
                      </div>

                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-warning">
                          📝 Submit untuk Review
                        </button>
                        <button type="button" className="btn btn-secondary">
                          💾 Simpan sebagai Draft
                        </button>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <h6 className="fw-semibold mb-3">Aksi Lanjutan</h6>
                      <div className="d-grid gap-2">
                        <Link
                          to={`/kursus/${id}`}
                          className="btn btn-outline-primary"
                        >
                          👁️ Preview Kursus
                        </Link>
                        <Link
                          to={`/pengajar/kursus/${id}/analytics`}
                          className="btn btn-outline-info"
                        >
                          📊 Lihat Analytics
                        </Link>
                        <button
                          type="button"
                          className="btn btn-outline-success"
                        >
                          📤 Export Data
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                        >
                          🗑️ Hapus Kursus
                        </button>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="alert alert-info">
                        <h6 className="alert-heading">
                          💡 Tips untuk Kursus Berkualitas:
                        </h6>
                        <ul className="mb-0">
                          <li>Pastikan judul kursus jelas dan menarik</li>
                          <li>Gunakan deskripsi yang detail dan informatif</li>
                          <li>Susun kurikulum secara logis dan berurutan</li>
                          <li>Tambahkan kuis untuk mengukur pemahaman siswa</li>
                          <li>Upload gambar sampul yang berkualitas tinggi</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <Link to="/pengajar/dashboard" className="btn btn-secondary">
                ← Kembali ke Dashboard
              </Link>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-primary">
                  💾 Simpan Draft
                </button>
                <button type="submit" className="btn btn-edu-primary">
                  ✅ Simpan Perubahan
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

    </div>
  );
};

export default ManageCourse;
