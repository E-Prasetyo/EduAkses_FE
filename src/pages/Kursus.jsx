import React, { useState, useEffect } from "react";
import { localStorageService } from "../services/localStorageService";
import { Link } from "react-router-dom";
import CourseListItem from "../components/CourseListItem";
import CourseCard from "../components/CourseCard";
import "../styles/Kursus.css";

const Kursus = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [selectedLevel, setSelectedLevel] = useState("Semua Level");
  const [sortBy, setSortBy] = useState("Terbaru");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const coursesPerPage = 9;

  // Fetch courses from localStorage
  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      try {
        // Get all courses from localStorage
        const allCourses = localStorageService.getCourses();

        // Filter only published courses
        const publishedCourses = allCourses.filter(
          (course) => course.status === "PUBLISHED"
        );

        setCourses(publishedCourses);

        // Extract unique categories from courses
        const uniqueCategories = ["Semua Kategori"];
        publishedCourses.forEach((course) => {
          if (course.category && !uniqueCategories.includes(course.category)) {
            uniqueCategories.push(course.category);
          }
        });
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Add event listener for storage changes
    window.addEventListener("storage", fetchData);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("storage", fetchData);
    };
  }, []);

  // levels is declared below

  const levels = ["Semua Level", "Pemula", "Menengah", "Lanjutan"];

  const sortOptions = [
    "Terbaru",
    "Terpopuler",
    "Rating Tertinggi",
    "Harga Terendah",
    "Durasi Terpendek",
  ];

  // Filter courses based on search and filters
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Semua Kategori" ||
        course.category === selectedCategory;
      const matchesLevel =
        selectedLevel === "Semua Level" || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Terpopuler":
          return b.students - a.students;
        case "Rating Tertinggi":
          return b.rating - a.rating;
        case "Harga Terendah":
          if (a.price === "free" && b.price !== "free") return -1;
          if (a.price !== "free" && b.price === "free") return 1;
          if (a.price === "free" && b.price === "free") return 0;
          const priceA = a.discountPrice || a.originalPrice;
          const priceB = b.discountPrice || b.originalPrice;
          return priceA - priceB;
        case "Durasi Terpendek":
          const durationA = parseInt(a.duration);
          const durationB = parseInt(b.duration);
          return durationA - durationB;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Semua Kategori");
    setSelectedLevel("Semua Level");
    setSortBy("Terbaru");
    setCurrentPage(1);
  };

  return (
    <div className="d-flex flex-column min-h-screen bg-light">
      {/* Hero Section */}
      <section className="bg-dark text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-decoration-none text-warning">
                      Beranda
                    </Link>
                  </li>
                  <li className="breadcrumb-item active text-white">Kursus</li>
                </ol>
              </nav>
              <h1 className="display-4 font-exo fw-bold mb-3">
                Eksplorasi Kursus
              </h1>
              <p className="lead font-jost mb-0">
                Temukan kursus terbaik untuk mengembangkan skill dan karir Anda.
                Lebih dari {courses.length} kursus berkualitas menanti!
              </p>
            </div>
            <div className="col-lg-4 text-center">
              <div
                className="bg-edu-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "120px", height: "120px" }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h4 className="font-exo fw-semibold text-warning">
                {courses.length}+ Kursus
              </h4>
              <p className="font-jost text-light mb-0">Tersedia untuk Anda</p>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Search and Filter Section */}
          <div className="card border-0 shadow-sm mb-5">
            <div className="card-body p-4">
              <div className="row g-3 align-items-end">
                <div className="col-lg-4">
                  <label className="form-label fw-medium">Cari Kursus</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      placeholder="Ketik kata kunci..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control h-12 pe-5"
                    />
                    <svg
                      className="position-absolute end-0 top-50 translate-middle-y me-3"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
                    </svg>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4">
                  <label className="form-label fw-medium">Kategori</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-select h-12">
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-2 col-md-4">
                  <label className="form-label fw-medium">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="form-select h-12">
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-2 col-md-4">
                  <label className="form-label fw-medium">Urutkan</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-select h-12">
                    {sortOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-2">
                  <button
                    onClick={clearFilters}
                    className="btn btn-outline-secondary w-100 h-12">
                    Reset Filter
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h5 font-exo fw-semibold mb-1">
                {filteredCourses.length} Kursus Ditemukan
              </h2>
              <p className="text-muted font-jost mb-0">
                {searchTerm && `Hasil pencarian untuk "${searchTerm}"`}
                {selectedCategory !== "Semua Kategori" &&
                  ` dalam kategori ${selectedCategory}`}
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Tampilan:</span>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === "grid" ? "btn-edu-primary" : "btn-outline-secondary"}`}
                  onClick={() => setViewMode("grid")}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M4 11h5V5H4v6zM4 18h5v-6H4v6zM10 18h5v-6h-5v6zM15 5v6h5V5h-5z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === "list" ? "btn-edu-primary" : "btn-outline-secondary"}`}
                  onClick={() => setViewMode("list")}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Course List/Grid */}
          {currentCourses.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="row g-4 mb-5">
                  {currentCourses.map((course) => (
                    <div key={course.id} className="col-lg-4 col-md-6 mb-4">
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row g-4 mb-5">
                  {currentCourses.map((course) => (
                    <div key={course.id} className="col-12 mb-4">
                      <CourseListItem course={course} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Course pagination">
                  <ul className="pagination justify-content-center">
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <li
                          key={pageNumber}
                          className={`page-item ${currentPage === pageNumber ? "active" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pageNumber)}>
                            {pageNumber}
                          </button>
                        </li>
                      );
                    })}

                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <div className="mb-4">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-muted">
                  <path
                    d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h4 className="font-exo fw-semibold text-muted mb-3">
                Tidak ada kursus yang ditemukan
              </h4>
              <p className="text-muted font-jost mb-4">
                Coba ubah kata kunci pencarian atau filter yang Anda gunakan
              </p>
              <button onClick={clearFilters} className="btn btn-edu-primary">
                Reset Semua Filter
              </button>
            </div>
          )}

          {/* Call to Action */}
          <div className="card bg-edu-primary text-white border-0 mt-5">
            <div className="card-body p-5 text-center">
              <h3 className="font-exo fw-bold mb-3">
                Tidak menemukan kursus yang tepat?
              </h3>
              <p className="font-jost mb-4">
                Hubungi kami atau berikan saran kursus yang ingin Anda pelajari.
                Tim kami akan mempertimbangkan untuk membuat kursus sesuai
                kebutuhan Anda.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link
                  to="/contact"
                  className="btn btn-light font-jost fw-medium">
                  Hubungi Kami
                </Link>
                <Link
                  to="/suggest-course"
                  className="btn btn-outline-light font-jost fw-medium">
                  Saran Kursus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Kursus;
