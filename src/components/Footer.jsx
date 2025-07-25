import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                className="me-2"
              >
                <rect width="32" height="32" rx="8" fill="var(--edu-primary)" />
                <path
                  d="M8 12h16M8 16h16M8 20h10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="h4 mb-0 font-exo fw-bold text-white">
                EduAkses
              </span>
            </div>
            <p className="text-light font-jost mb-4">
              Platform pembelajaran online yang memungkinkan siapa saja untuk
              belajar dan mengajar dengan mudah. Bergabunglah dengan ribuan
              pelajar dan pengajar dari seluruh Indonesia.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light hover-text-primary">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-light hover-text-primary">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a href="#" className="text-light hover-text-primary">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.079-1.044 2.431-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </a>
              <a href="#" className="text-light hover-text-primary">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Get Help */}
          <div className="col-lg-2 col-md-6">
            <h5 className="font-exo fw-semibold text-white mb-3">Get Help</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/help"
                  className="text-light text-decoration-none font-jost hover-text-primary"
                >
                  Pusat Bantuan
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/faq"
                  className="text-light text-decoration-none font-jost hover-text-primary"
                >
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/contact"
                  className="text-light text-decoration-none font-jost hover-text-primary"
                >
                  Hubungi Kami
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/support"
                  className="text-light text-decoration-none font-jost hover-text-primary"
                >
                  Live Chat
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div className="col-lg-2 col-md-6">
            <h5 className="font-exo fw-semibold text-white mb-3">Programs</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/kursus"
                  className="text-light text-decoration-none font-jost hover-text-primary"
                >
                  Semua Kursus
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/kategori/teknologi"
                  className="text-light text-decoration-none font-jost hover-text-primary"
                >
                  Teknologi
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/kategori/bisnis"
                  className="text-light text-decoration-none font-jost hover-text-primary"
                >
                  Bisnis
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/kategori/seni"
                  className="text-light text-decoration-none font-jost hover-text-primary"
                >
                  Seni & Desain
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-lg-4 col-md-6">
            <h5 className="font-exo fw-semibold text-white mb-3">Contact Us</h5>
            <div className="d-flex align-items-start mb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-edu-primary me-3 mt-1"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <p className="text-light font-jost mb-0">
                Jl. Pendidikan No. 123
                <br />
                Jakarta Selatan, 12345
                <br />
                Indonesia
              </p>
            </div>
            <div className="d-flex align-items-center mb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-edu-primary me-3"
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <p className="text-light font-jost mb-0">+62 21 1234 5678</p>
            </div>
            <div className="d-flex align-items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-edu-primary me-3"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <p className="text-light font-jost mb-0">hello@eduakses.com</p>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-light font-jost mb-0">
              &copy; 2024 EduAkses. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link
              to="/privacy"
              className="text-light text-decoration-none font-jost me-3 hover-text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-light text-decoration-none font-jost hover-text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
