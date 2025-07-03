import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaArrowUp,
} from "react-icons/fa";

import "../styles/Footer.css"; // Import CSS

function Footer() {
  return (
    <div className="footerWrapper bg-light py-4 w-100">
      {/* wrapper supaya background full */}
      <Container className="position-relative footerContainer">
        <Row className="mb-5 mt-5 gx-5">
          {/* === Kolom EduAkses === */}
          <Col md={3}>
            <h5>EduAkses</h5>
            <p className="text-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </Col>

          {/* === Kolom GET HELP === */}
          <Col md={3} className="mt-3 mt-md-0 columnPaddingStart">
            <h6 className="fw-bold mb-3">GET HELP</h6>
            <ul className="list-unstyled text-muted">
              <li className="listItem">Contact Us</li>
              <li className="listItem">Latest Articles</li>
              <li className="listItem">FAQ</li>
            </ul>
          </Col>

          {/* === Kolom PROGRAMS === */}
          <Col md={3} className="mt-3 mt-md-0 ps-md-4">
            <h6 className="fw-bold mb-3">PROGRAMS</h6>
            <ul className="list-unstyled text-muted">
              <li className="listItem">Art & Design</li>
              <li className="listItem">Business</li>
              <li className="listItem">IT & Software</li>
              <li className="listItem">Languages</li>
              <li className="listItem">Programming</li>
            </ul>
          </Col>

          {/* === Kolom CONTACT US === */}
          <Col md={3} className="mt-3 mt-md-0">
            <h6 className="fw-bold mb-3">CONTACT US</h6>
            <p className="text-muted mb-1">Alamat: Jalan Lurus No.100, INA</p>
            <p className="text-muted mb-1">
              Telp:{" "}
              <a href="tel:+6281234567890" className="text-dark">
                +62 812 3456 7890
              </a>
            </p>
            <p className="text-muted mb-1">
              Mail:{" "}
              <a href="mailto:eduakases@gmail.com" className="text-dark">
                eduakases@gmail.com
              </a>
            </p>
            <div className="d-flex gap-2 mt-2">
              <FaFacebookF className="socialIcon" />
              <FaTwitter className="socialIcon" />
              <FaInstagram className="socialIcon" />
              <FaLinkedin className="socialIcon" />
            </div>
          </Col>
        </Row>

        {/* === Copyright === */}
        <div className="text-center text-muted small mt-5 pt-4 copyright">
          Copyright © 2024 Lorem Ipsum | Powered by EduAkses
        </div>

        {/* === Tombol Scroll ke Atas === */}
        <div
          className="scrollToTop"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <FaArrowUp color="#fff" size={16} />
        </div>
      </Container>
    </div>
  );
}

export default Footer;
