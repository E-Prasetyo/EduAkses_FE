import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreateQuiz = ({ onSubmit, onCancel, isModal = false }) => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
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
    }
  }, [courseId, navigate]);

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
    const quizSubmitData = {
      ...quizData,
      questions,
      courseId: courseId,
      moduleId: moduleId || null,
    };

    if (onSubmit) {
      onSubmit(quizSubmitData);
    } else {
      const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
      savedQuizzes.push(quizSubmitData);
      localStorage.setItem("quizzes", JSON.stringify(savedQuizzes));

      navigate(`/pengajar/kursus/${courseId}/edit`);
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
              <h1 className="display-4 fw-bold text-white mb-2">
                Buat Kuis Baru
              </h1>
              <p className="lead text-white-50 mb-0">
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

      <Footer />

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
