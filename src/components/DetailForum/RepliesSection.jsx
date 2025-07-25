// components/DetailForum/RepliesSection.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  Button,
  Dropdown,
  Badge,
  Collapse,
  Spinner,
} from "react-bootstrap";
import ReplyComponent from "./ReplyComponent";

const RepliesSection = ({
  replies,
  totalReplies,
  currentUser,
  activeReply,
  setActiveReply,
  replyTexts,
  setReplyTexts,
  toggleLike,
  addNestedReply,
  onReportReply,
  onDeleteReply,
  onHideReply,
}) => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  const sectionRef = useRef(null);

  // Smooth scroll to reply form
  const scrollToReplyForm = () => {
    const formElement = document.querySelector("[data-reply-form]");
    if (formElement) {
      setIsLoading(true);

      formElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        const textarea = formElement.querySelector("textarea");
        if (textarea) {
          textarea.focus();
          textarea.style.boxShadow = "0 0 0 3px rgba(220, 53, 69, 0.3)";
          setTimeout(() => {
            textarea.style.boxShadow = "";
          }, 1000);
        }
        setIsLoading(false);
      }, 800);
    }
  };

  // Animate stats when data changes
  useEffect(() => {
    setAnimateStats(true);
    const timer = setTimeout(() => setAnimateStats(false), 600);
    return () => clearTimeout(timer);
  }, [replies.length, totalReplies]);

  // Add CSS animations to document if not already added
  useEffect(() => {
    if (!document.querySelector("#replies-styles")) {
      const style = document.createElement("style");
      style.id = "replies-styles";
      style.textContent = `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes countUp {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-count {
          animation: countUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animated-badge {
          transition: all 0.3s ease;
        }

        .replies-container {
          position: relative;
        }

        .reply-item {
          opacity: 0;
          animation-fill-mode: both;
        }

        .bg-gradient {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .first-reply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 53, 69, 0.3) !important;
        }

        .stats-card {
          transition: all 0.3s ease;
        }

        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Sort replies
  const getSortedReplies = () => {
    let sortedReplies = [...replies];

    switch (sortBy) {
      case "oldest":
        sortedReplies.sort((a, b) => new Date(a.waktu) - new Date(b.waktu));
        break;
      case "mostLiked":
        sortedReplies.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "newest":
      default:
        sortedReplies.sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
        break;
    }

    // Apply filter
    switch (filterBy) {
      case "withReplies":
        sortedReplies = sortedReplies.filter(
          (reply) => reply.replies && reply.replies.length > 0
        );
        break;
      case "noReplies":
        sortedReplies = sortedReplies.filter(
          (reply) => !reply.replies || reply.replies.length === 0
        );
        break;
      case "hidden":
        if (currentUser?.role === "admin") {
          sortedReplies = sortedReplies.filter((reply) => reply.isHidden);
        }
        break;
      case "all":
      default:
        break;
    }

    return sortedReplies;
  };

  const sortedReplies = getSortedReplies();

  const getSortIcon = (type) => {
    switch (type) {
      case "newest":
        return "bi-sort-down";
      case "oldest":
        return "bi-sort-up";
      case "mostLiked":
        return "bi-heart-fill";
      default:
        return "bi-sort-down";
    }
  };

  const getSortLabel = (type) => {
    switch (type) {
      case "newest":
        return "Terbaru";
      case "oldest":
        return "Terlama";
      case "mostLiked":
        return "Terpopuler";
      default:
        return "Urutkan";
    }
  };

  const getFilterLabel = (type) => {
    switch (type) {
      case "all":
        return "Semua";
      case "withReplies":
        return "Ada Balasan";
      case "noReplies":
        return "Tanpa Balasan";
      case "hidden":
        return "Disembunyikan";
      default:
        return "Filter";
    }
  };

  const hiddenCount =
    currentUser?.role === "admin"
      ? replies.filter((r) => r.isHidden).length
      : 0;

  return (
    <div className="mb-4" ref={sectionRef}>
      {/* Enhanced Replies Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <h4 className="mb-0 d-flex align-items-center">
            <i className="bi bi-chat-dots text-danger me-2"></i>
            Balasan ({totalReplies})
          </h4>

          {/* Status Badges */}
          {sortedReplies.length !== totalReplies && (
            <Badge bg="secondary" className="animated-badge">
              {sortedReplies.length} ditampilkan
            </Badge>
          )}

          {hiddenCount > 0 && (
            <Badge bg="warning" className="animated-badge">
              <i className="bi bi-eye-slash me-1"></i>
              {hiddenCount} disembunyikan
            </Badge>
          )}

          {filterBy !== "all" && (
            <Badge bg="info" className="animated-badge">
              <i className="bi bi-funnel me-1"></i>
              {getFilterLabel(filterBy)}
            </Badge>
          )}
        </div>

        {/* Enhanced Sort & Filter Controls */}
        {replies.length > 0 && (
          <div className="d-flex flex-wrap gap-2 align-items-center">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline-secondary"
              size="sm"
              className="d-md-none position-relative"
              onClick={() => setShowFilters(!showFilters)}>
              <i
                className={`bi bi-funnel me-1 ${showFilters ? "text-primary" : ""}`}></i>
              Filter & Urutkan
              {(filterBy !== "all" || sortBy !== "newest") && (
                <Badge
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                  style={{ fontSize: "0.5rem", padding: "2px 4px" }}>
                  •
                </Badge>
              )}
            </Button>

            {/* Desktop & Mobile Expanded Controls */}
            <Collapse in={showFilters} className="d-md-none w-100">
              <div className="mt-2 p-3 bg-light rounded">
                <div className="d-flex gap-2 flex-wrap">
                  <SortDropdown
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    getSortIcon={getSortIcon}
                    getSortLabel={getSortLabel}
                  />
                  <FilterDropdown
                    filterBy={filterBy}
                    setFilterBy={setFilterBy}
                    currentUser={currentUser}
                    getFilterLabel={getFilterLabel}
                  />
                </div>
              </div>
            </Collapse>

            {/* Desktop Controls */}
            <div className="d-none d-md-flex gap-2">
              <SortDropdown
                sortBy={sortBy}
                setSortBy={setSortBy}
                getSortIcon={getSortIcon}
                getSortLabel={getSortLabel}
              />
              <FilterDropdown
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                currentUser={currentUser}
                getFilterLabel={getFilterLabel}
              />
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Login Prompt */}
      {!currentUser && (
        <Alert variant="warning" className="mb-4 border-0 shadow-sm">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <i className="bi bi-info-circle-fill fs-4 text-warning"></i>
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-1 fw-bold">Login Diperlukan</h6>
              <p className="mb-2 small">
                Bergabunglah untuk memberikan balasan, like, dan berinteraksi
                dalam diskusi ini.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <Button variant="warning" size="sm" className="shadow-sm">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Button>
                <Button variant="outline-warning" size="sm">
                  <i className="bi bi-person-plus me-1"></i>
                  Daftar
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      )}

      {/* Enhanced Empty State */}
      {replies.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light"
              style={{ width: "120px", height: "120px" }}>
              <i
                className="bi bi-chat text-muted"
                style={{ fontSize: "3rem" }}></i>
            </div>
          </div>

          <h5 className="text-muted mt-3 mb-2">Belum ada balasan</h5>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "400px" }}>
            Jadilah yang pertama memberikan jawaban untuk pertanyaan ini!
            Bantuan Anda sangat berarti bagi komunitas.
          </p>

          {currentUser ? (
            <div className="d-flex flex-column align-items-center gap-3">
              <Button
                variant="danger"
                size="lg"
                className="px-4 py-2 shadow-sm position-relative first-reply-btn"
                onClick={scrollToReplyForm}
                disabled={isLoading}
                style={{
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}>
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Mengarahkan...
                  </>
                ) : (
                  <>
                    <i className="bi bi-chat-dots me-2"></i>
                    Tulis Balasan Pertama
                  </>
                )}
              </Button>

              <div className="text-center">
                <small className="text-muted d-block">
                  <i className="bi bi-lightbulb me-1"></i>
                  Berikan jawaban yang konstruktif dan membantu
                </small>
                <small className="text-muted">
                  Dapatkan like dan apresiasi dari komunitas
                </small>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center gap-2">
              <Button variant="outline-danger" size="lg" disabled>
                <i className="bi bi-lock me-2"></i>
                Login untuk Membalas
              </Button>
              <small className="text-muted">
                Bergabung dengan komunitas untuk berpartisipasi
              </small>
            </div>
          )}
        </div>
      ) : (
        /* Enhanced Replies List */
        <div>
          {/* Filter Results Info */}
          {sortedReplies.length !== replies.length && (
            <Alert variant="info" className="mb-3 border-0 bg-light">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center">
                  <i className="bi bi-filter me-2"></i>
                  <span>
                    Menampilkan <strong>{sortedReplies.length}</strong> dari{" "}
                    <strong>{replies.length}</strong> balasan
                  </span>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-decoration-none"
                  onClick={() => {
                    setFilterBy("all");
                    setSortBy("newest");
                  }}>
                  <i className="bi bi-x-circle me-1"></i>
                  Reset Filter
                </Button>
              </div>
            </Alert>
          )}

          {/* Admin Info */}
          {currentUser?.role === "admin" &&
            hiddenCount > 0 &&
            filterBy !== "hidden" && (
              <Alert variant="warning" className="mb-3 border-0">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-shield-check me-2"></i>
                    <span>
                      <strong>Admin:</strong> Terdapat {hiddenCount} balasan
                      tersembunyi
                    </span>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-decoration-none"
                    onClick={() => setFilterBy("hidden")}>
                    <i className="bi bi-eye-slash me-1"></i>
                    Lihat Tersembunyi
                  </Button>
                </div>
              </Alert>
            )}

          {/* Replies with Enhanced Animation */}
          <div className="replies-container">
            {sortedReplies.map((reply, index) => (
              <div
                key={reply.id}
                className="reply-item"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`,
                }}>
                <ReplyComponent
                  reply={reply}
                  activeReply={activeReply}
                  setActiveReply={setActiveReply}
                  replyTexts={replyTexts}
                  setReplyTexts={setReplyTexts}
                  toggleLike={toggleLike}
                  addNestedReply={addNestedReply}
                  currentUser={currentUser}
                  onReportReply={onReportReply}
                  onDeleteReply={onDeleteReply}
                  onHideReply={onHideReply}
                />

                {/* Enhanced Divider */}
                {index < sortedReplies.length - 1 && (
                  <div className="my-4 d-flex align-items-center">
                    <hr className="flex-grow-1 opacity-25" />
                    <small className="px-3 text-muted bg-white">
                      {sortedReplies.length - index - 1} balasan lainnya
                    </small>
                    <hr className="flex-grow-1 opacity-25" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {sortedReplies.length >= 10 && (
            <div className="text-center mt-4">
              <Button
                variant="outline-danger"
                className="px-4 py-2 shadow-sm"
                style={{ borderRadius: "25px" }}>
                <i className="bi bi-arrow-down-circle me-2"></i>
                Muat Lebih Banyak Balasan
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Quick Stats */}
      {replies.length > 0 && (
        <div className="mt-4">
          <div className="card border-0 shadow-sm stats-card bg-gradient">
            <div className="card-body p-4">
              <h6 className="card-title mb-3 text-center text-muted">
                <i className="bi bi-graph-up me-2"></i>
                Statistik Diskusi
              </h6>

              <div className="row text-center g-3">
                <div className="col-6 col-md-3">
                  <div className="p-2">
                    <div
                      className={`h4 mb-1 text-primary ${animateStats ? "animate-count" : ""}`}
                      style={{ fontWeight: "700" }}>
                      {totalReplies}
                    </div>
                    <small className="text-muted fw-medium">
                      Total Balasan
                    </small>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="p-2">
                    <div
                      className={`h4 mb-1 text-success ${animateStats ? "animate-count" : ""}`}
                      style={{ fontWeight: "700" }}>
                      {
                        replies.filter((r) => r.replies && r.replies.length > 0)
                          .length
                      }
                    </div>
                    <small className="text-muted fw-medium">
                      Dengan Balasan
                    </small>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="p-2">
                    <div
                      className={`h4 mb-1 text-info ${animateStats ? "animate-count" : ""}`}
                      style={{ fontWeight: "700" }}>
                      {replies.reduce((acc, r) => acc + (r.likes || 0), 0)}
                    </div>
                    <small className="text-muted fw-medium">Total Likes</small>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="p-2">
                    <div
                      className={`h4 mb-1 text-warning ${animateStats ? "animate-count" : ""}`}
                      style={{ fontWeight: "700" }}>
                      {new Set(replies.map((r) => r.userId)).size}
                    </div>
                    <small className="text-muted fw-medium">Kontributor</small>
                  </div>
                </div>
              </div>

              {/* Admin Stats */}
              {currentUser?.role === "admin" && hiddenCount > 0 && (
                <>
                  <hr className="my-3 opacity-25" />
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="p-2">
                        <div className="h5 mb-1 text-warning fw-bold">
                          {hiddenCount}
                        </div>
                        <small className="text-muted">Disembunyikan</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2">
                        <div className="h5 mb-1 text-success fw-bold">
                          {replies.length - hiddenCount}
                        </div>
                        <small className="text-muted">Terlihat</small>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Sort Dropdown Component
const SortDropdown = ({ sortBy, setSortBy, getSortIcon, getSortLabel }) => (
  <Dropdown>
    <Dropdown.Toggle
      variant="outline-primary"
      size="sm"
      className="d-flex align-items-center shadow-sm">
      <i className={`bi ${getSortIcon(sortBy)} me-1`}></i>
      <span className="d-none d-sm-inline">{getSortLabel(sortBy)}</span>
      <span className="d-sm-none">Sort</span>
    </Dropdown.Toggle>
    <Dropdown.Menu>
      <Dropdown.Header>Urutkan berdasarkan:</Dropdown.Header>
      <Dropdown.Item
        active={sortBy === "newest"}
        onClick={() => setSortBy("newest")}>
        <i className="bi bi-sort-down me-2"></i>Terbaru
      </Dropdown.Item>
      <Dropdown.Item
        active={sortBy === "oldest"}
        onClick={() => setSortBy("oldest")}>
        <i className="bi bi-sort-up me-2"></i>Terlama
      </Dropdown.Item>
      <Dropdown.Item
        active={sortBy === "mostLiked"}
        onClick={() => setSortBy("mostLiked")}>
        <i className="bi bi-heart-fill me-2"></i>Terpopuler
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

// Reusable Filter Dropdown Component
const FilterDropdown = ({
  filterBy,
  setFilterBy,
  currentUser,
  getFilterLabel,
}) => (
  <Dropdown>
    <Dropdown.Toggle
      variant="outline-success"
      size="sm"
      className="d-flex align-items-center shadow-sm">
      <i className="bi bi-funnel me-1"></i>
      <span className="d-none d-sm-inline">{getFilterLabel(filterBy)}</span>
      <span className="d-sm-none">Filter</span>
    </Dropdown.Toggle>
    <Dropdown.Menu>
      <Dropdown.Header>Filter balasan:</Dropdown.Header>
      <Dropdown.Item
        active={filterBy === "all"}
        onClick={() => setFilterBy("all")}>
        <i className="bi bi-list me-2"></i>Semua Balasan
      </Dropdown.Item>
      <Dropdown.Item
        active={filterBy === "withReplies"}
        onClick={() => setFilterBy("withReplies")}>
        <i className="bi bi-chat-dots me-2"></i>Ada Balasan
      </Dropdown.Item>
      <Dropdown.Item
        active={filterBy === "noReplies"}
        onClick={() => setFilterBy("noReplies")}>
        <i className="bi bi-chat me-2"></i>Tanpa Balasan
      </Dropdown.Item>

      {/* Admin only filter */}
      {currentUser?.role === "admin" && (
        <>
          <Dropdown.Divider />
          <Dropdown.Item
            active={filterBy === "hidden"}
            onClick={() => setFilterBy("hidden")}>
            <i className="bi bi-eye-slash me-2"></i>Disembunyikan
          </Dropdown.Item>
        </>
      )}
    </Dropdown.Menu>
  </Dropdown>
);

export default RepliesSection;
