import React, { useState, useEffect, useCallback } from "react";
import { Button, ButtonGroup, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Smooth scroll helper
const scrollToSelector = (selector, offset = 20) => {
  const el = document.querySelector(selector);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
};

// Count replies for badge
const getTotalRepliesCount = () => {
  const repliesSection = document.querySelector("[data-replies-section]");
  if (!repliesSection) return 0;
  return repliesSection.querySelectorAll('[id^="reply-"]').length;
};

const Navigation = ({ forumItem }) => {
  const navigate = useNavigate();

  const [active, setActive] = useState("top"); // "top" | "replies" | "form"
  const [repliesCount, setRepliesCount] = useState(0);
  const [showFab, setShowFab] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user (fallback kalau tidak dipass via props)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to parse currentUser", e);
    }
  }, []);

  // Observe reply count changes
  useEffect(() => {
    const update = () => setRepliesCount(getTotalRepliesCount());
    update();

    const repliesSection = document.querySelector("[data-replies-section]");
    if (!repliesSection) return;

    const observer = new MutationObserver(update);
    observer.observe(repliesSection, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Scroll handlers
  const handleBack = () => navigate(-1);

  const handleScrollToTop = useCallback(() => {
    setIsScrolling(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActive("top");
    setTimeout(() => setIsScrolling(false), 700);
  }, []);

  const handleScrollToReplies = useCallback(() => {
    setIsScrolling(true);
    scrollToSelector("[data-replies-section]", 80);
    setActive("replies");
    setTimeout(() => setIsScrolling(false), 700);
  }, []);

  const handleScrollToForm = useCallback(() => {
    setIsScrolling(true);
    scrollToSelector("[data-reply-form]", 20);
    setActive("form");
    setTimeout(() => setIsScrolling(false), 700);
  }, []);

  // Detect visible section for active state + show FAB
  useEffect(() => {
    const replies = document.querySelector("[data-replies-section]");
    const form = document.querySelector("[data-reply-form]");
    if (!replies || !form) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === replies) setActive("replies");
          if (entry.target === form) setActive("form");
        });
      },
      { threshold: 0.25, rootMargin: "-80px 0px -20% 0px" }
    );

    observer.observe(replies);
    observer.observe(form);

    const onScroll = () => {
      setShowFab(window.scrollY > 200);
      if (isScrolling) return;
      if (window.scrollY < 120) setActive("top");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [isScrolling]);

  const hasReplies = repliesCount > 0;
  const canReply = currentUser && !forumItem?.isLocked;

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="d-md-none nav-mobile shadow-sm border-top bg-white">
        <button
          className="nav-mobile-btn"
          onClick={handleBack}
          aria-label="Kembali">
          <i className="bi bi-arrow-left mb-1 text-danger" />
          <span>Kembali</span>
        </button>

        <button
          className={`nav-mobile-btn ${active === "replies" ? "active" : ""}`}
          onClick={handleScrollToReplies}
          aria-label="Balasan"
          disabled={!hasReplies}>
          <i className="bi bi-chat-dots mb-1" />
          <span>Balasan</span>
          {repliesCount > 0 && (
            <Badge bg="danger" className="badge-replies">
              {repliesCount > 99 ? "99+" : repliesCount}
            </Badge>
          )}
        </button>

        <button
          className={`nav-mobile-btn ${active === "form" ? "active" : ""}`}
          onClick={handleScrollToForm}
          aria-label="Balas"
          disabled={!canReply}>
          <i className={`bi ${canReply ? "bi-plus-circle" : "bi-lock"} mb-1`} />
          <span>{canReply ? "Balas" : "Login"}</span>
          {forumItem?.isLocked && (
            <i className="bi bi-lock-fill lock-icon-mobile" />
          )}
        </button>

        <button
          className={`nav-mobile-btn ${active === "top" ? "active" : ""}`}
          onClick={handleScrollToTop}
          aria-label="Atas">
          <i className="bi bi-arrow-up mb-1" />
          <span>Atas</span>
        </button>
      </nav>

      {/* Desktop inline nav */}
      <div className="d-none d-md-block mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-danger"
            onClick={handleBack}
            className="btn-edu-outline px-3 py-2 shadow-sm border-2 rounded-3">
            <i className="bi bi-arrow-left me-2" />
            Kembali ke Forum
          </Button>

          <ButtonGroup>
            <Button
              variant={active === "replies" ? "edu-primary" : "outline-primary"}
              className={`px-3 py-2 rounded-start-3 ${
                active === "replies" ? "btn-edu" : "btn-edu-outline"
              }`}
              onClick={handleScrollToReplies}
              disabled={!hasReplies}>
              <i className="bi bi-chat-dots me-2" />
              Lihat Balasan
              {repliesCount > 0 && (
                <Badge
                  bg={active === "replies" ? "light" : "primary"}
                  text={active === "replies" ? "primary" : "white"}
                  className="ms-2">
                  {repliesCount}
                </Badge>
              )}
            </Button>

            <Button
              variant={active === "form" ? "edu-primary" : "outline-success"}
              className={`px-3 py-2 rounded-end-3 ${
                active === "form" ? "btn-edu" : "btn-edu-outline"
              }`}
              onClick={handleScrollToForm}
              disabled={!canReply}>
              <i
                className={`bi ${canReply ? "bi-plus-circle" : "bi-lock"} me-2`}
              />
              {canReply ? "Tambah Balasan" : "Perlu Login"}
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Desktop floating buttons */}
      <div className="d-none d-md-block">
        <div
          className="position-fixed bottom-0 end-0 m-4 d-flex flex-column gap-3 fab-container"
          style={{
            transform: showFab ? "translateY(0)" : "translateY(100px)",
          }}>
          <Button
            variant="secondary"
            className="rounded-circle shadow-lg border-0 btn-fab"
            onClick={handleScrollToTop}
            aria-label="Ke atas">
            <i className="bi bi-arrow-up fs-5" />
          </Button>

          {canReply && (
            <Button
              variant="danger"
              className="rounded-circle shadow-lg border-0 btn-fab position-relative"
              onClick={handleScrollToForm}
              aria-label="Balas cepat">
              <i className="bi bi-plus fs-4" />
              {active === "form" && <span className="fab-pulse" />}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
