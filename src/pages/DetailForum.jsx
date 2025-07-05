import React from "react";
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

  const { avatar, judul, detail, nama, waktu, balasan } = state;

  // Data dummy balasan
  const replies = [
    {
      id: 1,
      avatar: "https://i.pravatar.cc/40?img=12",
      nama: "Laura Haptur",
      isi: "Ini adalah balasan pertama dari pengguna.",
    },
    {
      id: 2,
      avatar: "https://i.pravatar.cc/40?img=20",
      nama: "Andi Prasetyo",
      isi: "Ini adalah balasan kedua dari pengguna lainnya.",
    },
  ];

  return (
    <div className="container py-5">
      <div className="detail-forum-container p-4 rounded bg-white shadow-sm">
        {/* Header Forum */}
        <div className="d-flex align-items-start mb-4">
          <img
            src={avatar}
            alt="avatar"
            className="rounded-circle me-3"
            width={50}
            height={50}
          />
          <div>
            <h4 className="fw-bold mb-1">{judul}</h4>
            <p className="text-muted mb-0">
              Ditanyakan oleh <strong>{nama}</strong>, {waktu}
            </p>
          </div>
        </div>

        {/* Konten Pertanyaan */}
        <div className="bg-light p-3 rounded mb-4">
          <h6 className="fw-bold mb-2">Pertanyaan</h6>
          <p className="mb-0">{detail}</p>
        </div>

        {/* Balasan */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3">Balasan ({replies.length})</h6>

          {replies.map((reply) => (
            <div className="d-flex mb-3" key={reply.id}>
              <img
                src={reply.avatar}
                alt={reply.nama}
                className="rounded-circle me-3"
                width={40}
                height={40}
              />
              <div>
                <strong>{reply.nama}</strong>
                <p className="mb-1">{reply.isi}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Kembali */}
        <div className="text-end">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/")}>
            Kembali ke Forum
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailForum;
