import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { localStorageService } from "../services/localStorageService";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Quiz = () => {
  const { user } = useAuth();
  const { courseId, quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCooldown, setRetryCooldown] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
      console.log('User belum ready:', user);
      return;
    }
    console.log("Quiz component - courseId:", courseId, "quizId:", quizId, "user.id:", user.id);
    
    // Ambil quiz dari localStorageService
    const course = localStorageService.getCourseById(courseId);
    console.log("Found course:", course);
    
    let foundQuiz = null;
    
    if (course && course.modules) {
      console.log("Course modules:", course.modules);
      for (let moduleIndex = 0; moduleIndex < course.modules.length; moduleIndex++) {
        const module = course.modules[moduleIndex];
        console.log(`Module ${moduleIndex}:`, module);
        if (module.quizzes) {
          console.log(`Module ${moduleIndex} quizzes:`, module.quizzes);
          foundQuiz = module.quizzes.find(q => {
            console.log("Comparing quiz:", q.id, "with quizId:", quizId);
            return q.id === quizId || q.id === Number(quizId) || String(q.id) === String(quizId);
          });
          if (foundQuiz) {
            console.log("Found quiz:", foundQuiz);
            foundQuiz.moduleIndex = moduleIndex;
            break;
          }
        }
      }
    }
    
    console.log("Final found quiz:", foundQuiz);
    setQuiz(foundQuiz);
    
    // Set timer berdasarkan quiz yang ditemukan
    if (foundQuiz) {
      setTimeLeft(foundQuiz.timeLimit || 600);
    }
    
    // Cek apakah ada attempt terakhir dan hitung cooldown
    const lastAttempt = localStorage.getItem(`quiz_attempt_${quizId}_${user.id}`);
    if (lastAttempt) {
      const attemptTime = parseInt(lastAttempt);
      const now = Date.now();
      const timeDiff = now - attemptTime;
      const cooldownTime = 60000; // 1 menit dalam milidetik
      
      if (timeDiff < cooldownTime) {
        setRetryCooldown(Math.ceil((cooldownTime - timeDiff) / 1000));
        setLastAttemptTime(attemptTime);
      }
    }
  }, [courseId, quizId, user.id]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeLeft, showResults]);

  // Retry cooldown timer
  useEffect(() => {
    if (retryCooldown > 0) {
      const timer = setTimeout(() => setRetryCooldown(retryCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [retryCooldown]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowResults(true);
    setIsSubmitting(false);
    
    // Simpan waktu attempt
    localStorage.setItem(`quiz_attempt_${quizId}_${user.id}`, Date.now().toString());
    
    // Update progress/enrollment jika lulus
    const score = calculateScore();
    const passingScore = quiz.passingScore || 70;
    
    if (score.percentage >= passingScore) {
      // Simpan hasil quiz ke progress
      const progress = localStorageService.getCourseProgress(user.id, courseId);
      const newCompletedQuizzes = [...(progress.completedQuizzes || []), `${quiz.moduleIndex}-${quizId}`];
      
      localStorageService.updateProgress(
        user.id, 
        courseId, 
        progress.progress || 0, 
        progress.completedLessons || [],
        newCompletedQuizzes
      );
      
      localStorageService.completeCourse(user.id, courseId);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
    };
  };

  const score = showResults ? calculateScore() : null;
  const passingScore = quiz?.passingScore || 70;
  const isPassed = score && score.percentage >= passingScore;

  if (!quiz) {
    return (
      <div className="min-vh-100 d-flex flex-column bg-light">

        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <div className="alert alert-danger">
            Quiz tidak ditemukan atau sudah dihapus.
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-vh-100 d-flex flex-column bg-light">

        <main className="flex-grow-1 py-8">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                {/* Results Header */}
                <div className="text-center mb-6">
                  <h1 className="display-5 fw-bold text-black mb-4">Hasil Kuis</h1>
                  <div
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${
                      isPassed
                        ? "bg-success text-white"
                        : "bg-danger text-white"
                    }`}
                  >
                    {isPassed ? "🎉 Selamat!" : "😔 Coba Lagi"}
                    <span>
                      Skor: {score.correct}/{score.total} ({score.percentage}%)
                    </span>
                  </div>
                  <p className="text-muted mt-2">
                    Nilai minimum lulus: {passingScore}%
                  </p>
                </div>

                {/* Score Details */}
                <div className="card shadow-sm border-0 rounded-lg mb-6">
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-md-4">
                        <div className="h2 fw-bold text-success mb-2">
                          {score.correct}
                        </div>
                        <div className="text-muted">Jawaban Benar</div>
                      </div>
                      <div className="col-md-4">
                        <div className="h2 fw-bold text-danger mb-2">
                          {score.total - score.correct}
                        </div>
                        <div className="text-muted">Jawaban Salah</div>
                      </div>
                      <div className="col-md-4">
                        <div className="h2 fw-bold text-primary mb-2">
                          {score.percentage}%
                        </div>
                        <div className="text-muted">Skor Akhir</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Review */}
                <div className="card shadow-sm border-0 rounded-lg mb-6">
                  <div className="card-header bg-white py-3">
                    <h5 className="card-title mb-0 fw-bold">
                      <i className="bi bi-list-check me-2 text-success"></i>
                      Review Jawaban
                    </h5>
                  </div>
                  <div className="card-body">
                    {quiz.questions.map((question, index) => {
                      const userAnswer = selectedAnswers[index];
                      const isCorrect = userAnswer === question.correctAnswer;

                      return (
                        <div
                          key={question.id}
                          className="border rounded-3 p-4 mb-4"
                        >
                          <div className="d-flex align-items-start gap-3">
                            <div
                              className={`badge rounded-pill px-3 py-2 ${
                                isCorrect ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {isCorrect ? "✓" : "✗"}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-3">
                                {index + 1}. {question.question}
                              </h6>

                              <div className="mb-3">
                                {question.options.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className={`p-3 rounded-3 border mb-2 ${
                                      optionIndex === question.correctAnswer
                                        ? "bg-success text-white border-success"
                                        : optionIndex === userAnswer && !isCorrect
                                          ? "bg-danger text-white border-danger"
                                          : "bg-light border-secondary"
                                    }`}
                                  >
                                    <div className="d-flex align-items-center gap-3">
                                      <div
                                        className={`rounded-circle border-2 d-flex align-items-center justify-content-center ${
                                          optionIndex === question.correctAnswer
                                            ? "border-white bg-white"
                                            : optionIndex === userAnswer && !isCorrect
                                              ? "border-white bg-white"
                                              : "border-secondary"
                                        }`}
                                        style={{ width: '20px', height: '20px' }}
                                      >
                                        {optionIndex === question.correctAnswer && (
                                          <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                        )}
                                        {optionIndex === userAnswer && !isCorrect && (
                                          <div className="bg-danger rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                        )}
                                      </div>
                                      <span className={optionIndex === question.correctAnswer ? "text-white fw-medium" : ""}>
                                        {option}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="bg-info bg-opacity-10 border border-info rounded-3 p-3">
                                <div className="fw-semibold text-info mb-1">
                                  Penjelasan:
                                </div>
                                <div className="text-info">
                                  {question.explanation}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-center gap-3">
                  <Link
                    to={`/belajar/${courseId}`}
                    className="btn btn-primary btn-lg px-4"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Lanjut Belajar
                  </Link>
                  {!isPassed && (
                    <button
                      onClick={() => {
                        if (retryCooldown > 0) {
                          alert(`Tunggu ${formatTime(retryCooldown)} sebelum mencoba lagi!`);
                          return;
                        }
                        window.location.reload();
                      }}
                      disabled={retryCooldown > 0}
                      className="btn btn-secondary btn-lg px-4"
                    >
                      {retryCooldown > 0 ? `Tunggu ${formatTime(retryCooldown)}` : 'Ulangi Kuis'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>


      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">


      <main className="flex-grow-1 py-8">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Quiz Header */}
              <div className="card shadow-sm border-0 rounded-lg mb-6">
                <div className="card-header bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h1 className="h3 fw-bold mb-0">{quiz?.title || "Loading..."}</h1>
                    <div
                      className={`badge rounded-pill px-3 py-2 fw-semibold ${
                        timeLeft <= 60
                          ? "bg-danger text-white"
                          : "bg-primary text-white"
                      }`}
                    >
                      <i className="bi bi-clock me-1"></i>
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {/* Progress Bar */}
                  <div className="progress mb-3" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-primary"
                      style={{
                        width: `${((currentQuestion + 1) / quiz?.questions.length) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <div className="text-muted">
                    Pertanyaan {currentQuestion + 1} dari {quiz?.questions.length || 0}
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="card shadow-sm border-0 rounded-lg mb-6">
                <div className="card-body p-5">
                  <h2 className="h4 fw-bold mb-4">
                    {quiz?.questions[currentQuestion]?.question || "Loading question..."}
                  </h2>

                  <div className="space-y-3">
                    {quiz?.questions[currentQuestion]?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-100 text-start p-4 rounded-3 border-2 transition-colors ${
                          selectedAnswers[currentQuestion] === index
                            ? "border-primary bg-primary bg-opacity-10"
                            : "border-light hover:border-primary hover:bg-light"
                        }`}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className={`rounded-circle border-2 d-flex align-items-center justify-content-center ${
                              selectedAnswers[currentQuestion] === index
                                ? "border-primary bg-primary"
                                : "border-secondary"
                            }`}
                            style={{ width: '24px', height: '24px' }}
                          >
                            {selectedAnswers[currentQuestion] === index && (
                              <div className="bg-white rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                            )}
                          </div>
                          <span className="fw-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="d-flex justify-content-between align-items-center">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestion === 0}
                  className="btn btn-light btn-lg px-4"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Sebelumnya
                </button>

                <div className="d-flex gap-2">
                  {quiz?.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`btn rounded-circle ${
                        index === currentQuestion
                          ? "btn-primary"
                          : selectedAnswers[index] !== undefined
                            ? "btn-success"
                            : "btn-outline-secondary"
                      }`}
                      style={{ width: '40px', height: '40px' }}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {currentQuestion === quiz?.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      Object.keys(selectedAnswers).length < quiz?.questions.length
                    }
                    className="btn btn-success btn-lg px-4"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Selesai
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={selectedAnswers[currentQuestion] === undefined}
                    className="btn btn-primary btn-lg px-4"
                  >
                    Selanjutnya
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Quiz;