// src/components/DetailForum/QuestionDetail.jsx
import React, { useState } from "react";
import { Badge, Collapse, Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
};

const QuestionDetail = ({
  forumItem,
  currentUser,
  isLiked,
  onLikeTopic,
  localStorageService,
}) => {
  const [showFullDetail, setShowFullDetail] = useState(false);
  const [showStorage, setShowStorage] = useState(false);
  const isMobile = useIsMobile();

  const { detail = "", tags = [], likes = 0 } = forumItem;

  const maxLength = isMobile ? 220 : 360;
  const truncated = detail.length > maxLength && !showFullDetail;
  const contentToShow = truncated ? detail.slice(0, maxLength) + "..." : detail;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: forumItem.judul,
          text: detail,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link telah disalin ke clipboard!");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      alert("Link telah disalin ke clipboard!");
    }
  };

  const handleBookmark = () => {
    const key = "forum_bookmarks";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    const idx = list.findIndex((b) => b.id === forumItem.id);
    if (idx === -1) {
      list.push({
        id: forumItem.id,
        title: forumItem.judul,
        ts: new Date().toISOString(),
      });
      alert("Forum berhasil disimpan!");
    } else {
      list.splice(idx, 1);
      alert("Forum dihapus dari simpanan.");
    }
    localStorage.setItem(key, JSON.stringify(list));
  };

  const handleReport = () =>
    alert(
      `Terima kasih! Laporan untuk topik "${forumItem.judul}" akan ditinjau oleh moderator.`
    );

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        {/* Title + Actions */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <h4 className="mb-0 text-center text-md-start d-flex align-items-center gap-2">
            {/* IKON ❓ MERAH JADI TOGGLE */}
            <button
              type="button"
              className="btn p-0 border-0 bg-transparent text-danger d-flex align-items-center"
              onClick={() => setShowStorage((v) => !v)}
              aria-expanded={showStorage}
              aria-controls="storage-info"
              title="Status penyimpanan"
              style={{ lineHeight: 1 }}>
              <i className="bi bi-question-circle-fill" />
            </button>
            Detail Pertanyaan
          </h4>

          {/* Action buttons */}
          <div className="d-flex flex-wrap gap-2">
            <Button
              variant={isLiked ? "danger" : "outline-danger"}
              size="sm"
              onClick={onLikeTopic}
              className="d-flex align-items-center gap-1">
              <i className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`} />
              <span>{isLiked ? `Liked (${likes})` : `Like (${likes})`}</span>
            </Button>

            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleShare}
              className="d-flex align-items-center gap-1">
              <i className="bi bi-share" />
              <span>Share</span>
            </Button>

            <Button
              variant="outline-success"
              size="sm"
              onClick={handleBookmark}
              className="d-flex align-items-center gap-1">
              <i className="bi bi-bookmark-plus" />
              <span>Simpan</span>
            </Button>

            {/* Dropdown lainnya */}
            <div className="dropdown">
              <Button
                variant="outline-secondary"
                size="sm"
                className="dropdown-toggle"
                data-bs-toggle="dropdown">
                <i className="bi bi-three-dots" />
              </Button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={handleReport}>
                    <i className="bi bi-flag me-2" />
                    Laporkan
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => window.print()}>
                    <i className="bi bi-printer me-2" />
                    Print
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={async () => {
                      await navigator.clipboard.writeText(window.location.href);
                      alert("Link disalin!");
                    }}>
                    <i className="bi bi-link-45deg me-2" />
                    Copy Link
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detail text */}
        <div className="bg-light rounded p-3 p-md-4 mb-3">
          <div
            className="lead mb-0"
            style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            <ReactMarkdown>{contentToShow}</ReactMarkdown>
          </div>

          {detail.length > maxLength && (
            <Button
              variant="link"
              size="sm"
              className="p-0 text-decoration-none mt-2"
              onClick={() => setShowFullDetail((s) => !s)}>
              {showFullDetail ? (
                <>
                  <i className="bi bi-chevron-up me-1" />
                  Tampilkan lebih sedikit
                </>
              ) : (
                <>
                  <i className="bi bi-chevron-down me-1" />
                  Tampilkan selengkapnya
                </>
              )}
            </Button>
          )}
        </div>

        {/* Tags */}
        {!!tags.length && (
          <div className="mb-4">
            <h6 className="text-muted mb-2">
              <i className="bi bi-tags me-1" />
              Tags:
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <Badge
                  key={i}
                  bg="light"
                  text="dark"
                  className="px-2 py-1 border"
                  style={{ cursor: "pointer" }}
                  onClick={() => console.log("Search tag:", tag)}>
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Status Penyimpanan: hidden by default, toggled by ❓ */}
        <Collapse in={showStorage}>
          <div id="storage-info" className="alert alert-info mb-0">
            <StorageInfo
              localStorageService={localStorageService}
              currentUser={currentUser}
            />
          </div>
        </Collapse>
      </div>
    </div>
  );
};

const StorageInfo = ({ localStorageService, currentUser }) => (
  <div className="d-flex align-items-start">
    <i className="bi bi-database me-2 mt-1" />
    <div>
      <strong>Status Penyimpanan:</strong> Data tersimpan secara lokal di
      browser.
      <br />
      <small className="text-muted">
        Total forum: {localStorageService.getForumItems().length} • User:{" "}
        {currentUser?.name || "Guest"} • Draft tersimpan:{" "}
        {Object.keys(localStorageService.getReplyDrafts()).length}
      </small>
    </div>
  </div>
);

export default QuestionDetail;
