import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.username) {
      newErrors.username = "Username harus diisi";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Anda harus menyetujui syarat dan ketentuan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate registration process
      console.log("Registration data:", formData);

      // Store user data (in real app, this would come from API response)
      localStorage.setItem("userToken", "dummy-token");
      localStorage.setItem(
        "userData",
        JSON.stringify({
          name: formData.username,
          email: formData.email,
          role: "student",
        }),
      );

      alert("Registrasi berhasil! Selamat datang di EduAkses.");
      navigate("/");
    }
  };

  return (
    <div className="d-flex flex-column min-h-screen bg-light">
      <Header />

      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-edu-primary">
                  Beranda
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Daftar
              </li>
            </ol>
          </nav>

          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <rect
                          width="32"
                          height="32"
                          rx="8"
                          fill="var(--edu-primary)"
                        />
                        <path
                          d="M8 12h16M8 16h16M8 20h10"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <h1 className="h3 font-exo fw-bold text-dark mb-2">
                      Daftar ke EduAkses
                    </h1>
                    <p className="text-muted font-jost">
                      Bergabunglah dengan ribuan pelajar lainnya dan mulai
                      perjalanan belajar Anda.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        className={`form-control h-12 ${errors.email ? "is-invalid" : ""}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Masukkan email Anda"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="username"
                        className="form-label fw-medium"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        className={`form-control h-12 ${errors.username ? "is-invalid" : ""}`}
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Pilih username unik"
                      />
                      {errors.username && (
                        <div className="invalid-feedback">
                          {errors.username}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="password"
                        className="form-label fw-medium"
                      >
                        Password
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control h-12 ${errors.password ? "is-invalid" : ""}`}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Buat password yang kuat"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            {showPassword ? (
                              <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.06-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z" />
                            ) : (
                              <path d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            )}
                          </svg>
                        </button>
                        {errors.password && (
                          <div className="invalid-feedback d-block">
                            {errors.password}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="confirmPassword"
                        className="form-label fw-medium"
                      >
                        Konfirmasi Password
                      </label>
                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className={`form-control h-12 ${errors.confirmPassword ? "is-invalid" : ""}`}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Ketik ulang password Anda"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            {showConfirmPassword ? (
                              <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.06-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z" />
                            ) : (
                              <path d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            )}
                          </svg>
                        </button>
                        {errors.confirmPassword && (
                          <div className="invalid-feedback d-block">
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className={`form-check-input ${errors.agreeToTerms ? "is-invalid" : ""}`}
                          id="agreeToTerms"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                        />
                        <label
                          className="form-check-label font-jost"
                          htmlFor="agreeToTerms"
                        >
                          Saya setuju dengan{" "}
                          <Link
                            to="/terms"
                            className="text-edu-primary text-decoration-none"
                          >
                            Syarat & Ketentuan
                          </Link>{" "}
                          dan{" "}
                          <Link
                            to="/privacy"
                            className="text-edu-primary text-decoration-none"
                          >
                            Kebijakan Privasi
                          </Link>
                        </label>
                        {errors.agreeToTerms && (
                          <div className="invalid-feedback d-block">
                            {errors.agreeToTerms}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-edu-primary w-100 h-12 font-jost fw-medium mb-3"
                    >
                      Daftar Sekarang
                    </button>
                  </form>

                  <hr className="my-4" />

                  <div className="text-center">
                    <p className="text-muted font-jost mb-3">
                      Sudah punya akun?{" "}
                      <Link
                        to="/login"
                        className="text-edu-primary text-decoration-none fw-medium"
                      >
                        Masuk disini
                      </Link>
                    </p>
                  </div>

                  {/* Social Login */}
                  {/* <div className="d-grid gap-2">
                    <button className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 h-12">
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="font-jost">Daftar dengan Google</span>
                    </button>
                  </div> */}
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

export default Register;
