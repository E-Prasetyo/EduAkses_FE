import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY;
import CreateQuiz from "./CreateQuiz";
import { courseAPI } from "../services/api";
import { localStorageService } from "../services/localStorageService";
import ModuleQuizzes from "../components/ModuleQuizzes";

// Helper function to extract YouTube video ID from URL
const extractYouTubeVideoId = (url) => {
  if (!url) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

const EditCourse = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Tambahkan useAuth hook
  const [courseId] = useState(params.id || params['*']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Extract course ID from URL parameters

  useEffect(() => {
    if (window.tinymce) {
      setEditorLoaded(true);
    }
  }, []);

  // Validasi user login
  useEffect(() => {
    if (!user) {
      setError('Anda harus login terlebih dahulu.');
      setLoading(false);
      return;
    }
    
    if (user.role !== 'teacher') {
      setError('Anda tidak memiliki akses ke halaman ini.');
      setLoading(false);
      return;
    }
  }, [user]);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "Teknologi",
    coverImage: null,
    level: "Pemula",
    duration: "",
    price: "free",
    customPrice: "",
    status: "DRAFT",
    modules: []
  });

  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // Function to handle quiz creation
  const handleCreateQuiz = (moduleId) => {
    setSelectedModule(moduleId);
    setShowQuizModal(true);
  };

  // Function to save quiz
  const handleQuizSave = async (quizData) => {
    try {
      // Add temporary ID for localStorage
      const tempQuizData = { ...quizData, id: Date.now() };
      
      // Update local state
      const updatedModules = modules.map(module => {
        if (module.id === selectedModule) {
          return {
            ...module,
            quizzes: [...module.quizzes, tempQuizData]
          };
        }
        return module;
      });
      
      // Update state and localStorage
      setModules(updatedModules);
      const updatedCourseData = { ...courseData, modules: updatedModules };
      localStorageService.saveDraft(courseId, updatedCourseData);

      // Try to save to backend
      try {
        await courseAPI.addQuiz(courseId, selectedModule, quizData);
      } catch (error) {
        console.warn('Failed to save quiz to backend, will sync later:', error);
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      // You might want to show an error message to the user here
    } finally {
      setShowQuizModal(false);
    }
  };

  // Fungsi hapus quiz dari modul
  const handleDeleteQuiz = (moduleId, quizId) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          quizzes: (module.quizzes || []).filter(q => q.id !== quizId)
        };
      }
      return module;
    });
    setModules(updatedModules);
    const updatedCourseData = { ...courseData, modules: updatedModules };
    localStorageService.saveDraft(courseId, updatedCourseData);
    localStorageService.saveCourses(
      localStorageService.getCourses().map(c => c.id === courseId ? updatedCourseData : c)
    );
  };

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

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Cek apakah ada draft yang tersimpan
        const savedDraft = localStorageService.getDraft(courseId);
        if (savedDraft) {
          setCourseData(savedDraft);
          setModules(savedDraft.modules || []);
          setIsDataLoaded(true);
          setLoading(false);
          return;
        }
        // Ambil data course dari localStorage utama
        const foundCourse = localStorageService.getCourseById(courseId);
        if (foundCourse) {
          setCourseData(foundCourse);
          setModules(foundCourse.modules || []);
          setIsDataLoaded(true);
          setLoading(false);
          return;
        }
        // Jika tidak ditemukan, tampilkan error
        setError('Data kursus tidak ditemukan!');
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data kursus');
        setLoading(false);
      }
    };
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);



  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Course</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || !editorLoaded) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading course data...</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const newData = {
      ...courseData,
      [e.target.name]: e.target.value,
    };
    setCourseData(newData);
    
    // Auto save draft
    if (courseId) {
      const draftData = {
        ...newData,
        modules: modules,
        updatedAt: new Date().toISOString()
      };
      localStorageService.saveDraft(courseId, draftData);
    }
  };

  const handleDescriptionChange = (content) => {
    try {
      const newData = {
        ...courseData,
        description: content
      };
      setCourseData(newData);
      
      // Auto save draft
      if (courseId) {
        const draftData = {
          ...newData,
          modules: modules,
          updatedAt: new Date().toISOString()
        };
        localStorageService.saveDraft(courseId, draftData);
      }
    } catch (err) {
      console.error('Error updating editor content:', err);
      setError('Failed to update content. Please try again.');
    }
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
        // Validasi ukuran file (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          alert('Ukuran file terlalu besar. Maksimal 2MB.');
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
          image: base64, // Tambahkan field image
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
      index === moduleIndex ? { ...module, [field]: value } : module
    );
    setModules(updatedModules);
  };

  const addLesson = (moduleIndex) => {
    const updatedModules = modules.map((module, index) => {
      if (index === moduleIndex) {
        return {
          ...module,
          lessons: [
            ...module.lessons,
            {
              id: module.lessons.length + 1,
              title: "",
              type: "text",
              textContent: "",
              videoUrl: "",
              duration: "",
            },
          ],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Validasi user
      if (!user) {
        throw new Error('User tidak ditemukan. Silakan login ulang.');
      }
      
      if (!courseId) {
        throw new Error('Course ID is required');
      }

      // Validasi data
      if (!courseData.title?.trim()) {
        throw new Error('Judul kursus harus diisi');
      }
      if (!courseData.description?.trim()) {
        throw new Error('Deskripsi kursus harus diisi');
      }
      if (!courseData.category) {
        throw new Error('Kategori harus dipilih');
      }
      
      // Prepare the complete course data
      const completeData = {
        ...courseData,
        id: courseId,
        teacherId: user.id,
        instructor: user.name,
        modules: modules,
        quizzes: quizzes,
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        submittedDate: courseData.submittedDate || new Date().toISOString(),
        status: courseData.status || 'PENDING_REVIEW',
        students: courseData.students || 0,
        rating: courseData.rating || 0,
        reviews: courseData.reviews || [],
        thumbnail: courseData.coverImage || courseData.thumbnail || '',
        image: courseData.coverImage || courseData.thumbnail || courseData.image || '', // Tambahkan field image
        overview: courseData.description?.substring(0, 200) + '...' || courseData.overview || '', // Tambahkan overview
        whatYouLearn: courseData.whatYouLearn || [] // Tambahkan field whatYouLearn
      };

      console.log('Saving course data:', { courseId, teacherId: user.id, instructor: user.name });

      // Update course in localStorage (replace if exists)
      const allCourses = localStorageService.getCourses() || [];
      const updatedCourses = allCourses.some(c => c.id === courseId)
        ? allCourses.map(c => c.id === courseId ? completeData : c)
        : [...allCourses, completeData];
      
      localStorageService.saveCourses(updatedCourses);
      
      // Clear draft
      localStorageService.clearDraft(courseId);

      console.log('Course saved successfully to localStorage');

      // Show success message
      alert('Kursus berhasil disimpan!');
      
      // Redirect ke halaman detail course
      navigate(`/kursus/${courseId}`);

    } catch (err) {
      console.error('Error updating course:', err);
      setError(err.message || 'Gagal menyimpan perubahan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="flex-grow-1 bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="h3 mb-4 font-exo fw-bold">Edit Kursus</h1>
              <form onSubmit={handleSubmit}>
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <h5 className="card-title mb-4 font-exo fw-semibold">
                      Informasi Dasar
                    </h5>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Judul Kursus *</label>
                      <input
                        type="text"
                        name="title"
                        value={courseData.title || ''}
                        onChange={handleInputChange}
                        required
                        className="form-control h-12"
                        placeholder="Contoh: JavaScript untuk Pemula"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Kategori *</label>
                      <select
                        name="category"
                        value={courseData.category || ''}
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
                        value={courseData.level || ''}
                        onChange={handleInputChange}
                        className="form-select h-12"
                      >
                        <option value="Pemula">Pemula</option>
                        <option value="Menengah">Menengah</option>
                        <option value="Lanjutan">Lanjutan</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Estimasi Durasi</label>
                      <input
                        type="text"
                        name="duration"
                        value={courseData.duration || ''}
                        onChange={handleInputChange}
                        className="form-control h-12"
                        placeholder="Contoh: 8 Jam"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Tipe Kursus</label>
                      <select
                        name="price"
                        value={courseData.price || ''}
                        onChange={handleInputChange}
                        className="form-select h-12"
                      >
                        <option value="free">Gratis</option>
                        <option value="paid">Berbayar</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Deskripsi Kursus *</label>
                      {isDataLoaded ? (
                        <Editor
                          apiKey={TINYMCE_API_KEY}
                          value={courseData.description}
                          onEditorChange={handleDescriptionChange}
                          init={{
                            height: 300,
                            menubar: false,
                            readonly: false,
                            plugins: 'advlist autolink lists link image charmap code help wordcount',
                            toolbar:
                              'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | code | help',
                            setup: (editor) => {
                              editor.on('init', () => {
                                if (editor.mode.get() === 'readonly') {
                                  console.warn('Editor initialized in readonly mode');
                                  editor.mode.set('design');
                                }
                              });
                            },
                            branding: false,
                            statusbar: true,
                            content_style: "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; }"
                          }}
                        />
                      ) : (
                        <div className="p-3 text-center border rounded">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading editor...</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Gambar Sampul</label>
                      <div className="border border-2 border-dashed border-secondary rounded p-4 text-center">
                        {courseData.coverImage || courseData.thumbnail || courseData.image ? (
                          <div>
                            <img
                              src={courseData.coverImage || courseData.thumbnail || courseData.image || ''}
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
                              className="btn btn-primary"
                            >
                              Pilih Gambar
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Modules */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="card-title mb-0 font-exo fw-semibold">Modul Kursus</h5>
                      <button
                        type="button"
                        onClick={addModule}
                        className="btn btn-primary btn-sm"
                      >
                        + Tambah Modul
                      </button>
                    </div>
                    {modules.map((module, moduleIndex) => (
                      <div key={module.id} className="border rounded p-3 mb-3">
                        <div className="mb-3">
                          <label className="form-label fw-medium">Judul Modul</label>
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) =>
                              updateModule(moduleIndex, "title", e.target.value)
                            }
                            className="form-control"
                            placeholder="Contoh: Pengenalan JavaScript"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-medium">Deskripsi Modul</label>
                          <textarea
                            value={module.description}
                            onChange={(e) =>
                              updateModule(moduleIndex, "description", e.target.value)
                            }
                            className="form-control"
                            rows="2"
                          />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <label className="form-label fw-medium mb-0">Pelajaran</label>
                            <button
                              type="button"
                              onClick={() => addLesson(moduleIndex)}
                              className="btn btn-outline-primary btn-sm"
                            >
                              + Tambah Pelajaran
                            </button>
                          </div>
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="border rounded p-3 mb-2">
                              <div className="mb-3">
                                <label className="form-label">Judul Pelajaran</label>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) =>
                                    updateLesson(
                                      moduleIndex,
                                      lessonIndex,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  placeholder="Contoh: Apa itu JavaScript?"
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Tipe Konten</label>
                                <select
                                  value={lesson.type}
                                  onChange={(e) =>
                                    updateLesson(
                                      moduleIndex,
                                      lessonIndex,
                                      "type",
                                      e.target.value
                                    )
                                  }
                                  className="form-select"
                                >
                                  <option value="text">Teks</option>
                                  <option value="video">Video</option>
                                </select>
                              </div>
                              {lesson.type === "text" ? (
                                <div className="mb-3">
                                  <label className="form-label">Konten</label>
                                  <Editor
                                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                                    value={lesson.textContent}
                                    onEditorChange={(content) =>
                                      updateLesson(
                                        moduleIndex,
                                        lessonIndex,
                                        "textContent",
                                        content
                                      )
                                    }
                                    init={{
                                      height: 200,
                                      menubar: false,
                                      readonly: false,
                                      plugins: [
                                        "advlist autolink lists link image charmap print preview anchor",
                                        "searchreplace visualblocks code fullscreen",
                                        "insertdatetime media table paste code help wordcount",
                                      ],
                                      toolbar:
                                        "undo redo | formatselect | bold italic backcolor | \
                                        alignleft aligncenter alignright alignjustify | \
                                        bullist numlist outdent indent | removeformat | help",
                                      setup: (editor) => {
                                        editor.on('init', () => {
                                          if (editor.mode.get() === 'readonly') {
                                            console.warn('Editor initialized in readonly mode');
                                            editor.mode.set('design');
                                          }
                                        });
                                      },
                                      branding: false,
                                      statusbar: true,
                                      content_style: "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; }"
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="mb-3">
                                  <label className="form-label">URL Video</label>
                                  <input
                                    type="text"
                                    value={lesson.videoUrl}
                                    onChange={(e) =>
                                      updateLesson(
                                        moduleIndex,
                                        lessonIndex,
                                        "videoUrl",
                                        e.target.value
                                      )
                                    }
                                    className="form-control"
                                    placeholder="Masukkan URL atau ID video YouTube"
                                  />
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
                              )}
                              <div className="mb-3">
                                <label className="form-label">Durasi</label>
                                <input
                                  type="text"
                                  value={lesson.duration}
                                  onChange={(e) =>
                                    updateLesson(
                                      moduleIndex,
                                      lessonIndex,
                                      "duration",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  placeholder="Contoh: 10 menit"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Quiz Section */}
                        <ModuleQuizzes 
                          courseId={courseId}
                          moduleId={module.id}
                          quizzes={module.quizzes || []}
                          moduleIndex={moduleIndex}
                          onDeleteQuiz={handleDeleteQuiz}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    Simpan Perubahan
                  </button>
                  <Link to="/pengajar/kursus" className="btn btn-outline-secondary">
                    Batal
                  </Link>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            {/* HAPUS BAGIAN INI: Sidebar Gambar Sampul */}
            {/* <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4 font-exo fw-semibold">
                    Gambar Sampul
                  </h5>
                  <div className="border border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title mb-4 font-exo fw-semibold">
                        Gambar Sampul
                      </h5>
                      <div className="border border-2 border-dashed border-secondary rounded p-4 text-center">
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
                              className="btn btn-primary"
                            >
                              Pilih Gambar
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        {showQuizModal && (
          <CreateQuiz
            isOpen={showQuizModal}
            onClose={() => setShowQuizModal(false)}
            onSave={handleQuizSave}
            moduleId={selectedModule}
            isModal={true}
          />
        )}
      </main>
    
    </div>
  );
};

export default EditCourse;
