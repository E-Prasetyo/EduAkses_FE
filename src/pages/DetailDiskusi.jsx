import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import localStorageService from "../services/localStorageService";

// Import all components - sesuai dengan struktur folder Anda
import ForumHeader from "../components/DetailForum/ForumHeader";
import QuestionDetail from "../components/DetailForum/QuestionDetail";
import RepliesSection from "../components/DetailForum/RepliesSection";
import AddReplyForm from "../components/DetailForum/AddReplyForm";
import Navigation from "../components/DetailForum/Navigation";
import {
  LoadingComponent,
  ErrorComponent,
} from "../components/DetailForum/LoadingAndError";

const DetailDiskusi = () => {
  // Get forum ID from URL parameters
  const { id: forumId } = useParams();
  const navigate = useNavigate();

  // States
  const [forumItem, setForumItem] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  // Load forum item from localStorage
  const loadForumItem = useCallback(() => {
    try {
      if (!forumId) {
        setError("ID forum tidak valid");
        setLoading(false);
        return;
      }

      // Check if we've already viewed this forum in this session
      const viewedKey = `forum_viewed_${forumId}`;
      const hasViewed = sessionStorage.getItem(viewedKey);

      // Only increment views if not viewed in this session
      if (!hasViewed) {
        localStorageService.incrementForumViews(forumId);
        sessionStorage.setItem(viewedKey, "true");
      }

      const foundItem = localStorageService.getForumItemById(forumId);

      if (foundItem) {
        setForumItem(foundItem);
        setReplies(foundItem.balasan || []);

        // Check if current user liked this topic
        const user = localStorageService.getCurrentUser();
        if (user) {
          const liked = localStorageService.isForumLikedByUser(
            forumId,
            user.id
          );
          setIsLiked(liked);
        }
      } else {
        setError(`Forum dengan ID ${forumId} tidak ditemukan`);
      }
    } catch (error) {
      console.error("Error loading forum item:", error);
      setError("Terjadi kesalahan saat memuat data forum");
    } finally {
      setLoading(false);
    }
  }, [forumId]);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize sample data if needed
        localStorageService.initializeAllSampleData();

        // Clean up any corrupt drafts first
        const allDrafts = localStorageService.getReplyDrafts();
        const cleanedDrafts = {};
        Object.keys(allDrafts).forEach((key) => {
          const draft = allDrafts[key];
          if (typeof draft === "string") {
            cleanedDrafts[key] = draft;
          } else if (
            draft &&
            typeof draft === "object" &&
            typeof draft.content === "string"
          ) {
            cleanedDrafts[key] = draft.content;
          }
        });

        // Save cleaned drafts back
        localStorageService.saveReplyDrafts(cleanedDrafts);

        // Load current user
        const user = localStorageService.getCurrentUser();
        setCurrentUser(user);

        // Load categories
        const forumCategories = localStorageService.getForumCategories();
        setCategories(forumCategories);

        // Load reply drafts - ensure all are strings
        const cleanDrafts = {};
        Object.keys(cleanedDrafts).forEach((key) => {
          cleanDrafts[key] = String(cleanedDrafts[key] || "");
        });

        setReplyTexts(cleanDrafts);

        // Load main reply draft
        const mainDraft = cleanDrafts["main"];
        setNewReply(typeof mainDraft === "string" ? mainDraft : "");

        // Load forum item
        loadForumItem();
      } catch (err) {
        console.error("Error initializing data:", err);
        setError("Terjadi kesalahan saat memuat data forum.");
        setLoading(false);
      }
    };

    initializeData();
  }, [forumId, loadForumItem]);

  // Cleanup function untuk component unmount
  useEffect(() => {
    return () => {
      // Cleanup session storage when component unmounts
      // sessionStorage.removeItem(`forum_viewed_${forumId}`);
    };
  }, [forumId]);

  // Safety useEffect to ensure newReply is always a string
  useEffect(() => {
    if (typeof newReply !== "string") {
      setNewReply("");
    }
  }, [newReply]);

  // Safety useEffect to ensure replyTexts values are always strings
  useEffect(() => {
    const hasNonStringValues = Object.values(replyTexts).some(
      (value) => typeof value !== "string"
    );
    if (hasNonStringValues) {
      const cleanedTexts = {};
      Object.keys(replyTexts).forEach((key) => {
        const value = replyTexts[key];
        cleanedTexts[key] =
          typeof value === "string" ? value : String(value || "");
      });
      setReplyTexts(cleanedTexts);
    }
  }, [replyTexts]);

  // Update forum item in localStorage and state
  const updateForumItem = useCallback(
    (updatedReplies) => {
      try {
        const updatedData = {
          balasan: updatedReplies,
          jumlahBalasan:
            localStorageService.getTotalRepliesCount(updatedReplies),
        };

        // Update in localStorage
        const updatedItem = localStorageService.updateForumItem(
          forumId,
          updatedData
        );

        if (updatedItem) {
          setReplies(updatedReplies);
          setForumItem((prev) => (prev ? { ...prev, ...updatedData } : null));
        }
      } catch (error) {
        console.error("Error updating forum item:", error);
        alert("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
      }
    },
    [forumId]
  );

  // Generate unique ID
  const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

  // Handle send main reply
  const handleSendReply = useCallback(async () => {
    const replyText = String(newReply || "").trim();
    if (!replyText || isSubmitting || !currentUser) return;

    try {
      setIsSubmitting(true);

      const newReplyObj = {
        id: generateId(),
        avatar:
          currentUser.avatar || `https://i.pravatar.cc/40?random=${Date.now()}`,
        nama: currentUser.name || "User Anonymous",
        userId: currentUser.id,
        isi: replyText,
        waktu: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        replies: [],
      };

      const updatedReplies = [newReplyObj, ...replies];
      updateForumItem(updatedReplies);

      setNewReply("");
      localStorageService.removeReplyDraft("main");

      // Show success message
      const successAlert = document.createElement("div");
      successAlert.className =
        "alert alert-success alert-dismissible fade show position-fixed";
      successAlert.style.cssText =
        "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
      successAlert.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        Balasan berhasil dikirim!
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
      `;
      document.body.appendChild(successAlert);
      setTimeout(() => {
        if (successAlert.parentElement) {
          successAlert.remove();
        }
      }, 5000);
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("Terjadi kesalahan saat menambah balasan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }, [newReply, isSubmitting, replies, updateForumItem, currentUser]);

  // Handle add nested reply
  const addNestedReply = useCallback(
    (parentId, parentPath = []) => {
      const replyText = String(replyTexts[parentId] || "").trim();
      if (!replyText || isSubmitting || !currentUser) return;

      try {
        setIsSubmitting(true);

        const nestedReply = {
          id: generateId(),
          avatar:
            currentUser.avatar ||
            `https://i.pravatar.cc/40?random=${Date.now()}`,
          nama: currentUser.name || "User Anonymous",
          userId: currentUser.id,
          isi: replyText,
          waktu: new Date().toISOString(),
          likes: 0,
          isLiked: false,
          replies: [],
        };

        const updateNestedReplies = (arr, path) => {
          if (path.length === 0) {
            return arr.map((item) =>
              item.id === parentId
                ? { ...item, replies: [...(item.replies || []), nestedReply] }
                : item
            );
          }
          const [current, ...rest] = path;
          return arr.map((item) =>
            item.id === current
              ? {
                  ...item,
                  replies: updateNestedReplies(item.replies || [], rest),
                }
              : item
          );
        };

        const updatedReplies = updateNestedReplies(replies, parentPath);
        updateForumItem(updatedReplies);

        // Clear reply text and draft
        setReplyTexts((prev) => ({ ...prev, [parentId]: "" }));
        localStorageService.removeReplyDraft(parentId);
        setActiveReply(null);
      } catch (error) {
        console.error("Error adding nested reply:", error);
        alert("Terjadi kesalahan saat menambah balasan. Silakan coba lagi.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [replyTexts, isSubmitting, replies, updateForumItem, currentUser]
  );

  // Handle toggle like
  const toggleLike = useCallback(
    (replyId, parentPath = []) => {
      if (!currentUser) return;

      try {
        const updateLikes = (arr, path) => {
          if (path.length === 0) {
            return arr.map((r) =>
              r.id === replyId
                ? {
                    ...r,
                    likes: r.isLiked
                      ? Math.max(0, (r.likes || 1) - 1)
                      : (r.likes || 0) + 1,
                    isLiked: !r.isLiked,
                  }
                : r
            );
          }
          const [current, ...rest] = path;
          return arr.map((r) =>
            r.id === current
              ? { ...r, replies: updateLikes(r.replies || [], rest) }
              : r
          );
        };

        const updatedReplies = updateLikes(replies, parentPath);
        updateForumItem(updatedReplies);
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    },
    [replies, updateForumItem, currentUser]
  );

  // ADMIN FUNCTIONS - NEW
  // Handle delete reply
  const handleDeleteReply = useCallback(
    (replyId, parentPath = []) => {
      if (!currentUser || currentUser.role !== "admin") {
        alert("Anda tidak memiliki izin untuk menghapus balasan.");
        return;
      }

      try {
        const deleteReplyRecursive = (arr, path) => {
          if (path.length === 0) {
            // Delete at current level
            return arr.filter((r) => r.id !== replyId);
          }

          const [current, ...rest] = path;
          return arr.map((r) =>
            r.id === current
              ? { ...r, replies: deleteReplyRecursive(r.replies || [], rest) }
              : r
          );
        };

        const updatedReplies = deleteReplyRecursive(replies, parentPath);
        updateForumItem(updatedReplies);

        console.log("Reply deleted successfully:", replyId);
      } catch (error) {
        console.error("Error deleting reply:", error);
        alert("Terjadi kesalahan saat menghapus balasan.");
      }
    },
    [replies, updateForumItem, currentUser]
  );

  // Handle hide/show reply
  const handleHideReply = useCallback(
    (replyId, parentPath = [], isHidden) => {
      if (!currentUser || currentUser.role !== "admin") {
        alert("Anda tidak memiliki izin untuk menyembunyikan balasan.");
        return;
      }

      try {
        const hideReplyRecursive = (arr, path) => {
          if (path.length === 0) {
            // Update at current level
            return arr.map((r) =>
              r.id === replyId ? { ...r, isHidden: isHidden } : r
            );
          }

          const [current, ...rest] = path;
          return arr.map((r) =>
            r.id === current
              ? { ...r, replies: hideReplyRecursive(r.replies || [], rest) }
              : r
          );
        };

        const updatedReplies = hideReplyRecursive(replies, parentPath);
        updateForumItem(updatedReplies);

        console.log("Reply visibility updated:", replyId, "Hidden:", isHidden);
      } catch (error) {
        console.error("Error updating reply visibility:", error);
        alert("Terjadi kesalahan saat mengubah visibilitas balasan.");
      }
    },
    [replies, updateForumItem, currentUser]
  );

  // Handle main reply text change
  const handleMainReplyChange = useCallback((e) => {
    let value = "";

    if (e && e.target && typeof e.target.value !== "undefined") {
      value = String(e.target.value);
    } else if (typeof e === "string") {
      value = e;
    }

    setNewReply(value);
    localStorageService.setReplyDraft("main", value);
  }, []);

  // Handle like topic
  const handleLikeTopic = () => {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu untuk like topik ini.");
      return;
    }

    const liked = localStorageService.toggleForumLike(forumId, currentUser.id);
    setIsLiked(liked);

    // Refresh forum item to get updated like count
    const updatedItem = localStorageService.getForumItemById(forumId);
    if (updatedItem) {
      setForumItem(updatedItem);
    }
  };

  // Handle report reply
  const handleReportReply = (reply) => {
    alert(
      `Terima kasih! Laporan untuk balasan dari ${reply.nama} akan ditinjau oleh moderator.`
    );
  };

  // Get category display
  const getCategoryDisplay = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category
      ? { name: category.name, color: category.color }
      : { name: "Umum", color: "#6c757d" };
  };

  // Loading state
  if (loading) {
    return <LoadingComponent />;
  }

  // Error state
  if (error || !forumItem) {
    return <ErrorComponent error={error} forumId={forumId} />;
  }

  const totalReplies = localStorageService.getTotalRepliesCount(replies);
  const category = getCategoryDisplay(forumItem.kategori);

  return (
    <div
      className="min-vh-100 bg-light"
      style={{ paddingBottom: window.innerWidth < 768 ? "80px" : "20px" }}>
      {/* Header Section */}
      <ForumHeader
        forumItem={forumItem}
        category={category}
        totalReplies={totalReplies}
        forumId={forumId}
      />

      {/* Main Content */}
      <div className="container my-4 my-md-5">
        <div className="row">
          <div className="col">
            {/* Navigation */}
            <Navigation forumItem={forumItem} />

            {/* Question Detail Card */}
            <QuestionDetail
              forumItem={forumItem}
              currentUser={currentUser}
              isLiked={isLiked}
              onLikeTopic={handleLikeTopic}
              localStorageService={localStorageService}
            />

            {/* Replies Section */}
            <div data-replies-section>
              <RepliesSection
                replies={replies}
                totalReplies={totalReplies}
                currentUser={currentUser}
                activeReply={activeReply}
                setActiveReply={setActiveReply}
                replyTexts={replyTexts}
                setReplyTexts={setReplyTexts}
                toggleLike={toggleLike}
                addNestedReply={addNestedReply}
                onReportReply={handleReportReply}
                onDeleteReply={handleDeleteReply} // ADD THIS
                onHideReply={handleHideReply} // ADD THIS
              />
            </div>

            {/* Add Reply Form */}
            <div data-reply-form>
              <AddReplyForm
                currentUser={currentUser}
                newReply={newReply}
                handleMainReplyChange={handleMainReplyChange}
                handleSendReply={handleSendReply}
                isSubmitting={isSubmitting}
                forumItem={forumItem}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDiskusi;
