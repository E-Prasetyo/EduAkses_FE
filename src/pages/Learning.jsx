import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { localStorageService } from "../services/localStorageService";
import { useAuth } from "../contexts/AuthContext";

// Helper function to extract YouTube video ID
const extractYouTubeVideoId = (url) => {
  if (!url) return null;
  
  // If it's already just an ID (11 characters)
  if (url.length === 11 && !url.includes('/') && !url.includes('.')) {
    return url;
  }
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return match && match[2].length === 11 ? match[2] : null;
};

const Learning = () => {
  const { user } = useAuth();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Quiz state
  const [quizData, setQuizData] = useState({
    questions: [],
    currentQuestion: 0,
    answers: {},
    score: null,
    isCompleted: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const foundCourse = localStorageService.getCourseById(courseId);
    if (!foundCourse) {
      setCourse(null);
      setLoading(false);
      return;
    }
    setCourse(foundCourse);
    // Ambil progress user
    const progress = localStorageService.getCourseProgress(user.id, courseId);
    setCompletedLessons(progress.completedLessons || []);
    setCompletedQuizzes(progress.completedQuizzes || []);
    setLoading(false);
  }, [courseId, user]);

  // Fungsi untuk mengecek apakah semua lesson dalam module sudah selesai
  const isModuleCompleted = (moduleIndex) => {
    const module = course?.modules[moduleIndex];
    if (!module || !module.lessons) return false;
    
    return module.lessons.every((_, lessonIndex) => 
      completedLessons.includes(`${moduleIndex}-${lessonIndex}`)
    );
  };

  // Fungsi untuk mengecek apakah quiz dalam module sudah lulus
  const isModuleQuizPassed = (moduleIndex) => {
    const module = course?.modules[moduleIndex];
    if (!module || !module.quizzes || module.quizzes.length === 0) return true;
    
    return module.quizzes.some(quiz => 
      completedQuizzes.includes(`${moduleIndex}-${quiz.id}`)
    );
  };

  // Fungsi untuk mengecek apakah module bisa ditandai selesai
  const canMarkModuleComplete = (moduleIndex) => {
    return isModuleCompleted(moduleIndex) && isModuleQuizPassed(moduleIndex);
  };

  // Fungsi untuk mengecek apakah lesson bisa ditandai selesai
  const canMarkLessonComplete = (moduleIndex, lessonIndex) => {
    return true;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (!course) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger">Kursus tidak ditemukan atau sudah dihapus.</div>
      </div>
    );
  }
  if (!course.modules || course.modules.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-warning">Belum ada modul pada kursus ini.</div>
      </div>
    );
  }
  const totalLessons = course.modules.reduce((acc, module) => acc + (module.lessons ? module.lessons.length : 0), 0);
  const totalQuizzes = course.modules.reduce((acc, module) => acc + (module.quizzes ? module.quizzes.length : 0), 0);
  const totalItems = totalLessons + totalQuizzes;
  
  // Hitung progress yang benar termasuk quiz
  const calculateProgress = () => {
    let completedItems = completedLessons.length;
    
    // Tambahkan quiz yang sudah lulus
    course.modules.forEach((module, moduleIndex) => {
      if (module.quizzes) {
        module.quizzes.forEach(quiz => {
          if (completedQuizzes.includes(`${moduleIndex}-${quiz.id}`)) {
            completedItems++;
          }
        });
      }
    });
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };
  
  // Recalculate progress when completedLessons or completedQuizzes change
  const currentProgress = calculateProgress();
  
  const currentModuleData = course.modules[currentModule];
  if (!currentModuleData || !currentModuleData.lessons || currentModuleData.lessons.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-warning">Belum ada pelajaran pada modul ini.</div>
      </div>
    );
  }
  const currentLessonData = currentModuleData.lessons[currentLesson];
  
  // Debug: Log current lesson data
  console.log('Current Lesson Data:', currentLessonData);
  console.log('Lesson Type:', currentLessonData?.type);
  console.log('Video URL:', currentLessonData?.videoUrl);
  console.log('Text Content:', currentLessonData?.textContent);
  console.log('Full Course Data:', course);
  console.log('Current Module Index:', currentModule);
  console.log('Current Lesson Index:', currentLesson);
  console.log('Extracted Video ID:', currentLessonData?.videoUrl ? extractYouTubeVideoId(currentLessonData.videoUrl) : 'No video URL');
  console.log('Current Module Quizzes:', currentModuleData.quizzes);
  console.log('All Course Modules:', course?.modules?.map((m, i) => ({ index: i, title: m.title, quizzes: m.quizzes?.length || 0 })));
  
  // Deklarasikan isLastLesson sebelum return utama
  const isLastLesson =
    currentModule === course.modules.length - 1 &&
    currentLesson === currentModuleData.lessons.length - 1;

  const markAsComplete = () => {
    // Cek apakah lesson bisa ditandai selesai
    if (!canMarkLessonComplete(currentModule, currentLesson)) {
      alert("Anda harus menyelesaikan quiz terlebih dahulu sebelum menandai lesson ini selesai!");
      return;
    }
    
    const lessonKey = `${currentModule}-${currentLesson}`;
    if (!completedLessons.includes(lessonKey)) {
      const newCompleted = [...completedLessons, lessonKey];
      setCompletedLessons(newCompleted);
      // Simpan progress ke localStorage
      localStorageService.updateProgress(
        user.id, 
        courseId, 
        currentProgress, 
        newCompleted,
        completedQuizzes
      );
    }
  };

  const isLessonCompleted = (moduleIndex, lessonIndex) => {
    return completedLessons.includes(`${moduleIndex}-${lessonIndex}`);
  };

  const isQuizCompleted = (moduleIndex, quizId) => {
    return completedQuizzes.includes(`${moduleIndex}-${quizId}`);
  };

  const navigateToLesson = (moduleIndex, lessonIndex) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
  };

  const saveProgress = () => {
    const progress = {
      currentModule,
      currentLesson,
      completedLessons: Array.from(completedLessons)
    };
    localStorage.setItem(`course_${id}_progress`, JSON.stringify(progress));
  };

  const nextLesson = () => {
    markAsComplete();

    if (isLastLesson) {
      // If this is the last lesson and all lessons are completed, navigate to the quiz
      if (currentModuleData.quizzes && 
          currentModuleData.quizzes.length > 0 && 
          isModuleCompleted(currentModule) && 
          !isModuleQuizPassed(currentModule)) {
        navigate(`/kuis/${courseId}/${currentModuleData.quizzes[0].id}`);
      } else if (currentModule < course.modules.length - 1) {
        // If there's no quiz or lessons aren't completed, move to next module
        setCurrentModule(currentModule + 1);
        setCurrentLesson(0);
      }
    } else if (currentLesson < currentModuleData.lessons.length - 1) {
      // Move to next lesson in the same module
      setCurrentLesson(currentLesson + 1);
    } else if (currentModule < course.modules.length - 1) {
      // Move to next module
      setCurrentModule(currentModule + 1);
      setCurrentLesson(0);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    } else if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
      setCurrentLesson(course.modules[currentModule - 1].lessons.length - 1);
    }
  };

  // Fungsi untuk mendapatkan teks tombol selanjutnya
  const getNextButtonText = () => {
    if (isLastLesson) {
      if (currentModuleData.quizzes && 
          currentModuleData.quizzes.length > 0 && 
          isModuleCompleted(currentModule) && 
          !isModuleQuizPassed(currentModule)) {
        return 'Mulai Kuis';
      } else if (currentModule < course.modules.length - 1) {
        return 'Modul Selanjutnya';
      } else {
        return 'Selesai Kursus';
      }
    } else {
      return 'Selanjutnya';
    }
  };

  // Fungsi untuk mengecek apakah tombol selanjutnya bisa diklik
  const canProceedToNext = () => {
    if (isLastLesson) {
      if (currentModuleData.quizzes && 
          currentModuleData.quizzes.length > 0) {
        return isModuleCompleted(currentModule);
      }
      return true;
    }
    return true;
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="d-flex flex-grow-1">
        {/* Sidebar - Course Navigation */}
        <div className="bg-white border-end" style={{ width: '320px', height: 'calc(100vh - 72px)', overflowY: 'auto' }}>
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Kembali
              </button>
              <span className="badge bg-primary">
                {completedLessons.length + completedQuizzes.length}/{totalItems} Selesai
              </span>
            </div>

            <h2 className="h5 mb-4">{course.title}</h2>

            <div className="accordion" id="moduleAccordion">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="accordion-item">
                  <h2 className="accordion-header">
                    <button 
                      className={`accordion-button ${currentModule !== moduleIndex ? 'collapsed' : ''}`}
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target={`#module${moduleIndex}`}
                    >
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <span>{module.title}</span>
                        <small className="badge bg-primary ms-2">
                          {module.lessons.filter((_, idx) => isLessonCompleted(moduleIndex, idx)).length + 
                          (module.quizzes ? module.quizzes.filter(quiz => isQuizCompleted(moduleIndex, quiz.id)).length : 0)}/
                         {module.lessons.length + (module.quizzes ? module.quizzes.length : 0)}
                        </small>
                      </div>
                    </button>
                  </h2>
                  <div 
                    id={`module${moduleIndex}`} 
                    className={`accordion-collapse collapse ${currentModule === moduleIndex ? 'show' : ''}`}
                  >
                    <div className="accordion-body p-0">
                      <div className="list-group list-group-flush">
                        {/* Lessons */}
                        {module.lessons.map((lesson, lessonIndex) => (
                          <button
                            key={lesson.id}
                            onClick={() => navigateToLesson(moduleIndex, lessonIndex)}
                            className={`list-group-item list-group-item-action d-flex align-items-center ${
                              currentModule === moduleIndex &&
                              currentLesson === lessonIndex
                                ? 'active'
                                : ''
                            }`}
                          >
                            <div className="me-3">
                              <div
                                className={`badge ${
                                  isLessonCompleted(moduleIndex, lessonIndex)
                                    ? "bg-success"
                                    : currentModule === moduleIndex &&
                                      currentLesson === lessonIndex
                                    ? "bg-primary"
                                    : "bg-secondary"
                                }`}
                              >
                                {isLessonCompleted(moduleIndex, lessonIndex)
                                  ? "✓"
                                  : lessonIndex + 1}
                              </div>
                            </div>
                            <div>
                              <div className="fw-medium">
                                {lesson.title}
                              </div>
                              <small className={`${
                                currentModule === moduleIndex &&
                                currentLesson === lessonIndex
                                  ? 'text-light'
                                  : 'text-muted'
                              }`}>
                                {lesson.type === "video" ? "📺" : "📖"}{" "}
                                {lesson.duration}
                              </small>
                            </div>
                          </button>
                        ))}
                        
                        {/* Quizzes */}
                        {module.quizzes && module.quizzes.map((quiz) => (
                          <Link
                            key={quiz.id}
                            to={`/kuis/${courseId}/${quiz.id}`}
                            className={`list-group-item list-group-item-action d-flex align-items-center ${
                              isQuizCompleted(moduleIndex, quiz.id) ? 'disabled' : ''
                            }`}
                          >
                            <div className="me-3">
                              <div className={`badge ${
                                isQuizCompleted(moduleIndex, quiz.id) 
                                  ? 'bg-success text-white' 
                                  : isModuleCompleted(moduleIndex)
                                  ? 'bg-warning text-dark'
                                  : 'bg-secondary text-white'
                              }`}>
                                {isQuizCompleted(moduleIndex, quiz.id) 
                                  ? '✓' 
                                  : <i className="bi bi-journal-check"></i>
                                }
                              </div>
                            </div>
                            <div>
                              <div className="fw-medium">
                                {quiz.title}
                              </div>
                              <small className="text-muted">
                                {quiz.questions?.length || 0} Soal • {quiz.timeLimit / 60} Menit
                                {isQuizCompleted(moduleIndex, quiz.id) && ' • Lulus'}
                              </small>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow-1 d-flex flex-column">
          {/* Content Header */}
          <div className="bg-white border-bottom p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h1 className="h4 mb-2">{currentLessonData.title}</h1>
                <p className="text-muted mb-0">{currentLessonData.description}</p>
              </div>
              <div className="d-flex gap-2">
                <button
                  onClick={prevLesson}
                  disabled={currentModule === 0 && currentLesson === 0}
                  className="btn btn-outline-secondary"
                >
                  <i className="bi bi-arrow-left me-1"></i> Sebelumnya
                </button>
                <button 
                  onClick={() => {
                    if (isLastLesson && currentModule === course.modules.length - 1 && isModuleCompleted(currentModule) && isModuleQuizPassed(currentModule)) {
                      // Redirect ke dashboard sesuai role
                      if (user.role === 'teacher') {
                        navigate('/pengajar/dashboard');
                      } else if (user.role === 'admin') {
                        navigate('/admin/dashboard');
                      } else {
                        navigate('/pelajar/dashboard');
                      }
                    } else {
                      nextLesson();
                    }
                  }}
                  disabled={!canProceedToNext()}
                  className="btn btn-primary"
                >
                  {getNextButtonText()} 
                  <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-primary" 
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="p-4 flex-grow-1">
            {currentLessonData.type === "video" ? (
              <div className="container">
                {currentLessonData.videoUrl ? (
                  <>
                    <div className="ratio ratio-16x9 mb-4">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYouTubeVideoId(currentLessonData.videoUrl)}`}
                        title={currentLessonData.title}
                        allowFullScreen
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      ></iframe>
                    </div>
                    {currentLessonData.textContent && (
                      <div className="mt-4">
                        <h5>Deskripsi Video:</h5>
                        <div
                          className="content"
                          dangerouslySetInnerHTML={{
                            __html: currentLessonData.textContent,
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-5">
                    <div className="alert alert-warning">
                      <h5>Video tidak tersedia</h5>
                      <p>URL video belum diisi atau tidak valid.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="container">
                {currentLessonData.textContent ? (
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: currentLessonData.textContent,
                    }}
                  />
                ) : (
                  <div className="text-center py-5">
                    <div className="alert alert-info">
                      <h5>Materi belum tersedia</h5>
                      <p>Konten pelajaran belum diisi.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="bg-white border-top p-4 mt-auto">
            <div className="container d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <button
                  onClick={markAsComplete}
                  disabled={isLessonCompleted(currentModule, currentLesson)}
                  className={`btn ${
                    isLessonCompleted(currentModule, currentLesson)
                      ? "btn-success"
                      : "btn-primary"
                  }`}
                >
                  {isLessonCompleted(currentModule, currentLesson)
                    ? "✓ Selesai"
                    : "Tandai Selesai"}
                </button>
                {currentModuleData.quizzes && currentModuleData.quizzes.length > 0 && (
                  isModuleCompleted(currentModule) ? (
                    <Link
                      to={`/kuis/${courseId}/${currentModuleData.quizzes[0].id}`}
                      className="btn btn-warning text-white"
                    >
                      <i className="bi bi-journal-check me-2"></i>
                      {isModuleQuizPassed(currentModule) ? 'Lihat Hasil Kuis' : 'Mulai Kuis'} {currentModule + 1}
                    </Link>
                  ) : (
                    <button
                      className="btn btn-warning text-white"
                      disabled
                      title="Selesaikan semua materi untuk membuka kuis"
                    >
                      <i className="bi bi-lock me-2"></i>
                      Kuis {currentModule + 1} Terkunci
                    </button>
                  )
                )}
              </div>
              <div className="text-muted small">
                Pelajaran {currentLesson + 1} dari {currentModuleData.lessons.length} - 
                Modul {currentModule + 1}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;