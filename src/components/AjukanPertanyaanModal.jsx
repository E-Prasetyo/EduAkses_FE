import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AjukanPertanyaanModal = ({ show, onHide, onSubmit }) => {
  const [judul, setJudul] = useState("");
  const [detail, setDetail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      id: Date.now(),
      avatar: "https://i.pravatar.cc/40",
      judul,
      detail, // ✅ Tambahkan ini agar data tampil di DetailForum
      nama: "User",
      waktu: "Baru saja",
      balasan: 0,
    };

    onSubmit(newItem); // Kirim data lengkap
    setJudul("");
    setDetail("");
  };

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Ajukan Pertanyaan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Judul Pertanyaan</Form.Label>
            <Form.Control
              type="text"
              placeholder="Judul*"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Detail Pertanyaan</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Detail pertanyaan"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </Form.Group>
          <div className="text-center">
            <Button type="submit" className="submit-button">
              Kirim Pertanyaan
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AjukanPertanyaanModal;
