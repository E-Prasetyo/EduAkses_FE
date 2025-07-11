import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Helper function to extract YouTube video ID from URL
const extractYouTubeVideoId = (url) => {
  if (!url) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

const CreateCourse = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    coverImage: null,
    level: "Pemula",
    duration: "",
    price: "free",
    customPrice: "",
  });

  const [modules, setModules] = useState([
    {
      id: 1,
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
    },
  ]);

  const [quizzes, setQuizzes] = useState([]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Course Data:", courseData);
    console.log("Modules:", modules);
    console.log("Quizzes:", quizzes);
    alert("Kursus berhasil dibuat! Status: Menunggu Review");
  };

  return (
    <div className="d-flex flex-column min-h-screen bg-white">
      <Header />

      <div className="bg-dark text-white py-5">
        <div className="container">
          <h1 className="display-4 font-exo fw-bold">Tambah Kursus</h1>
          <p className="text-light mt-2">
            Buat kursus baru dan bagikan pengetahuan Anda
          </p>
        </div>
      </div>

      <main className="flex-grow-1 py-5">
        <div className="container">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="card border-edu-light-grey rounded-2xl mb-4">
              <div className="card-body p-4">
                <h2 className="h4 font-exo fw-semibold mb-4">
                  Informasi Dasar
                </h2>

                <div className="row g-4">
                  <div className="col-lg-6">
                    <div className="mb-3">
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
                        placeholder="Masukkan judul kursus"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-medium">Kategori *</label>
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

                    <div className="mb-3">
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

                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Estimasi Durasi
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={courseData.duration}
                        onChange={handleInputChange}
                        className="form-control h-12"
                        placeholder="Contoh: 4 Jam"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <label className="form-label fw-medium">
                      Gambar Sampul
                    </label>
                    <div className="border border-2 border-dashed border-edu-light-grey rounded p-4 text-center">
                      {courseData.coverImage ? (
                        <div>
                          <img
                            src={URL.createObjectURL(courseData.coverImage)}
                            alt="Preview"
                            className="img-fluid rounded mb-3"
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setCourseData({ ...courseData, coverImage: null })
                            }
                            className="btn btn-danger btn-sm"
                          >
                            Hapus Gambar
                          </button>
                        </div>
                      ) : (
                        <div>
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            fill="none"
                            className="text-muted mb-3"
                          >
                            <path
                              d="M24 4V44M4 24H44"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          <p className="text-muted mb-3">
                            Drag & drop gambar atau klik untuk upload
                          </p>
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
                            Pilih Gambar
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="form-label fw-medium">
                    Deskripsi Kursus *
                  </label>
                  <textarea
                    name="description"
                    value={courseData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="form-control"
                    placeholder="Jelaskan tentang kursus ini..."
                  />
                </div>
              </div>
            </div>

            {/* Modules and Lessons */}
            <div className="card border-edu-light-grey rounded-2xl mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 font-exo fw-semibold mb-0">
                    Kurikulum Kursus
                  </h2>
                  <button
                    type="button"
                    onClick={addModule}
                    className="btn btn-edu-green font-jost fw-medium"
                  >
                    + Tambah Modul
                  </button>
                </div>

                <div className="row g-4">
                  {modules.map((module, moduleIndex) => (
                    <div key={module.id} className="col-12">
                      <div className="card border">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center gap-3 mb-3">
                            <div
                              className="bg-edu-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                              style={{ width: "32px", height: "32px" }}
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
                              className="form-control h-10"
                            />
                            {modules.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeModule(moduleIndex)}
                                className="btn btn-outline-danger btn-sm"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                </svg>
                              </button>
                            )}
                          </div>

                          <textarea
                            value={module.description}
                            onChange={(e) =>
                              updateModule(
                                moduleIndex,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Deskripsi modul"
                            rows={2}
                            className="form-control mb-4"
                          />

                          <div className="row g-3">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="col-12">
                                <div className="card bg-light border-0">
                                  <div className="card-body p-3">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                      <span className="small fw-medium text-muted">
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
                                        style={{ width: "auto" }}
                                      >
                                        <option value="text">Teks</option>
                                        <option value="video">Video</option>
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
                                          <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                          >
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>

                                    {lesson.type === "text" ? (
                                      <div className="mb-3">
                                        <label className="form-label small fw-medium">
                                          Konten Pelajaran
                                        </label>
                                        <Editor
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
                                            height: 250,
                                            menubar: false,
                                            promotion: false,
                                            license_key: "gpl",
                                            readonly: false,
                                            disabled: false,
                                            editable_root: true,
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
                                              "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | code | removeformat | help",
                                            media_live_embeds: true,
                                            media_dimensions: false,
                                            content_style:
                                              "body { font-family: Jost, sans-serif; font-size: 14px; padding: 10px; }",
                                            branding: false,
                                            elementpath: false,
                                            statusbar: false,
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
                                              {extractYouTubeVideoId(
                                                lesson.videoUrl,
                                              ) ? (
                                                <div className="ratio ratio-16x9">
                                                  <iframe
                                                    src={`https://www.youtube.com/embed/${extractYouTubeVideoId(lesson.videoUrl)}`}
                                                    title="YouTube video preview"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="rounded"
                                                  ></iframe>
                                                </div>
                                              ) : (
                                                <div className="alert alert-warning small">
                                                  <strong>
                                                    URL tidak valid!
                                                  </strong>{" "}
                                                  Masukkan URL YouTube yang
                                                  valid.
                                                  <br />
                                                  Contoh:
                                                  https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                                </div>
                                              )}
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
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="d-flex justify-content-end gap-3">
              <Link
                to="/profil"
                className="btn btn-secondary font-jost fw-medium"
              >
                Batal
              </Link>
              <button
                type="submit"
                className="btn btn-edu-primary font-jost fw-medium"
              >
                Simpan Kursus
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateCourse;
