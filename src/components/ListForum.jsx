import React, { useState } from "react";
import ItemForum from "./ItemForum"; // Pastikan ItemForum sudah digabung atau inline juga
import Pagination from "react-bootstrap/Pagination";
import AjukanPertanyaanModal from "./AjukanPertanyaanModal";

const ListForum = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      avatar: "https://i.pravatar.cc/40?img=1",
      judul: "Bagaimana Cara Install Ulang Windows",
      nama: "Ardi",
      waktu: "2 jam yang lalu",
      balasan: 3,
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleAddForum = (itemBaru) => {
    setItems([itemBaru, ...items]);
    setShowModal(false);
  };

  return (
    <>
      {/* Embedded Style */}
      <style>
        {`
          .list-forum-container {
            background-color: #f5f5f5;
            padding: 32px;
            border-radius: 10px;
          }

          .list-forum-container h5 {
            font-weight: 700;
            font-size: 1.2rem;
            margin-bottom: 24px;
          }

          .forum-item {
            background-color: white;
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: background-color 0.2s ease;
          }

          .forum-item:hover {
            background-color: #f0f0f0;
            cursor: pointer;
          }

          .forum-item-left {
            display: flex;
            align-items: flex-start;
          }

          .forum-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 16px;
            object-fit: cover;
          }

          .forum-info {
            display: flex;
            flex-direction: column;
          }

          .forum-title {
            font-weight: 700;
            margin: 0;
            font-size: 1rem;
          }

          .forum-meta {
            font-size: 0.85rem;
            color: #777;
            margin-top: 4px;
          }

          .forum-reply-count {
            font-size: 0.85rem;
            font-weight: 500;
            color: #666;
          }

          .custom-pagination .page-item .page-link {
            border-radius: 50% !important;
            width: 38px;
            height: 38px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 4px;
            font-weight: 500;
            color: #333;
            border: 1px solid #ccc;
            transition: all 0.3s ease;
          }

          .custom-pagination .page-item.active .page-link {
            background-color: black;
            color: white;
            border-color: black;
          }

          .custom-pagination .page-item .page-link:hover {
            background-color: black;
            color: white;
          }

          .submit-button {
            background-color: black;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 500;
            transition: background-color 0.3s ease;
          }

          .submit-button:hover {
            background-color: #333;
          }
        `}
      </style>

      <div className="list-forum-container">
        <h5 className="fw-bold mb-3">Daftar Pertanyaan</h5>

        {/* Daftar item forum */}
        {items.map((item) => (
          <ItemForum key={item.id} {...item} />
        ))}

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-3">
          <Pagination className="custom-pagination">
            <Pagination.Prev />
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Next />
          </Pagination>
        </div>
      </div>

      {/* Tombol Ajukan Pertanyaan */}
      <div className="text-center mt-4">
        <button className="submit-button" onClick={() => setShowModal(true)}>
          Ajukan Pertanyaan
        </button>
      </div>

      {/* Modal Ajukan Pertanyaan */}
      <AjukanPertanyaanModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleAddForum}
      />
    </>
  );
};

export default ListForum;
