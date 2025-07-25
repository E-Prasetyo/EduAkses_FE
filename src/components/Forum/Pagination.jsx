import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-center mt-5">
      <nav
        aria-label="Forum pagination"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "0.5rem",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}>
        <div className="d-flex align-items-center gap-2">
          {/* Previous Button */}
          <button
            className="btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              border: "2px solid transparent",
              background: currentPage === 1 ? "rgba(0,0,0,0.05)" : "white",
              color: currentPage === 1 ? "#ccc" : "#667eea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
              transition: "all 0.3s ease",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 4px 12px rgba(102, 126, 234, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.target.style.borderColor = "transparent";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}>
            <i className="bi bi-chevron-left"></i>
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            const isActive = pageNum === currentPage;

            // Smart pagination for large page counts
            if (totalPages > 7) {
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    className="btn"
                    onClick={() => onPageChange(pageNum)}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      border: "2px solid transparent",
                      background: isActive
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "white",
                      color: isActive ? "white" : "#667eea",
                      fontWeight: isActive ? "700" : "600",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      boxShadow: isActive
                        ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 4px 12px rgba(102, 126, 234, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.borderColor = "transparent";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }
                    }}>
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === currentPage - 2 ||
                pageNum === currentPage + 2
              ) {
                return (
                  <span
                    key={pageNum}
                    style={{
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6c757d",
                      fontWeight: "600",
                    }}>
                    ⋯
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                className="btn"
                onClick={() => onPageChange(pageNum)}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  border: "2px solid transparent",
                  background: isActive
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "white",
                  color: isActive ? "white" : "#667eea",
                  fontWeight: isActive ? "700" : "600",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  boxShadow: isActive
                    ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(102, 126, 234, 0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.borderColor = "transparent";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}>
                {pageNum}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            className="btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              border: "2px solid transparent",
              background:
                currentPage === totalPages ? "rgba(0,0,0,0.05)" : "white",
              color: currentPage === totalPages ? "#ccc" : "#667eea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
              transition: "all 0.3s ease",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 4px 12px rgba(102, 126, 234, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.borderColor = "transparent";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Pagination;
