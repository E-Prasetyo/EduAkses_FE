// src/components/DetailForum/ReplyComponent.jsx
import React, { useCallback, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Badge, Dropdown, Button, Collapse, Modal } from "react-bootstrap";
import localStorageService from "../../services/localStorageService";

// ===== Helpers =====
const getRelativeTime = (timestamp) => {
  const now = new Date();
  const posted = new Date(timestamp);
  const diffSec = Math.floor((now - posted) / 1000);
  if (diffSec < 60) return "baru saja";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)} hari lalu`;
  return posted.toLocaleDateString("id-ID");
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
};

// Success Toast
const showToast = (message, type = "success") => {
  const toastElement = document.createElement("div");
  toastElement.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  toastElement.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
  toastElement.innerHTML = `
    <i class="bi bi-${type === "success" ? "check-circle" : "exclamation-triangle"} me-2"></i>
    ${message}
    <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
  `;
  document.body.appendChild(toastElement);
  setTimeout(() => {
    if (toastElement.parentElement) {
      toastElement.remove();
    }
  }, 4000);
};

// ===== Component =====
const ReplyComponent = React.memo(function ReplyComponent({
  reply,
  depth = 0,
  parentPath = [],
  activeReply,
  setActiveReply,
  replyTexts,
  setReplyTexts,
  toggleLike,
  addNestedReply,
  currentUser,
  onReportReply,
  onDeleteReply, // New prop for delete function
  onHideReply, // New prop for hide function
}) {
  const isMobile = useIsMobile();
  const [showReplies, setShowReplies] = useState(true);
  const [expandedBody, setExpandedBody] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHideModal, setShowHideModal] = useState(false);
  const [isHidden, setIsHidden] = useState(reply.isHidden || false);

  const isReplying = activeReply === reply.id;
  const isOwnReply = currentUser && reply.userId === currentUser.id;
  const currentPath = useMemo(
    () => [...parentPath, reply.id],
    [parentPath, reply.id]
  );

  // Truncate logic
  const maxLen = isMobile ? 180 : 360;
  const shouldTruncate = reply.isi?.length > maxLen;
  const bodyToShow =
    shouldTruncate && !expandedBody
      ? reply.isi.slice(0, maxLen) + "..."
      : reply.isi;

  // Draft handlers
  const handleReplyTextChange = useCallback(
    (e) => {
      const value = e?.target?.value ?? "";
      setReplyTexts((prev) => ({ ...prev, [reply.id]: value }));
      localStorageService.setReplyDraft(reply.id, value);
    },
    [reply.id, setReplyTexts]
  );

  const handleLikeClick = () => {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu untuk memberikan like.");
      return;
    }
    toggleLike(reply.id, parentPath);
  };

  // Admin functions
  const handleDeleteConfirm = () => {
    if (onDeleteReply) {
      onDeleteReply(reply.id, parentPath);
      showToast("Balasan berhasil dihapus!");
    }
    setShowDeleteModal(false);
  };

  const handleHideConfirm = () => {
    const newHiddenState = !isHidden;
    setIsHidden(newHiddenState);

    if (onHideReply) {
      onHideReply(reply.id, parentPath, newHiddenState);
    }

    showToast(
      newHiddenState
        ? "Balasan berhasil disembunyikan!"
        : "Balasan berhasil ditampilkan kembali!"
    );
    setShowHideModal(false);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(reply.isi || "");
      showToast("Teks berhasil disalin!");
    } catch (err) {
      showToast("Gagal menyalin teks!", "danger");
    }
  };

  const handleShare = async () => {
    const url = window.location.href + `#reply-${reply.id}`;

    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: `Balasan dari ${reply.nama}`,
          text: reply.isi?.substring(0, 100) + "...",
          url,
        });
      } catch (err) {
        // If share fails, copy to clipboard
        await navigator.clipboard.writeText(url);
        showToast("Link berhasil disalin!");
      }
    } else {
      await navigator.clipboard.writeText(url);
      showToast("Link berhasil disalin!");
    }
  };

  const marginLeft =
    depth === 0 ? 0 : Math.min(depth * (isMobile ? 12 : 18), 72); // px
  const nestedLine = depth > 0;

  // Don't render if hidden (unless admin)
  if (isHidden && currentUser?.role !== "admin") {
    return null;
  }

  return (
    <>
      <div style={{ marginTop: depth ? "1rem" : 0, position: "relative" }}>
        {/* Vertical line to indicate nesting */}
        {nestedLine && (
          <div
            style={{
              position: "absolute",
              left: marginLeft - 10,
              top: 0,
              bottom: 0,
              width: 2,
              background: "#e9ecef",
            }}
          />
        )}

        <div style={{ marginLeft }}>
          <div
            className={`bg-white border rounded p-2 p-md-3 mb-3 shadow-sm ${isHidden ? "opacity-50 border-warning" : ""}`}>
            {/* Hidden indicator */}
            {isHidden && (
              <div className="alert alert-warning py-1 mb-2">
                <small>
                  <i className="bi bi-eye-slash me-1"></i>
                  Balasan ini disembunyikan - hanya admin yang dapat melihat
                </small>
              </div>
            )}

            {/* HEADER */}
            <div className="d-flex align-items-start">
              {/* Avatar */}
              <img
                src={reply.avatar}
                alt={reply.nama}
                className="rounded-circle me-2 me-md-3 flex-shrink-0"
                style={{
                  width: isMobile ? 32 : 40,
                  height: isMobile ? 32 : 40,
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.currentTarget.src = "https://i.pravatar.cc/40?img=0";
                }}
              />

              {/* Content container */}
              <div className="flex-grow-1 min-w-0">
                {/* User row */}
                <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <strong className="text-dark">{reply.nama}</strong>
                    {isOwnReply && (
                      <Badge bg="primary" className="small">
                        Anda
                      </Badge>
                    )}
                    {isHidden && (
                      <Badge bg="warning" className="small">
                        <i className="bi bi-eye-slash me-1"></i>Disembunyikan
                      </Badge>
                    )}
                    <small className="text-muted">
                      {getRelativeTime(reply.waktu)}
                    </small>
                  </div>

                  {/* Dropdown actions */}
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="light"
                      size="sm"
                      className="border-0 shadow-none p-1">
                      <i className="bi bi-three-dots" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => onReportReply && onReportReply(reply)}>
                        <i className="bi bi-flag me-2" />
                        Laporkan
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleCopyText}>
                        <i className="bi bi-clipboard me-2" />
                        Copy Text
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleShare}>
                        <i className="bi bi-share me-2" />
                        Bagikan
                      </Dropdown.Item>

                      {/* Admin Actions */}
                      {currentUser?.role === "admin" && (
                        <>
                          <Dropdown.Divider />
                          <Dropdown.Item
                            className="text-warning"
                            onClick={() => setShowHideModal(true)}>
                            <i
                              className={`bi ${isHidden ? "bi-eye" : "bi-eye-slash"} me-2`}
                            />
                            {isHidden ? "Tampilkan" : "Sembunyikan"}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-danger"
                            onClick={() => setShowDeleteModal(true)}>
                            <i className="bi bi-trash me-2" />
                            Hapus
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                {/* BODY */}
                <div className="mb-3 reply-content">
                  <ReactMarkdown>{bodyToShow || ""}</ReactMarkdown>

                  {shouldTruncate && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-decoration-none mt-1"
                      onClick={() => setExpandedBody((v) => !v)}>
                      {expandedBody ? (
                        <>
                          <i className="bi bi-chevron-up me-1" />
                          Tampilkan lebih sedikit
                        </>
                      ) : (
                        <>
                          <i className="bi bi-chevron-down me-1" />
                          Selengkapnya
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="d-flex flex-wrap gap-2 gap-md-3 align-items-center">
                  {/* Like */}
                  <button
                    onClick={handleLikeClick}
                    className={`btn btn-sm border-0 bg-transparent d-flex align-items-center gap-1 p-1 ${
                      reply.isLiked ? "text-danger" : "text-muted"
                    }`}
                    style={{ cursor: currentUser ? "pointer" : "default" }}
                    title={
                      currentUser
                        ? reply.isLiked
                          ? "Batalkan like"
                          : "Like"
                        : "Login untuk like"
                    }
                    disabled={!currentUser}>
                    <i
                      className={`bi ${reply.isLiked ? "bi-heart-fill" : "bi-heart"}`}
                    />
                    <span className="small">{reply.likes || 0}</span>
                  </button>

                  {/* Reply button */}
                  {currentUser && !isHidden && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="d-flex align-items-center"
                      onClick={() =>
                        setActiveReply(isReplying ? null : reply.id)
                      }>
                      <i className="bi bi-reply me-1" />
                      <span className="d-none d-sm-inline">
                        {isReplying ? "Batal" : "Balas"}
                      </span>
                      <span className="d-sm-none">
                        {isReplying ? "Batal" : "Reply"}
                      </span>
                    </Button>
                  )}

                  {/* Reply id */}
                  <small
                    className="text-muted d-none d-md-inline"
                    id={`reply-${reply.id}`}>
                    #{reply.id}
                  </small>

                  {/* Toggle nested replies */}
                  {reply.replies?.length > 0 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-decoration-none"
                      onClick={() => setShowReplies((v) => !v)}>
                      <i
                        className={`bi ${
                          showReplies ? "bi-chevron-up" : "bi-chevron-down"
                        } me-1`}
                      />
                      {reply.replies.length} balasan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* REPLY FORM */}
          <Collapse in={isReplying && currentUser && !isHidden}>
            <div
              className="bg-light border rounded p-3 mb-3"
              style={{ marginLeft: isMobile ? "1rem" : "3rem" }}>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows={isMobile ? 2 : 3}
                  placeholder={`Balas ke @${reply.nama}...`}
                  value={
                    typeof replyTexts[reply.id] === "string"
                      ? replyTexts[reply.id]
                      : ""
                  }
                  onChange={handleReplyTextChange}
                />
                <div className="form-text d-flex justify-content-between">
                  <small>Tulis balasan yang konstruktif</small>
                  <small className="text-muted">
                    {(replyTexts[reply.id] || "").length} karakter
                  </small>
                </div>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveReply(null)}>
                  <i className="bi bi-x me-1" /> Batal
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => addNestedReply(reply.id, parentPath)}
                  disabled={!String(replyTexts[reply.id] || "").trim()}>
                  <i className="bi bi-send me-1" /> Kirim
                </Button>
              </div>
            </div>
          </Collapse>

          {/* NESTED REPLIES */}
          <Collapse in={showReplies}>
            <div>
              {reply.replies?.length > 0 &&
                reply.replies.map((nested) => (
                  <ReplyComponent
                    key={nested.id}
                    reply={nested}
                    depth={depth + 1}
                    parentPath={currentPath}
                    activeReply={activeReply}
                    setActiveReply={setActiveReply}
                    replyTexts={replyTexts}
                    setReplyTexts={setReplyTexts}
                    toggleLike={toggleLike}
                    addNestedReply={addNestedReply}
                    currentUser={currentUser}
                    onReportReply={onReportReply}
                    onDeleteReply={onDeleteReply}
                    onHideReply={onHideReply}
                  />
                ))}
            </div>
          </Collapse>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle text-danger me-2"></i>
            Konfirmasi Hapus
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Apakah Anda yakin ingin menghapus balasan ini?</p>
          <div className="bg-light p-3 rounded">
            <small className="text-muted">Dari: {reply.nama}</small>
            <div className="mt-1">
              <em>"{reply.isi?.substring(0, 100)}..."</em>
            </div>
          </div>
          <p className="text-danger mt-3 mb-0">
            <strong>Peringatan:</strong> Tindakan ini tidak dapat dibatalkan!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <i className="bi bi-trash me-1"></i>
            Ya, Hapus
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Hide Confirmation Modal */}
      <Modal
        show={showHideModal}
        onHide={() => setShowHideModal(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i
              className={`bi ${isHidden ? "bi-eye" : "bi-eye-slash"} text-warning me-2`}></i>
            {isHidden ? "Tampilkan" : "Sembunyikan"} Balasan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Apakah Anda yakin ingin{" "}
            {isHidden ? "menampilkan kembali" : "menyembunyikan"} balasan ini?
          </p>
          <div className="bg-light p-3 rounded">
            <small className="text-muted">Dari: {reply.nama}</small>
            <div className="mt-1">
              <em>"{reply.isi?.substring(0, 100)}..."</em>
            </div>
          </div>
          <p className="text-info mt-3 mb-0">
            {isHidden
              ? "Balasan akan ditampilkan kembali untuk semua pengguna."
              : "Balasan akan disembunyikan dari pengguna biasa, hanya admin yang dapat melihat."}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHideModal(false)}>
            Batal
          </Button>
          <Button variant="warning" onClick={handleHideConfirm}>
            <i
              className={`bi ${isHidden ? "bi-eye" : "bi-eye-slash"} me-1`}></i>
            Ya, {isHidden ? "Tampilkan" : "Sembunyikan"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

ReplyComponent.displayName = "ReplyComponent";

export default ReplyComponent;
