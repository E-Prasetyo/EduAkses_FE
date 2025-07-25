# EduAkses_FE

## Daftar Isi
1. Pendahuluan
2. Struktur Proyek
3. Fitur Utama
4. Instalasi & Konfigurasi
5. Alur Autentikasi & Otorisasi
6. Penjelasan Service & Integrasi Backend
7. Daftar Endpoint API (Lengkap dengan Penjelasan & Contoh)
8. Penanganan Error & Fallback
9. Troubleshooting
10. Catatan Pengembangan

---

## 1. Pendahuluan

**EduAkses_FE** adalah aplikasi frontend untuk platform pembelajaran online berbasis React. Aplikasi ini menyediakan fitur manajemen kursus, forum diskusi, kuis, serta sistem autentikasi dan otorisasi berbasis peran (admin, pengajar, pelajar). Komunikasi data dilakukan melalui REST API ke backend, dengan fallback ke localStorage jika backend tidak tersedia.

---

## 2. Struktur Proyek

```
├── public/
│   └── tinymce/         # Editor teks
├── scripts/             # Script utilitas
├── src/
│   ├── assets/          # Gambar, ikon, dsb
│   ├── components/      # Komponen UI
│   ├── contexts/        # React Context
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilitas JS
│   ├── pages/           # Halaman utama
│   ├── services/        # Integrasi API & localStorage
│   └── styles/          # CSS
├── .env                 # Variabel lingkungan
├── vite.config.js       # Konfigurasi Vite
├── package.json         # Dependensi & script
```

---

## 3. Fitur Utama

- **Manajemen Pengguna:** Login, register, profil, peran (admin, pengajar, pelajar)
- **Manajemen Kursus:** CRUD kursus, pendaftaran, pelacakan kemajuan
- **Forum Diskusi:** Topik, balasan, like, pencarian, trending
- **Kuis & Penilaian:** Pembuatan, pengambilan, penilaian otomatis
---

## 4. Instalasi & Konfigurasi

### a. Instalasi
```bash
npm install
```

### b. Menjalankan Aplikasi
```bash
npm run dev
```
Akses di: [http://localhost:5173](http://localhost:5173)

### c. Variabel Lingkungan (`.env`)
```
VITE_API_URL=http://localhost:5173/api
VITE_TINYMCE_API_KEY=... (dapatkan dari tinymce.com)
```

### d. Proxy Backend (di `vite.config.js`)
```js
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

---

## 5. Alur Autentikasi & Otorisasi

- **Login:** User mengisi form login, request dikirim ke `/auth/login`, jika sukses token JWT disimpan di localStorage/sessionStorage.
- **Register:** User mengisi form register, request ke `/auth/register`, data user dan token diterima.
- **Token:** Setiap request ke endpoint API yang butuh otorisasi akan otomatis menyisipkan token di header `Authorization`.
- **Logout:** Menghapus token dari storage dan redirect ke login.
- **Fallback:** Jika backend tidak tersedia, login/register tetap bisa dilakukan secara lokal (mode offline/development).

**Kredensial Default:**
- Admin:  
  - Email: `admin@eduakses.com`  
  - Password: `admin123`
- Pengajar:  
  - Email: `ahmad@eduakses.com`  
  - Password: `ahmad123`

---

## 6. Penjelasan Service & Integrasi Backend

### a. **Konfigurasi Axios** (`src/services/axiosConfig.js`)
- Membuat instance Axios dengan baseURL, timeout, dan headers.
- Interceptor request: Menyisipkan token ke header Authorization.
- Interceptor response: Menangani error (401, 404, 500, network) dan fallback ke localStorage.

### b. **Service API**
- **authAPI.js:** Login, register, get current user, logout, update profile.
- **userAPI.js:** CRUD user, approve/reject pengajar, get semua pelajar/pengajar.
- **api.js:** CRUD kursus, CRUD kuis pada modul kursus.
- **enrollmentAPI.js:** Enroll kursus, get/update progress, complete course.
- **forumAPI.js:** CRUD topik forum, balasan, like/unlike, kategori, pencarian, trending.
- **localStorageService.js:** Fallback data lokal jika backend tidak tersedia.

### c. **Contoh Integrasi**
```js
// Contoh: Mengambil semua kursus
dispatch(async () => {
  const data = await courseAPI.getAllCourses();
  setCourses(data);
});
```

---

## 7. Daftar Endpoint API (Lengkap dengan Penjelasan & Contoh)

### a. **Autentikasi**
| Method | Endpoint              | Deskripsi                | Contoh Payload/Response |
|--------|----------------------|--------------------------|------------------------|
| POST   | `/auth/login`        | Login user               | `{ email, password }` → `{ user, token }` |
| POST   | `/auth/register`     | Register user            | `{ name, email, password, role }` → `{ user, token }` |
| GET    | `/auth/me`           | Get current user         | (header: Bearer token) → `{ user }` |
| POST   | `/auth/logout`       | Logout user              | (header: Bearer token) → `{ success: true }` |
| PUT    | `/auth/profile`      | Update profile user      | `{ name, ... }` → `{ user }` |

### b. **Manajemen User**
| Method | Endpoint                              | Deskripsi                    | Contoh |
|--------|---------------------------------------|------------------------------|--------|
| GET    | `/users`                              | Get semua user (admin)       | `[ { user }, ... ]` |
| GET    | `/users/{userId}`                     | Get user by ID               | `{ user }` |
| PUT    | `/users/{userId}`                     | Update user (admin)          | `{ ... }` |
| DELETE | `/users/{userId}`                     | Delete user (admin)          | `{ success: true }` |
| GET    | `/users/teachers`                     | Get semua pengajar           | `[ { user }, ... ]` |
| GET    | `/users/students`                     | Get semua pelajar            | `[ { user }, ... ]` |
| PUT    | `/users/teachers/{teacherId}/approve` | Approve pengajar (admin)     | `{ success: true }` |
| PUT    | `/users/teachers/{teacherId}/reject`  | Reject pengajar (admin)      | `{ success: true }` |

### c. **Kursus & Kuis**
| Method | Endpoint                                              | Deskripsi                        | Contoh |
|--------|-------------------------------------------------------|----------------------------------|--------|
| GET    | `/courses`                                            | Get semua kursus                 | `[ { course }, ... ]` |
| GET    | `/courses/{courseId}`                                 | Get kursus by ID                 | `{ course }` |
| POST   | `/courses`                                            | Create kursus                    | `{ title, ... }` |
| PUT    | `/courses/{courseId}`                                 | Update kursus                    | `{ ... }` |
| DELETE | `/courses/{courseId}`                                 | Delete kursus                    | `{ success: true }` |
| POST   | `/courses/{courseId}/modules/{moduleId}/quizzes`      | Tambah kuis ke modul             | `{ ... }` |
| PUT    | `/courses/{courseId}/modules/{moduleId}/quizzes/{id}` | Update kuis                      | `{ ... }` |
| DELETE | `/courses/{courseId}/modules/{moduleId}/quizzes/{id}` | Delete kuis                      | `{ success: true }` |

### d. **Enrollment & Progress**
| Method | Endpoint                                         | Deskripsi                    | Contoh |
|--------|--------------------------------------------------|------------------------------|--------|
| POST   | `/enrollments/courses/{courseId}`                | Enroll ke kursus             | `{ success: true }` |
| GET    | `/enrollments`                                   | Get semua enrollment user    | `[ { enrollment }, ... ]` |
| GET    | `/enrollments/courses/{courseId}/progress`       | Get progress kursus          | `{ progress }` |
| PUT    | `/enrollments/courses/{courseId}/progress`       | Update progress kursus       | `{ progress }` |
| PUT    | `/enrollments/courses/{courseId}/complete`       | Tandai kursus selesai        | `{ success: true }` |

### e. **Forum Diskusi**
| Method | Endpoint                                 | Deskripsi                        | Contoh |
|--------|------------------------------------------|----------------------------------|--------|
| GET    | `/forum`                                | Get semua topik forum            | `[ { forum }, ... ]` |
| GET    | `/forum/{id}`                           | Get detail topik forum           | `{ forum }` |
| POST   | `/forum`                                | Buat topik forum baru            | `{ title, ... }` |
| PUT    | `/forum/{id}`                           | Update topik forum               | `{ ... }` |
| DELETE | `/forum/{id}`                           | Hapus topik forum                | `{ success: true }` |
| POST   | `/forum/{forumId}/replies`              | Tambah balasan ke topik          | `{ content }` |
| PUT    | `/forum/{forumId}/replies/{replyId}`    | Update balasan                   | `{ content }` |
| DELETE | `/forum/{forumId}/replies/{replyId}`    | Hapus balasan                    | `{ success: true }` |
| POST   | `/forum/{forumId}/like`                 | Like topik forum                 | `{ success: true }` |
| DELETE | `/forum/{forumId}/like`                 | Unlike topik forum               | `{ success: true }` |
| GET    | `/forum/categories`                     | Get kategori forum               | `[ { category }, ... ]` |
| GET    | `/forum/search`                         | Cari topik forum                 | `[ { forum }, ... ]` |
| GET    | `/forum/trending`                       | Get trending topik forum         | `[ { forum }, ... ]` |

---

## 8. Penanganan Error & Fallback

- **Error 401:** Token expired, user otomatis logout
- **Error 404/500/Network:** Aplikasi fallback ke localStorage (mode offline)
- **Semua error** dicatat di console browser
- **Fallback:** Data tetap bisa diakses/ditulis secara lokal jika backend tidak tersedia (khusus development)

---

## 9. Troubleshooting

- **Tidak bisa konek backend:**  
  - Pastikan backend berjalan di port 8000
  - Cek proxy di `vite.config.js`
- **Error 500/404:**  
  - Cek endpoint backend & log server
- **Autentikasi gagal:**  
  - Hapus token di localStorage/sessionStorage, login ulang
- **Mode Offline:**  
  - Jika backend mati, aplikasi tetap bisa login/register dan akses data dummy (localStorage)

---

## 10. Catatan Pengembangan

- **Base URL** bisa diubah sesuai environment (dev/staging/production)
- **Fallback localStorage** hanya untuk development/offline mode
- **Error Handling** sudah terpusat di masing-masing service
- **Penambahan Endpoint:**
  - Tambahkan fungsi baru di file service terkait di `src/services/`
  - Gunakan `axiosInstance` untuk request ke backend
  - Pastikan endpoint backend sudah tersedia dan sesuai

---


**Dokumentasi ini sudah mencakup seluruh fitur, struktur, serta endpoint API yang digunakan pada aplikasi EduAkses_FE. Jika ada pertanyaan atau butuh penjelasan lebih detail, silakan hubungi tim pengembang.**