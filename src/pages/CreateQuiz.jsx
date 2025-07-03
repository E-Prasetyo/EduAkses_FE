import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreateQuiz = () => {
  const { courseId, moduleId } = useParams();
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
    // Here you would submit to backend
    console.log("Quiz Data:", quizData);
    console.log("Questions:", questions);
    alert("Kuis berhasil dibuat!");
  };

  return (
    <div className="flex flex-col items-end bg-white min-h-screen">
      <Header />

      {/* Header */}
      <div className="w-full bg-black text-white py-8">
        <div className="w-full max-w-[1290px] mx-auto px-4">
          <h1 className="text-4xl font-exo font-bold">Buat Kuis</h1>
          <p className="text-gray-300 mt-2">
            Tambahkan kuis untuk menguji pemahaman siswa
          </p>
        </div>
      </div>

      <main className="flex-1 w-full py-8">
        <div className="w-full max-w-[1290px] mx-auto px-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Quiz Information */}
            <div className="bg-white border border-edu-light-grey rounded-2xl p-6">
              <h2 className="text-2xl font-exo font-semibold mb-6">
                Informasi Kuis
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Kuis *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={quizData.title}
                    onChange={handleQuizDataChange}
                    required
                    className="w-full h-12 px-4 border border-edu-light-grey rounded-lg focus:outline-none focus:border-edu-primary"
                    placeholder="Contoh: Kuis Modul 1 - Pengenalan Komputer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batas Waktu (menit)
                  </label>
                  <input
                    type="number"
                    name="timeLimit"
                    value={quizData.timeLimit / 60}
                    onChange={(e) =>
                      setQuizData({
                        ...quizData,
                        timeLimit: parseInt(e.target.value) * 60,
                      })
                    }
                    min="1"
                    max="180"
                    className="w-full h-12 px-4 border border-edu-light-grey rounded-lg focus:outline-none focus:border-edu-primary"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi (opsional)
                  </label>
                  <textarea
                    name="description"
                    value={quizData.description}
                    onChange={handleQuizDataChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-edu-light-grey rounded-lg focus:outline-none focus:border-edu-primary resize-none"
                    placeholder="Jelaskan tentang kuis ini..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai Minimum Lulus (%)
                  </label>
                  <input
                    type="number"
                    name="passingScore"
                    value={quizData.passingScore}
                    onChange={handleQuizDataChange}
                    min="50"
                    max="100"
                    className="w-full h-12 px-4 border border-edu-light-grey rounded-lg focus:outline-none focus:border-edu-primary"
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="bg-white border border-edu-light-grey rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-exo font-semibold">
                  Soal Kuis ({questions.length})
                </h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 bg-edu-green text-white rounded-lg font-jost font-medium hover:bg-opacity-90 transition-colors"
                >
                  + Tambah Soal
                </button>
              </div>

              <div className="space-y-6">
                {questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-6 relative"
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-exo font-semibold text-lg">
                        Soal {questionIndex + 1}
                      </h3>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Question Text */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pertanyaan *
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "question",
                            e.target.value,
                          )
                        }
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-edu-primary resize-none"
                        placeholder="Tulis pertanyaan di sini..."
                      />
                    </div>

                    {/* Options */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Pilihan Jawaban *
                      </label>
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-3"
                          >
                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() =>
                                updateQuestion(
                                  questionIndex,
                                  "correctAnswer",
                                  optionIndex,
                                )
                              }
                              className="w-5 h-5 text-edu-primary"
                            />
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  updateOption(
                                    questionIndex,
                                    optionIndex,
                                    e.target.value,
                                  )
                                }
                                required
                                className="w-full h-10 px-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:border-edu-primary"
                                placeholder={`Pilihan ${String.fromCharCode(65 + optionIndex)}`}
                              />
                              {question.correctAnswer === optionIndex && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-edu-green">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                  >
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Klik radio button untuk menandai jawaban yang benar
                      </p>
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Penjelasan *
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "explanation",
                            e.target.value,
                          )
                        }
                        required
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-edu-primary resize-none"
                        placeholder="Jelaskan mengapa jawaban ini benar..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Link
                to={`/kursus/${courseId}/kelola`}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-jost font-medium hover:bg-opacity-90 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-edu-primary text-white rounded-lg font-jost font-medium hover:bg-opacity-90 transition-colors"
              >
                Simpan Kuis
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateQuiz;
