import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ModuleQuizzes = ({ courseId, moduleId, quizzes, moduleIndex, onDeleteQuiz }) => {
  const navigate = useNavigate();

  const handleDeleteQuiz = (quizId) => {
    if (window.confirm('Yakin ingin menghapus kuis ini?')) {
      if (onDeleteQuiz) {
        onDeleteQuiz(moduleId, quizId);
      } else {
        alert('Fungsi hapus quiz belum diimplementasikan!');
      }
    }
  };

  return (
    <div className="mt-4 border-top pt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-bold">
          <i className="bi bi-journal-check me-2 text-warning"></i>
          Kuis di Modul Ini
        </h5>
        <Link
          to={`/pengajar/kursus/${courseId}/modul/${moduleId}/quiz/create`}
          className="btn btn-warning btn-sm"
        >
          <i className="bi bi-plus-lg me-1"></i>
          Tambah Kuis
        </Link>
      </div>
      
      {quizzes && quizzes.length > 0 ? (
        <div className="list-group">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="list-group-item list-group-item-action d-flex align-items-center gap-3 p-3"
            >
              <div className="badge bg-warning text-dark rounded-pill px-3 py-2">
                <i className="bi bi-journal-check me-1"></i>
                Kuis
              </div>
              <div className="flex-grow-1">
                <div className="fw-medium">{quiz.title}</div>
                <small className="text-muted">
                  {quiz.questions?.length || 0} Soal • {quiz.timeLimit / 60} Menit • 
                  Nilai Lulus: {quiz.passingScore || 70}%
                </small>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate(`/pengajar/kursus/${courseId}/modul/${moduleId}/quiz/${quiz.id}/edit`)}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDeleteQuiz(quiz.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted">
          <i className="bi bi-journal-x display-6 mb-3"></i>
          <p className="mb-3">Belum ada kuis untuk modul ini</p>
          <Link
            to={`/pengajar/kursus/${courseId}/modul/${moduleId}/quiz/create`}
            className="btn btn-warning"
          >
            <i className="bi bi-plus-lg me-2"></i>
            Buat Kuis Pertama
          </Link>
        </div>
      )}
    </div>
  );
};

export default ModuleQuizzes;
