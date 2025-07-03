import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CourseCard from "../components/CourseCard";
import StatsCounter from "../components/StatsCounter";

const Index = () => {
  const featuredCourses = [
    {
      id: 1,
      title: "Pengantar JavaScript untuk Pemula",
      description:
        "Belajar dasar-dasar JavaScript dari nol hingga bisa membuat aplikasi web sederhana.",
      image:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop",
      instructor: "Ahmad Fulan",
      rating: 4.8,
      students: 1250,
      duration: "8 Jam",
      level: "Pemula",
      price: "free",
      category: "Teknologi",
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      description:
        "Memahami prinsip-prinsip desain UI/UX dan cara membuat wireframe yang efektif.",
      image:
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=300&h=200&fit=crop",
      instructor: "Siti Nurhaliza",
      rating: 4.9,
      students: 890,
      duration: "12 Jam",
      level: "Menengah",
      price: "paid",
      originalPrice: 299000,
      discountPrice: 199000,
      category: "Seni & Desain",
    },
    {
      id: 3,
      title: "Digital Marketing Strategy",
      description:
        "Strategi pemasaran digital yang efektif untuk meningkatkan brand awareness dan penjualan.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
      instructor: "Budi Santoso",
      rating: 4.7,
      students: 2100,
      duration: "6 Jam",
      level: "Pemula",
      price: "paid",
      originalPrice: 399000,
      discountPrice: 249000,
      category: "Bisnis",
    },
    {
      id: 4,
      title: "Python untuk Data Science",
      description:
        "Belajar Python untuk analisis data dan machine learning dengan library populer.",
      image:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=300&h=200&fit=crop",
      instructor: "Dr. Maya Sari",
      rating: 4.9,
      students: 1567,
      duration: "15 Jam",
      level: "Lanjutan",
      price: "paid",
      originalPrice: 599000,
      discountPrice: 399000,
      category: "Teknologi",
    },
    {
      id: 5,
      title: "Copywriting untuk Konversi",
      description:
        "Teknik menulis copy yang persuasif untuk meningkatkan tingkat konversi.",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop",
      instructor: "Rina Pratiwi",
      rating: 4.6,
      students: 743,
      duration: "4 Jam",
      level: "Menengah",
      price: "paid",
      originalPrice: 199000,
      discountPrice: 149000,
      category: "Literasi & Kewirausahaan",
    },
    {
      id: 6,
      title: "Fotografi untuk Pemula",
      description:
        "Dasar-dasar fotografi mulai dari komposisi hingga teknik editing sederhana.",
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop",
      instructor: "Joko Anwar",
      rating: 4.5,
      students: 967,
      duration: "7 Jam",
      level: "Pemula",
      price: "free",
      category: "Seni & Desain",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Putri",
      role: "UI/UX Designer",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
      content:
        "EduAkses membantu saya mengembangkan skill design dengan sangat baik. Materinya lengkap dan mudah dipahami.",
      rating: 5,
    },
    {
      id: 2,
      name: "Rudi Hartono",
      role: "Web Developer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      content:
        "Kursus JavaScript di EduAkses sangat membantu karir saya sebagai developer. Sekarang saya sudah bekerja di tech company!",
      rating: 5,
    },
    {
      id: 3,
      name: "Lisa Amanda",
      role: "Digital Marketer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      content:
        "Platform yang sangat user-friendly dengan konten berkualitas tinggi. Recommended untuk yang ingin upgrade skill!",
      rating: 5,
    },
  ];

  return (
    <div className="d-flex flex-column min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="hero-gradient text-white py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="fade-in-up">
                <h1 className="display-4 font-exo fw-bold mb-4">
                  Belajar Tanpa Batas,
                  <br />
                  <span className="text-warning">Raih Masa Depan</span>
                </h1>
                <p className="lead font-jost mb-4">
                  Bergabunglah dengan ribuan pelajar dan raih skill baru yang
                  akan mengubah karir Anda. Akses kursus berkualitas tinggi dari
                  expert terbaik di Indonesia.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3">
                  <Link
                    to="/kursus"
                    className="btn btn-light btn-lg font-jost fw-medium px-4"
                  >
                    Mulai Belajar Gratis
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-outline-light btn-lg font-jost fw-medium px-4"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="Learning illustration"
                  className="img-fluid rounded-3xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-edu-white-grey">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-lg-3 col-md-6">
              <StatsCounter
                number={25000}
                suffix="+"
                label="Siswa Aktif"
                duration={2000}
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <StatsCounter
                number={899}
                suffix=""
                label="Kursus Tersedia"
                duration={2000}
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <StatsCounter
                number={150}
                suffix="+"
                label="Expert Pengajar"
                duration={2000}
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <StatsCounter
                number={98}
                suffix="%"
                label="Tingkat Kepuasan"
                duration={2000}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 font-exo fw-bold mb-3">Kursus Populer</h2>
            <p className="lead text-muted font-jost">
              Pilihan terbaik dari ribuan kursus yang tersedia
            </p>
          </div>

          <div className="row g-4">
            {featuredCourses.map((course) => (
              <div key={course.id} className="col-lg-4 col-md-6">
                <CourseCard course={course} />
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link
              to="/kursus"
              className="btn btn-edu-primary btn-lg font-jost fw-medium px-5"
            >
              Lihat Semua Kursus
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-edu-white-grey">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 font-exo fw-bold mb-3">
              Mengapa Memilih EduAkses?
            </h2>
            <p className="lead text-muted font-jost">
              Platform pembelajaran terdepan dengan berbagai keunggulan
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="text-center p-4">
                <div
                  className="bg-edu-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h4 className="font-exo fw-semibold mb-3">Kualitas Terjamin</h4>
                <p className="text-muted font-jost">
                  Semua kursus dibuat oleh expert berpengalaman dan telah
                  terbukti berkualitas tinggi.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="text-center p-4">
                <div
                  className="bg-edu-green rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h4 className="font-exo fw-semibold mb-3">Akses Selamanya</h4>
                <p className="text-muted font-jost">
                  Beli sekali, akses selamanya. Belajar dengan ritmu Anda
                  sendiri tanpa batasan waktu.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="text-center p-4">
                <div
                  className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                  </svg>
                </div>
                <h4 className="font-exo fw-semibold mb-3">Sertifikat Resmi</h4>
                <p className="text-muted font-jost">
                  Dapatkan sertifikat penyelesaian yang diakui industri untuk
                  boost karir Anda.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="text-center p-4">
                <div
                  className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 19l-3.5-2.5L12 14l3.5 2.5L12 19z" />
                  </svg>
                </div>
                <h4 className="font-exo fw-semibold mb-3">Komunitas Aktif</h4>
                <p className="text-muted font-jost">
                  Bergabung dengan komunitas pelajar dan berbagi pengalaman
                  dengan sesama.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="text-center p-4">
                <div
                  className="bg-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h4 className="font-exo fw-semibold mb-3">Mobile Friendly</h4>
                <p className="text-muted font-jost">
                  Belajar dimana saja, kapan saja dengan aplikasi mobile yang
                  responsive.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="text-center p-4">
                <div
                  className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
                  </svg>
                </div>
                <h4 className="font-exo fw-semibold mb-3">Harga Terjangkau</h4>
                <p className="text-muted font-jost">
                  Kursus berkualitas dengan harga yang ramah di kantong. Banyak
                  kursus gratis tersedia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 font-exo fw-bold mb-3">
              Kata Mereka Tentang Kami
            </h2>
            <p className="lead text-muted font-jost">
              Ribuan pelajar telah merasakan manfaatnya
            </p>
          </div>

          <div className="row g-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm card-hover">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="rounded-circle me-3"
                        width="60"
                        height="60"
                      />
                      <div>
                        <h5 className="card-title font-exo fw-semibold mb-1">
                          {testimonial.name}
                        </h5>
                        <p className="text-muted small mb-0 font-jost">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="#FFD700"
                          className="me-1"
                        >
                          <path d="M8 1L10.09 5.26L15 6L11.5 9.74L12.18 15L8 12.77L3.82 15L4.5 9.74L1 6L5.91 5.26L8 1Z" />
                        </svg>
                      ))}
                    </div>
                    <p className="card-text font-jost text-muted">
                      "{testimonial.content}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Teachers */}
      <section className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="display-6 font-exo fw-bold mb-3">
                Jadilah Pengajar di EduAkses
              </h2>
              <p className="lead font-jost mb-4 mb-lg-0">
                Bagikan ilmu Anda kepada ribuan siswa dan dapatkan penghasilan
                tambahan. Bergabunglah dengan komunitas pengajar terbaik di
                Indonesia.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link
                to="/register"
                className="btn btn-edu-primary btn-lg font-jost fw-medium px-5"
              >
                Mulai Mengajar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
