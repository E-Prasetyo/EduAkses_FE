import React, { useState } from "react";
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

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffSec = Math.floor((now - posted) / 1000);
    if (diffSec < 60) return "baru saja";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
    return `${Math.floor(diffSec / 86400)} hari lalu`;
  };

  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});

  const generateId = () => Math.floor(Math.random() * 1000000);

  const handleSendReply = () => {
    if (!newReply.trim()) return;
    const replyBaru = {
      id: generateId(),
      avatar: "https://i.pravatar.cc/40?img=30",
      nama: "Fulan",
      isi: newReply.trim(),
      waktu: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    setReplies([replyBaru, ...replies]);
    setNewReply("");
  };

  const addNestedReply = (parentId, parentPath = []) => {
    const replyText = replyTexts[parentId];
    if (!replyText || !replyText.trim()) return;

    const reply = {
      id: generateId(),
      avatar: "https://i.pravatar.cc/40?img=30",
      nama: "Fulan",
      isi: replyText.trim(),
      waktu: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    const updateReplies = (items, path, newReply) => {
      if (path.length === 0) {
        const item = items.find((item) => item.id === parentId);
        if (item) item.replies.push(newReply);
        return;
      }
      const [currentId, ...rest] = path;
      const currentItem = items.find((item) => item.id === currentId);
      if (currentItem) updateReplies(currentItem.replies, rest, newReply);
    };

    const newReplies = [...replies];
    updateReplies(newReplies, parentPath, reply);

    setReplies(newReplies);
    setReplyTexts({ ...replyTexts, [parentId]: "" });
    setActiveReply(null);
  };

  const toggleLike = (replyId, parentPath = []) => {
    const updateLikes = (items, path) => {
      if (path.length === 0) {
        const item = items.find((item) => item.id === replyId);
        if (item) item.likes += 1;
        return;
      }
      const [currentId, ...rest] = path;
      const currentItem = items.find((item) => item.id === currentId);
      if (currentItem) updateLikes(currentItem.replies, rest);
    };

    const newReplies = [...replies];
    updateLikes(newReplies, parentPath);
    setReplies(newReplies);
  };

  const ReplyComponent = ({ reply, depth = 0, parentPath = [] }) => {
    const currentPath = [...parentPath, reply.id];
    const isReplying = activeReply === reply.id;
    const marginLeft = depth > 0 ? `${depth * 3}rem` : "0";

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
                    <strong className="text-primary">{reply.nama}</strong>
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
                    onChange={(e) =>
                      setReplyTexts({
                        ...replyTexts,
                        [reply.id]: e.target.value,
                      })
                    }
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
            />
          ))}
      </div>
    );
  };

  return (
    <>
      <Header />
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
                <h4 className="text-primary mb-3">
                  <i className="fas fa-question-circle me-2"></i>Pertanyaan
                </h4>
                <p className="lead">{detail}</p>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>
                    <i className="fas fa-comments me-2"></i>
                    Balasan ({replies.length})
                  </h5>
                  <Badge bg="primary">
                    {replies.reduce(
                      (total, r) => total + 1 + r.replies.length,
                      0
                    )}{" "}
                    Total Komentar
                  </Badge>
                </div>

                {replies.map((reply) => (
                  <ReplyComponent key={reply.id} reply={reply} />
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
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-plus-circle me-2"></i>Tambah Balasan
                </h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Tuliskan komentar Anda..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="warning"
                      onClick={handleSendReply}
                      disabled={!newReply.trim()}>
                      <i className="fas fa-paper-plane me-2"></i>Kirim Balasan
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
