import React, { useState } from "react";

const StarRating = ({ rating, onRate, readonly = false, size = "1rem" }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starIndex) => {
    if (!readonly && onRate) {
      onRate(starIndex + 1);
    }
  };

  const handleStarHover = (starIndex) => {
    if (!readonly) {
      setHoverRating(starIndex + 1);
    }
  };

  const handleStarLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="star-rating d-flex align-items-center">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isFilled =
          starValue <= (hoverRating || rating || 0) ? true : false;

        return (
          <span
            key={index}
            className={`star ${readonly ? "" : "cursor-pointer"}`}
            style={{
              color: isFilled ? "#ffc107" : "#e4e5e9",
              fontSize: size,
              marginRight: "2px",
              cursor: readonly ? "default" : "pointer",
            }}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleStarHover(index)}
            onMouseLeave={handleStarLeave}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

const RatingSystem = ({ courseId, courseTitle, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      if (onSubmit) {
        onSubmit({ rating, review });
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="alert alert-success">
        <h5 className="alert-heading">
          <i className="fas fa-check-circle me-2"></i>
          Terima kasih atas ulasan Anda!
        </h5>
        <p className="mb-0">
          Rating dan ulasan Anda telah berhasil disimpan dan akan membantu
          pelajar lain dalam memilih kursus.
        </p>
      </div>
    );
  }

  return (
    <div className="rating-system">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="card-title fw-bold mb-3">
            <i className="fas fa-star text-warning me-2"></i>
            Beri Rating & Ulasan
          </h5>
          <p className="text-muted mb-4">
            Bagikan pengalaman Anda tentang kursus "{courseTitle}" untuk
            membantu pelajar lain.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-medium">
                Rating Keseluruhan <span className="text-danger">*</span>
              </label>
              <div className="d-flex align-items-center gap-3">
                <StarRating rating={rating} onRate={setRating} size="1.5rem" />
                <span className="text-muted">
                  {rating > 0 && (
                    <>
                      {rating}/5 {rating <= 2 && "⭐ Kurang Memuaskan"}
                      {rating === 3 && "⭐⭐ Cukup Baik"}
                      {rating === 4 && "⭐⭐⭐ Sangat Baik"}
                      {rating === 5 && "⭐⭐⭐⭐ Luar Biasa!"}
                    </>
                  )}
                </span>
              </div>
              {rating === 0 && (
                <small className="text-danger">
                  Silakan pilih rating terlebih dahulu
                </small>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="review" className="form-label fw-medium">
                Ulasan (Opsional)
              </label>
              <textarea
                id="review"
                className="form-control"
                rows="4"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Ceritakan pengalaman belajar Anda di kursus ini..."
              />
              <div className="form-text">
                Bagikan detail tentang materi, kualitas pengajaran, dan hal-hal
                yang bermanfaat
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                disabled={rating === 0 || loading}
                className="btn btn-edu-primary"
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane me-2"></i>
                    Kirim Ulasan
                  </>
                )}
              </button>
              <button type="button" className="btn btn-outline-secondary">
                Nanti Saja
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="fas fa-comments fa-3x text-muted mb-3"></i>
        <p className="text-muted">Belum ada ulasan untuk kursus ini.</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review, index) => (
        <div key={index} className="review-item border-bottom pb-3 mb-3">
          <div className="d-flex align-items-start gap-3">
            <img
              src={review.avatar || "/api/placeholder/40/40"}
              alt={review.name}
              className="rounded-circle"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-1">
                <strong className="small">{review.name}</strong>
                <StarRating rating={review.rating} readonly size="0.9rem" />
                <span className="text-muted small">{review.date}</span>
              </div>
              {review.comment && (
                <p className="small text-muted mb-0">{review.comment}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { RatingSystem, StarRating, ReviewList };
export default RatingSystem;
