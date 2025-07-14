import React, { useState } from "react";
import ItemForum from "./ItemForum";
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
    {
      id: 2,
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
      {/* Container */}
      <div className="bg-light rounded-3 p-4">
        <h5 className="fw-bold mb-4">Daftar Pertanyaan</h5>

        {/* Daftar ItemForum */}
        {items.map((item) => (
          <ItemForum key={item.id} {...item} />
        ))}

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
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
        <button
          className="btn btn-dark px-4 py-2 fw-medium"
          onClick={() => setShowModal(true)}>
          Ajukan Pertanyaan
        </button>
      </div>

      {/* Modal Tambah Pertanyaan */}
      <AjukanPertanyaanModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleAddForum}
      />
    </>
  );
};

export default ListForum;
