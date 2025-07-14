import React, { useState } from "react";
import ItemForum from "./ItemForum";
import Pagination from "react-bootstrap/Pagination";
import AjukanPertanyaanModal from "./AjukanPertanyaanModal";

const ListForum = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      avatar: "https://i.pravatar.cc/40?img=1",
      judul: "Install Windows",
      nama: "Ardi",
      waktu: "2 jam yang lalu",
      balasan: 3,
    },
    {
      id: 2,
      avatar: "https://i.pravatar.cc/40?img=2",
      judul: "Reset Android",
      nama: "Budi",
      waktu: "3 jam yang lalu",
      balasan: 5,
    },
    {
      id: 3,
      avatar: "https://i.pravatar.cc/40?img=3",
      judul: "Cara Flashing",
      nama: "Sari",
      waktu: "4 jam yang lalu",
      balasan: 2,
    },
    {
      id: 4,
      avatar: "https://i.pravatar.cc/40?img=4",
      judul: "Gagal Booting",
      nama: "Tono",
      waktu: "5 jam yang lalu",
      balasan: 0,
    },
    {
      id: 5,
      avatar: "https://i.pravatar.cc/40?img=5",
      judul: "Windows Blue Screen",
      nama: "Dina",
      waktu: "6 jam yang lalu",
      balasan: 1,
    },
    {
      id: 6,
      avatar: "https://i.pravatar.cc/40?img=6",
      judul: "Install Linux",
      nama: "Lina",
      waktu: "7 jam yang lalu",
      balasan: 6,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleAddForum = (itemBaru) => {
    setItems([itemBaru, ...items]);
    setShowModal(false);
    setCurrentPage(1); // balikan ke halaman pertama
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="bg-light rounded-3 p-4">
        <h5 className="fw-bold mb-4">Daftar Pertanyaan</h5>

        {/* Render item per halaman */}
        {currentItems.map((item) => (
          <ItemForum key={item.id} {...item} />
        ))}

        {/* Pagination aktif jika lebih dari 1 halaman */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4 flex-wrap">
            <div className="d-flex gap-2">
              {/* Prev Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  borderRadius: "50%",
                  backgroundColor: "#f8d7da",
                  color: "#dc3545",
                  border: "1px solid #dc3545",
                  width: "40px",
                  height: "40px",
                  fontWeight: "bold",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}>
                &lt;
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    style={{
                      borderRadius: "50%",
                      backgroundColor: isActive ? "#dc3545" : "#f8d7da",
                      color: isActive ? "#fff" : "#dc3545",
                      border: "1px solid #dc3545",
                      width: "40px",
                      height: "40px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}>
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  borderRadius: "50%",
                  backgroundColor: "#f8d7da",
                  color: "#dc3545",
                  border: "1px solid #dc3545",
                  width: "40px",
                  height: "40px",
                  fontWeight: "bold",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}>
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-danger px-4 py-2 fw-medium"
          onClick={() => setShowModal(true)}>
          Ajukan Pertanyaan
        </button>
      </div>

      <AjukanPertanyaanModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleAddForum}
      />
    </>
  );
};

export default ListForum;
