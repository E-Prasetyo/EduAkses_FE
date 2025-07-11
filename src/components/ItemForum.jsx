import React from "react";
import { useNavigate } from "react-router-dom";

const ItemForum = ({ id, avatar, judul, detail, nama, waktu, balasan }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/forum/${id}`, {
      state: { id, avatar, judul, detail, nama, waktu, balasan },
    });
  };

  return (
    <>
      <style>
        {`
          .forum-item {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            transition: background-color 0.2s ease;
            border-bottom: 1px solid #dee2e6;
            cursor: pointer;
          }

          .forum-item:hover {
            background-color: #f8f8f8;
          }

          .forum-item-left {
            display: flex;
            align-items: flex-start;
          }

          .forum-avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 16px;
          }

          .forum-info {
            display: flex;
            flex-direction: column;
          }

          .forum-title {
            font-size: 1rem;
            font-weight: 700;
            margin: 0 0 4px 0;
            color: #000;
          }

          .forum-meta {
            font-size: 0.85rem;
            color: #666666;
            margin: 0;
          }

          .forum-reply-count {
            font-size: 0.85rem;
            color: #666666;
            font-weight: 500;
            white-space: nowrap;
            padding-top: 6px;
            text-align: right;
          }
        `}
      </style>

      <div className="forum-item" onClick={handleClick}>
        <div className="forum-item-left">
          <img src={avatar} alt="avatar" className="forum-avatar" />
          <div className="forum-info">
            <h6 className="forum-title">{judul}</h6>
            <p className="forum-meta">
              Ditanyakan oleh {nama}, {waktu}
            </p>
          </div>
        </div>
        <div className="forum-reply-count">{balasan} Balasan</div>
      </div>
    </>
  );
};

export default ItemForum;
