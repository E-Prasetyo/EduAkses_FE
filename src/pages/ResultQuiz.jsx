import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { courseAPI } from '../services/api';
import { useRef } from "react";


const ResultQuiz = () => {
  // const { user } = useAuth();
    const hasFetched = useRef(false);
    const { courseId } = useParams();

    const [resultAnswer, setResultAnswer] = useState([]);
    //  const [retryCooldown, setRetryCooldown] = useState(0);
  

    useEffect(() => {
    
      const fetchQuiz = async () => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        const result = await courseAPI.getReviewAnswerQuiz(courseId);
        setResultAnswer(result.data.result);
      };

        fetchQuiz();
        console.log('✅ useEffect dijalankan');
      
        return () => {
          console.log('🔁 Cleanup dipanggil');
        };
    }, []);
  
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
                      resultAnswer?.isPassed
                        ? "bg-success text-white"
                        : "bg-danger text-white"
                    }`}
                  >
                    {resultAnswer.isPassed ? "🎉 Selamat!" : "😔 Coba Lagi"}
                    <span>
                      Skor: {resultAnswer.correct_answer}/{resultAnswer.totalQuestion} ({resultAnswer.score}%)
                    </span>
                  </div>
                  <p className="text-muted mt-2">
                    Nilai minimum lulus: {resultAnswer.passingScore}%
                  </p>
                </div>

                {/* Score Details */}
                <div className="card shadow-sm border-0 rounded-lg mb-6">
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-md-4">
                        <div className="h2 fw-bold text-success mb-2">
                          {resultAnswer.correct_answer}
                        </div>
                        <div className="text-muted">Jawaban Benar</div>
                      </div>
                      <div className="col-md-4">
                        <div className="h2 fw-bold text-danger mb-2">
                          {resultAnswer.false_answer}
                        </div>
                        <div className="text-muted">Jawaban Salah</div>
                      </div>
                      <div className="col-md-4">
                        <div className="h2 fw-bold text-primary mb-2">
                          {resultAnswer.score}%
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
                    {resultAnswer?.review?.map((question, index) => {
                      return (
                         <div
                          key={question.id}
                          className="border rounded-3 p-4 mb-4"
                        >
                          <div className="d-flex align-items-start gap-3">
                            {question.is_correct ? "✓" : "✗"}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-3">
                              {index + 1}. {question.question_text}
                            </h6>
                            <div className="mb-3">
                              {question.options.map((option, optionIndex) => (
                               <div
                                  key={optionIndex}
                                  className={`p-3 rounded-3 border mb-2 ${
                                    option.keys === question.correct_answer
                                      ? "bg-success text-white border-success"
                                      : option.keys === question.user_answer && !question.is_correct
                                        ? "bg-danger text-white border-danger"
                                        : "bg-light border-secondary"
                                  }`}
                                >
                                  {option.text}
                                </div>
                              ))}
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

                      )
                    })}
                    {/* {resultAnswer.review.map((question, index) => {
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

                             <div className="mb-3"> */}
                                {/* {question.options.map((option, optionIndex) => (
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
                                ))} */}
                              {/* </div> 

                              <div className="bg-info bg-opacity-10 border border-info rounded-3 p-3">
                                <div className="fw-semibold text-info mb-1">
                                  Penjelasan:
                                </div>
                                <div className="text-info">
                                  {resultAnswer.explanation}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })} */}
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
                  {/* {!resultAnswer.isPassed && (
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
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </main>


      </div>
    );
}

export default ResultQuiz;