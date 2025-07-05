import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/DetailForum.css";

const DetailForum = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="text-center mt-5">
        <p>Data forum tidak ditemukan.</p>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Kembali ke Forum
        </button>
      </div>
    );
  }

  const { avatar, judul, detail, nama, waktu } = state;

  // Fungsi untuk format waktu relatif
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffMs = now - posted;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "baru saja";
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    return `${diffDay} hari lalu`;
  };

  // State balasan dan input baru
  const [replies, setReplies] = useState([
    {
      id: 1,
      avatar: "https://i.pravatar.cc/40?img=12",
      nama: "Laura Haptur",
      isi: "Ini adalah balasan pertama dari pengguna.",
      waktu: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 menit lalu
    },
    {
      id: 2,
      avatar: "https://i.pravatar.cc/40?img=20",
      nama: "Andi Prasetyo",
      isi: "Ini adalah balasan kedua dari pengguna lainnya.",
      waktu: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 menit lalu
    },
  ]);

  const [newReply, setNewReply] = useState("");

  const handleSendReply = () => {
    if (!newReply.trim()) return;

    const replyBaru = {
      id: replies.length + 1,
      avatar: "https://i.pravatar.cc/40?img=30",
      nama: "Fulan",
      isi: newReply.trim(),
      waktu: new Date().toISOString(),
    };

    setReplies([replyBaru, ...replies]);
    setNewReply("");
  };

  return (
    <>
      {/* Header Forum */}
      <div className="forum-header">
        <div className="avatar-box">
          <img src={avatar} alt="avatar" className="img-fluid" />
        </div>
        <div className="info">
          <h2>{judul}</h2>
          <p>
            Ditanyakan oleh <strong>{nama}</strong>, {waktu}
          </p>
        </div>
      </div>

      {/* Konten Forum */}
      <div className="container narrow-container py-5 mt-5">
        <div className="detail-forum-container p-4 rounded bg-light shadow-sm">
          {/* Pertanyaan */}
          <div className="bg-light p-3 rounded mb-4">
            <h2 className="fw-bold mb-2">Pertanyaan</h2>
            <h4 className="mb-0">{detail}</h4>
          </div>

          <hr className="my-4" />

          {/* Balasan */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Balasan ({replies.length})</h6>
            {replies.map((reply) => (
              <div className="d-flex mb-3 reply-container" key={reply.id}>
                <img
                  src={reply.avatar}
                  alt={reply.nama}
                  className="rounded-circle me-3"
                  width={40}
                  height={40}
                />
                <div className="w-100">
                  <div className="d-flex justify-content-between">
                    <strong>{reply.nama}</strong>
                    <small className="text-muted">
                      {getRelativeTime(reply.waktu)}
                    </small>
                  </div>
                  <p className="mb-1">{reply.isi}</p>
                  <button className="reply-button">Reply</button>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Kembali */}
          <div className="text-end mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/")}>
              Kembali ke Forum
            </button>
          </div>
        </div>

        {/* Form Balasan */}
        <div className="mt-4">
          <h6 className="fw-bold mb-3">Balas</h6>
          <textarea
            className="form-control mb-3"
            placeholder="Tuliskan komentar Anda"
            rows="4"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <button
            className="btn btn-warning text-white"
            onClick={handleSendReply}>
            Kirim Balasan
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailForum;
