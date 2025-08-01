import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { localStorageService } from "../services/localStorageService";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { courseAPI } from "../services/api";

const Quiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courseId, quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedAnswersDTO, setSelectedAnswersDTO] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCooldown, setRetryCooldown] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);

  const fetchQuiz = async () => {
    const foundQuiz = await courseAPI.getQuiz(courseId);
    setQuiz(foundQuiz.data.quizzes);
  
    // // Set timer berdasarkan quiz yang ditemukan
    if (foundQuiz) {
      setTimeLeft(foundQuiz.timeLimit || 600);
    }
    
    // // Cek apakah ada attempt terakhir dan hitung cooldown
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
  }

  useEffect(() => {
    if (!user || !user.id) {
      console.log('User belum ready:', user);
      return;
    }
    // console.log("Quiz component - courseId:", courseId, "quizId:", quizId, "user.id:", user.id);
  
    
    fetchQuiz();
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

  const handleAnswerSelect = (answerIndex, questions, keys) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex,
    });

    setSelectedAnswersDTO(prev => {
      const updated = [...prev];

      // Check if answer for this question already exists
      const existingIndex = updated.findIndex(
        answer => answer.idQuestion === questions.id
      );

      const newAnswer = {
        idQuestion: questions.id,
        keyOption: keys
      };

      if (existingIndex !== -1) {
        updated[existingIndex] = newAnswer;
      } else {
        updated.push(newAnswer);
      }

      return updated;
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
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const sendData = {
      id: courseId,
      questions: selectedAnswersDTO
    }

    const result = await courseAPI.answerQuiz(sendData);
    if (result.status = 'success') {
      setShowResults(true);
      setIsSubmitting(false);
      navigate(`/kuis/result/${courseId}`);
    }
   
    // Simpan waktu attempt
    // localStorage.setItem(`quiz_attempt_${quizId}_${user.id}`, Date.now().toString());
    
    // // Update progress/enrollment jika lulus
    // const score = calculateScore();
    // const passingScore = quiz.passingScore || 70;
    
    // if (score.percentage >= passingScore) {
    //   // Simpan hasil quiz ke progress
    //   const progress = localStorageService.getCourseProgress(user.id, courseId);
    //   const newCompletedQuizzes = [...(progress.completedQuizzes || []), `${quiz.moduleIndex}-${quizId}`];
      
    //   localStorageService.updateProgress(
    //     user.id, 
    //     courseId, 
    //     progress.progress || 0, 
    //     progress.completedLessons || [],
    //     newCompletedQuizzes
    //   );
      
    //   localStorageService.completeCourse(user.id, courseId);
    // }
  };

  // const calculateScore = () => {
  //   let correct = 0;
  //   quiz.questions.forEach((question, index) => {
  //     if (selectedAnswers[index] === question.correctAnswer) {
  //       correct++;
  //     }
  //   });
  //   return {
  //     correct,
  //     total: quiz.questions.length,
  //     percentage: Math.round((correct / quiz.questions.length) * 100),
  //   };
  // };

  // const score = showResults ? calculateScore() : null;
  // const passingScore = quiz?.passingScore || 70;
  // const isPassed = score && score.percentage >= passingScore;

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
                        onClick={() => handleAnswerSelect(index, quiz?.questions[currentQuestion], option.keys)}
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
                          <span className="fw-medium">{option.text}</span>
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