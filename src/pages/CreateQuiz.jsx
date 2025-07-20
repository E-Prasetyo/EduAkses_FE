import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { localStorageService } from "../services/localStorageService";

const CreateQuiz = ({ onSubmit, onCancel, isModal = false }) => {
  const { courseId, moduleId, quizId } = useParams();
  const navigate = useNavigate();
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [courseModules, setCourseModules] = useState([]);
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    timeLimit: 600, // 10 minutes in seconds
    passingScore: 70,
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    },
  ]);

  useEffect(() => {
    if (!courseId) {
      console.error("Course ID is required");
      navigate("/pengajar/kursus");
      return;
    }
    
    // Load course modules for dropdown
    const course = localStorageService.getCourseById(courseId);
    console.log("Loading course for quiz creation:", course);
    console.log("Course modules:", course?.modules);
    console.log("CourseId from URL:", courseId, "Type:", typeof courseId);
    console.log("ModuleId from URL:", moduleId, "Type:", typeof moduleId);
    
    if (course && course.modules) {
      setCourseModules(course.modules);
      console.log("Course modules set:", course.modules);
      
      // Jika ada moduleId di URL, set sebagai default selected
      if (moduleId) {
        console.log("Setting default moduleId:", moduleId);
        setSelectedModuleId(moduleId);
      }
    } else {
      console.error("Course or modules not found");
      setCourseModules([]);
    }
  }, [courseId, moduleId, navigate]);

  // Prefill data jika edit quiz
  useEffect(() => {
    if (quizId && courseModules.length > 0) {
      // Cari quiz di module yang sesuai
      let foundQuiz = null;
      let foundModuleId = moduleId;
      courseModules.forEach((mod) => {
        if (mod.quizzes) {
          const q = mod.quizzes.find(qz => String(qz.id) === String(quizId));
          if (q) {
            foundQuiz = q;
            foundModuleId = mod.id;
          }
        }
      });
      if (foundQuiz) {
        setQuizData({
          title: foundQuiz.title,
          description: foundQuiz.description,
          timeLimit: foundQuiz.timeLimit,
          passingScore: foundQuiz.passingScore,
        });
        setQuestions(foundQuiz.questions);
        setSelectedModuleId(foundModuleId);
      }
    }
  }, [quizId, courseModules, moduleId]);

  const handleQuizDataChange = (e) => {
    setQuizData({
      ...quizData,
      [e.target.name]: e.target.value,
    });
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (questionIndex, field, value) => {
    const updatedQuestions = questions.map((question, index) =>
      index === questionIndex ? { ...question, [field]: value } : question,
    );
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = questions.map((question, index) => {
      if (index === questionIndex) {
        const newOptions = [...question.options];
        newOptions[optionIndex] = value;
        return { ...question, options: newOptions };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (questionIndex) => {
    setQuestions(questions.filter((_, index) => index !== questionIndex));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi data quiz
    if (!quizData.title.trim()) {
      alert("Judul kuis harus diisi!");
      return;
    }
    
    if (!selectedModuleId) {
      alert("Pilih module untuk quiz ini!");
      return;
    }
    
    if (questions.length === 0) {
      alert("Minimal harus ada 1 soal!");
      return;
    }
    
    // Validasi setiap soal
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.question.trim()) {
        alert(`Soal ${i + 1} harus diisi!`);
        return;
      }
      
      // Validasi opsi jawaban
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].trim()) {
          alert(`Opsi ${String.fromCharCode(65 + j)} pada soal ${i + 1} harus diisi!`);
          return;
        }
      }
      
      if (!question.explanation.trim()) {
        alert(`Penjelasan soal ${i + 1} harus diisi!`);
        return;
      }
    }
    
    const quizSubmitData = {
      id: quizId || `quiz_${Date.now()}`,
      ...quizData,
      questions,
      courseId: courseId,
      moduleId: selectedModuleId,
      createdAt: new Date().toISOString(),
      teacherId: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).id : null
    };

    if (onSubmit) {
      onSubmit(quizSubmitData);
    } else {
      try {
        // Ambil course yang sedang diedit
        const course = localStorageService.getCourseById(courseId);
        if (!course) {
          alert("Course tidak ditemukan!");
          return;
        }
        // Update course dengan quiz baru/edited
        const updatedCourse = { ...course };
        if (selectedModuleId) {
          if (!updatedCourse.modules) {
            updatedCourse.modules = [];
          }
          const moduleIndex = updatedCourse.modules.findIndex(m => m.id === parseInt(selectedModuleId));
          if (moduleIndex !== -1) {
            if (!updatedCourse.modules[moduleIndex].quizzes) {
              updatedCourse.modules[moduleIndex].quizzes = [];
            }
            // Jika edit, replace quiz, jika baru, push
            const quizIdx = updatedCourse.modules[moduleIndex].quizzes.findIndex(q => String(q.id) === String(quizSubmitData.id));
            if (quizIdx !== -1) {
              updatedCourse.modules[moduleIndex].quizzes[quizIdx] = quizSubmitData;
            } else {
              updatedCourse.modules[moduleIndex].quizzes.push(quizSubmitData);
            }
          } else {
            alert("Module tidak ditemukan!");
            return;
          }
        } else {
          if (!updatedCourse.quizzes) {
            updatedCourse.quizzes = [];
          }
          updatedCourse.quizzes.push(quizSubmitData);
        }
        // Simpan course yang sudah diupdate
        const allCourses = localStorageService.getCourses();
        const updatedCourses = allCourses.map(c => 
          c.id === courseId ? updatedCourse : c
        );
        localStorageService.saveCourses(updatedCourses);
        alert("Quiz berhasil disimpan!");
        navigate(`/pengajar/kursus/${courseId}/edit`);
      } catch (error) {
        console.error("Error saving quiz:", error);
        alert("Gagal menyimpan quiz. Silakan coba lagi.");
      }
    }
  };

  const renderContent = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Quiz Information */}
      <div className="bg-white border border-edu-light-grey rounded-2xl p-6">
        <h2 className="text-2xl font-exo font-semibold mb-6">
          Informasi Kuis
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rest of your form content */}
        </div>
      </div>
    </form>
  );

  // Return different layouts based on isModal prop
  return isModal ? (
    <div className="p-4">
      {renderContent()}
    </div>
  ) : (
    <div className="min-vh-100 d-flex flex-column bg-light">

      {/* Hero Section with Animated Background */}
      <div className="bg-gradient position-relative overflow-hidden py-4 mb-4">
        <div className="container position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-black mb-2">
                Buat Kuis Baru
              </h1>
              <p className="lead text-black-50 mb-0">
                Rancang kuis interaktif untuk menguji pemahaman siswa Anda
              </p>
            </div>
            <div className="col-lg-4 text-center d-none d-lg-block">
              <div className="quiz-icon-wrapper">
                <i className="bi bi-pencil-square display-1 text-white-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="shape shape-bottom">
          <svg viewBox="0 0 1440 24">
            <path fill="#f8f9fa" d="M0 24h1440V0c-283 0-566 24-720 24C566 24 283 0 0 0v24z"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <form onSubmit={handleSubmit}>
              {/* Quiz Information Card */}
              <div className="card shadow-sm border-0 rounded-lg mb-4">
                <div className="card-header bg-white py-3">
                  <h5 className="card-title mb-0 fw-bold">
                    <i className="bi bi-info-circle me-2 text-primary"></i>
                    Informasi Kuis
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-md-8">
                      <label className="form-label fw-medium">Judul Kuis *</label>
                      <input
                        type="text"
                        name="title"
                        value={quizData.title}
                        onChange={handleQuizDataChange}
                        required
                        className="form-control form-control-lg"
                        placeholder="Contoh: Kuis JavaScript Dasar"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Durasi (menit)</label>
                      <div className="input-group">
                        <input
                          type="number"
                          name="timeLimit"
                          value={quizData.timeLimit / 60}
                          onChange={(e) => setQuizData({
                            ...quizData,
                            timeLimit: parseInt(e.target.value) * 60,
                          })}
                          min="1"
                          max="180"
                          className="form-control form-control-lg"
                        />
                        <span className="input-group-text">menit</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Deskripsi</label>
                      <textarea
                        name="description"
                        value={quizData.description}
                        onChange={handleQuizDataChange}
                        rows="3"
                        className="form-control"
                        placeholder="Jelaskan tentang kuis ini..."
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Nilai Minimum Lulus</label>
                      <div className="input-group">
                        <input
                          type="number"
                          name="passingScore"
                          value={quizData.passingScore}
                          onChange={handleQuizDataChange}
                          min="50"
                          max="100"
                          className="form-control form-control-lg"
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <label className="form-label fw-medium">Pilih Module *</label>
                      <select
                        value={selectedModuleId}
                        onChange={(e) => {
                          console.log("Module selected:", e.target.value);
                          setSelectedModuleId(e.target.value);
                        }}
                        required
                        disabled={!!moduleId} // Disable jika moduleId ada di URL
                        className="form-control form-control-lg"
                      >
                        <option value="">Pilih module untuk quiz ini</option>
                        {courseModules.map((module, index) => {
                          console.log("Rendering module option:", module);
                          return (
                            <option key={module.id} value={module.id}>
                              Module {index + 1}: {module.title}
                            </option>
                          );
                        })}
                      </select>
                      <small className="text-muted">
                        {moduleId ? 
                          `Quiz akan ditambahkan ke Module ${courseModules.findIndex(m => m.id === parseInt(moduleId)) + 1}` : 
                          `Available modules: ${courseModules.length}`
                        }
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="card shadow-sm border-0 rounded-lg">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 fw-bold">
                    <i className="bi bi-list-check me-2 text-success"></i>
                    Daftar Soal ({questions.length})
                  </h5>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="btn btn-success"
                  >
                    <i className="bi bi-plus-lg me-2"></i>
                    Tambah Soal
                  </button>
                </div>
                <div className="card-body">
                  <div className="quiz-questions">
                    {questions.map((question, index) => (
                      <div 
                        key={question.id} 
                        className="question-card bg-light rounded-3 p-4 mb-4"
                      >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="fw-bold mb-0">
                            Soal {index + 1}
                          </h6>
                          {questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              className="btn btn-outline-danger btn-sm"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>

                        <div className="mb-3">
                          <textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(index, "question", e.target.value)}
                            required
                            rows="2"
                            className="form-control"
                            placeholder="Tulis pertanyaan di sini..."
                          />
                        </div>

                        <div className="options-list mb-3">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="option-item d-flex align-items-center gap-2 mb-2">
                              <div className="form-check">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name={`correct-${index}`}
                                  checked={question.correctAnswer === optIndex}
                                  onChange={() => updateQuestion(index, "correctAnswer", optIndex)}
                                />
                              </div>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(index, optIndex, e.target.value)}
                                required
                                className="form-control"
                                placeholder={`Pilihan ${String.fromCharCode(65 + optIndex)}`}
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <textarea
                            value={question.explanation}
                            onChange={(e) => updateQuestion(index, "explanation", e.target.value)}
                            required
                            rows="2"
                            className="form-control"
                            placeholder="Penjelasan jawaban yang benar..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link
                  to={`/pengajar/kursus/${courseId}/edit`}
                  className="btn btn-light btn-lg px-4"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-4"
                >
                  <i className="bi bi-save me-2"></i>
                  Simpan Kuis
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>


      {/* Custom CSS */}
      <style jsx>{`
        .bg-gradient {
          background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
        }
        .quiz-icon-wrapper {
          width: 120px;
          height: 120px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }
        .shape {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1;
        }
        .question-card {
          border: 1px solid rgba(0,0,0,.05);
          transition: all 0.3s ease;
        }
        .question-card:hover {
          border-color: rgba(13,110,253,.25);
          box-shadow: 0 .125rem .25rem rgba(0,0,0,.05);
        }
      `}</style>
    </div>
  );
};

export default CreateQuiz;
