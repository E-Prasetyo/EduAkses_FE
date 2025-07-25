import React from "react";
import { Dropdown, Button } from "react-bootstrap";

const ForumActions = ({
  currentUser,
  isLiked,
  likes,
  forumItem,
  onLikeTopic,
  onShare,
  onBookmark,
  onReport,
  onTogglePin,
  onToggleLock,
}) => {
  return (
    <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-end">
      {/* Like Button */}
      {currentUser && (
        <Button
          variant={isLiked ? "danger" : "outline-danger"}
          size="sm"
          className="d-flex align-items-center"
          onClick={onLikeTopic}>
          <i
            className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"} me-1`}></i>
          <span className="d-none d-sm-inline">
            {isLiked ? "Liked" : "Like"}
          </span>
          <span className="ms-1">({likes || 0})</span>
        </Button>
      )}

      {/* Share Button - Mobile friendly */}
      <Button
        variant="outline-primary"
        size="sm"
        className="d-flex align-items-center"
        onClick={onShare}>
        <i className="bi bi-share me-1"></i>
        <span className="d-none d-sm-inline">Share</span>
      </Button>

      {/* Bookmark Button */}
      <Button
        variant="outline-success"
        size="sm"
        className="d-flex align-items-center"
        onClick={onBookmark}>
        <i className="bi bi-bookmark me-1"></i>
        <span className="d-none d-sm-inline">Simpan</span>
      </Button>

      {/* More Options Dropdown */}
      <Dropdown align="end">
        <Dropdown.Toggle variant="outline-secondary" size="sm">
          <i className="bi bi-three-dots"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={onReport}>
            <i className="bi bi-flag me-2"></i>Laporkan
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => navigator.clipboard.writeText(window.location.href)}>
            <i className="bi bi-link-45deg me-2"></i>Copy Link
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            <i className="bi bi-printer me-2"></i>Print
          </Dropdown.Item>

          {/* Admin Actions */}
          {currentUser?.role === "admin" && (
            <>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onTogglePin}>
                <i className="bi bi-pin me-2"></i>
                {forumItem.isPinned ? "Unpin" : "Pin"} Topik
              </Dropdown.Item>
              <Dropdown.Item onClick={onToggleLock}>
                <i className="bi bi-lock me-2"></i>
                {forumItem.isLocked ? "Unlock" : "Lock"} Topik
              </Dropdown.Item>
              <Dropdown.Item className="text-warning">
                <i className="bi bi-eye-slash me-2"></i>Sembunyikan
              </Dropdown.Item>
              <Dropdown.Item className="text-danger">
                <i className="bi bi-trash me-2"></i>Hapus
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ForumActions;
