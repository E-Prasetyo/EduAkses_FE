import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ItemForum.css"; // optional

const ItemForum = ({ id, avatar, judul, nama, waktu, balasan }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/forum/${id}`);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-between p-3 border-bottom forum-item"
      onClick={handleClick}
      style={{ cursor: "pointer" }} // agar ada efek pointer saat hover
    >
      <div className="d-flex align-items-start">
        <img
          src={avatar}
          alt="avatar"
          className="rounded-circle me-3"
          width={40}
          height={40}
        />
        <div>
          <h6 className="mb-1 fw-bold">{judul}</h6>
          <p className="mb-0 text-muted small">
            Ditanyakan oleh {nama}, {waktu}
          </p>
        </div>
      </div>
      <div className="text-end text-muted small">{balasan} Balasan</div>
    </div>
  );
};

export default ItemForum;
