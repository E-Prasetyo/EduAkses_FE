import React from 'react';
import { Link } from 'react-router-dom';

const ModuleQuizzes = ({ courseId, moduleId, quizzes }) => {
  return (
    <div className="mt-4 border-top pt-4">
      <h5 className="mb-3 font-semibold">Kuis di Modul Ini:</h5>
      <div className="list-group">
        {quizzes.map((quiz) => (
          <Link
            key={quiz.id}
            to={`/kursus/${courseId}/modul/${moduleId}/kuis/${quiz.id}`}
            className="list-group-item list-group-item-action d-flex align-items-center gap-3"
          >
            <div className="badge bg-warning text-dark">
              <i className="bi bi-journal-check me-1"></i>
              Kuis
            </div>
            <div>
              <div className="fw-medium">{quiz.title}</div>
              <small className="text-muted">
                {quiz.questions.length} Soal • {quiz.timeLimit / 60} Menit
              </small>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ModuleQuizzes;
