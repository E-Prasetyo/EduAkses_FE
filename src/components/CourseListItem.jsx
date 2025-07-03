import React from "react";
import { Link } from "react-router-dom";

const CourseListItem = ({ course }) => {
  return (
    <div className="card border-0 shadow-sm card-hover h-100">
      <div className="row g-0">
        {/* Course Image */}
        <div className="col-md-4">
          <div
            className="position-relative h-100"
            style={{ minHeight: "200px" }}
          >
            <img
              src={course.image}
              alt={course.title}
              className="img-fluid h-100 w-100 rounded-start"
              style={{ objectFit: "cover" }}
            />
            <div className="position-absolute top-0 start-0 m-3">
              <span className="badge bg-dark font-jost">{course.category}</span>
            </div>
            {course.price === "free" && (
              <div className="position-absolute top-0 end-0 m-3">
                <span className="badge bg-edu-green font-jost">GRATIS</span>
              </div>
            )}
            <div className="position-absolute bottom-0 start-0 m-3">
              <span
                className={`badge ${course.level === "Pemula" ? "bg-success" : course.level === "Menengah" ? "bg-warning" : "bg-danger"} font-jost`}
              >
                {course.level}
              </span>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="col-md-8">
          <div className="card-body p-4 d-flex flex-column h-100">
            <div className="mb-2">
              <small className="text-muted font-jost">
                by {course.instructor}
              </small>
            </div>

            <h5 className="card-title font-exo fw-semibold mb-3">
              <Link
                to={`/kursus/${course.id}`}
                className="text-decoration-none text-dark"
              >
                {course.title}
              </Link>
            </h5>

            <p className="card-text text-muted font-jost mb-3 flex-grow-1">
              {course.description}
            </p>

            {/* Meta Info */}
            <div className="row g-3 mb-3">
              <div className="col-auto">
                <div className="d-flex align-items-center text-muted">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="me-2"
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                  </svg>
                  <small className="font-jost">{course.duration}</small>
                </div>
              </div>
              <div className="col-auto">
                <div className="d-flex align-items-center text-muted">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="me-2"
                  >
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h2c.83 0 1.5.67 1.5 1.5V18h2v2H4v-2z" />
                  </svg>
                  <small className="font-jost">{course.students} siswa</small>
                </div>
              </div>
              <div className="col-auto">
                <div className="d-flex align-items-center text-muted">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="#FFD700"
                    className="me-2"
                  >
                    <path d="M8 1L10.09 5.26L15 6L11.5 9.74L12.18 15L8 12.77L3.82 15L4.5 9.74L1 6L5.91 5.26L8 1Z" />
                  </svg>
                  <small className="font-jost fw-medium">{course.rating}</small>
                </div>
              </div>
            </div>

            {/* Price and Action */}
            <div className="d-flex align-items-center justify-content-between">
              <div>
                {course.price === "free" ? (
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
                )}
              </div>

              <Link
                to={`/kursus/${course.id}`}
                className="btn btn-edu-primary font-jost fw-medium"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseListItem;
