import React from "react";

const ProgressTracker = ({
  completedLessons = 0,
  totalLessons = 0,
  showDetails = true,
}) => {
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="progress-tracker">
      {showDetails && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-medium">Progress Belajar</span>
          <span className="text-muted small">
            {completedLessons}/{totalLessons} pelajaran
          </span>
        </div>
      )}

      <div
        className="progress mb-2"
        style={{ height: showDetails ? "8px" : "6px" }}
      >
        <div
          className="progress-bar bg-edu-primary"
          role="progressbar"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span className="visually-hidden">
            {Math.round(progressPercentage)}% selesai
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {Math.round(progressPercentage)}% selesai
          </small>
          {progressPercentage === 100 ? (
            <span className="badge bg-success">
              <i className="fas fa-check me-1"></i>
              Selesai
            </span>
          ) : progressPercentage > 0 ? (
            <span className="badge bg-primary">
              <i className="fas fa-play me-1"></i>
              Sedang Berjalan
            </span>
          ) : (
            <span className="badge bg-secondary">
              <i className="fas fa-clock me-1"></i>
              Belum Dimulai
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
