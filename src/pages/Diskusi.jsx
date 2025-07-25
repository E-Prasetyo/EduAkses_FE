import React, { useState, useEffect } from "react";
import { Container, Dropdown, Toast, ToastContainer } from "react-bootstrap";
import localStorageService from "../services/localStorageService";

// Import komponen-komponen yang sudah dipisahkan - PERBAIKAN PATH
import ForumHeader from "../components/Forum/ForumHeader";
import SearchFilter from "../components/Forum/SearchFilter";
import ForumItem from "../components/Forum/ForumItem";
import EmptyState from "../components/Forum/EmptyState";
import Pagination from "../components/Forum/Pagination";
import CreateTopicModal from "../components/Forum/CreateTopicModal";
import FloatingActionButton from "../components/Forum/FloatingActionButton";

// Import CSS
import "../styles/Diskusi.css";

const Diskusi = () => {
  // STATE
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // PAGINATION
  const itemsPerPage = 8;

  // Apply filters and search
  const filteredItems = localStorageService.searchForumItems(
    searchQuery,
    selectedCategory,
    sortBy
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show toast notification
  const showToastNotification = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // LOAD DATA saat komponen dimount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        // Simulate loading delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Initialize sample data jika belum ada
        localStorageService.initializeAllSampleData();

        // Load forum items
        const forumItems = localStorageService.getForumItems();
        setItems(forumItems);

        // Load forum categories
        const forumCategories = localStorageService.getForumCategories();
        setCategories(forumCategories);

        // Load current user
        const user = localStorageService.getCurrentUser();
        setCurrentUser(user);

        console.log("Loaded forum data:", {
          items: forumItems.length,
          categories: forumCategories.length,
          user: user?.name,
        });
      } catch (error) {
        console.error("Error initializing forum data:", error);
        setItems([]);
        showToastNotification("❌ Gagal memuat data forum", "danger");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Update filtered items when search/filter changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory, sortBy]);

  // HANDLE TAMBAH PERTANYAAN
  const handleAddForum = async (itemBaru) => {
    try {
      setIsSubmitting(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add to localStorage using service
      const addedItem = localStorageService.addForumItem({
        ...itemBaru,
        userId: currentUser?.id,
        nama: currentUser?.name || "User Anonymous",
        avatar: currentUser?.avatar,
      });

      // Update state
      const updatedItems = localStorageService.getForumItems();
      setItems(updatedItems);

      // Close modal
      setShowModal(false);

      console.log("Forum item added:", addedItem);

      // Show success message
      showToastNotification("🎉 Pertanyaan berhasil ditambahkan!", "success");

      // Optional: Navigate to the new topic
      if (
        window.confirm(
          "Pertanyaan berhasil ditambahkan! Lihat pertanyaan sekarang?"
        )
      ) {
        // Could navigate to the new topic if needed
        console.log(`Navigate to /forum/${addedItem.id}`);
      }
    } catch (error) {
      console.error("Error adding forum item:", error);
      showToastNotification(
        "❌ Gagal menambahkan pertanyaan. Silakan coba lagi.",
        "danger"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // HANDLE CLEAR DATA
  const handleClearData = async () => {
    const confirmMessage = `Yakin ingin menghapus semua ${filteredItems.length} data forum? Tindakan ini tidak dapat dibatalkan.`;

    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        localStorageService.saveForumItems([]);
        setItems([]);
        setCurrentPage(1);

        showToastNotification("🗑️ Semua data forum berhasil dihapus.", "info");
        console.log("All forum data cleared");
      } catch (error) {
        console.error("Error clearing data:", error);
        showToastNotification(
          "❌ Terjadi kesalahan saat menghapus data.",
          "danger"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // HANDLE FORM SUBMIT
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const judul = form.judul.value.trim();
    const detail = form.detail.value.trim();
    const kategori = form.kategori.value || "umum";
    const tags = form.tags.value
      .trim()
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    // Enhanced validation with visual feedback
    const showFieldError = (field, message) => {
      field.classList.add("is-invalid");
      showToastNotification(`❗ ${message}`, "warning");
      field.focus();
    };

    // Clear previous errors
    form.querySelectorAll(".is-invalid").forEach((field) => {
      field.classList.remove("is-invalid");
    });

    // Validasi input
    if (!judul) {
      showFieldError(form.judul, "Judul pertanyaan harus diisi!");
      return;
    }

    if (judul.length < 10) {
      showFieldError(form.judul, "Judul pertanyaan minimal 10 karakter!");
      return;
    }

    if (tags.length > 10) {
      showFieldError(form.tags, "Maksimal 10 tags diperbolehkan!");
      return;
    }

    const itemBaru = {
      judul,
      detail: detail || "Tidak ada detail tambahan",
      kategori,
      tags,
    };

    await handleAddForum(itemBaru);
    form.reset();
  };

  // GET RELATIVE TIME
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffSec = Math.floor((now - posted) / 1000);

    if (diffSec < 60) return "baru saja";
    if (diffSec < 3600) {
      const minutes = Math.floor(diffSec / 60);
      return `${minutes} menit lalu`;
    }
    if (diffSec < 86400) {
      const hours = Math.floor(diffSec / 3600);
      return `${hours} jam lalu`;
    }
    if (diffSec < 86400 * 7) {
      const days = Math.floor(diffSec / 86400);
      return `${days} hari lalu`;
    }
    if (diffSec < 86400 * 30) {
      const weeks = Math.floor(diffSec / (86400 * 7));
      return `${weeks} minggu lalu`;
    }
    return new Date(timestamp).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // GET CATEGORY DISPLAY
  const getCategoryDisplay = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category
      ? { name: category.name, color: category.color }
      : { name: "Umum", color: "#6c757d" };
  };

  // HANDLE LIKE TOPIC dengan animasi
  const handleLikeTopic = async (e, forumId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      showToastNotification(
        "🔐 Silakan login terlebih dahulu untuk like topik ini.",
        "warning"
      );
      return;
    }

    try {
      // Add click animation
      const button = e.currentTarget;
      button.style.animation = "likeClick 0.3s ease-in-out";
      setTimeout(() => {
        button.style.animation = "";
      }, 300);

      const isLiked = localStorageService.toggleForumLike(
        forumId,
        currentUser.id
      );

      // Update local state
      const updatedItems = localStorageService.getForumItems();
      setItems(updatedItems);

      // Show feedback
      if (isLiked) {
        showToastNotification("❤️ Topik disukai!", "success");
      } else {
        showToastNotification("💔 Like dibatalkan", "info");
      }

      console.log(isLiked ? "Topic liked" : "Topic unliked");
    } catch (error) {
      console.error("Error toggling like:", error);
      showToastNotification("❌ Gagal memproses like", "danger");
    }
  };

  // Handle export data
  const handleExportData = () => {
    try {
      const data = localStorageService.exportForumData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `forum-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToastNotification("📋 Data berhasil diexport!", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToastNotification("❌ Gagal export data", "danger");
    }
  };

  // Enhanced Loading Component
  if (loading) {
    return (
      <div className="d-flex flex-col align-items-center justify-content-center bg-white min-vh-100">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-4"
            role="status"
            style={{
              width: "4rem",
              height: "4rem",
              borderWidth: "0.3em",
            }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 className="mb-3" style={{ color: "#2d3748", fontSize: "1.5rem" }}>
            Memuat data forum...
          </h3>
          <p className="text-muted" style={{ fontSize: "1rem" }}>
            Mohon tunggu sebentar, sedang menyiapkan forum diskusi untuk Anda
          </p>
          <div
            className="progress mx-auto mt-3"
            style={{ width: "250px", height: "6px" }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: "100%" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Add custom CSS animations */}
      <style jsx>{`
        @keyframes likeClick {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .forum-item {
          animation: fadeInUp 0.6s ease-out;
        }

        .forum-item:nth-child(even) {
          animation-delay: 0.1s;
        }

        .forum-item:nth-child(3n) {
          animation-delay: 0.2s;
        }

        .forum-card:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }
      `}</style>

      <div className="flex flex-col items-end bg-white min-h-screen">
        <main className="flex pb-24 pt-12 flex-col items-center gap-12 w-full">
          <div className="w-full max-w-[1290px] px-4">
            {/* Header Component */}
            <ForumHeader items={items} />

            <Container className="my-5">
              {/* Search and Filter Component */}
              {items.length > 0 && (
                <SearchFilter
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  categories={categories}
                  onCreateTopic={() => setShowModal(true)}
                  getCategoryDisplay={getCategoryDisplay}
                />
              )}

              {/* Forum Content */}
              <div className="bg-light rounded-3 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">
                    {searchQuery || selectedCategory !== "all"
                      ? `Hasil Pencarian (${filteredItems.length})`
                      : `Daftar Pertanyaan (${items.length})`}
                  </h5>

                  {/* Admin Controls */}
                  {items.length > 0 && currentUser?.role === "admin" && (
                    <div className="d-flex gap-2">
                      <small className="text-muted align-self-center">
                        {items.length} forum tersimpan
                      </small>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                          <i className="bi bi-gear me-1"></i>
                          Admin
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={handleClearData}>
                            <i className="bi bi-trash me-2"></i>
                            Hapus Semua Data
                          </Dropdown.Item>
                          <Dropdown.Item onClick={handleExportData}>
                            <i className="bi bi-download me-2"></i>
                            Export Data
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  )}
                </div>

                {/* Empty State atau Forum Items */}
                {filteredItems.length === 0 ? (
                  <EmptyState
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    setSearchQuery={setSearchQuery}
                    setSelectedCategory={setSelectedCategory}
                    onCreateTopic={() => setShowModal(true)}
                  />
                ) : (
                  <>
                    {/* Forum Items */}
                    {currentItems.map((item) => {
                      const category = getCategoryDisplay(item.kategori);
                      const isLiked = currentUser
                        ? localStorageService.isForumLikedByUser(
                            item.id,
                            currentUser.id
                          )
                        : false;

                      return (
                        <div key={item.id} className="forum-item">
                          <ForumItem
                            item={item}
                            category={category}
                            isLiked={isLiked}
                            getRelativeTime={getRelativeTime}
                            handleLikeTopic={handleLikeTopic}
                            currentUser={currentUser}
                            localStorageService={localStorageService}
                          />
                        </div>
                      );
                    })}

                    {/* Pagination Component */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                )}
              </div>

              {/* Floating Action Button */}
              <FloatingActionButton onClick={() => setShowModal(true)} />

              {/* Create Topic Modal */}
              <CreateTopicModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleFormSubmit}
                categories={categories}
                isSubmitting={isSubmitting}
              />

              {/* Toast Notifications */}
              <ToastContainer
                position="top-end"
                className="p-3"
                style={{ zIndex: 9999 }}>
                <Toast
                  show={showToast}
                  onClose={() => setShowToast(false)}
                  delay={4000}
                  autohide
                  bg={toastVariant === "danger" ? "danger" : toastVariant}
                  className="text-white">
                  <Toast.Header className="d-flex justify-content-between">
                    <strong className="me-auto">
                      {toastVariant === "success" && (
                        <i className="bi bi-check-circle me-2"></i>
                      )}
                      {toastVariant === "danger" && (
                        <i className="bi bi-exclamation-triangle me-2"></i>
                      )}
                      {toastVariant === "warning" && (
                        <i className="bi bi-exclamation-circle me-2"></i>
                      )}
                      {toastVariant === "info" && (
                        <i className="bi bi-info-circle me-2"></i>
                      )}
                      Forum EduAkses
                    </strong>
                  </Toast.Header>
                  <Toast.Body className="fw-medium">{toastMessage}</Toast.Body>
                </Toast>
              </ToastContainer>
            </Container>
          </div>
        </main>
      </div>
    </>
  );
};

export default Diskusi;
