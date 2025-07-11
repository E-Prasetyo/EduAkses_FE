import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Ahmad Fulan",
    email: "ahmad.fulan@email.com",
    bio: "Seorang pengajar berpengalaman di bidang teknologi informasi dengan passion untuk berbagi ilmu dan membantu siswa mencapai potensi terbaik mereka.",
    role: "Pengajar",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    joinDate: "Januari 2024",
    coursesCreated: 5,
    studentsCount: 1250,
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    // Here you would make API call to update profile
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In real app, upload to cloud storage and get URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData({
          ...editData,
          avatar: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage/sessionStorage
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");

    // Show confirmation
    alert("Anda telah berhasil logout");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column min-h-screen bg-white">
      <Header />

      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Profile Header */}
          <div className="bg-dark text-white rounded-2xl p-4 p-md-5 mb-4">
            <div className="row align-items-center">
              <div className="col-auto">
                <div className="position-relative">
                  <img
                    src={isEditing ? editData.avatar : profileData.avatar}
                    alt="Profile"
                    className="rounded-circle border border-white border-4"
                    width="96"
                    height="96"
                    style={{ objectFit: "cover" }}
                  />
                  {isEditing && (
                    <label className="position-absolute bottom-0 end-0 btn btn-edu-primary btn-sm rounded-circle p-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="white"
                      >
                        <path d="M8 0L6.545 1.455L12.09 7H0v2h12.09L6.545 14.545L8 16l8-8L8 0z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="d-none"
                      />
                    </label>
                  )}
                </div>
              </div>
              <div className="col">
                <h1 className="h2 font-exo fw-bold mb-2">{profileData.name}</h1>
                <p className="text-light h5 mb-2">{profileData.role}</p>
                <p className="text-secondary mb-0">
                  Bergabung {profileData.joinDate}
                </p>
              </div>
              <div className="col-auto">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-edu-primary font-jost fw-medium"
                >
                  {isEditing ? "Batal" : "Edit Profil"}
                </button>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Main Profile Form */}
            <div className="col-lg-8">
              <div className="card border-edu-light-grey">
                <div className="card-body p-4">
                  <h2 className="h4 font-exo fw-semibold mb-4">
                    Informasi Profil
                  </h2>

                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">
                        Nama Lengkap
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleInputChange}
                          className="form-control h-12"
                        />
                      ) : (
                        <p className="text-dark py-2 mb-0">
                          {profileData.name}
                        </p>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleInputChange}
                          className="form-control h-12"
                        />
                      ) : (
                        <p className="text-dark py-2 mb-0">
                          {profileData.email}
                        </p>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={editData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="form-control"
                          placeholder="Ceritakan tentang diri Anda..."
                        />
                      ) : (
                        <p className="text-dark py-2 mb-0 lh-base">
                          {profileData.bio}
                        </p>
                      )}
                    </div>

                    {isEditing && (
                      <div className="col-12 pt-3">
                        <div className="d-flex gap-3">
                          <button
                            onClick={handleSave}
                            className="btn btn-edu-primary font-jost fw-medium"
                          >
                            Simpan Perubahan
                          </button>
                          <button
                            onClick={handleCancel}
                            className="btn btn-secondary font-jost fw-medium"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="col-lg-4">
              <div className="row g-4">
                {/* Statistics */}
                {/* <div className="col-12">
                  <div className="card bg-edu-white-grey border-0">
                    <div className="card-body p-4">
                      <h3 className="h5 font-exo fw-semibold mb-4">
                        Statistik
                      </h3>
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-edu-dark-gray font-jost">
                            Kursus Dibuat
                          </span>
                          <span className="fw-semibold">
                            {profileData.coursesCreated}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-edu-dark-gray font-jost">
                            Total Siswa
                          </span>
                          <span className="fw-semibold">
                            {profileData.studentsCount}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-edu-dark-gray font-jost">
                            Rating
                          </span>
                          <div className="d-flex align-items-center gap-1">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="#FFD700"
                            >
                              <path d="M8 1L10.09 5.26L15 6L11.5 9.74L12.18 15L8 12.77L3.82 15L4.5 9.74L1 6L5.91 5.26L8 1Z" />
                            </svg>
                            <span className="fw-semibold">4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Quick Actions */}
                {/* <div className="col-12">
                  <div className="card bg-edu-white-grey border-0">
                    <div className="card-body p-4">
                      <h3 className="h5 font-exo fw-semibold mb-4">
                        Aksi Cepat
                      </h3>
                      <div className="d-flex flex-column gap-2">
                        <button className="btn btn-light text-start p-3 border-0 rounded font-jost">
                          📚 Kelola Kursus
                        </button>
                        <button className="btn btn-light text-start p-3 border-0 rounded font-jost">
                          ➕ Buat Kursus Baru
                        </button>
                        <button className="btn btn-light text-start p-3 border-0 rounded font-jost">
                          📊 Lihat Statistik
                        </button>
                        <button className="btn btn-light text-start p-3 border-0 rounded font-jost">
                          ⚙️ Pengaturan Akun
                        </button>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Account Security */}
                <div className="col-12">
                  <div className="card bg-edu-white-grey border-0">
                    <div className="card-body p-4">
                      <h3 className="h5 font-exo fw-semibold mb-4">Keamanan</h3>
                      <div className="d-flex flex-column gap-2">
                        <button className="btn btn-light text-start p-3 border-0 rounded font-jost">
                          🔐 Ubah Password
                        </button>
                        <button className="btn btn-light text-start p-3 border-0 rounded font-jost">
                          📱 Autentikasi 2 Faktor
                        </button>
                        <button className="btn btn-light text-start p-3 border-0 rounded font-jost">
                          🔒 Log Aktivitas
                        </button>
                        <button
                          onClick={handleLogout}
                          className="btn btn-outline-danger text-start p-3 border-2 rounded font-jost"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
