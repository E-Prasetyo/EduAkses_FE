import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "student",
    agreement: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Format email tidak valid");
      return false;
    }
    if (!formData.name || formData.name.length < 3) {
      setError("Nama minimal 3 karakter");
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return false;
    }
    if (!formData.agreement) {
      setError("Anda harus menyetujui syarat dan ketentuan");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register(formData);
      if (formData.role === 'teacher') {
        alert('Pendaftaran berhasil! Silakan tunggu persetujuan admin untuk mengaktifkan akun Anda.');
      } else {
        alert('Pendaftaran berhasil! Silakan login untuk melanjutkan.');
      }
      navigate("/login");
    } catch (err) {
      setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <h4 className="font-exo fw-bold mb-1">Daftar Akun Baru</h4>
                <p className="text-muted mb-0">Mulai perjalanan belajar Anda</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label font-jost fw-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label font-jost fw-medium">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="role" className="form-label font-jost fw-medium">
                    Daftar Sebagai
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="student">Pelajar</option>
                    <option value="teacher">Pengajar</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label font-jost fw-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label font-jost fw-medium"
                  >
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="agreement"
                    name="agreement"
                    checked={formData.agreement}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label font-jost" htmlFor="agreement">
                    Saya menyetujui{" "}
                    <Link
                      to="/syarat-ketentuan"
                      className="text-primary text-decoration-none"
                    >
                      syarat dan ketentuan
                    </Link>{" "}
                    yang berlaku
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  {isLoading ? "Sedang mendaftar..." : "Daftar"}
                </button>

                <div className="text-center">
                  <span className="text-muted">Sudah punya akun? </span>
                  <Link to="/login" className="text-primary text-decoration-none">
                    Masuk sekarang
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
