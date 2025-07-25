import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Header.css"; // Import CSS file

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Initialize Bootstrap dropdowns
    const initializeDropdowns = () => {
      if (typeof window !== "undefined" && window.bootstrap) {
        [dropdownRef.current, mobileDropdownRef.current].forEach((element) => {
          if (element) {
            try {
              new window.bootstrap.Dropdown(element);
            } catch (error) {
              console.error("Error initializing dropdown:", error);
            }
          }
        });
      }
    };

    initializeDropdowns();
    const timer = setTimeout(initializeDropdowns, 500);
    return () => clearTimeout(timer);
  }, [user]);

  // Close mobile nav when route changes
  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsNavOpen(false);
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case "student":
        return "/pelajar/dashboard";
      case "teacher":
        return "/pengajar/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-white border-bottom border-edu-light-grey sticky-top header-nav ${isScrolled ? "scrolled" : ""}`}>
      <div className="container-fluid px-3 px-lg-4">
        {/* Mobile Layout */}
        <div className="mobile-header-content d-lg-none w-100">
          {/* Logo */}
          <div className="mobile-logo-section">
            <Link
              className="navbar-brand d-flex align-items-center text-decoration-none header-logo"
              to="/">
              <div className="me-2">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 32 32"
                  fill="none"
                  className="hover-glow">
                  <rect
                    width="32"
                    height="32"
                    rx="8"
                    fill="var(--edu-primary)"
                  />
                  <path
                    d="M8 12h16M8 16h16M8 20h10"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="fw-bold text-dark font-exo fs-6 header-logo-text">
                EduAkses
              </span>
            </Link>
          </div>

          {/* Mobile Right Section */}
          <div className="mobile-right-section">
            {/* User profile for mobile */}
            {user && (
              <div className="mobile-profile-container">
                <div className="dropdown">
                  <button
                    ref={mobileDropdownRef}
                    className="btn btn-link text-decoration-none p-0 d-flex align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="true"
                    aria-expanded="false">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="rounded-circle mobile-profile-avatar"
                        width="30"
                        height="30"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-light border d-flex align-items-center justify-content-center text-secondary mobile-profile-avatar"
                        style={{
                          width: 30,
                          height: 30,
                          fontWeight: 600,
                          fontSize: 9,
                        }}>
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-1 mobile-profile-dropdown">
                    <li className="px-3 py-2 border-bottom">
                      <small className="text-muted d-block">
                        Masuk sebagai
                      </small>
                      <span className="font-jost fw-medium text-dark small">
                        {user.name}
                      </span>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item font-jost py-2 desktop-dropdown-item"
                        to="/profil">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="me-2">
                          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47z" />
                        </svg>
                        Profil
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item font-jost py-2 desktop-dropdown-item"
                        to={getDashboardLink()}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="me-2">
                          <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                        </svg>
                        <span className="small">
                          {user.role === "student" && "Dashboard Pelajar"}
                          {user.role === "teacher" && "Dashboard Pengajar"}
                          {user.role === "admin" && "Dashboard Admin"}
                        </span>
                      </Link>
                    </li>
                    {user.role === "teacher" && (
                      <li>
                        <Link
                          className="dropdown-item font-jost py-2 desktop-dropdown-item"
                          to="/kursus/buat">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="me-2">
                            <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
                          </svg>
                          Buat Kursus
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider my-1" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item font-jost text-danger py-2 w-100 text-start desktop-dropdown-item"
                        onClick={handleLogout}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="me-2">
                          <path
                            fillRule="evenodd"
                            d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                          />
                        </svg>
                        Keluar
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Mobile hamburger button */}
            <div className="mobile-hamburger-container">
              <button
                className="navbar-toggler border-0 p-0"
                type="button"
                onClick={toggleNav}
                aria-controls="navbarContent"
                aria-expanded={isNavOpen}
                aria-label="Toggle navigation">
                <div
                  className={`mobile-hamburger ${isNavOpen ? "active" : ""}`}>
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="d-none d-lg-flex w-100 align-items-center">
          {/* Desktop Logo */}
          <Link
            className="navbar-brand d-flex align-items-center text-decoration-none header-logo me-4"
            to="/">
            <div className="me-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                className="hover-glow">
                <rect width="32" height="32" rx="8" fill="var(--edu-primary)" />
                <path
                  d="M8 12h16M8 16h16M8 20h10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="fw-bold text-dark font-exo fs-5 header-logo-text">
              EduAkses
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link font-jost fw-medium desktop-nav-link ${isActiveRoute("/") ? "text-edu-primary active" : "text-dark"}`}
                to="/">
                Beranda
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link font-jost fw-medium desktop-nav-link ${isActiveRoute("/kursus") ? "text-edu-primary active" : "text-dark"}`}
                to="/kursus">
                Kursus
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link
                  className={`nav-link font-jost fw-medium desktop-nav-link ${isActiveRoute("/diskusi") ? "text-edu-primary active" : "text-dark"}`}
                  to="/diskusi">
                  Diskusi
                </Link>
              </li>
            )}
          </ul>

          {/* Desktop Auth Section */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="dropdown">
                <button
                  ref={dropdownRef}
                  className="btn btn-link text-decoration-none p-0 d-flex align-items-center desktop-profile-btn"
                  type="button"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="true"
                  aria-expanded="false">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="rounded-circle me-2 desktop-profile-avatar"
                      width="40"
                      height="40"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-light border me-2 d-flex align-items-center justify-content-center text-secondary desktop-profile-avatar"
                      style={{
                        width: 40,
                        height: 40,
                        fontWeight: 600,
                        fontSize: 12,
                      }}>
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="font-jost fw-medium text-dark">
                    {user.name}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="ms-2"
                    style={{ transition: "transform 0.3s ease" }}>
                    <path d="M8 10.5L4 6.5h8L8 10.5z" />
                  </svg>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 desktop-profile-dropdown">
                  <li className="px-2 py-2 border-bottom">
                    <small className="text-muted d-block">Selamat datang</small>
                    <span className="font-jost fw-medium text-dark">
                      {user.name}
                    </span>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item font-jost py-2 desktop-dropdown-item"
                      to="/profil">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="me-2">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47z" />
                      </svg>
                      Profil Saya
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item font-jost py-2 desktop-dropdown-item"
                      to={getDashboardLink()}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="me-2">
                        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                      </svg>
                      {user.role === "student" && "Dashboard Pelajar"}
                      {user.role === "teacher" && "Dashboard Pengajar"}
                      {user.role === "admin" && "Dashboard Admin"}
                    </Link>
                  </li>
                  {user.role === "teacher" && (
                    <li>
                      <Link
                        className="dropdown-item font-jost py-2 desktop-dropdown-item"
                        to="/kursus/buat">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="me-2">
                          <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
                        </svg>
                        Buat Kursus Baru
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider my-2" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item font-jost text-danger py-2 w-100 text-start desktop-dropdown-item"
                      onClick={handleLogout}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="me-2">
                        <path
                          fillRule="evenodd"
                          d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                        />
                        <path
                          fillRule="evenodd"
                          d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                        />
                      </svg>
                      Keluar
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-primary mobile-auth-btn">
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary mobile-auth-btn">
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Navigation Menu - Mobile */}
        <div
          className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
          id="navbarContent">
          <div
            className={`d-lg-none ${isNavOpen ? "mobile-nav-container" : ""}`}>
            <ul className="navbar-nav py-3">
              <li className="nav-item mobile-nav-item">
                <Link
                  className={`nav-link font-jost fw-medium px-0 mobile-nav-link ${isActiveRoute("/") ? "text-edu-primary active" : "text-dark"}`}
                  to="/"
                  onClick={() => setIsNavOpen(false)}>
                  Beranda
                </Link>
              </li>
              <li className="nav-item mobile-nav-item">
                <Link
                  className={`nav-link font-jost fw-medium px-0 mobile-nav-link ${isActiveRoute("/kursus") ? "text-edu-primary active" : "text-dark"}`}
                  to="/kursus"
                  onClick={() => setIsNavOpen(false)}>
                  Kursus
                </Link>
              </li>
              {user && (
                <li className="nav-item mobile-nav-item">
                  <Link
                    className={`nav-link font-jost fw-medium px-0 mobile-nav-link ${isActiveRoute("/diskusi") ? "text-edu-primary active" : "text-dark"}`}
                    to="/diskusi"
                    onClick={() => setIsNavOpen(false)}>
                    Diskusi
                  </Link>
                </li>
              )}
            </ul>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="py-3 border-top mt-2 mobile-auth-container">
                <div className="d-grid gap-3">
                  <Link
                    to="/login"
                    className="btn btn-outline-primary mobile-auth-btn"
                    onClick={() => setIsNavOpen(false)}>
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary mobile-auth-btn"
                    onClick={() => setIsNavOpen(false)}>
                    Daftar
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
