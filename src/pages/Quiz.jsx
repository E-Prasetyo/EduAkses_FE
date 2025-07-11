import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";

const Quiz = () => {
  const { id, quizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock quiz data - would come from backend with randomized questions
  const quiz = {
    id: quizId,
    title: "Kuis Modul 1: Pengenalan Komputer",
    timeLimit: 600, // 10 minutes
    questions: [
      {
        id: 1,
        question: "Apa kepanjangan dari CPU?",
        type: "multiple-choice",
        options: [
          "Computer Processing Unit",
          "Central Processing Unit",
          "Central Program Unit",
          "Computer Program Unit",
        ],
        correctAnswer: 1,
        explanation:
          "CPU adalah singkatan dari Central Processing Unit, yang merupakan unit pemrosesan pusat dalam komputer.",
      },
      {
        id: 2,
        question: "Manakah yang termasuk perangkat input?",
        type: "multiple-choice",
        options: ["Monitor", "Printer", "Keyboard", "Speaker"],
        correctAnswer: 2,
        explanation:
          "Keyboard adalah perangkat input yang digunakan untuk memasukkan data ke dalam komputer.",
      },
      {
        id: 3,
        question: "Apa fungsi utama RAM dalam komputer?",
        type: "multiple-choice",
        options: [
          "Menyimpan data secara permanen",
          "Memproses data",
          "Menyimpan data sementara saat komputer berjalan",
          "Menampilkan data di layar",
        ],
        correctAnswer: 2,
        explanation:
          "RAM (Random Access Memory) berfungsi sebagai memori sementara yang menyimpan data dan program yang sedang digunakan.",
      },
      {
        id: 4,
        question: "Mana pernyataan yang benar tentang perbedaan HDD dan SSD?",
        type: "multiple-choice",
        options: [
          "HDD lebih cepat dari SSD",
          "SSD menggunakan piringan berputar",
          "SSD lebih cepat dan tidak ada bagian yang bergerak",
          "HDD dan SSD memiliki kecepatan yang sama",
        ],
        correctAnswer: 2,
        explanation:
          "SSD (Solid State Drive) lebih cepat dari HDD karena menggunakan memori flash dan tidak memiliki bagian mekanis yang bergerak.",
      },
      {
        id: 5,
        question: "Apa yang dimaksud dengan sistem operasi?",
        type: "multiple-choice",
        options: [
          "Program untuk membuat dokumen",
          "Perangkat keras komputer",
          "Software yang mengelola sumber daya komputer",
          "Program untuk browsing internet",
        ],
        correctAnswer: 2,
        explanation:
          "Sistem operasi adalah perangkat lunak yang mengelola sumber daya komputer dan menyediakan platform untuk program lain berjalan.",
      },
    ],
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeLeft, showResults]);

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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setShowResults(true);
    setIsSubmitting(false);
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

  if (showResults) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <Header />

        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4">
            {/* Results Header */}
            <div className="text-center mb-8">
              <h1 className="font-exo font-bold text-3xl mb-4">Hasil Kuis</h1>
              <div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${
                  score.percentage >= 70
                    ? "bg-edu-green text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {score.percentage >= 70 ? "🎉 Selamat!" : "😔 Coba Lagi"}
                <span>
                  Skor: {score.correct}/{score.total} ({score.percentage}%)
                </span>
              </div>
            </div>

            {/* Score Details */}
            <div className="bg-edu-white-grey p-8 rounded-2xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-edu-green">
                    {score.correct}
                  </div>
                  <div className="text-edu-dark-gray">Jawaban Benar</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-500">
                    {score.total - score.correct}
                  </div>
                  <div className="text-edu-dark-gray">Jawaban Salah</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-edu-primary">
                    {score.percentage}%
                  </div>
                  <div className="text-edu-dark-gray">Skor Akhir</div>
                </div>
              </div>
            </div>

            {/* Question Review */}
            <div className="space-y-6 mb-8">
              <h2 className="font-exo font-semibold text-2xl">
                Review Jawaban
              </h2>
              {quiz.questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className="bg-white border border-edu-light-grey rounded-2xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                          isCorrect ? "bg-edu-green" : "bg-red-500"
                        }`}
                      >
                        {isCorrect ? "✓" : "✗"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-exo font-semibold text-lg mb-3">
                          {index + 1}. {question.question}
                        </h3>

                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                optionIndex === question.correctAnswer
                                  ? "bg-edu-green text-white border-edu-green"
                                  : optionIndex === userAnswer && !isCorrect
                                    ? "bg-red-100 border-red-300"
                                    : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    optionIndex === question.correctAnswer
                                      ? "border-white bg-white"
                                      : optionIndex === userAnswer && !isCorrect
                                        ? "border-red-500"
                                        : "border-gray-300"
                                  }`}
                                >
                                  {optionIndex === question.correctAnswer && (
                                    <div className="w-3 h-3 bg-edu-green rounded-full"></div>
                                  )}
                                  {optionIndex === userAnswer && !isCorrect && (
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                  )}
                                </div>
                                <span
                                  className={
                                    optionIndex === question.correctAnswer
                                      ? "text-white font-medium"
                                      : ""
                                  }
                                >
                                  {option}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="font-semibold text-blue-800 mb-1">
                            Penjelasan:
                          </div>
                          <div className="text-blue-700">
                            {question.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <Link
                to={`/kursus/${id}/belajar`}
                className="px-6 py-3 bg-edu-primary text-white rounded-lg font-jost font-medium hover:bg-opacity-90 transition-colors"
              >
                Lanjut Belajar
              </Link>
              {score.percentage < 70 && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg font-jost font-medium hover:bg-opacity-90 transition-colors"
                >
                  Ulangi Kuis
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Quiz Header */}
          <div className="bg-white border border-edu-light-grey rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-exo font-bold text-2xl">{quiz.title}</h1>
              <div
                className={`px-4 py-2 rounded-lg font-semibold ${
                  timeLeft <= 60
                    ? "bg-red-500 text-white"
                    : "bg-edu-white-grey text-edu-dark-gray"
                }`}
              >
                ⏰ {formatTime(timeLeft)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-edu-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
                }}
              ></div>
            </div>

            <div className="text-edu-dark-gray">
              Pertanyaan {currentQuestion + 1} dari {quiz.questions.length}
            </div>
          </div>

          {/* Question */}
          <div className="bg-white border border-edu-light-grey rounded-2xl p-8 mb-8">
            <h2 className="font-exo font-semibold text-xl mb-6">
              {quiz.questions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-edu-primary bg-edu-primary bg-opacity-10"
                      : "border-gray-200 hover:border-edu-primary hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? "border-edu-primary bg-edu-primary"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-jost text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg font-jost font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Sebelumnya
            </button>

            <div className="flex items-center gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full font-semibold text-sm transition-colors ${
                    index === currentQuestion
                      ? "bg-edu-primary text-white"
                      : selectedAnswers[index] !== undefined
                        ? "bg-edu-green text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  Object.keys(selectedAnswers).length < quiz.questions.length
                }
                className="px-6 py-3 bg-edu-green text-white rounded-lg font-jost font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Mengirim..." : "Selesai"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="px-6 py-3 bg-edu-primary text-white rounded-lg font-jost font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
