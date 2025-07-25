import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navigation from "./Navigation";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState("teacher");
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom border-edu-light-grey sticky-top">
      <div className="container-fluid px-4">
        {/* Logo */}
        <Link
          className="navbar-brand d-flex align-items-center text-decoration-none"
          to="/"
        >
          <div className="me-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--edu-primary)" />
              <path
                d="M8 12h16M8 16h16M8 20h10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="fw-bold text-dark font-exo">EduAkses</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link font-jost fw-medium ${isActiveRoute("/") ? "text-edu-primary" : "text-dark"}`}
                to="/"
              >
                Beranda
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link font-jost fw-medium ${isActiveRoute("/kursus") ? "text-edu-primary" : "text-dark"}`}
                to="/kursus"
              >
                Kursus
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link font-jost fw-medium ${isActiveRoute("/diskusi") ? "text-edu-primary" : "text-dark"}`}
                to="/diskusi"
              >
                Diskusi
              </Link>
            </li>
          </ul>

          {/* Auth Section */}
          <div className="d-flex align-items-center gap-3">
            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="btn btn-link text-decoration-none p-0 d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                    alt="Profile"
                    className="rounded-circle me-2"
                    width="40"
                    height="40"
                  />
                  <span className="font-jost fw-medium text-dark">
                    Ahmad Fulan
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="ms-1"
                  >
                    <path d="M8 10.5L4 6.5h8L8 10.5z" />
                  </svg>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item font-jost" to="/profil">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="me-2"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47z" />
                      </svg>
                      Profil
                    </Link>
                  </li>
                  {userRole === "student" && (
                    <li>
                      <Link
                        className="dropdown-item font-jost"
                        to="/pelajar/dashboard"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="me-2"
                        >
                          <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                        </svg>
                        Dashboard Pelajar
                      </Link>
                    </li>
                  )}
                  {userRole === "teacher" && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item font-jost"
                          to="/pengajar/dashboard"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="me-2"
                          >
                            <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v2A1.5 1.5 0 0 1 14.5 5H1.5A1.5 1.5 0 0 1 0 3.5v-2zM1.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-13z" />
                          </svg>
                          Dashboard Pengajar
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item font-jost"
                          to="/kursus/buat"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="me-2"
                          >
                            <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
                          </svg>
                          Buat Kursus
                        </Link>
                      </li>
                    </>
                  )}
                  {userRole === "admin" && (
                    <li>
                      <Link
                        className="dropdown-item font-jost"
                        to="/admin/dashboard"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="me-2"
                        >
                          <path d="M6 2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07A7.001 7.001 0 0 1 8 16a7.001 7.001 0 0 1-1-13.93V2.5a.5.5 0 0 1-.5-.5z" />
                        </svg>
                        Dashboard Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item font-jost text-danger">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="me-2"
                      >
                        <path d="M6 14a1 1 0 0 1-1-1V9a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1zM10 14a1 1 0 0 1-1-1V9a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1z" />
                      </svg>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-dark font-jost fw-medium me-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-edu-primary font-jost fw-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
