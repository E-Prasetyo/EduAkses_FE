import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";

const Learning = () => {
  const { id } = useParams();
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  // Mock course data
  const course = {
    id: id,
    title: "Dasar-Dasar Komputer dan Internet",
    modules: [
      {
        id: 1,
        title: "Pengenalan Komputer",
        lessons: [
          {
            id: 1,
            title: "Apa itu Komputer?",
            type: "video",
            content: "dQw4w9WgXcQ", // YouTube video ID
            duration: "15 menit",
            description: "Pengenalan dasar tentang komputer dan sejarahnya",
          },
          {
            id: 2,
            title: "Komponen Komputer",
            type: "text",
            content: `
              <h2>Komponen Utama Komputer</h2>
              <p>Komputer terdiri dari beberapa komponen utama yang bekerja sama untuk menjalankan berbagai tugas. Berikut adalah komponen-komponen tersebut:</p>
              
              <h3>1. Central Processing Unit (CPU)</h3>
              <p>CPU adalah "otak" dari komputer yang bertanggung jawab untuk memproses semua instruksi dan perhitungan. CPU terdiri dari:</p>
              <ul>
                <li>Control Unit (CU) - mengatur operasi komputer</li>
                <li>Arithmetic Logic Unit (ALU) - melakukan operasi matematika dan logika</li>
                <li>Register - penyimpanan sementara berkecepatan tinggi</li>
              </ul>

              <h3>2. Memory (Memori)</h3>
              <p>Memori digunakan untuk menyimpan data dan program yang sedang berjalan:</p>
              <ul>
                <li>RAM (Random Access Memory) - memori sementara yang cepat</li>
                <li>ROM (Read Only Memory) - memori permanen untuk sistem dasar</li>
              </ul>

              <h3>3. Storage (Penyimpanan)</h3>
              <p>Perangkat penyimpanan untuk data jangka panjang:</p>
              <ul>
                <li>Hard Disk Drive (HDD)</li>
                <li>Solid State Drive (SSD)</li>
                <li>Optical Drive (CD/DVD/Blu-ray)</li>
              </ul>

              <h3>4. Input/Output Devices</h3>
              <p>Perangkat untuk berinteraksi dengan komputer:</p>
              <ul>
                <li>Input: Keyboard, Mouse, Microphone, Scanner</li>
                <li>Output: Monitor, Printer, Speaker</li>
              </ul>
            `,
            duration: "20 menit",
            description: "Mempelajari komponen-komponen utama dalam komputer",
          },
          {
            id: 3,
            title: "Cara Kerja Komputer",
            type: "video",
            content: "dQw4w9WgXcQ",
            duration: "12 menit",
            description: "Memahami bagaimana komputer memproses informasi",
          },
        ],
      },
      {
        id: 2,
        title: "Sistem Operasi",
        lessons: [
          {
            id: 4,
            title: "Pengenalan Sistem Operasi",
            type: "text",
            content: `
              <h2>Apa itu Sistem Operasi?</h2>
              <p>Sistem operasi adalah perangkat lunak sistem yang mengelola sumber daya komputer dan menyediakan layanan umum untuk program komputer lainnya.</p>
              
              <h3>Fungsi Utama Sistem Operasi:</h3>
              <ul>
                <li>Manajemen proses dan memori</li>
                <li>Manajemen file dan direktori</li>
                <li>Antarmuka pengguna</li>
                <li>Keamanan sistem</li>
                <li>Manajemen perangkat keras</li>
              </ul>

              <h3>Jenis-jenis Sistem Operasi:</h3>
              <ul>
                <li><strong>Windows</strong> - Sistem operasi populer untuk PC</li>
                <li><strong>macOS</strong> - Sistem operasi eksklusif untuk komputer Apple</li>
                <li><strong>Linux</strong> - Sistem operasi open source</li>
                <li><strong>Android</strong> - Sistem operasi untuk perangkat mobile</li>
                <li><strong>iOS</strong> - Sistem operasi untuk iPhone dan iPad</li>
              </ul>
            `,
            duration: "18 menit",
            description: "Memahami peran dan fungsi sistem operasi",
          },
          {
            id: 5,
            title: "Interface Pengguna",
            type: "video",
            content: "dQw4w9WgXcQ",
            duration: "25 menit",
            description: "Mempelajari berbagai jenis antarmuka pengguna",
          },
        ],
      },
    ],
  };

  const currentModuleData = course.modules[currentModule];
  const currentLessonData = currentModuleData.lessons[currentLesson];

  const markAsComplete = () => {
    const lessonKey = `${currentModule}-${currentLesson}`;
    setCompletedLessons((prev) => new Set([...prev, lessonKey]));
  };

  const isLessonCompleted = (moduleIndex, lessonIndex) => {
    return completedLessons.has(`${moduleIndex}-${lessonIndex}`);
  };

  const navigateToLesson = (moduleIndex, lessonIndex) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
  };

  const nextLesson = () => {
    if (currentLesson < currentModuleData.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setCurrentLesson(0);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    } else if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
      setCurrentLesson(course.modules[currentModule - 1].lessons.length - 1);
    }
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar - Course Navigation */}
        <div className="w-80 bg-edu-white-grey border-r border-edu-light-grey h-[calc(100vh-72px)] overflow-y-auto">
          <div className="p-6">
            <Link
              to={`/kursus/${id}`}
              className="flex items-center gap-2 text-edu-primary hover:text-edu-primary/80 transition-colors mb-4"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  d="M8 0L6.545 1.455L12.09 7H0v2h12.09L6.545 14.545L8 16l8-8L8 0z"
                  transform="rotate(180 8 8)"
                />
              </svg>
              <span className="font-jost">Kembali ke Detail Kursus</span>
            </Link>

            <h2 className="font-exo font-semibold text-lg mb-4">
              {course.title}
            </h2>

            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div
                  key={module.id}
                  className="border border-edu-light-grey rounded-lg bg-white"
                >
                  <div className="p-4">
                    <h3 className="font-exo font-semibold mb-2">
                      {module.title}
                    </h3>
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lesson.id}
                          onClick={() =>
                            navigateToLesson(moduleIndex, lessonIndex)
                          }
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            currentModule === moduleIndex &&
                            currentLesson === lessonIndex
                              ? "bg-edu-primary text-white"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                                isLessonCompleted(moduleIndex, lessonIndex)
                                  ? "bg-edu-green text-white"
                                  : currentModule === moduleIndex &&
                                      currentLesson === lessonIndex
                                    ? "bg-white text-edu-primary"
                                    : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {isLessonCompleted(moduleIndex, lessonIndex)
                                ? "✓"
                                : lessonIndex + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {lesson.title}
                              </div>
                              <div
                                className={`text-xs ${
                                  currentModule === moduleIndex &&
                                  currentLesson === lessonIndex
                                    ? "text-white/80"
                                    : "text-gray-500"
                                }`}
                              >
                                {lesson.type === "video" ? "📺" : "📖"}{" "}
                                {lesson.duration}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content Header */}
          <div className="bg-white border-b border-edu-light-grey p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-exo font-semibold text-2xl mb-2">
                  {currentLessonData.title}
                </h1>
                <p className="text-edu-dark-gray font-jost">
                  {currentLessonData.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={prevLesson}
                  disabled={currentModule === 0 && currentLesson === 0}
                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Sebelumnya
                </button>
                <button
                  onClick={nextLesson}
                  disabled={
                    currentModule === course.modules.length - 1 &&
                    currentLesson === currentModuleData.lessons.length - 1
                  }
                  className="px-4 py-2 bg-edu-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Selanjutnya →
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="flex-1 p-6">
            {currentLessonData.type === "video" ? (
              <div className="max-w-4xl mx-auto">
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentLessonData.content}`}
                    title={currentLessonData.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <div
                  className="prose prose-lg max-w-none font-jost"
                  dangerouslySetInnerHTML={{
                    __html: currentLessonData.content,
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="bg-white border-t border-edu-light-grey p-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={markAsComplete}
                  disabled={isLessonCompleted(currentModule, currentLesson)}
                  className={`px-6 py-2 rounded-lg font-jost font-medium transition-colors ${
                    isLessonCompleted(currentModule, currentLesson)
                      ? "bg-edu-green text-white cursor-default"
                      : "bg-edu-primary text-white hover:bg-opacity-90"
                  }`}
                >
                  {isLessonCompleted(currentModule, currentLesson)
                    ? "✓ Selesai"
                    : "Tandai Selesai"}
                </button>
                {currentModule === 0 && currentLesson === 2 && (
                  <Link
                    to={`/kursus/${id}/kuis/1`}
                    className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-jost font-medium hover:bg-yellow-600 transition-colors"
                  >
                    Kuis Modul 1
                  </Link>
                )}
              </div>
              <div className="text-sm text-edu-dark-gray">
                Pelajaran {currentLesson + 1} dari{" "}
                {currentModuleData.lessons.length} - Modul {currentModule + 1}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
