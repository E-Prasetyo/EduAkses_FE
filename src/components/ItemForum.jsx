import React from "react";
import { Link } from "react-router-dom";

const ItemForum = ({ id, avatar, judul, detail, nama, waktu, balasan }) => {
  return (
    <Link
      to={`/forum/${id}`}
      state={{ id, avatar, judul, detail, nama, waktu, balasan }}
      className="text-decoration-none text-dark">
      <div className="card border-0 shadow-sm card-hover h-100 mb-3">
        <div className="row g-0">
          {/* Avatar */}
          <div className="col-auto">
            <img
              src={avatar}
              alt="Avatar"
              className="rounded-circle m-4"
              style={{ width: "48px", height: "48px", objectFit: "cover" }}
            />
          </div>

          {/* Info */}
          <div className="col">
            <div className="card-body py-3 pe-3">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1 mb-4 mt-3">
                  <h6 className="fw-semibold mb-1">{judul}</h6>
                  <small className="text-muted">
                    Ditanyakan oleh {nama}, {waktu}
                  </small>
                </div>
                <div className="text-end ps-3">
                  <small className="text-muted">{balasan} Balasan</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemForum;
