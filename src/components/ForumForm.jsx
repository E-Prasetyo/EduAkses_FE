import React, { useState } from "react";

const ForumForm = ({ onSubmit }) => {
  const [judul, setJudul] = useState("");
  const [detail, setDetail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!judul.trim()) return;

    const newItem = {
      id: Date.now(),
      avatar: "https://i.pravatar.cc/40", // Avatar dummy
      judul,
      nama: "User", // Bisa kamu ubah dari props
      waktu: "Baru saja",
      balasan: 0,
    };

    onSubmit(newItem); // Kirim ke parent
    setJudul("");
    setDetail("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Judul Pertanyaan"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          placeholder="Detail Pertanyaan"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className="form-control"
          rows="4"></textarea>
      </div>
      <button type="submit" className="submit-button">
        Kirim Pertanyaan
      </button>
    </form>
  );
};

export default ForumForm;
