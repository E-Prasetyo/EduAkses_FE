import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const styles = {
  forumHeader: {
    display: "flex",
    backgroundColor: "#000",
    color: "white",
    padding: "40px 20px",
    alignItems: "center",
  },
  avatarBox: {
    marginLeft: "15%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginRight: 30,
    width: 120,
    height: 120,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  infoTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  infoText: {
    margin: 0,
    color: "#ddd",
  },
  replyContainer: {
    backgroundColor: "#fdfdfd",
    padding: 15,
    borderRadius: 10,
    border: "1px solid #eee",
    marginBottom: 10,
  },
  replyButton: {
    color: "#f57c00",
    fontSize: "0.9rem",
    fontWeight: 500,
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  },
};

const DetailForum = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Data forum tidak ditemukan.</p>
        <button onClick={() => navigate("/")} style={{ padding: "8px 16px" }}>
          Kembali ke Forum
        </button>
      </div>
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

  const [replies, setReplies] = useState([
    {
      id: 1,
      avatar: "https://i.pravatar.cc/40?img=12",
      nama: "Laura Haptur",
      isi: "Ini adalah balasan pertama.",
      waktu: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      avatar: "https://i.pravatar.cc/40?img=20",
      nama: "Andi Prasetyo",
      isi: "Ini balasan kedua.",
      waktu: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
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
      <Header />
      <div style={styles.forumHeader}>
        <div style={styles.avatarBox}>
          <img
            src={avatar}
            alt="avatar"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div style={styles.info}>
          <h2 style={styles.infoTitle}>{judul}</h2>
          <p style={styles.infoText}>
            Ditanyakan oleh <strong>{nama}</strong>, {waktu}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "50px auto", padding: "20px" }}>
        <div
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}>
          <div style={{ marginBottom: 20 }}>
            <h2>Pertanyaan</h2>
            <h4>{detail}</h4>
          </div>

          <hr />

          <div>
            <h6>Balasan ({replies.length})</h6>
            {replies.map((reply) => (
              <div key={reply.id} style={styles.replyContainer}>
                <div style={{ display: "flex" }}>
                  <img
                    src={reply.avatar}
                    alt={reply.nama}
                    style={{
                      borderRadius: "50%",
                      marginRight: 10,
                      width: 40,
                      height: 40,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}>
                      <strong>{reply.nama}</strong>
                      <small style={{ color: "#999" }}>
                        {getRelativeTime(reply.waktu)}
                      </small>
                    </div>
                    <p>{reply.isi}</p>
                    <button style={styles.replyButton}>Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, textAlign: "end" }}>
            <button
              onClick={() => navigate("/")}
              style={{ padding: "8px 16px" }}>
              Kembali ke Forum
            </button>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <h6>Balas</h6>
          <textarea
            placeholder="Tuliskan komentar Anda"
            rows="4"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
            }}
          />
          <button
            onClick={handleSendReply}
            style={{
              backgroundColor: "#f57c00",
              color: "white",
              border: "none",
              padding: "8px 20px",
              borderRadius: 8,
            }}>
            Kirim Balasan
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DetailForum;
