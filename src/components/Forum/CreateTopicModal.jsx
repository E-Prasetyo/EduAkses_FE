import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CreateTopicModal = ({
  show,
  onHide,
  onSubmit,
  categories,
  isSubmitting = false,
}) => {
  const primary = "var(--edu-primary)";
  const primaryGrad =
    "linear-gradient(135deg, var(--edu-primary) 0%, #b02a37 100%)";
  const primaryLight = "rgba(220,53,69,0.1)";
  const primaryLighter = "rgba(220,53,69,0.05)";
  const primaryBorder = "rgba(220,53,69,0.2)";
  const white = "#ffffff";

  const focusOn = (e) => {
    e.target.style.borderColor = primary;
    e.target.style.background = white;
    e.target.style.boxShadow = "0 0 0 0.2rem rgba(220,53,69,0.25)";
  };
  const focusOff = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.background = "rgba(247, 250, 252, 0.5)";
    e.target.style.boxShadow = "none";
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      className="create-topic-modal">
      <div
        className="modal-content"
        style={{
          border: "none",
          borderRadius: "25px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
        }}>
        <Modal.Header
          closeButton
          style={{
            background: primaryGrad,
            color: white,
            border: "none",
            padding: "2rem",
          }}>
          <Modal.Title
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
            <i className="bi bi-question-circle"></i>
            Buat Topik Diskusi Baru
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: "2rem" }}>
          <Form onSubmit={onSubmit}>
            <div className="row">
              <div className="col-md-8">
                <Form.Group className="mb-4">
                  <Form.Label
                    className="fw-bold"
                    style={{
                      color: "#2d3748",
                      fontSize: "1rem",
                      marginBottom: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}>
                    <i className="bi bi-chat-quote text-edu-primary"></i>
                    Judul Pertanyaan *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="judul"
                    placeholder="Tulis judul yang jelas dan spesifik..."
                    required
                    minLength={10}
                    maxLength={200}
                    disabled={isSubmitting}
                    style={{
                      border: "2px solid #e2e8f0",
                      borderRadius: "15px",
                      padding: "1rem",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "rgba(247, 250, 252, 0.5)",
                    }}
                    onFocus={focusOn}
                    onBlur={focusOff}
                  />
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Minimal 10 karakter, maksimal 200 karakter
                  </Form.Text>
                </Form.Group>
              </div>

              <div className="col-md-4">
                <Form.Group className="mb-4">
                  <Form.Label
                    className="fw-bold"
                    style={{
                      color: "#2d3748",
                      fontSize: "1rem",
                      marginBottom: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}>
                    <i className="bi bi-bookmark text-edu-green"></i>
                    Kategori
                  </Form.Label>
                  <Form.Select
                    name="kategori"
                    defaultValue="umum"
                    disabled={isSubmitting}
                    style={{
                      border: "2px solid #e2e8f0",
                      borderRadius: "15px",
                      padding: "1rem",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "rgba(247, 250, 252, 0.5)",
                    }}
                    onFocus={focusOn}
                    onBlur={focusOff}>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-4">
              <Form.Label
                className="fw-bold"
                style={{
                  color: "#2d3748",
                  fontSize: "1rem",
                  marginBottom: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                <i className="bi bi-card-text text-edu-primary"></i>
                Detail Pertanyaan
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="detail"
                placeholder="Jelaskan detail pertanyaan Anda..."
                maxLength={2000}
                disabled={isSubmitting}
                style={{
                  border: "2px solid #e2e8f0",
                  borderRadius: "15px",
                  padding: "1rem",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  background: "rgba(247, 250, 252, 0.5)",
                  resize: "vertical",
                  minHeight: "120px",
                }}
                onFocus={focusOn}
                onBlur={focusOff}
              />
              <Form.Text className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Maksimal 2000 karakter (opsional)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label
                className="fw-bold"
                style={{
                  color: "#2d3748",
                  fontSize: "1rem",
                  marginBottom: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                <i className="bi bi-tags text-warning"></i>
                Tags
              </Form.Label>
              <Form.Control
                type="text"
                name="tags"
                placeholder="matematika, aljabar, belajar (pisahkan dengan koma)"
                maxLength={200}
                disabled={isSubmitting}
                style={{
                  border: "2px solid #e2e8f0",
                  borderRadius: "15px",
                  padding: "1rem",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  background: "rgba(247, 250, 252, 0.5)",
                }}
                onFocus={focusOn}
                onBlur={focusOff}
              />
              <Form.Text className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Pisahkan dengan koma, maksimal 10 tags
              </Form.Text>
            </Form.Group>

            {/* Tips */}
            <div
              className="mb-4 p-3 rounded"
              style={{
                background: `linear-gradient(135deg, ${primaryLighter} 0%, rgba(176,42,55,0.05) 100%)`,
                border: `1px solid ${primaryBorder}`,
                borderRadius: "20px",
                padding: "1.5rem",
              }}>
              <h6
                className="mb-3"
                style={{
                  color: primary,
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                <i className="bi bi-lightbulb"></i>
                Tips untuk pertanyaan yang baik:
              </h6>
              <ul className="mb-0" style={{ paddingLeft: "1.5rem" }}>
                <li
                  style={{
                    color: "#4a5568",
                    marginBottom: "0.5rem",
                    lineHeight: "1.5",
                  }}>
                  Gunakan judul yang jelas dan spesifik
                </li>
                <li
                  style={{
                    color: "#4a5568",
                    marginBottom: "0.5rem",
                    lineHeight: "1.5",
                  }}>
                  Berikan detail yang cukup agar mudah dipahami
                </li>
                <li
                  style={{
                    color: "#4a5568",
                    marginBottom: "0.5rem",
                    lineHeight: "1.5",
                  }}>
                  Gunakan tags yang relevan
                </li>
                <li
                  style={{
                    color: "#4a5568",
                    marginBottom: "0.5rem",
                    lineHeight: "1.5",
                  }}>
                  Cek dulu apakah pertanyaan serupa sudah ada
                </li>
                <li style={{ color: "#4a5568", lineHeight: "1.5" }}>
                  Hindari pertanyaan terlalu umum/ambigu
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end gap-3">
              <Button
                variant="outline-secondary"
                onClick={onHide}
                disabled={isSubmitting}
                style={{
                  borderRadius: "15px",
                  padding: "0.75rem 2rem",
                  fontWeight: "600",
                  border: "2px solid #6c757d",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.background = "#6c757d";
                    e.target.style.color = white;
                    e.target.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#6c757d";
                    e.target.style.transform = "translateY(0)";
                  }
                }}>
                <i className="bi bi-x-circle me-2"></i>
                Batal
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                style={{
                  borderRadius: "15px",
                  padding: "0.75rem 2rem",
                  fontWeight: "600",
                  background: isSubmitting ? "#6c757d" : primaryGrad,
                  border: "none",
                  transition: "all 0.3s ease",
                  boxShadow: isSubmitting
                    ? "none"
                    : "0 4px 15px rgba(220,53,69,0.3)",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(220,53,69,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(220,53,69,0.3)";
                  }
                }}>
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"></span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Buat Topik
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default CreateTopicModal;
