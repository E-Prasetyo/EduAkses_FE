import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/DetailForum.css"; // pastikan file ini sudah dibuat

const DetailForum = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Jika data forum tidak tersedia (akses langsung via URL)
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

  // Destructuring data dari state
  const { avatar, judul, nama, waktu, balasan } = state;

  return (
    <div className="container py-5">
      <div className="detail-forum-container p-4 rounded bg-white shadow-sm">
        {/* Judul dan info penanya */}
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
              Ditanyakan oleh {nama}, {waktu}
            </p>
          </div>
        </div>

        {/* Isi Pertanyaan */}
        <div className="bg-light p-3 rounded mb-4">
          <h6 className="fw-bold mb-2">Pertanyaan</h6>
          <p className="mb-0">
            Lorem ipsum dolor sit amet, ini adalah isi pertanyaannya.
          </p>
        </div>

        {/* Daftar Balasan */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3">Balasan ({balasan})</h6>

          <div className="mb-3">
            <strong>Laura Haptur</strong>
            <p>Ini adalah balasan pertama dari pengguna.</p>
          </div>

          <div className="mb-3">
            <strong>Laura Haptur</strong>
            <p>Ini adalah balasan kedua dari pengguna lainnya.</p>
          </div>
        </div>

        {/* Tombol kembali */}
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
