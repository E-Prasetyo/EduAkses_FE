import React from "react";
import { Badge } from "react-bootstrap";

const SearchFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  onCreateTopic,
  getCategoryDisplay,
}) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="row g-3">
          {/* Search */}
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Cari topik, konten, atau tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-md-3">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="col-md-3">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="most_replies">Paling Banyak Balasan</option>
              <option value="most_views">Paling Banyak Dilihat</option>
              <option value="most_likes">Paling Disukai</option>
            </select>
          </div>

          {/* Add New Topic Button */}
          <div className="col-md-2">
            <button className="btn btn-danger w-100" onClick={onCreateTopic}>
              <i className="bi bi-plus-circle me-1"></i>
              Buat Topik
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCategory !== "all") && (
          <div className="mt-3 pt-3 border-top">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <small className="text-muted">Filter aktif:</small>
              {searchQuery && (
                <Badge bg="primary" className="d-flex align-items-center gap-1">
                  Pencarian: "{searchQuery}"
                  <button
                    className="btn-close btn-close-white"
                    style={{ fontSize: "0.6em" }}
                    onClick={() => setSearchQuery("")}></button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge bg="info" className="d-flex align-items-center gap-1">
                  {getCategoryDisplay(selectedCategory).name}
                  <button
                    className="btn-close btn-close-white"
                    style={{ fontSize: "0.6em" }}
                    onClick={() => setSelectedCategory("all")}></button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
