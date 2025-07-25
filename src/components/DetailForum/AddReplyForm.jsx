import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Alert, Collapse, ProgressBar } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

const MAX_CHARS = 1000;
const MIN_CHARS = 10;
const EMOJIS = ["😀", "😎", "👏", "🔥", "💡", "✅", "❗", "🙏"];

const AddReplyForm = ({
  currentUser,
  newReply,
  handleMainReplyChange,
  handleSendReply,
  isSubmitting,
  forumItem,
}) => {
  const [showTips, setShowTips] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);

  const text = String(newReply || "");
  const charCount = text.length;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  const charPercent = Math.min(100, (charCount / MAX_CHARS) * 100);
  const tooShort = charCount < MIN_CHARS;
  const tooLong = charCount > MAX_CHARS;
  const canSubmit =
    !isSubmitting &&
    !forumItem.isLocked &&
    !tooShort &&
    !tooLong &&
    text.trim();

  const colorByCount = () => {
    if (tooLong) return "danger";
    if (charPercent > 80) return "warning";
    if (!tooShort) return "success";
    return "secondary";
  };

  const insertAtCursor = (snippet) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newValue = text.substring(0, start) + snippet + text.substring(end);
    handleMainReplyChange({ target: { value: newValue } });
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + snippet.length;
    }, 0);
  };

  if (!currentUser) {
    return (
      <Card className="shadow-sm border-danger">
        <Card.Body className="text-center py-5">
          <div className="mb-4">
            <i
              className="bi bi-person-plus text-danger"
              style={{ fontSize: "3rem" }}
            />
          </div>
          <h5 className="text-dark mb-3">Login untuk Berpartisipasi</h5>
          <p className="text-muted mb-4">
            Silakan login untuk memberikan balasan, like, dan berinteraksi dalam
            diskusi ini.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <Button variant="danger" size="lg">
              <i className="bi bi-box-arrow-in-right me-2" /> Login Sekarang
            </Button>
            <Button variant="outline-danger" size="lg">
              <i className="bi bi-person-plus me-2" /> Daftar Akun
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      {/* HEADER */}
      <Card.Header className="bg-danger text-white">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <img
              src={currentUser.avatar || "https://i.pravatar.cc/32?img=10"}
              alt="avatar"
              className="rounded-circle me-3"
              style={{ width: 32, height: 32, objectFit: "cover" }}
              onError={(e) => (e.target.src = "https://i.pravatar.cc/32?img=0")}
            />
            <div>
              <div className="d-flex align-items-center">
                <i className="bi bi-plus-circle me-2" />
                <span className="fw-bold">Tambah Balasan</span>
              </div>
              <small className="opacity-75 d-block">
                Sebagai {currentUser.name}
              </small>
            </div>
          </div>

          <Button
            variant="light"
            size="sm"
            className="border-0 text-dark"
            onClick={() => setShowTips((p) => !p)}
            aria-expanded={showTips}
            aria-controls="tips-panel"
            title="Tips Menulis">
            <i className="bi bi-question-circle" />
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        {/* LOCKED */}
        {forumItem.isLocked && (
          <Alert variant="warning" className="mb-3">
            <i className="bi bi-lock-fill me-2" />
            <strong>Topik Dikunci.</strong> Tidak dapat menambahkan balasan
            baru.
          </Alert>
        )}

        {/* TIPS */}
        <Collapse in={showTips}>
          <div id="tips-panel" className="mb-3">
            <Alert variant="info" className="mb-0">
              <h6 className="fw-bold mb-2">
                <i className="bi bi-lightbulb me-2" />
                Tips Menulis Balasan yang Baik
              </h6>
              <ul className="mb-0 small">
                <li>Jelas, ringkas, dan relevan dengan pertanyaan</li>
                <li>Tambah contoh atau referensi bila ada</li>
                <li>Gunakan bahasa sopan dan konstruktif</li>
                <li>
                  Gunakan format (bold/italic/code) untuk menonjolkan poin
                  penting
                </li>
              </ul>
            </Alert>
          </div>
        </Collapse>

        {/* LABEL */}
        <label className="form-label mb-2 d-flex align-items-center gap-1">
          <i className="bi bi-chat-dots" /> Balasan Anda:
        </label>

        {/* EMOJI TOOLBAR */}
        <div className="btn-toolbar mb-2" role="toolbar">
          <div className="btn-group me-2" role="group">
            <Button
              variant="outline-secondary"
              size="sm"
              title="Daftar"
              onClick={() => insertAtCursor("\n- ")}>
              <i className="bi bi-list-ul" />
            </Button>
          </div>
          <div className="btn-group" role="group">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowEmoji((v) => !v)}
              title="Emoji">
              😊
            </Button>
          </div>
        </div>

        <Collapse in={showEmoji}>
          <div className="mb-2 d-flex flex-wrap gap-1">
            {EMOJIS.map((e) => (
              <Button
                key={e}
                variant="light"
                size="sm"
                className="px-2"
                onClick={() => {
                  insertAtCursor(e);
                  setShowEmoji(false);
                }}>
                {e}
              </Button>
            ))}
          </div>
        </Collapse>

        {/* TEXTAREA */}
        <textarea
          ref={textareaRef}
          className={`form-control border-2 ${tooLong ? "border-danger" : ""}`}
          rows={3}
          style={{ resize: "vertical", minHeight: 100, maxHeight: 300 }}
          placeholder={`Tuliskan balasan Anda...\n\nTips:\n• Jelaskan langkah-langkah\n• Beri contoh konkret\n• Cantumkan sumber jika ada`}
          value={text}
          onChange={handleMainReplyChange}
          disabled={isSubmitting || forumItem.isLocked}
        />

        {/* COUNTER */}
        <div className="mt-2">
          <ProgressBar
            now={charPercent}
            variant={colorByCount()}
            style={{ height: 6 }}
            className="mb-1"
          />
          <div className="d-flex justify-content-between small text-muted flex-wrap gap-2">
            <span>Berikan jawaban yang konstruktif dan membantu</span>
            <span className={`text-${colorByCount()}`}>
              {charCount}/{MAX_CHARS} karakter
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="d-flex justify-content-end mt-3">
          <Button
            variant="danger"
            size="lg"
            className="px-4"
            onClick={handleSendReply}
            disabled={!canSubmit}>
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Mengirim...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2" /> Kirim Balasan
              </>
            )}
          </Button>
        </div>

        {/* VALIDATION */}
        {text.trim() && !canSubmit && !isSubmitting && (
          <div className="mt-2">
            {tooShort && (
              <small className="text-warning">
                <i className="bi bi-exclamation-triangle me-1" />
                Minimal {MIN_CHARS} karakter
              </small>
            )}
            {tooLong && (
              <small className="text-danger">
                <i className="bi bi-exclamation-triangle me-1" />
                Maksimal {MAX_CHARS} karakter
              </small>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AddReplyForm;
