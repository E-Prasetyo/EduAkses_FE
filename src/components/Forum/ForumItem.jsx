// src/components/Forum/ForumItem.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";
import "../../styles/ForumItem.css";

const ForumItem = ({
  item,
  category,
  isLiked,
  getRelativeTime,
  handleLikeTopic,
}) => {
  const primary = "var(--edu-primary)";
  const primaryLight = "rgba(220,53,69,0.1)";
  const primaryBorder = "rgba(220,53,69,0.2)";

  return (
    <div className="forum-card mobile mb-4">
      {/* garis dekor atas */}
      <div className="forum-card__topline" />

      <div className="forum-card__inner">
        <div className="d-flex gap-3">
          {/* Avatar */}
          <div className="position-relative flex-shrink-0">
            <div className="forum-avatar-wrap">
              <img
                src={item.avatar}
                alt={item.nama}
                onError={(e) =>
                  (e.currentTarget.src = "https://i.pravatar.cc/52?img=0")
                }
              />
            </div>
            <div className="online-dot" />
          </div>

          {/* Content */}
          <div className="flex-grow-1 min-w-0">
            {/* Kategori + waktu */}
            <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-1">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <Badge
                  style={{
                    backgroundColor: primary,
                    color: "#fff",
                    borderRadius: 12,
                    padding: "0.35rem 0.8rem",
                    fontSize: ".75rem",
                    fontWeight: 600,
                    letterSpacing: ".5px",
                    boxShadow: `0 4px 12px ${primary}40`,
                  }}>
                  {category.name}
                </Badge>

                {item.isPinned && (
                  <Badge bg="warning" text="dark" style={{ borderRadius: 12 }}>
                    📌 Pinned
                  </Badge>
                )}
                {item.isLocked && (
                  <Badge bg="secondary" style={{ borderRadius: 12 }}>
                    🔒 Locked
                  </Badge>
                )}

                <span
                  className="time-badge"
                  style={{ background: primaryLight, color: primary }}>
                  🕐 {getRelativeTime(item.waktu)}
                </span>
              </div>
            </div>

            {/* Judul */}
            <Link
              to={`/forum/${item.id}`}
              className="text-decoration-none d-block mb-2">
              <h4
                className="forum-title"
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "#1a202c",
                  lineHeight: 1.4,
                  margin: 0,
                }}>
                {item.judul}
              </h4>
            </Link>

            {/* Admin + waktu */}
            <div className="author-row d-flex align-items-center text-muted">
              <i className="bi bi-person-circle text-danger" />
              <span className="fw-semibold text-dark">{item.nama}</span>
              <span>• {getRelativeTime(item.waktu)}</span>
            </div>

            {/* Deskripsi */}
            {item.detail && (
              <div className="forum-desc-box mb-3">
                <p className="desc-truncate forum-desc-text">{item.detail}</p>
              </div>
            )}

            {/* Tags */}
            {!!item.tags?.length && (
              <div className="d-flex flex-wrap gap-2 mb-3">
                {item.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="tag-pill"
                    style={{
                      background: primaryLight,
                      color: primary,
                      borderRadius: 12,
                      padding: ".35rem .7rem",
                      fontSize: ".8rem",
                      fontWeight: 500,
                      border: `1px solid ${primaryBorder}`,
                    }}>
                    #{tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="tag-more">
                    +{item.tags.length - 3} lainnya
                  </span>
                )}
              </div>
            )}

            {/* Stats + Button */}
            <div className="forum-stats-wrap no-bg">
              <Link
                to={`/forum/${item.id}`}
                className="text-decoration-none me-auto">
                <button className="read-btn w-100 w-sm-auto">
                  Baca Selengkapnya →
                </button>
              </Link>

              <div className="ms-auto d-flex align-items-center gap-3 stats-right">
                {/* Replies */}
                <button type="button" className="stat-link" title="Balasan">
                  <i className="bi bi-chat-dots" />
                  <span>{item.jumlahBalasan || 0}</span>
                </button>

                {/* Views */}
                <button type="button" className="stat-link" title="Dilihat">
                  <i className="bi bi-eye" />
                  <span>{item.views || 0}</span>
                </button>

                {/* Likes */}
                <button
                  type="button"
                  className={`stat-link ${isLiked ? "active" : ""}`}
                  title="Suka"
                  onClick={(e) => handleLikeTopic(e, item.id)}>
                  <i
                    className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}
                  />
                  <span>{item.likes || 0}</span>
                </button>
              </div>
            </div>
          </div>
          {/* end content */}
        </div>
      </div>
    </div>
  );
};

export default ForumItem;
