import React, { useState } from "react";
import ItemForum from "./ItemForum";
import Pagination from "react-bootstrap/Pagination";
import AjukanPertanyaanModal from "./AjukanPertanyaanModal";
import "../styles/ListForum.css";

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
    setShowModal(false); // tutup modal setelah submit
  };

  return (
    <>
      <div className="list-forum-container">
        <h5 className="fw-bold mb-3">Daftar Pertanyaan</h5>

        {/* LIST FORUM */}
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

      {/* Modal Pop-up */}
      <AjukanPertanyaanModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleAddForum}
      />
    </>
  );
};

export default ListForum;
