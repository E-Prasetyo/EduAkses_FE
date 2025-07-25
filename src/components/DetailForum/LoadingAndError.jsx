import React from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Loading Component
export const LoadingComponent = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Card
        className="shadow-sm border-0"
        style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body className="text-center py-5">
          <div className="mb-4">
            <div
              className="spinner-border text-danger"
              role="status"
              style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>

          <h4 className="text-dark mb-3">Memuat Diskusi Forum</h4>

          <p className="text-muted mb-4">
            Mohon tunggu sebentar, kami sedang memuat data forum untuk Anda.
          </p>

          <div className="d-flex justify-content-center">
            <div className="progress" style={{ width: "200px", height: "4px" }}>
              <div
                className="progress-bar bg-danger progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: "75%" }}></div>
            </div>
          </div>

          <small className="text-muted d-block mt-3">
            <i className="bi bi-shield-check me-1"></i>
            Data tersimpan dengan aman di browser Anda
          </small>
        </Card.Body>
      </Card>
    </div>
  );
};

// Error Component
export const ErrorComponent = ({ error, forumId }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleToForum = () => {
    navigate("/forum");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleClearCache = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus semua data cache? Tindakan ini tidak dapat dibatalkan."
      )
    ) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center py-5">
                {/* Error Icon */}
                <div className="mb-4">
                  <i
                    className="bi bi-exclamation-triangle text-warning"
                    style={{ fontSize: "4rem" }}></i>
                </div>

                {/* Error Title */}
                <h3 className="text-dark mb-3">Forum Tidak Ditemukan</h3>

                {/* Error Message */}
                <p className="text-muted mb-4">
                  {error ||
                    `Forum dengan ID ${forumId} tidak tersedia atau telah dihapus.`}
                </p>

                {/* Error Details Alert */}
                <Alert variant="light" className="text-start mb-4">
                  <h6 className="fw-bold mb-2">
                    <i className="bi bi-info-circle me-2"></i>
                    Kemungkinan Penyebab:
                  </h6>
                  <ul className="mb-0 small">
                    <li>Forum telah dihapus atau dipindahkan</li>
                    <li>Link yang Anda akses sudah tidak valid</li>
                    <li>Data cache browser mengalami masalah</li>
                    <li>Koneksi internet terputus saat memuat data</li>
                  </ul>
                </Alert>

                {/* Action Buttons */}
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={handleBack}
                    className="d-flex align-items-center justify-content-center">
                    <i className="bi bi-arrow-left me-2"></i>
                    Kembali
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="lg"
                    onClick={handleToForum}
                    className="d-flex align-items-center justify-content-center">
                    <i className="bi bi-house me-2"></i>
                    Ke Halaman Forum
                  </Button>
                </div>

                {/* Additional Actions */}
                <div className="mt-4 pt-3 border-top">
                  <h6 className="text-muted mb-3">Atau coba:</h6>

                  <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleRefresh}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Refresh Halaman
                    </Button>

                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={handleClearCache}>
                      <i className="bi bi-trash me-1"></i>
                      Bersihkan Cache
                    </Button>
                  </div>
                </div>

                {/* Help Link */}
                <div className="mt-4">
                  <small className="text-muted">
                    Masih mengalami masalah?{" "}
                    <a href="/help" className="text-decoration-none">
                      Hubungi bantuan
                    </a>
                  </small>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Network Error Component
export const NetworkErrorComponent = ({ onRetry }) => {
  return (
    <Alert variant="danger" className="mb-4">
      <div className="d-flex align-items-center">
        <i className="bi bi-wifi-off me-3 fs-4"></i>
        <div className="flex-grow-1">
          <h6 className="mb-1">Koneksi Bermasalah</h6>
          <p className="mb-2">
            Tidak dapat memuat data. Periksa koneksi internet Anda dan coba
            lagi.
          </p>
          <Button variant="danger" size="sm" onClick={onRetry}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Coba Lagi
          </Button>
        </div>
      </div>
    </Alert>
  );
};

// Empty State Component
export const EmptyStateComponent = ({
  icon = "bi-inbox",
  title = "Tidak Ada Data",
  description = "Belum ada data yang tersedia.",
  actionText = "Muat Ulang",
  onAction,
}) => {
  return (
    <div className="text-center py-5">
      <div className="mb-4">
        <i className={`bi ${icon} text-muted`} style={{ fontSize: "4rem" }}></i>
      </div>

      <h4 className="text-muted mb-3">{title}</h4>

      <p
        className="text-muted mb-4"
        style={{ maxWidth: "400px", margin: "0 auto" }}>
        {description}
      </p>

      {onAction && (
        <Button variant="outline-primary" onClick={onAction}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          {actionText}
        </Button>
      )}
    </div>
  );
};
