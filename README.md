# EduAkses - Platform Pembelajaran Online

Platform pembelajaran online yang mendukung pengajar, siswa, dan admin untuk mengelola kursus secara efektif.

## Fitur Utama

### 🎓 Pengajar (Teacher)
- **Dashboard Pengajar**: Kelola kursus, pantau progress siswa, dan lihat statistik
- **Buat Kursus**: Buat kursus dengan modul, pelajaran, dan quiz
- **Edit Kursus**: Edit kursus yang sudah dibuat
- **Upload Video**: Upload video YouTube untuk pelajaran
- **Sistem Notifikasi**: Terima notifikasi tentang status kursus

### 👨‍🎓 Siswa (Student)
- **Dashboard Siswa**: Lihat kursus yang diikuti dan progress belajar
- **Enroll Kursus**: Daftar ke kursus yang tersedia
- **Belajar Online**: Akses materi pelajaran dan video
- **Quiz**: Ikuti quiz untuk menguji pemahaman
- **Progress Tracking**: Pantau progress belajar

### 👨‍💼 Admin
- **Dashboard Admin**: Kelola semua pengajar, siswa, dan kursus
- **Review Kursus**: Setujui atau tolak kursus yang diajukan
- **Kelola Pengajar**: Setujui atau tolak pendaftaran pengajar
- **Hapus Pengajar**: Hapus pengajar beserta semua kursus dan data terkait
- **Analytics**: Lihat statistik platform

## Sistem Pendaftaran Pengajar

### Cara Pendaftaran
1. **Daftar sebagai Pengajar** di halaman register
2. **Pilih role "Teacher"** saat pendaftaran
3. **Tunggu persetujuan admin** (status: pending)
4. **Setelah disetujui** (status: active), bisa membuat kursus

### ID Pengajar
- Setiap pengajar mendapat ID unik: `teacher{timestamp}`
- Contoh: `teacher1703123456789`
- ID ini digunakan untuk mengidentifikasi course milik pengajar

### Filter Course di Dashboard
- Course ditampilkan berdasarkan `teacherId === user.id`
- Atau berdasarkan `instructor === user.name`
- Admin bisa melihat semua course yang sudah dipublish

## Cara Menggunakan

### Login Default
```
Admin:
- Email: admin@eduakses.com
- Password: admin123

Teacher:
- Email: ahmad@eduakses.com  
- Password: ahmad123

Student:
- Email: budi@eduakses.com
- Password: budi123
```

### Membuat Kursus
1. Login sebagai pengajar
2. Klik "Buat Kursus Baru"
3. Isi informasi dasar kursus
4. Tambahkan modul dan pelajaran
5. Upload video YouTube atau tambahkan konten teks
6. Submit untuk review admin

### Menjalankan Aplikasi
```bash
npm install
npm run dev
```

## Teknologi
- React 18
- React Router
- Bootstrap 5
- TinyMCE Editor
- LocalStorage untuk data persistence

## Struktur Data

### Course Structure
```javascript
{
  id: "unique_id",
  title: "Judul Kursus",
  description: "Deskripsi kursus",
  teacherId: "teacher_id", // ID pengajar
  instructor: "Nama Pengajar",
  status: "PENDING_REVIEW|PUBLISHED|REJECTED",
  modules: [
    {
      id: 1,
      title: "Judul Modul",
      lessons: [
        {
          id: 1,
          title: "Judul Pelajaran",
          type: "text|video",
          textContent: "Konten HTML",
          videoUrl: "YouTube Video ID",
          duration: "10:30"
        }
      ]
    }
  ]
}
```

## Perbaikan Terbaru

### ✅ Sistem Pengajar Universal
- Semua pengajar yang mendaftar bisa membuat dan mengelola kursus
- ID pengajar unik dan konsisten
- Filter course berdasarkan user yang login
- Migration script untuk memperbaiki data lama

### ✅ Video YouTube
- Support berbagai format URL YouTube
- Auto-extract video ID
- Fallback jika video tidak tersedia

### ✅ Sinkronisasi Real-time
- Dashboard teacher update otomatis saat ada perubahan
- Event listener untuk perubahan localStorage

## Troubleshooting

### Course Tidak Muncul di Dashboard Teacher
1. Pastikan login sebagai pengajar yang benar
2. Periksa console browser untuk debugging
3. Pastikan course memiliki `teacherId` yang sesuai
4. Refresh halaman atau logout/login ulang

### Video YouTube Tidak Muncul
1. Pastikan URL YouTube valid
2. Periksa console untuk error
3. Pastikan video tidak private atau di-restrict
4. Gunakan format URL: `https://www.youtube.com/watch?v=VIDEO_ID`

### Fitur Hapus Pengajar
1. **Akses**: Login sebagai admin dan buka tab "Kelola Pengajar"
2. **Konfirmasi**: Sistem akan menampilkan detail lengkap pengajar dan data yang akan dihapus
3. **Warning**: Sistem akan memberikan peringatan jika pengajar memiliki banyak kursus/siswa
4. **Data yang dihapus**: Akun pengajar, semua kursus, enrollment siswa, dan progress belajar
5. **Notifikasi**: Admin akan menerima notifikasi tentang penghapusan yang dilakukan

### Fitur Kelola Status Pengajar
1. **Akses**: Login sebagai admin dan buka tab "Kelola Pengajar"
2. **Aktifkan**: Klik tombol hijau (✓) untuk mengaktifkan pengajar yang pending
3. **Nonaktifkan**: Klik tombol kuning (🚫) untuk menonaktifkan pengajar yang aktif
4. **Efek Status**: 
   - **Aktif**: Pengajar bisa membuat dan mengelola kursus
   - **Pending**: Pengajar tidak bisa membuat kursus
5. **Notifikasi**: Pengajar akan menerima notifikasi tentang perubahan status

### Fitur Kelola Pelajar
1. **Akses**: Login sebagai admin dan buka tab "Kelola Pelajar"
2. **Lihat Data**: Tabel menampilkan semua pelajar dengan informasi lengkap
3. **Statistik**: 
   - Total pelajar terdaftar
   - Total enrollment kursus
   - Total progress belajar
4. **Hapus Pelajar**: Klik tombol merah (🗑️) untuk menghapus pelajar
5. **Data yang dihapus**: Akun pelajar, semua enrollment, dan progress belajar
6. **Konfirmasi**: Sistem akan menampilkan detail lengkap sebelum penghapusan

## Kontribusi
Silakan buat issue atau pull request untuk perbaikan dan fitur baru.
