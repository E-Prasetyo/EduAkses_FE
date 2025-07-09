import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <div className="card h-100 border-0 shadow-sm card-hover">
      <div className="position-relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span
            className={`badge ${course.level === "Pemula" ? "bg-success" : course.level === "Menengah" ? "bg-warning" : "bg-danger"} font-jost`}
          >
            {course.level}
          </span>
        </div>
        {course.price === "free" && (
          <div className="position-absolute top-0 start-0 m-2">
            <span className="badge bg-edu-green font-jost">GRATIS</span>
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column p-4">
        <div className="mb-2">
          <span className="badge bg-light text-dark font-jost small">
            {course.category}
          </span>
        </div>

        <h5 className="card-title font-exo fw-semibold mb-2">{course.title}</h5>

        <p className="card-text text-muted font-jost small mb-3 flex-grow-1">
          {course.description}
        </p>

        <div className="d-flex align-items-center mb-3">
          {/* <div className="d-flex align-items-center me-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="#FFD700"
              className="me-1"
            >
              <path d="M8 1L10.09 5.26L15 6L11.5 9.74L12.18 15L8 12.77L3.82 15L4.5 9.74L1 6L5.91 5.26L8 1Z" />
            </svg>
            <span className="small font-jost fw-medium">{course.rating}</span>
          </div> */}
          <div className="d-flex align-items-center text-muted small">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="me-1"
            >
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h2c.83 0 1.5.67 1.5 1.5V18h2v2H4v-2z" />
            </svg>
            <span>{course.students} siswa</span>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center text-muted small">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="me-1"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
            </svg>
            <span>{course.duration}</span>
          </div>
          <div className="text-muted small">by {course.instructor}</div>
        </div>

        <div className="d-flex align-items-center justify-content-between">
          {/* {course.price === "free" ? (
            <span className="h5 mb-0 text-edu-green font-exo fw-bold">
              GRATIS
            </span>
          ) : (
            <div>
              {course.discountPrice ? (
                <>
                  <span className="h5 mb-0 text-edu-primary font-exo fw-bold">
                    Rp {course.discountPrice.toLocaleString("id-ID")}
                  </span>
                  <br />
                  <small className="text-decoration-line-through text-muted">
                    Rp {course.originalPrice.toLocaleString("id-ID")}
                  </small>
                </>
              ) : (
                <span className="h5 mb-0 text-edu-primary font-exo fw-bold">
                  Rp {course.originalPrice.toLocaleString("id-ID")}
                </span>
              )}
            </div>
          )} */}

          <Link
            to={`/kursus/${course.id}`}
            className="btn btn-edu-primary btn-sm font-jost fw-medium"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
