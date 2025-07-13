import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Programming",
      description: "Kursus pemrograman dan pengembangan software",
      courseCount: 25,
      isActive: true,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Design",
      description: "UI/UX Design, Graphic Design, dan Web Design",
      courseCount: 18,
      isActive: true,
      createdAt: "2024-01-20",
    },
    {
      id: 3,
      name: "Marketing",
      description: "Digital Marketing, SEO, dan Social Media Marketing",
      courseCount: 12,
      isActive: true,
      createdAt: "2024-02-01",
    },
    {
      id: 4,
      name: "Business",
      description: "Entrepreneurship, Management, dan Leadership",
      courseCount: 8,
      isActive: false,
      createdAt: "2024-02-10",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      // Update existing category
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...formData } : cat,
        ),
      );
    } else {
      // Add new category
      const newCategory = {
        id: Date.now(),
        ...formData,
        courseCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCategories([...categories, newCategory]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", isActive: true });
    setEditingCategory(null);
    setShowModal(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = (categoryId) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus kategori ini? Semua kursus dalam kategori ini akan kehilangan kategorinya.",
      )
    ) {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
  };

  const toggleStatus = (categoryId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat,
      ),
    );
  };

  return (
    <div className="min-vh-100 d-flex flex-column">

      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 fw-bold mb-1">Manajemen Kategori</h1>
              <p className="text-muted mb-0">
                Kelola kategori kursus yang tersedia di platform
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/admin/dashboard" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>
                Kembali
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-edu-primary"
              >
                <i className="fas fa-plus me-2"></i>
                Tambah Kategori
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-tags fa-2x text-primary mb-2"></i>
                  <h3 className="h4 fw-bold mb-1">{categories.length}</h3>
                  <small className="text-muted">Total Kategori</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                  <h3 className="h4 fw-bold mb-1">
                    {categories.filter((cat) => cat.isActive).length}
                  </h3>
                  <small className="text-muted">Kategori Aktif</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-book fa-2x text-info mb-2"></i>
                  <h3 className="h4 fw-bold mb-1">
                    {categories.reduce((sum, cat) => sum + cat.courseCount, 0)}
                  </h3>
                  <small className="text-muted">Total Kursus</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-pause-circle fa-2x text-warning mb-2"></i>
                  <h3 className="h4 fw-bold mb-1">
                    {categories.filter((cat) => !cat.isActive).length}
                  </h3>
                  <small className="text-muted">Kategori Nonaktif</small>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Table */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Nama Kategori</th>
                      <th>Deskripsi</th>
                      <th className="text-center">Jumlah Kursus</th>
                      <th className="text-center">Status</th>
                      <th>Tanggal Dibuat</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td>
                          <div className="fw-bold">{category.name}</div>
                        </td>
                        <td>
                          <small className="text-muted">
                            {category.description}
                          </small>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-secondary">
                            {category.courseCount}
                          </span>
                        </td>
                        <td className="text-center">
                          {category.isActive ? (
                            <span className="badge bg-success">Aktif</span>
                          ) : (
                            <span className="badge bg-secondary">Nonaktif</span>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(category.createdAt).toLocaleDateString(
                              "id-ID",
                            )}
                          </small>
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              onClick={() => handleEdit(category)}
                              className="btn btn-outline-primary"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => toggleStatus(category.id)}
                              className={`btn btn-outline-${
                                category.isActive ? "warning" : "success"
                              }`}
                              title={
                                category.isActive ? "Nonaktifkan" : "Aktifkan"
                              }
                            >
                              <i
                                className={`fas fa-${
                                  category.isActive ? "pause" : "play"
                                }`}
                              ></i>
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="btn btn-outline-danger"
                              title="Hapus"
                              disabled={category.courseCount > 0}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {categories.length === 0 && (
                <div className="text-center py-4">
                  <i className="fas fa-tags fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Belum ada kategori</h5>
                  <p className="text-muted">
                    Mulai dengan menambahkan kategori pertama Anda
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={resetForm}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">
                      Nama Kategori <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="categoryName"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Masukkan nama kategori"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="categoryDescription" className="form-label">
                      Deskripsi
                    </label>
                    <textarea
                      id="categoryDescription"
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Deskripsi kategori (opsional)"
                    />
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="categoryActive"
                      className="form-check-input"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                    />
                    <label
                      htmlFor="categoryActive"
                      className="form-check-label"
                    >
                      Kategori aktif
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-edu-primary">
                    {editingCategory ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

  
    </div>
  );
};

export default CategoryManagement;
