import React from 'react';
import { Link } from 'react-router-dom';

const QuizManager = ({ moduleId, courseId, quizzes, onAddQuiz, onDeleteQuiz }) => {
  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium">Kuis dalam Modul ini</h4>
        <Link
          to={`/kursus/${courseId}/modul/${moduleId}/kuis/buat`}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Tambah Kuis
        </Link>
      </div>

      <div className="space-y-2">
        {quizzes.map((quiz, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <div>
              <p className="font-medium">{quiz.title}</p>
              <p className="text-sm text-gray-500">
                {quiz.questions.length} Pertanyaan • {quiz.timeLimit / 60} Menit
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/kursus/${courseId}/modul/${moduleId}/kuis/${quiz.id}/edit`}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </Link>
              <button
                onClick={() => onDeleteQuiz(quiz.id)}
                className="text-red-500 hover:text-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        
        {quizzes.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Belum ada kuis untuk modul ini
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManager;
