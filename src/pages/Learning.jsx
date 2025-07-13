import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const Learning = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);
  
  // Quiz state
  const [quizData, setQuizData] = useState({
    questions: [],
    currentQuestion: 0,
    answers: {},
    score: null,
    isCompleted: false
  });

  // Mock course data (same as before)
  const course = {
    id: id,
    title: "Dasar-Dasar Komputer dan Internet",
    modules: [
      {
        id: 1,
        title: "Pengenalan Komputer",
        lessons: [
          {
            id: 1,
            title: "Apa itu Komputer?",
            type: "video",
            content: "dQw4w9WgXcQ",
            duration: "15 menit",
            description: "Pengenalan dasar tentang komputer dan sejarahnya",
          },
          {
            id: 2,
            title: "Komponen Komputer",
            type: "text",
            content: `
              <h2>Komponen Utama Komputer</h2>
              <p>Komputer terdiri dari beberapa komponen utama yang bekerja sama untuk menjalankan berbagai tugas.</p>
            `,
            duration: "20 menit",
            description: "Mempelajari komponen-komponen utama dalam komputer",
          },
          {
            id: 3,
            title: "Cara Kerja Komputer",
            type: "video",
            content: "dQw4w9WgXcQ",
            duration: "12 menit",
            description: "Memahami bagaimana komputer memproses informasi",
          }
        ],
        quizzes: [
          {
            id: 1,
            title: "Kuis Pengenalan Komputer",
            timeLimit: 600,
            questions: 5,
            passingScore: 70
          }
        ]
      },
      {
        id: 2,
        title: "Sistem Operasi",
        lessons: [
          {
            id: 4,
            title: "Pengenalan Sistem Operasi",
            type: "text",
            content: `
              <h2>Apa itu Sistem Operasi?</h2>
              <p>Sistem operasi adalah perangkat lunak sistem yang mengelola sumber daya komputer.</p>
            `,
            duration: "18 menit",
            description: "Memahami peran dan fungsi sistem operasi",
          },
          {
            id: 5,
            title: "Interface Pengguna",
            type: "video",
            content: "dQw4w9WgXcQ",
            duration: "25 menit",
            description: "Mempelajari berbagai jenis antarmuka pengguna",
          }
        ],
        quizzes: [
          {
            id: 2,
            title: "Kuis Sistem Operasi",
            timeLimit: 600,
            questions: 5,
            passingScore: 70
          }
        ]
      }
    ]
  };

  // Compute total lessons and last lesson status
  const totalLessons = course?.modules.reduce((acc, module) => acc + module.lessons.length, 0) || 0;
  const isLastLesson = currentModule === course?.modules.length - 1 && 
                      currentLesson === course?.modules[currentModule].lessons.length - 1;

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem(`course_${id}_progress`);
    if (savedProgress) {
      const { completedLessons: saved } = JSON.parse(savedProgress);
      setCompletedLessons(new Set(saved));
    }
    setLoading(false);
  }, [id]);

  const currentModuleData = course.modules[currentModule];
  const currentLessonData = currentModuleData.lessons[currentLesson];

  const markAsComplete = () => {
    const lessonKey = `${currentModule}-${currentLesson}`;
    setCompletedLessons(prev => new Set([...prev, lessonKey]));
    saveProgress();
  };

  const isLessonCompleted = (moduleIndex, lessonIndex) => {
    return completedLessons.has(`${moduleIndex}-${lessonIndex}`);
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
          currentModuleData.lessons.every((_, idx) => isLessonCompleted(currentModule, idx))) {
        navigate(`/kursus/${id}/modul/${currentModule + 1}/kuis/${currentModuleData.quizzes[0].id}`);
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />

      <div className="d-flex flex-grow-1">
        {/* Sidebar - Course Navigation */}
        <div className="bg-white border-end" style={{ width: '320px', height: 'calc(100vh - 72px)', overflowY: 'auto' }}>
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Link
                to={`/kursus/${id}`}
                className="btn btn-outline-primary btn-sm"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Kembali
              </Link>
              <span className="badge bg-primary">
                {completedLessons.size}/{totalLessons} Selesai
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
                          {module.lessons.filter((_, idx) => isLessonCompleted(moduleIndex, idx)).length}/{module.lessons.length}
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
                            to={`/kursus/${id}/modul/${moduleIndex + 1}/kuis/${quiz.id}`}
                            className="list-group-item list-group-item-action d-flex align-items-center"
                          >
                            <div className="me-3">
                              <div className="badge bg-warning text-dark">
                                <i className="bi bi-journal-check"></i>
                              </div>
                            </div>
                            <div>
                              <div className="fw-medium">
                                {quiz.title}
                              </div>
                              <small className="text-muted">
                                {quiz.questions} Soal • {quiz.timeLimit / 60} Menit
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
                <button onClick={nextLesson} className="btn btn-primary">
                  {isLastLesson ? 'Mulai Kuis' : 'Selanjutnya'} 
                  <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-primary" 
                style={{ width: `${(completedLessons.size / totalLessons) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="p-4 flex-grow-1">
            {currentLessonData.type === "video" ? (
              <div className="container">
                <div className="ratio ratio-16x9 mb-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentLessonData.content}`}
                    title={currentLessonData.title}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : (
              <div className="container">
                <div
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: currentLessonData.content,
                  }}
                />
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
                  currentModuleData.lessons.every((_, idx) => isLessonCompleted(currentModule, idx)) ? (
                    <Link
                      to={`/kursus/${id}/modul/${currentModule + 1}/kuis/${currentModuleData.quizzes[0].id}`}
                      className="btn btn-warning text-white"
                    >
                      <i className="bi bi-journal-check me-2"></i>
                      Mulai Kuis {currentModule + 1}
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
