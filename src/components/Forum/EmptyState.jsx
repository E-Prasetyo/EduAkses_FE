import React from "react";

const EmptyState = ({
  searchQuery,
  selectedCategory,
  setSearchQuery,
  setSelectedCategory,
  onCreateTopic,
}) => {
  const hasFilters = searchQuery || selectedCategory !== "all";

  return (
    <div
      className="text-center py-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
        borderRadius: "20px",
        padding: "4rem 2rem",
        animation: "fadeIn 1s ease-out",
      }}>
      {hasFilters ? (
        <>
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "2rem",
              animation: "bounce 2s infinite",
            }}>
            🔍
          </div>
          <h5
            style={{
              color: "#4a5568",
              fontSize: "1.5rem",
              marginBottom: "1rem",
              fontWeight: "700",
            }}>
            Tidak ada hasil yang ditemukan
          </h5>
          <p
            style={{
              color: "#718096",
              fontSize: "1.1rem",
              marginBottom: "2rem",
              maxWidth: "500px",
              margin: "0 auto 2rem",
            }}>
            Coba gunakan kata kunci yang berbeda atau ubah filter pencarian.
            Atau mungkin Anda ingin memulai diskusi baru tentang topik ini?
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              style={{
                borderRadius: "15px",
                padding: "0.75rem 2rem",
                fontWeight: "600",
                border: "2px solid #667eea",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#667eea";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#667eea";
                e.target.style.transform = "translateY(0)";
              }}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Reset Filter
            </button>
            <button
              className="btn btn-primary"
              onClick={onCreateTopic}
              style={{
                borderRadius: "15px",
                padding: "0.75rem 2rem",
                fontWeight: "600",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 8px 25px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 4px 15px rgba(102, 126, 234, 0.3)";
              }}>
              <i className="bi bi-plus-circle me-2"></i>
              Buat Topik Baru
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "2rem",
              animation: "float 3s ease-in-out infinite",
            }}>
            💭
          </div>
          <h5
            style={{
              color: "#4a5568",
              fontSize: "1.5rem",
              marginBottom: "1rem",
              fontWeight: "700",
            }}>
            Belum ada diskusi
          </h5>
          <p
            style={{
              color: "#718096",
              fontSize: "1.1rem",
              marginBottom: "2rem",
              maxWidth: "500px",
              margin: "0 auto 2rem",
            }}>
            Jadilah yang pertama memulai diskusi di forum ini! Bagikan
            pertanyaan, ide, atau pengalaman Anda.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={onCreateTopic}
            style={{
              borderRadius: "20px",
              padding: "1rem 3rem",
              fontWeight: "700",
              fontSize: "1.1rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px) scale(1.05)";
              e.target.style.boxShadow = "0 12px 35px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.3)";
            }}>
            <i
              className="bi bi-plus-circle me-2"
              style={{ fontSize: "1.2rem" }}></i>
            Buat Pertanyaan Pertama
          </button>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -15px, 0);
          }
          70% {
            transform: translate3d(0, -7px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default EmptyState;
