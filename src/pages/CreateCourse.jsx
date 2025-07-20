import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { localStorageService } from "../services/localStorageService";

const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY;

// Helper function to extract YouTube video ID from URL
const extractYouTubeVideoId = (url) => {
  if (!url) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

const CreateCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "Teknologi",
    coverImage: null,
    level: "Pemula",
    duration: "",
    price: "free",
    customPrice: "",
    status: "DRAFT"
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [basicInfoSaved, setBasicInfoSaved] = useState(false);

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

  const [categories, setCategories] = useState([
    "Teknologi",
    "Seni & Desain",
    "Bisnis",
    "Literasi & Kewirausahaan",
    "Pengembangan Diri",
  ]);

  useEffect(() => {
    const storedCategories = localStorageService.getCategories();
    if (storedCategories && storedCategories.length > 0) {
      setCategories(storedCategories.map(cat => typeof cat === "string" ? cat : cat.name));
    }
  }, []);

  const handleSaveBasicInfo = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validasi informasi dasar
    if (!courseData.title.trim()) {
      newErrors.title = "Judul kursus wajib diisi";
    }
    if (!courseData.description.trim()) {
      newErrors.description = "Deskripsi kursus wajib diisi";
    }
    if (!courseData.category) {
      newErrors.category = "Kategori wajib dipilih";
    }
    if (!courseData.duration.trim()) {
      newErrors.duration = "Durasi kursus wajib diisi";
    }
    if (courseData.price === "paid" && !courseData.customPrice) {
      newErrors.customPrice = "Harga kursus wajib diisi";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Simulasi penyimpanan ke server
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBasicInfoSaved(true);
        setShowModuleForm(true);
      } catch (error) {
        setErrors({
          submit: "Terjadi kesalahan saat menyimpan informasi dasar. Silakan coba lagi."
        });
      }
    }
  };

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

  const handleInputChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDescriptionChange = (content) => {
    setCourseData({
      ...courseData,
      description: content
    });
  };

  // Tambahkan fungsi konversi file ke base64
  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validasi ukuran file (max 300KB)
        if (file.size > 300 * 1024) {
          alert('Ukuran file terlalu besar. Maksimal 300KB.');
          return;
        }

        // Validasi tipe file
        if (!file.type.startsWith('image/')) {
          alert('File harus berupa gambar.');
          return;
        }

        const base64 = await toBase64(file);
        setCourseData({
          ...courseData,
          coverImage: base64,
          thumbnail: base64,
          image: base64, // Pastikan image juga diisi
        });
        
        console.log('Image uploaded successfully:', { fileName: file.name, size: file.size });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Gagal mengupload gambar. Silakan coba lagi.');
      }
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
            // Jika field adalah videoUrl, extract YouTube ID
            if (field === "videoUrl" && value) {
              value = extractYouTubeVideoId(value);
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

  const validateForm = () => {
    const newErrors = {};

    // Validasi informasi dasar
    if (!courseData.title.trim()) {
      newErrors.title = "Judul kursus wajib diisi";
    }
    if (!courseData.description.trim()) {
      newErrors.description = "Deskripsi kursus wajib diisi";
    }
    if (!courseData.category) {
      newErrors.category = "Kategori wajib dipilih";
    }
    if (!courseData.duration.trim()) {
      newErrors.duration = "Durasi kursus wajib diisi";
    }
    if (courseData.price === "paid" && !courseData.customPrice) {
      newErrors.customPrice = "Harga kursus wajib diisi";
    }

    // Validasi modul dan pelajaran
    if (modules.length === 0) {
      newErrors.modules = "Minimal harus ada satu modul";
    } else {
      modules.forEach((module, moduleIndex) => {
        if (!module.title.trim()) {
          newErrors[`module_${moduleIndex}_title`] = "Judul modul wajib diisi";
        }
        if (module.lessons.length === 0) {
          newErrors[`module_${moduleIndex}_lessons`] = "Minimal harus ada satu pelajaran dalam modul";
        } else {
          module.lessons.forEach((lesson, lessonIndex) => {
            if (!lesson.title.trim()) {
              newErrors[`module_${moduleIndex}_lesson_${lessonIndex}_title`] = "Judul pelajaran wajib diisi";
            }
            if (lesson.type === "text" && !lesson.textContent.trim()) {
              newErrors[`module_${moduleIndex}_lesson_${lessonIndex}_content`] = "Konten pelajaran wajib diisi";
            }
            if (lesson.type === "video" && !lesson.videoUrl.trim()) {
              newErrors[`module_${moduleIndex}_lesson_${lessonIndex}_video`] = "URL video wajib diisi";
            }
          });
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error('Anda harus login sebagai pengajar untuk membuat kursus.');
      }

      if (!validateForm()) {
        throw new Error('Mohon lengkapi semua field yang wajib diisi.');
      }

      // Prepare course data
      const newCourse = {
        id: Date.now().toString(),
        teacherId: user.id,
        instructor: user.name,
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level,
        duration: courseData.duration,
        price: courseData.price === 'paid' ? parseInt(courseData.customPrice) : 0,
        status: 'PENDING_REVIEW',
        submittedDate: new Date().toISOString(),
        modules: modules,
        quizzes: quizzes,
        students: 0,
        rating: 0,
        reviews: [],
        thumbnail: courseData.coverImage || courseData.thumbnail || courseData.image || '',
        coverImage: courseData.coverImage || courseData.thumbnail || courseData.image || '',
        image: courseData.coverImage || courseData.thumbnail || courseData.image || '',
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        overview: courseData.description.substring(0, 200) + '...',
        whatYouLearn: []
      };

      console.log('Creating new course:', newCourse);

      // Save to localStorage
      const existingCourses = localStorageService.getCourses() || [];
      const updatedCourses = [...existingCourses, newCourse];
      const saveResult = localStorageService.saveCourses(updatedCourses);
      if (!saveResult) {
        alert('Gagal menyimpan course. Storage penuh atau terjadi error! Silakan hapus course lama atau gunakan gambar yang lebih kecil.');
        setIsSubmitting(false);
        return;
      }

      // Create notification for admin
      const notifications = localStorageService.getNotifications() || [];
      const newNotification = {
        id: Date.now(),
        userId: 'admin1',
        courseId: newCourse.id,
        message: `Kursus baru "${courseData.title}" telah diajukan oleh ${user.name} dan menunggu review`,
        type: 'NEW_COURSE',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      localStorageService.saveNotifications([...notifications, newNotification]);

      console.log('Course created successfully:', newCourse.id);

      alert('Kursus berhasil dibuat dan sedang menunggu review dari admin!');
      navigate('/pengajar/dashboard');
    } catch (error) {
      console.error('Error creating course:', error);
      setErrors({
        submit: error.message || 'Terjadi kesalahan saat membuat kursus. Silakan coba lagi.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column min-h-screen bg-white">

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
            {errors.submit && (
              <div className="alert alert-danger mb-4">
                {errors.submit}
              </div>
            )}
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
                      <div>
                        <input
                          type="text"
                          name="title"
                          value={courseData.title}
                          onChange={handleInputChange}
                          required
                          className={`form-control h-12 ${errors.title ? 'is-invalid' : ''}`}
                          placeholder="Masukkan judul kursus"
                        />
                        {errors.title && (
                          <div className="invalid-feedback">{errors.title}</div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-medium">Kategori *</label>
                      <div>
                        <select
                          name="category"
                          value={courseData.category}
                          onChange={handleInputChange}
                          required
                          className={`form-select h-12 ${errors.category ? 'is-invalid' : ''}`}
                        >
                          <option value="">Pilih kategori</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <div className="invalid-feedback">{errors.category}</div>
                        )}
                      </div>
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
                      <label className="form-label fw-medium">Harga</label>
                      <div className="d-flex gap-3 align-items-center">
                        <div className="form-check">
                          <input
                            type="radio"
                            id="free"
                            name="price"
                            value="free"
                            checked={courseData.price === 'free'}
                            onChange={handleInputChange}
                            className="form-check-input"
                          />
                          <label className="form-check-label" htmlFor="free">
                            Gratis
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            id="paid"
                            name="price"
                            value="paid"
                            checked={courseData.price === 'paid'}
                            onChange={handleInputChange}
                            className="form-check-input"
                          />
                          <label className="form-check-label" htmlFor="paid">
                            Berbayar
                          </label>
                        </div>
                      </div>
                      {courseData.price === 'paid' && (
                        <div className="mt-2">
                          <input
                            type="number"
                            name="customPrice"
                            value={courseData.customPrice}
                            onChange={handleInputChange}
                            className={`form-control h-12 ${errors.customPrice ? 'is-invalid' : ''}`}
                            placeholder="Masukkan harga kursus"
                          />
                          {errors.customPrice && (
                            <div className="invalid-feedback">{errors.customPrice}</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Estimasi Durasi
                      </label>
                      <div>
                        <input
                          type="text"
                          name="duration"
                          value={courseData.duration}
                          onChange={handleInputChange}
                          className={`form-control h-12 ${errors.duration ? 'is-invalid' : ''}`}
                          placeholder="Contoh: 4 Jam"
                        />
                        {errors.duration && (
                          <div className="invalid-feedback">{errors.duration}</div>
                        )}
                      </div>
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
                            src={courseData.coverImage}
                            alt="Preview"
                            className="img-fluid rounded mb-3"
                            style={{ height: "200px", objectFit: "cover" }}
                            onError={(e) => {
                              console.error('Error loading image:', e);
                              e.target.style.display = 'none';
                              alert('Gagal memuat gambar. Silakan upload ulang.');
                            }}
                          />
                          <div className="d-flex gap-2 justify-content-center">
                            <button
                              type="button"
                              onClick={() =>
                                setCourseData({ ...courseData, coverImage: null, thumbnail: null, image: null })
                              }
                              className="btn btn-danger btn-sm"
                            >
                              Hapus Gambar
                            </button>
                            <button
                              type="button"
                              onClick={() => document.getElementById('coverImage').click()}
                              className="btn btn-outline-primary btn-sm"
                            >
                              Ganti Gambar
                            </button>
                          </div>
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
                  <div>
                    <Editor
                      apiKey={TINYMCE_API_KEY}
                      tinymceScriptSrc="/tinymce/tinymce.min.js"
                      init={{
                        height: 300,
                        menubar: true,
                        plugins: [
                          "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                          "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                          "insertdatetime", "media", "table", "help", "wordcount"
                        ],
                        toolbar: "undo redo | formatselect | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | help",
                        content_style: "body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }",
                        promotion: false,
                        branding: false
                      }}
                      onEditorChange={(content) => handleDescriptionChange(content)}
                      value={courseData.description}
                      className={errors.description ? 'is-invalid' : ''}
                    />
                    {errors.description && (
                      <div className="invalid-feedback d-block">{errors.description}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 d-flex justify-content-end">
                <button
                  type="button"
                  onClick={handleSaveBasicInfo}
                  className="btn btn-edu-primary"
                  disabled={basicInfoSaved}
                >
                  {basicInfoSaved ? "Informasi Dasar Tersimpan" : "Simpan Informasi Dasar"}
                </button>
              </div>
            </div>

            {/* Modules and Lessons */}
            {showModuleForm && (
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
                  {errors.modules && (
                    <div className="alert alert-danger mb-4">{errors.modules}</div>
                  )}

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
                              <div className="flex-grow-1">
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
                                  className={`form-control h-10 ${errors[`module_${moduleIndex}_title`] ? 'is-invalid' : ''}`}
                                />
                                {errors[`module_${moduleIndex}_title`] && (
                                  <div className="invalid-feedback d-block">{errors[`module_${moduleIndex}_title`]}</div>
                                )}
                              </div>
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
                                    <path d="M6 19c0 1.1.9 2 2 2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
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
                                        <div className="flex-grow-1">
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
                                            className={`form-control form-control-sm ${errors[`module_${moduleIndex}_lesson_${lessonIndex}_title`] ? 'is-invalid' : ''}`}
                                          />
                                          {errors[`module_${moduleIndex}_lesson_${lessonIndex}_title`] && (
                                            <div className="invalid-feedback d-block">{errors[`module_${moduleIndex}_lesson_${lessonIndex}_title`]}</div>
                                          )}
                                        </div>
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
                                              <path d="M6 19c0 1.1.9 2 2 2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                            </svg>
                                          </button>
                                        )}
                                      </div>

                                      {lesson.type === "text" ? (
                                        <div className="mb-3">
                                          <label className="form-label small fw-medium">
                                            Konten Pelajaran
                                          </label>
                                          <div>
                                            <Editor
                                              apiKey={TINYMCE_API_KEY}
                                              key={`lesson-${moduleIndex}-${lessonIndex}`}
                                              init={{
                                                height: 300,
                                                menubar: true,
                                                plugins: [
                                                  "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                                                  "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                                                  "insertdatetime", "media", "table", "help", "wordcount"
                                                ],
                                                toolbar: "undo redo | formatselect | bold italic backcolor | \
                                                  alignleft aligncenter alignright alignjustify | \
                                                  bullist numlist outdent indent | removeformat | help",
                                                content_style: "body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }",
                                                promotion: false,
                                                branding: false
                                              }}
                                              value={lesson.textContent}
                                              onEditorChange={(content) =>
                                                updateLesson(
                                                  moduleIndex,
                                                  lessonIndex,
                                                  "textContent",
                                                  content
                                                )
                                              }
                                              className={errors[`module_${moduleIndex}_lesson_${lessonIndex}_content`] ? 'is-invalid' : ''}
                                            />
                                            {errors[`module_${moduleIndex}_lesson_${lessonIndex}_content`] && (
                                              <div className="invalid-feedback d-block">{errors[`module_${moduleIndex}_lesson_${lessonIndex}_content`]}</div>
                                            )}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="row g-3">
                                          <div className="col-md-8">
                                            <label className="form-label small fw-medium">
                                              URL Video YouTube
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
                                              placeholder="Masukkan URL atau ID video YouTube"
                                              className={`form-control form-control-sm ${errors[`module_${moduleIndex}_lesson_${lessonIndex}_video`] ? 'is-invalid' : ''}`}
                                            />
                                            {errors[`module_${moduleIndex}_lesson_${lessonIndex}_video`] && (
                                              <div className="invalid-feedback d-block">{errors[`module_${moduleIndex}_lesson_${lessonIndex}_video`]}</div>
                                            )}
                                           {/* Preview embed jika ID valid */}
                                           {lesson.videoUrl && extractYouTubeVideoId(lesson.videoUrl) && (
                                             <div className="mt-2 ratio ratio-16x9">
                                               <iframe
                                                 src={`https://www.youtube.com/embed/${extractYouTubeVideoId(lesson.videoUrl)}`}
                                                 title="YouTube video preview"
                                                 allowFullScreen
                                               ></iframe>
                                             </div>
                                           )}
                                          </div>
                                          <div className="col-md-4">
                                            <label className="form-label small fw-medium">
                                              Durasi Video
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
                                              placeholder="Contoh: 10:30"
                                              className="form-control form-control-sm"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-3">
                              <button
                                type="button"
                                onClick={() => addLesson(moduleIndex)}
                                className="btn btn-outline-primary btn-sm"
                              >
                                + Tambah Pelajaran
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
                disabled={isSubmitting}
                className="btn btn-edu-primary font-jost fw-medium"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Kursus'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateCourse;
