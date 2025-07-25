import React from "react";

const FloatingActionButton = ({ onClick }) => {
  return (
    <div className="d-md-none">
      <button
        className="position-fixed"
        onClick={onClick}
        style={{
          bottom: "20px",
          right: "20px",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
          border: "none",
          color: "white",
          fontSize: "1.8rem",
          zIndex: 1000,
          boxShadow: "0 8px 25px rgba(255, 107, 107, 0.4)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1) rotate(90deg)";
          e.target.style.boxShadow = "0 12px 35px rgba(255, 107, 107, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1) rotate(0deg)";
          e.target.style.boxShadow = "0 8px 25px rgba(255, 107, 107, 0.4)";
        }}
        onMouseDown={(e) => {
          e.target.style.transform = "scale(0.95)";
        }}
        onMouseUp={(e) => {
          e.target.style.transform = "scale(1.1) rotate(90deg)";
        }}
        title="Buat Topik Baru">
        <i className="bi bi-plus-lg"></i>
      </button>
    </div>
  );
};

export default FloatingActionButton;
