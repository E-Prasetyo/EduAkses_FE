import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Dropdown,
} from "react-bootstrap";
import Footer from "../components/Footer";
import Header from "../components/Header";

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const posted = new Date(timestamp);
  const diffSec = Math.floor((now - posted) / 1000);
  if (diffSec < 60) return "baru saja";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
  return `${Math.floor(diffSec / 86400)} hari lalu`;
};

// Pindahkan ReplyComponent keluar dari komponen utama
const ReplyComponent = React.memo(
  ({
    reply,
    depth = 0,
    parentPath = [],
    activeReply,
    setActiveReply,
    replyTexts,
    setReplyTexts,
    toggleLike,
    addNestedReply,
  }) => {
    const currentPath = [...parentPath, reply.id];
    const isReplying = activeReply === reply.id;
    const marginLeft = depth > 0 ? `${depth * 3}rem` : "0";

    const handleReplyTextChange = useCallback(
      (e) => {
        const value = e.target.value;
        setReplyTexts((prev) => ({
          ...prev,
          [reply.id]: value,
        }));
      },
      [reply.id, setReplyTexts]
    );

    return (
      <div style={{ marginLeft, marginTop: depth > 0 ? "1rem" : "0" }}>
        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <div className="d-flex">
              <img
                src={reply.avatar}
                alt={reply.nama}
                className="rounded-circle me-3"
                style={{ width: 40, height: 40 }}
              />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong className="text-danger">{reply.nama}</strong>
                    <small className="text-muted ms-2">
                      {getRelativeTime(reply.waktu)}
                    </small>
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="light"
                      size="sm"
                      className="border-0">
                      <i className="fas fa-ellipsis-h"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>Report</Dropdown.Item>
                      <Dropdown.Item>Block User</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <p className="mb-3">{reply.isi}</p>

                <div className="d-flex gap-3">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => toggleLike(reply.id, parentPath)}
                    className="d-flex align-items-center">
                    <i className="fas fa-heart me-1"></i>
                    {reply.likes}
                  </Button>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setActiveReply(isReplying ? null : reply.id)}
                    className="d-flex align-items-center">
                    <i className="fas fa-reply me-1"></i>
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {isReplying && (
          <Card className="mb-3 ms-5">
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Tulis balasan..."
                    value={replyTexts[reply.id] || ""}
                    onChange={handleReplyTextChange}
                  />
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveReply(null)}>
                    Batal
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => addNestedReply(reply.id, parentPath)}>
                    <i className="fas fa-paper-plane me-1"></i>
                    Kirim
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}

        {reply.replies &&
          reply.replies.map((nestedReply) => (
            <ReplyComponent
              key={nestedReply.id}
              reply={nestedReply}
              depth={depth + 1}
              parentPath={currentPath}
              activeReply={activeReply}
              setActiveReply={setActiveReply}
              replyTexts={replyTexts}
              setReplyTexts={setReplyTexts}
              toggleLike={toggleLike}
              addNestedReply={addNestedReply}
            />
          ))}
      </div>
    );
  }
);

const DetailForum = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <Container className="text-center mt-5">
        <p>Data forum tidak ditemukan.</p>
        <Button variant="primary" onClick={() => navigate("/pages/Diskusi")}>
          Kembali ke Forum
        </Button>
      </Container>
    );
  }

  const { avatar, judul, detail, nama, waktu } = state;

  const [replies, setReplies] = useState([
    {
      id: 1,
      avatar: "https://i.pravatar.cc/40?img=12",
      nama: "Laura Haptur",
      isi: "Ini adalah balasan pertama.",
      waktu: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      likes: 0,
      replies: [],
    },
  ]);

  const [newReply, setNewReply] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

  const handleNewReplyChange = useCallback((e) => {
    setNewReply(e.target.value);
  }, []);

  const handleSendReply = useCallback(async () => {
    if (!newReply.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const replyBaru = {
        id: generateId(),
        avatar: "https://i.pravatar.cc/40?img=30",
        nama: "Fulan",
        isi: newReply.trim(),
        waktu: new Date().toISOString(),
        likes: 0,
        replies: [],
      };

      setReplies((prev) => [replyBaru, ...prev]);
      setNewReply("");
    } finally {
      setIsSubmitting(false);
    }
  }, [newReply, isSubmitting]);

  const addNestedReply = useCallback(
    (parentId, parentPath = []) => {
      const replyText = replyTexts[parentId];
      if (!replyText || !replyText.trim() || isSubmitting) return;

      setIsSubmitting(true);

      const newReply = {
        id: generateId(),
        avatar: "https://i.pravatar.cc/40?img=30",
        nama: "Fulan",
        isi: replyText.trim(),
        waktu: new Date().toISOString(),
        likes: 0,
        replies: [],
      };

      const updateReplies = (repliesArray, path) => {
        if (path.length === 0) {
          return repliesArray.map((item) =>
            item.id === parentId
              ? { ...item, replies: [...item.replies, newReply] }
              : item
          );
        }

        const [currentId, ...rest] = path;
        return repliesArray.map((item) =>
          item.id === currentId
            ? {
                ...item,
                replies: updateReplies(item.replies || [], rest),
              }
            : item
        );
      };

      setReplies((prevReplies) => updateReplies(prevReplies, parentPath));
      setReplyTexts((prev) => ({ ...prev, [parentId]: "" }));
      setActiveReply(null);
      setIsSubmitting(false);
    },
    [replyTexts, isSubmitting]
  );

  const toggleLike = useCallback((replyId, parentPath = []) => {
    const updateLikes = (repliesArray, path) => {
      if (path.length === 0) {
        return repliesArray.map((item) =>
          item.id === replyId ? { ...item, likes: item.likes + 1 } : item
        );
      }

      const [currentId, ...rest] = path;
      return repliesArray.map((item) =>
        item.id === currentId
          ? {
              ...item,
              replies: updateLikes(item.replies || [], rest),
            }
          : item
      );
    };

    setReplies((prevReplies) => updateLikes(prevReplies, parentPath));
  }, []);

  return (
    <>
      <div className="bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={2}>
              <div className="bg-white rounded p-3 text-center">
                <img
                  src={avatar}
                  alt="avatar"
                  className="img-fluid rounded"
                  style={{ maxWidth: 80 }}
                />
              </div>
            </Col>
            <Col md={10}>
              <h2 className="mb-3">{judul}</h2>
              <p className="text-light mb-0">
                Ditanyakan oleh <strong>{nama}</strong>, {waktu}
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="my-5">
        <Row>
          <Col>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="text-danger mb-3">
                  <i className="fas fa-question-circle me-2 text-danger"></i>
                  Pertanyaan
                </h4>

                <p className="lead">{detail}</p>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>
                    <i className="fas fa-comments me-2"></i>
                    Balasan ({replies.length})
                  </h5>
                  <Badge bg="danger" className="py-2 px-3">
                    {replies.reduce((total, r) => {
                      const countNestedReplies = (reply) => {
                        let count = 1;
                        if (reply.replies && reply.replies.length > 0) {
                          reply.replies.forEach((nestedReply) => {
                            count += countNestedReplies(nestedReply);
                          });
                        }
                        return count;
                      };
                      return total + countNestedReplies(r);
                    }, 0)}{" "}
                    Total Komentar
                  </Badge>
                </div>

                {replies.map((reply) => (
                  <ReplyComponent
                    key={reply.id}
                    reply={reply}
                    activeReply={activeReply}
                    setActiveReply={setActiveReply}
                    replyTexts={replyTexts}
                    setReplyTexts={setReplyTexts}
                    toggleLike={toggleLike}
                    addNestedReply={addNestedReply}
                  />
                ))}

                <div className="text-end mt-4">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/")}>
                    Kembali ke Forum
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Header className="bg-danger  text-white">
                <h5 className="mb-0">
                  <i className="fas fa-plus-circle me-2"></i>Tambah Balasan
                </h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Control
                      key="main-reply-textarea"
                      as="textarea"
                      rows={4}
                      placeholder="Tuliskan komentar Anda..."
                      value={newReply}
                      onChange={handleNewReplyChange}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="warning"
                      onClick={handleSendReply}
                      disabled={!newReply.trim() || isSubmitting}>
                      <i className="fas fa-paper-plane me-2"></i>
                      {isSubmitting ? "Mengirim..." : "Kirim Balasan"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DetailForum;
