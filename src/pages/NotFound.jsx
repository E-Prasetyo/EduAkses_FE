import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-exo font-bold text-edu-primary mb-4">
          404
        </h1>
        <h2 className="text-2xl font-exo font-semibold text-black mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-lg font-jost text-edu-dark-gray mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <a
          href="/"
          className="inline-flex h-12 px-6 justify-center items-center gap-2.5 rounded-3xl bg-edu-primary text-white font-jost text-lg font-medium leading-relaxed capitalize hover:bg-opacity-90 transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
};

export default NotFound;
