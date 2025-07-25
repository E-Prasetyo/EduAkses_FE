import React from "react";
import { Badge } from "react-bootstrap";

// Utility function untuk relative time
const getRelativeTime = (timestamp) => {
  const now = new Date();
  const posted = new Date(timestamp);
  const diffSec = Math.floor((now - posted) / 1000);

  if (diffSec < 60) return "baru saja";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)} hari lalu`;
  return new Date(timestamp).toLocaleDateString("id-ID");
};

const ForumHeader = ({ forumItem, category, totalReplies, forumId }) => {
  const { avatar, judul, nama, waktu, views, likes } = forumItem;

  return (
    <div className="bg-dark text-white py-4 py-md-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Avatar - Responsif untuk mobile */}
          <div className="col-12 col-md-2 text-center mb-3 mb-md-0">
            <div
              className="avatar-box d-inline-block"
              style={{
                width: window.innerWidth < 768 ? 80 : 100,
                height: window.innerWidth < 768 ? 80 : 100,
                borderRadius: "15%",
                overflow: "hidden",
                border: "3px solid #fff",
                boxShadow: "0 4px 12px rgba(0,0,0,.15)",
              }}>
              <img
                src={avatar}
                alt="avatar"
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.src = "https://i.pravatar.cc/80?img=0";
                }}
              />
            </div>
          </div>

          <div className="col-12 col-md-10">
            {/* Badges */}
            <div className="mb-3 text-center text-md-start">
              <Badge
                style={{ backgroundColor: category.color, border: "none" }}
                className="me-2 mb-2">
                <i className="bi bi-tag-fill me-1"></i>
                {category.name}
              </Badge>
              {forumItem.isPinned && (
                <Badge bg="warning" className="me-2 mb-2">
                  <i className="bi bi-pin-fill me-1"></i>Pinned
                </Badge>
              )}
              {forumItem.isLocked && (
                <Badge bg="secondary" className="me-2 mb-2">
                  <i className="bi bi-lock-fill me-1"></i>Locked
                </Badge>
              )}
            </div>

            {/* Title - Responsif */}
            <h1
              className="mb-3 text-white text-center text-md-start"
              style={{
                lineHeight: "1.3",
                fontSize: window.innerWidth < 768 ? "1.5rem" : "2rem",
              }}>
              {judul}
            </h1>

            {/* User & Time Info */}
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start gap-2 gap-md-3 mb-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-person-circle me-2"></i>
                <span className="text-center">
                  Ditanyakan oleh <strong>{nama}</strong>
                </span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-clock me-2"></i>
                <span>{getRelativeTime(waktu)}</span>
              </div>
            </div>

            {/* Stats - Grid responsif untuk mobile */}
            <div className="row g-2 text-light text-center text-md-start">
              <div className="col-6 col-md-3">
                <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                  <i className="bi bi-chat-dots me-2"></i>
                  <span className="small">{totalReplies} balasan</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                  <i className="bi bi-eye me-2"></i>
                  <span className="small">{views || 0} views</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                  <i className="bi bi-heart-fill me-2"></i>
                  <span className="small">{likes || 0} likes</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                  <i className="bi bi-hash me-1"></i>
                  <span className="small">ID: {forumId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumHeader;
