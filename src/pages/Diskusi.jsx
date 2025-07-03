import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Diskusi = () => {
  return (
    <div className="flex flex-col items-end bg-white min-h-screen">
      <Header />

      <main className="flex pb-24 pt-12 flex-col items-center gap-12 w-full">
        <div className="w-full max-w-[1290px] px-4">
          <div className="text-center mb-12">
            <h1 className="text-black font-exo text-4xl lg:text-5xl font-semibold leading-tight capitalize mb-4">
              Forum Diskusi
            </h1>
            <p className="text-edu-dark-gray font-jost text-lg font-normal leading-relaxed max-w-2xl mx-auto">
              Bergabunglah dengan komunitas belajar kami. Bertanya, berbagi
              pengalaman, dan belajar bersama dengan sesama pelajar
            </p>
          </div>

          {/* Discussion Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Teknologi",
                description:
                  "Diskusi seputar programming, web development, dan teknologi",
                color: "bg-blue-100",
              },
              {
                title: "Pengembangan Diri",
                description: "Tips dan motivasi untuk pengembangan personal",
                color: "bg-green-100",
              },
              {
                title: "Kewirausahaan",
                description: "Berbagi pengalaman bisnis dan kewirausahaan",
                color: "bg-purple-100",
              },
              {
                title: "Karir",
                description: "Panduan karir dan pengembangan profesional",
                color: "bg-yellow-100",
              },
              {
                title: "Akademik",
                description: "Diskusi mata pelajaran dan metode belajar",
                color: "bg-pink-100",
              },
              {
                title: "Umum",
                description: "Topik umum dan diskusi bebas",
                color: "bg-gray-100",
              },
            ].map((category, index) => (
              <div
                key={index}
                className="p-6 border border-edu-light-grey rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
                      fill="#FF782D"
                    />
                  </svg>
                </div>
                <h3 className="text-black font-exo text-xl font-semibold leading-tight mb-2">
                  {category.title}
                </h3>
                <p className="text-edu-dark-gray font-jost text-base font-normal leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>

          {/* Coming Soon Content */}
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-edu-white-grey rounded-full flex items-center justify-center mx-auto mb-8">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                  fill="#FF782D"
                />
              </svg>
            </div>
            <h2 className="text-black font-exo text-3xl font-semibold leading-tight mb-4">
              Forum Diskusi Segera Hadir
            </h2>
            <p className="text-edu-dark-gray font-jost text-lg font-normal leading-relaxed mb-8 max-w-lg mx-auto">
              Kami sedang membangun platform diskusi interaktif untuk
              memfasilitasi pembelajaran kolaboratif. Nantikan fitur forum yang
              akan memungkinkan Anda berbagi dan belajar bersama!
            </p>
            <button className="flex h-12 px-6 justify-center items-center gap-2.5 rounded-3xl bg-edu-primary text-white font-jost text-lg font-medium leading-relaxed capitalize hover:bg-opacity-90 transition-colors mx-auto">
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Diskusi;
