import React, { useState } from "react";
import { Link } from "react-router-dom";

const EnrollButton = ({ courseId, price, isEnrolled = false, onEnroll }) => {
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onEnroll) {
        onEnroll();
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <div className="d-grid">
        <Link
          to={`/belajar/${courseId}`}
          className="btn btn-edu-primary btn-lg"
        >
          <i className="fas fa-play me-2"></i>
          Lanjut Belajar
        </Link>
        <Link
          to="/pelajar/dashboard"
          className="btn btn-outline-secondary btn-sm mt-2"
        >
          Lihat di Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="d-grid">
      {price === 0 || price === "free" ? (
        <button
          onClick={handleEnroll}
          disabled={loading}
          className="btn btn-edu-primary btn-lg"
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Mendaftar...
            </>
          ) : (
            <>
              <i className="fas fa-plus me-2"></i>
              Daftar Gratis
            </>
          )}
        </button>
      ) : (
        <>
          <button
            onClick={handleEnroll}
            disabled={loading}
            className="btn btn-edu-primary btn-lg"
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Memproses...
              </>
            ) : (
              <>
                <i className="fas fa-shopping-cart me-2"></i>
                Beli Sekarang - Rp {price.toLocaleString()}
              </>
            )}
          </button>
          <small className="text-muted text-center mt-2">
            <i className="fas fa-shield-alt me-1"></i>
            Garansi uang kembali 30 hari
          </small>
        </>
      )}
    </div>
  );
};

export default EnrollButton;
