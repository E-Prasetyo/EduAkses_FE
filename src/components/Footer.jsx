import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h5 className="mb-3">EduAkses</h5>
            <p className="mb-0">
              Platform pembelajaran online yang memungkinkan siapa saja untuk
              belajar dan mengajar dengan mudah. Bergabunglah dengan ribuan
              pelajar dan pengajar dari seluruh Indonesia.
            </p>
          </div>
          <div className="col-lg-2 mb-4">
            <h5 className="mb-3">Programs</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  href="#"
                  className="text-light text-decoration-none"
                >
                  Semua Kursus
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-light text-decoration-none"
                >
                  Teknologi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-light text-decoration-none"
                >
                  Bisnis
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-light text-decoration-none"
                >
                  Seni & Desain
                </a>
              </li>
            </ul>
          </div>
          <div className="col-lg-2 mb-4">
            <h5 className="mb-3">Get Help</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  href="#"
                  className="text-light text-decoration-none"
                >
                  Pusat Bantuan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-light text-decoration-none"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-light text-decoration-none"
                >
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>
          <div className="col-lg-4 mb-4">
            <h5 className="mb-3">Contact Us</h5>
            <p>
              Jl. Pendidikan No. 123
              <br />
              Jakarta Selatan, 12345
              <br />
              Indonesia
            </p>
            <p>
              📞 +62 21 1234 5678
              <br />
              ✉️ hello@eduakses.com
            </p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">
              &copy; 2024 EduAkses. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <a
              href="#"
              className="text-light text-decoration-none me-3"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-light text-decoration-none"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
