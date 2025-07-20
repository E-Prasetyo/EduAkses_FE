import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { localStorageService } from "../services/localStorageService";
import { useAuth } from "../contexts/AuthContext";
import { stripHtml } from "../lib/utils";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingCourses, setPendingCourses] = useState([]);
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [rejectedCourses, setRejectedCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [activeTeachers, setActiveTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    pendingReviews: 0
  });
  const [notifications, setNotifications] = useState([]);

  const loadDashboardData = () => {
    // Load all data from localStorage
    const allCourses = localStorageService.getCourses() || [];
    const allUsers = localStorageService.getUsers();
    const allEnrollments = localStorageService.getEnrollments() || [];
    const allNotifications = localStorageService.getNotifications() || [];

    // Filter pending courses (menunggu review)
    const pending = allCourses.filter(course => course.status === 'PENDING_REVIEW');
    setPendingCourses(pending);

    // Filter published courses
    const published = allCourses.filter(course => course.status === 'PUBLISHED');
    setApprovedCourses(published);

    // Filter rejected courses
    const rejected = allCourses.filter(course => course.status === 'REJECTED');
    setRejectedCourses(rejected);

    // Filter teachers
    const allTeachers = allUsers.filter(user => user.role === 'teacher');
    setTeachers(allTeachers);

    // Filter categories
    const allCategories = localStorageService.getCategories();
    setCategories(allCategories);

    // Filter pending teachers
    const pendingTeachers = allUsers.filter(user => user.role === 'teacher' && user.status === 'pending');
    setPendingTeachers(pendingTeachers);

    // Filter active teachers
    const activeTeachers = allUsers.filter(user => user.role === 'teacher' && user.status === 'active');
    setActiveTeachers(activeTeachers);

    // Filter students
    const allStudents = allUsers.filter(user => user.role === 'student');
    setStudents(allStudents);

    // Calculate statistics
    const totalStudents = allUsers.filter(user => user.role === 'student').length;
    const totalRevenue = allEnrollments.reduce((sum, enrollment) => {
      const course = allCourses.find(c => c.id === enrollment.courseId);
      return sum + (course?.price || 0);
    }, 0);

    setStats({
      totalCourses: allCourses.length,
      totalStudents,
      totalRevenue,
      pendingReviews: pending.length
    });

    setNotifications(allNotifications.filter(n => n.userId === 'admin1'));
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCourseAction = (courseId, action, reason = "") => {
    const course = pendingCourses.find((c) => c.id === courseId);
    if (!course) return;

    const currentDate = new Date().toISOString();
    const updatedCourse = {
      ...course,
      status: action === "PUBLISHED" ? "PUBLISHED" : "REJECTED",
      lastUpdated: currentDate,
      ...(action === "PUBLISHED" && {
        approvedDate: currentDate.split("T")[0],
        students: course.students || 0,
        rating: course.rating || 0,
        image: course.coverImage || course.thumbnail || course.image || '',
        thumbnail: course.coverImage || course.thumbnail || '',
        overview: course.overview || course.description?.substring(0, 200) + '...' || '',
        whatYouLearn: course.whatYouLearn || []
      }),
      ...(action === "REJECTED" && {
        rejectedDate: currentDate.split("T")[0],
        reason: reason || "Tidak memenuhi standar kualitas"
      })
    };

    // Get all courses and update the specific course
    const allCourses = localStorageService.getCourses() || [];
    const updatedCourses = allCourses.map(c => 
      c.id === courseId ? updatedCourse : c
    );

    // Save updated courses to localStorage
    localStorageService.saveCourses(updatedCourses);

    // Create notification for course owner
    const notification = {
      id: Date.now(),
      userId: course.teacherId,
      courseId: course.id,
      message: action === "PUBLISHED"
        ? `Kursus "${course.title}" telah disetujui dan dipublikasikan`
        : `Kursus "${course.title}" ditolak dengan alasan: ${reason}`,
      type: action === "PUBLISHED" ? 'course_approved' : 'course_rejected',
      isRead: false,
      createdAt: currentDate
    };

    const notifications = localStorageService.getNotifications() || [];
    localStorageService.saveNotifications([...notifications, notification]);

    // Reload dashboard data
    loadDashboardData();
  };

  const handleTeacherApproval = (teacherId, isApproved) => {
    const users = localStorageService.getUsers();
    const updatedUsers = users.map(user => {
      if (user.id === teacherId) {
        return {
          ...user,
          status: isApproved ? 'active' : 'pending'
        };
      }
      return user;
    });

    // Update users in localStorage
    localStorageService.saveUsers(updatedUsers);

    // Update state
    const updatedTeacher = updatedUsers.find(user => user.id === teacherId);
    setPendingTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
    if (isApproved) {
      setActiveTeachers(prev => [...prev, updatedTeacher]);
    }

    // Create notification for teacher
    const notification = {
      id: Date.now(),
      userId: teacherId,
      message: isApproved
        ? 'Selamat! Akun pengajar Anda telah disetujui. Anda sekarang dapat membuat dan mengelola kursus.'
        : 'Maaf, akun pengajar Anda telah dinonaktifkan. Silakan hubungi admin untuk informasi lebih lanjut.',
      type: isApproved ? 'teacher_approved' : 'teacher_rejected',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    const notifications = localStorageService.getNotifications() || [];
    localStorageService.saveNotifications([...notifications, notification]);
  };

  const handleToggleTeacherStatus = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    console.log('Toggle teacher status:', { teacherId, currentStatus: teacher.status, teacherName: teacher.name });

    const newStatus = teacher.status === 'active' ? 'pending' : 'active';
    const statusText = newStatus === 'active' ? 'mengaktifkan' : 'menonaktifkan';
    
    if (window.confirm(`Apakah Anda yakin ingin ${statusText} pengajar "${teacher.name}"?`)) {
      try {
        const users = localStorageService.getUsers();
        const updatedUsers = users.map(user => {
          if (user.id === teacherId) {
            return {
              ...user,
              status: newStatus
            };
          }
          return user;
        });

        console.log('Updated users:', updatedUsers.filter(u => u.id === teacherId));

        // Update users in localStorage
        localStorageService.saveUsers(updatedUsers);

        // Update state immediately
        const updatedTeacher = updatedUsers.find(user => user.id === teacherId);
        setTeachers(prev => prev.map(t => t.id === teacherId ? updatedTeacher : t));
        
        // Update pending and active teachers lists
        if (newStatus === 'active') {
          setPendingTeachers(prev => prev.filter(t => t.id !== teacherId));
          setActiveTeachers(prev => [...prev, updatedTeacher]);
        } else {
          setActiveTeachers(prev => prev.filter(t => t.id !== teacherId));
          setPendingTeachers(prev => [...prev, updatedTeacher]);
        }

        // Create notification for teacher
        const notification = {
          id: Date.now(),
          userId: teacherId,
          message: newStatus === 'active'
            ? 'Selamat! Akun pengajar Anda telah diaktifkan kembali. Anda sekarang dapat membuat dan mengelola kursus.'
            : 'Akun pengajar Anda telah dinonaktifkan. Anda tidak dapat membuat atau mengelola kursus untuk sementara.',
          type: newStatus === 'active' ? 'teacher_activated' : 'teacher_deactivated',
          isRead: false,
          createdAt: new Date().toISOString()
        };

        const notifications = localStorageService.getNotifications() || [];
        localStorageService.saveNotifications([...notifications, notification]);
        
        console.log('Teacher status updated successfully:', { teacherId, newStatus });
        alert(`Pengajar "${teacher.name}" berhasil ${statusText === 'mengaktifkan' ? 'diaktifkan' : 'dinonaktifkan'}!`);
      } catch (error) {
        console.error('Error toggling teacher status:', error);
        alert('❌ Terjadi kesalahan saat mengubah status pengajar. Silakan coba lagi.');
      }
    }
  };

  const handleApprove = (courseId) => {
    if (window.confirm("Apakah Anda yakin ingin menyetujui kursus ini?")) {
      handleCourseAction(courseId, "PUBLISHED");
    }
  };

  const handleReject = (courseId) => {
    const reason = prompt("Masukkan alasan penolakan:");
    if (reason) {
      handleCourseAction(courseId, "REJECTED", reason);
    }
  };

  const handleEditCourse = (courseId) => {
    // Navigate to course edit page
    window.location.href = `/admin/kursus/${courseId}/edit`;
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kursus ini? Tindakan ini tidak dapat dibatalkan.")) {
      const allCourses = localStorageService.getCourses() || [];
      const updatedCourses = allCourses.filter(course => course.id !== courseId);
      localStorageService.saveCourses(updatedCourses);
      
      // Reload dashboard data
      loadDashboardData();
      
      alert("Kursus berhasil dihapus.");
    }
  };

  const handleReviewAgain = (courseId) => {
    if (window.confirm("Apakah Anda yakin ingin me-review ulang kursus ini?")) {
      const allCourses = localStorageService.getCourses() || [];
      const updatedCourses = allCourses.map(course => 
        course.id === courseId 
          ? { ...course, status: 'PENDING_REVIEW', rejectedDate: null, reason: null }
          : course
      );
      localStorageService.saveCourses(updatedCourses);
      
      // Reload dashboard data
      loadDashboardData();
      
      alert("Kursus telah dipindahkan ke pending review.");
    }
  };

  const handleDeleteTeacher = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    // Ambil statistik pengajar
    const stats = getTeacherStats(teacherId);
    const allCourses = localStorageService.getCourses() || [];
    const teacherCourses = allCourses.filter(course => course.teacherId === teacherId);
    const allEnrollments = localStorageService.getEnrollments() || [];
    const courseIdsToRemove = teacherCourses.map(course => course.id);
    const enrollmentsToRemove = allEnrollments.filter(enrollment => 
      courseIdsToRemove.includes(enrollment.courseId)
    );

    // Buat daftar kursus yang akan dihapus
    const coursesList = teacherCourses.length > 0 
      ? teacherCourses.map(course => `- ${course.title} (${course.status})`).join('\n')
      : 'Tidak ada kursus';

    // Warning khusus jika pengajar memiliki banyak konten
    let warningMessage = '';
    if (teacherCourses.length > 5) {
      warningMessage += `\n⚠️ PERINGATAN: Pengajar ini memiliki ${teacherCourses.length} kursus (jumlah besar)!\n`;
    }
    if (enrollmentsToRemove.length > 10) {
      warningMessage += `⚠️ PERINGATAN: ${enrollmentsToRemove.length} siswa akan kehilangan akses ke kursus!\n`;
    }
    if (teacher.status === 'active') {
      warningMessage += `⚠️ PERINGATAN: Pengajar ini berstatus AKTIF dan sedang mengajar!\n`;
    }

    // Konfirmasi penghapusan dengan detail lengkap
    const confirmMessage = `Apakah Anda yakin ingin menghapus pengajar "${teacher.name}"?${warningMessage}\n\n📋 Detail Pengajar:\n- Nama: ${teacher.name}\n- Email: ${teacher.email}\n- ID: ${teacher.id}\n- Status: ${teacher.status === 'active' ? 'Aktif' : 'Pending'}\n- Spesialisasi: ${teacher.specialization || 'Tidak ada'}\n\n📚 Kursus yang akan dihapus:\n${coursesList}\n\n🗑️ Yang akan dihapus:\n- 1 akun pengajar\n- ${teacherCourses.length} kursus\n- ${enrollmentsToRemove.length} enrollment siswa\n- Semua progress belajar terkait\n\n⚠️ Tindakan ini TIDAK DAPAT DIBATALKAN!`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // 1. Hapus semua kursus milik pengajar ini
        const updatedCourses = allCourses.filter(course => course.teacherId !== teacherId);
        localStorageService.saveCourses(updatedCourses);

        // 2. Hapus semua enrollment ke kursus yang dihapus
        const updatedEnrollments = allEnrollments.filter(enrollment => 
          !courseIdsToRemove.includes(enrollment.courseId)
        );
        localStorageService.saveEnrollments(updatedEnrollments);

        // 3. Hapus semua progress ke kursus yang dihapus
        const allProgress = localStorageService.getProgress() || [];
        const updatedProgress = allProgress.filter(progress => 
          !courseIdsToRemove.includes(progress.courseId)
        );
        localStorageService.saveProgress(updatedProgress);

        // 4. Hapus pengajar dari daftar users
        const allUsers = localStorageService.getUsers();
        const updatedUsers = allUsers.filter(user => user.id !== teacherId);
        localStorageService.saveUsers(updatedUsers);

        // 5. Buat notifikasi untuk admin
        const notifications = localStorageService.getNotifications() || [];
        const newNotification = {
          id: Date.now(),
          userId: 'admin1',
          message: `Pengajar "${teacher.name}" telah dihapus dari sistem. ${teacherCourses.length} kursus dan ${enrollmentsToRemove.length} enrollment terkait telah dihapus.`,
          type: 'teacher_deleted',
          isRead: false,
          createdAt: new Date().toISOString()
        };
        localStorageService.saveNotifications([...notifications, newNotification]);

        // 6. Reload dashboard data
        loadDashboardData();
        
        // 7. Tampilkan ringkasan penghapusan
        const summaryMessage = `✅ Pengajar "${teacher.name}" berhasil dihapus!\n\n📊 Ringkasan penghapusan:\n- 1 akun pengajar\n- ${teacherCourses.length} kursus\n- ${enrollmentsToRemove.length} enrollment siswa\n- Semua progress belajar terkait\n\n🗂️ Data telah dibersihkan dari sistem.`;
        alert(summaryMessage);
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('❌ Terjadi kesalahan saat menghapus pengajar. Silakan coba lagi.');
      }
    }
  };

  const getTeacherStats = (teacherId) => {
    const allCourses = localStorageService.getCourses() || [];
    const allEnrollments = localStorageService.getEnrollments() || [];
    
    const teacherCourses = allCourses.filter(course => course.teacherId === teacherId);
    const totalStudents = allEnrollments.filter(enrollment => 
      teacherCourses.some(course => course.id === enrollment.courseId)
    ).length;
    
    return {
      totalCourses: teacherCourses.length,
      totalStudents: totalStudents
    };
  };

  const handleDeleteStudent = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // Ambil statistik pelajar
    const allEnrollments = localStorageService.getEnrollments() || [];
    const allProgress = localStorageService.getProgress() || [];
    const studentEnrollments = allEnrollments.filter(enrollment => enrollment.studentId === studentId);
    const studentProgress = allProgress.filter(progress => progress.studentId === studentId);

    // Konfirmasi penghapusan dengan detail lengkap
    const confirmMessage = `Apakah Anda yakin ingin menghapus pelajar "${student.name}"?\n\n📋 Detail Pelajar:\n- Nama: ${student.name}\n- Email: ${student.email}\n- ID: ${student.id}\n- Tanggal Daftar: ${new Date(student.createdAt || Date.now()).toLocaleDateString("id-ID")}\n\n🗑️ Yang akan dihapus:\n- 1 akun pelajar\n- ${studentEnrollments.length} enrollment kursus\n- ${studentProgress.length} progress belajar\n\n⚠️ Tindakan ini TIDAK DAPAT DIBATALKAN!`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // 1. Hapus pelajar dari daftar users
        const allUsers = localStorageService.getUsers();
        const updatedUsers = allUsers.filter(user => user.id !== studentId);
        localStorageService.saveUsers(updatedUsers);

        // 2. Hapus semua enrollment pelajar
        const updatedEnrollments = allEnrollments.filter(enrollment => enrollment.studentId !== studentId);
        localStorageService.saveEnrollments(updatedEnrollments);

        // 3. Hapus semua progress belajar pelajar
        const updatedProgress = allProgress.filter(progress => progress.studentId !== studentId);
        localStorageService.saveProgress(updatedProgress);

        // 4. Buat notifikasi untuk admin
        const notifications = localStorageService.getNotifications() || [];
        const newNotification = {
          id: Date.now(),
          userId: 'admin1',
          message: `Pelajar "${student.name}" telah dihapus dari sistem. ${studentEnrollments.length} enrollment dan ${studentProgress.length} progress belajar telah dihapus.`,
          type: 'student_deleted',
          isRead: false,
          createdAt: new Date().toISOString()
        };
        localStorageService.saveNotifications([...notifications, newNotification]);

        // 5. Reload dashboard data
        loadDashboardData();
        
        // 6. Tampilkan ringkasan penghapusan
        const summaryMessage = `✅ Pelajar "${student.name}" berhasil dihapus!\n\n📊 Ringkasan penghapusan:\n- 1 akun pelajar\n- ${studentEnrollments.length} enrollment kursus\n- ${studentProgress.length} progress belajar\n\n🗂️ Data telah dibersihkan dari sistem.`;
        alert(summaryMessage);
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('❌ Terjadi kesalahan saat menghapus pelajar. Silakan coba lagi.');
      }
    }
  };

  const getStudentStats = (studentId) => {
    const allEnrollments = localStorageService.getEnrollments() || [];
    const allProgress = localStorageService.getProgress() || [];
    
    const studentEnrollments = allEnrollments.filter(enrollment => enrollment.studentId === studentId);
    const studentProgress = allProgress.filter(progress => progress.studentId === studentId);
    
    return {
      totalEnrollments: studentEnrollments.length,
      totalProgress: studentProgress.length
    };
  };

  const totalPending = pendingCourses.length;
  const totalPublished = approvedCourses.length;
  const totalRejected = rejectedCourses.length;
  const totalStudents = approvedCourses.reduce(
    (sum, course) => sum + course.students,
    0,
  );

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Hero Section */}
      <section className="bg-gradient-primary py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-6 fw-bold text-white mb-3">
                Admin Dashboard
              </h1>
              <p className="lead text-white-50 mb-4">
                Kelola kursus, verifikasi konten, dan pantau aktivitas platform
              </p>
              <div className="d-flex gap-3">
                <Link to="/admin/kategori" className="btn btn-light btn-lg">
                  <i className="fas fa-tags me-2"></i>
                  Kelola Kategori
                </Link>
              </div>
            </div>
            <div
              className="col-lg-4 text-center hide-statistics"
              style={{ display: "none" }}
            >
              <div className="row g-2">
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1 text-white">
                      {totalPending}
                    </h3>
                    <small className="text-white-50">Pending Review</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1 text-white">
                      {totalPublished}
                    </h3>
                    <small className="text-white-50">Published</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1 text-white">
                      {totalStudents}
                    </h3>
                    <small className="text-white-50">Total Students</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3">
                    <h3 className="h4 fw-bold mb-1 text-white">
                      {totalRejected}
                    </h3>
                    <small className="text-white-50">Rejected</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow-1 py-5">

        <div className="container">
          {/* Navigation Tabs */}
          <ul className="nav nav-tabs nav-fill mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                <i className="fas fa-clock me-2"></i>
                Pending Review ({totalPending})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "published" ? "active" : ""}`}
                onClick={() => setActiveTab("published")}
              >
                <i className="fas fa-check-circle me-2"></i>
                Published ({totalPublished})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "rejected" ? "active" : ""}`}
                onClick={() => setActiveTab("rejected")}
              >
                <i className="fas fa-times-circle me-2"></i>
                Rejected ({totalRejected})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "teachers" ? "active" : ""}`}
                onClick={() => setActiveTab("teachers")}
              >
                <i className="fas fa-chalkboard-teacher me-2"></i>
                Pengajar Pending ({pendingTeachers.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "allTeachers" ? "active" : ""}`}
                onClick={() => setActiveTab("allTeachers")}
              >
                <i className="fas fa-users me-2"></i>
                Kelola Pengajar ({teachers.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "students" ? "active" : ""}`}
                onClick={() => setActiveTab("students")}
              >
                <i className="fas fa-user-graduate me-2"></i>
                Kelola Pelajar ({students.length})
              </button>
            </li>
          </ul>

          {/* Pending Courses Tab */}
          {activeTab === "pending" && (
            <div className="tab-content">
              {pendingCourses.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-clipboard-check fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">
                    Tidak ada kursus yang menunggu review
                  </h5>
                  <p className="text-muted">Semua kursus telah diproses</p>
                </div>
              ) : (
                <div className="row g-4">
                  {pendingCourses.map((course) => (
                    <div key={course.id} className="col-lg-6">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="row g-0 h-100">
                          <div className="col-md-4">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="img-fluid rounded-start h-100"
                              style={{ objectFit: "cover" }}
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          </div>
                          <div className="col-md-8">
                            <div className="card-body d-flex flex-column h-100">
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h6 className="card-title fw-bold mb-1">
                                    {course.title}
                                  </h6>
                                  <span className="badge bg-warning">
                                    Pending
                                  </span>
                                </div>
                                <p className="text-muted small mb-2">
                                  oleh <strong>{course.instructor}</strong>
                                </p>
                                <p className="card-text small text-muted mb-2">
                                  {stripHtml(course.description)}
                                </p>
                                <div className="row g-2 mb-3">
                                  <div className="col-6">
                                    <small className="text-muted d-block">
                                      Kategori
                                    </small>
                                    <span className="badge bg-primary">
                                      {course.category}
                                    </span>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">
                                      Durasi
                                    </small>
                                    <small className="fw-medium">
                                      {course.duration}
                                    </small>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">
                                      Modul
                                    </small>
                                    <small className="fw-medium">
                                      {course.modules?.length || 0} modul
                                    </small>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">
                                      Pelajaran
                                    </small>
                                    <small className="fw-medium">
                                      {course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0)} pelajaran
                                    </small>
                                  </div>
                                </div>
                                <small className="text-muted">
                                  Diajukan:{" "}
                                  {new Date(
                                    course.submittedDate,
                                  ).toLocaleDateString("id-ID")}
                                </small>
                              </div>
                              <div className="d-flex gap-2 mt-3">
                                <button
                                  onClick={() => handleApprove(course.id)}
                                  className="btn btn-success btn-sm flex-fill"
                                >
                                  <i className="fas fa-check me-1"></i>
                                  Setujui
                                </button>
                                <button
                                  onClick={() => handleReject(course.id)}
                                  className="btn btn-danger btn-sm flex-fill"
                                >
                                  <i className="fas fa-times me-1"></i>
                                  Tolak
                                </button>
                                <div className="d-flex gap-1">
                                  <Link
                                    to={`/kursus/${course.id}`}
                                    className="btn btn-outline-primary btn-sm"
                                    title="Lihat Detail"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </Link>
                                  <button
                                    onClick={() => handleEditCourse(course.id)}
                                    className="btn btn-outline-warning btn-sm"
                                    title="Edit Kursus"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCourse(course.id)}
                                    className="btn btn-outline-danger btn-sm"
                                    title="Hapus Kursus"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Published Courses Tab */}
          {activeTab === "published" && (
            <div className="tab-content">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Kursus</th>
                          <th>Instruktur</th>
                          <th>Kategori</th>
                          <th className="text-center">Students</th>
                          <th className="text-center">Rating</th>
                          <th>Tanggal Disetujui</th>
                          <th className="text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedCourses.map((course) => (
                          <tr key={course.id}>
                            <td>
                              <div className="fw-bold">{course.title}</div>
                            </td>
                            <td>
                              <small className="text-muted">
                                {course.instructor}
                              </small>
                            </td>
                            <td>
                              <span className="badge bg-primary">
                                {course.category}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-success">
                                {course.students}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-warning">
                                <i className="fas fa-star me-1"></i>
                                {course.rating || "N/A"}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">
                                {new Date(
                                  course.approvedDate,
                                ).toLocaleDateString("id-ID")}
                              </small>
                            </td>
                            <td className="text-center">
                              <div className="d-flex gap-2 justify-content-center">
                                <Link to={`/pengajar/kursus/${course.id}/edit`} className="btn btn-outline-warning btn-sm" title="Edit Kursus">
                                  <i className="fas fa-edit"></i>
                                </Link>
                                <button onClick={() => handleDeleteCourse(course.id)} className="btn btn-outline-danger btn-sm" title="Hapus Kursus">
                                  <i className="fas fa-trash"></i>
                                </button>
                                <Link to={`/kursus/${course.id}`} className="btn btn-outline-primary btn-sm" title="Lihat Kursus">
                                  <i className="fas fa-eye"></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rejected Courses Tab */}
          {activeTab === "rejected" && (
            <div className="tab-content">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Kursus</th>
                          <th>Instruktur</th>
                          <th>Alasan Penolakan</th>
                          <th>Tanggal Ditolak</th>
                          <th className="text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rejectedCourses.map((course) => (
                          <tr key={course.id}>
                            <td>
                              <div className="fw-bold">{course.title}</div>
                            </td>
                            <td>
                              <small className="text-muted">
                                {course.instructor}
                              </small>
                            </td>
                            <td>
                              <small className="text-danger">
                                {course.reason}
                              </small>
                            </td>
                            <td>
                              <small className="text-muted">
                                {new Date(
                                  course.rejectedDate,
                                ).toLocaleDateString("id-ID")}
                              </small>
                            </td>
                            <td className="text-center">
                              <div className="d-flex gap-1 justify-content-center">
                                <button 
                                  onClick={() => handleReviewAgain(course.id)}
                                  className="btn btn-outline-success btn-sm"
                                  title="Review Ulang"
                                >
                                  <i className="fas fa-redo"></i>
                                </button>
                                <Link
                                  to={`/kursus/${course.id}`}
                                  className="btn btn-outline-primary btn-sm"
                                  title="Lihat Detail"
                                >
                                  <i className="fas fa-eye"></i>
                                </Link>
                                <button
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="btn btn-outline-danger btn-sm"
                                  title="Hapus Kursus"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Teachers Tab */}
          {activeTab === "teachers" && (
            <div className="tab-content">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  {pendingTeachers.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-user-check fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">Tidak ada pengajar yang menunggu persetujuan</h5>
                      <p className="text-muted">Semua pengajar telah diproses</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Tanggal Daftar</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingTeachers.map((teacher) => (
                            <tr key={teacher.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  {teacher.avatar ? (
                                    <img
                                      src={teacher.avatar}
                                      alt={teacher.name}
                                      className="rounded-circle me-2"
                                      width="32"
                                      height="32"
                                    />
                                  ) : (
                                    <div
                                      className="rounded-circle bg-primary text-white me-2"
                                      style={{
                                        width: "32px",
                                        height: "32px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {teacher.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="fw-bold">{teacher.name}</div>
                                </div>
                              </td>
                              <td>{teacher.email}</td>
                              <td>
                                <small className="text-muted">
                                  {new Date(teacher.createdAt).toLocaleDateString("id-ID")}
                                </small>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-warning">Pending</span>
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => handleTeacherApproval(teacher.id, true)}
                                  className="btn btn-success btn-sm me-2"
                                >
                                  <i className="fas fa-check me-1"></i>
                                  Setujui
                                </button>
                                <button
                                  onClick={() => handleTeacherApproval(teacher.id, false)}
                                  className="btn btn-danger btn-sm"
                                >
                                  <i className="fas fa-times me-1"></i>
                                  Tolak
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* All Teachers Management Tab */}
          {activeTab === "allTeachers" && (
            <div className="tab-content">
              {/* Statistics Cards */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="text-primary mb-2">
                        <i className="fas fa-users fa-2x"></i>
                      </div>
                      <h4 className="fw-bold">{teachers.length}</h4>
                      <p className="text-muted mb-0">Total Pengajar</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="text-success mb-2">
                        <i className="fas fa-user-check fa-2x"></i>
                      </div>
                      <h4 className="fw-bold">{activeTeachers.length}</h4>
                      <p className="text-muted mb-0">Pengajar Aktif</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="text-warning mb-2">
                        <i className="fas fa-user-clock fa-2x"></i>
                      </div>
                      <h4 className="fw-bold">{pendingTeachers.length}</h4>
                      <p className="text-muted mb-0">Menunggu Persetujuan</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="text-info mb-2">
                        <i className="fas fa-chalkboard-teacher fa-2x"></i>
                      </div>
                      <h4 className="fw-bold">{teachers.reduce((total, teacher) => total + getTeacherStats(teacher.id).totalCourses, 0)}</h4>
                      <p className="text-muted mb-0">Total Kursus</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-users me-2"></i>
                    Kelola Semua Pengajar
                  </h5>
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Klik tombol <i className="fas fa-check text-success"></i> untuk mengaktifkan pengajar pending, <i className="fas fa-ban text-warning"></i> untuk menonaktifkan pengajar aktif, atau <i className="fas fa-trash text-danger"></i> untuk menghapus pengajar
                  </small>
                </div>
                <div className="card-body">
                  {teachers.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">Tidak ada pengajar terdaftar</h5>
                      <p className="text-muted">Belum ada pengajar yang mendaftar di platform</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nama Pengajar</th>
                            <th>Email</th>
                            <th>Spesialisasi</th>
                            <th>Tanggal Registrasi</th>
                            <th className="text-center">Jumlah Kursus</th>
                            <th className="text-center">Total Siswa</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teachers.map((teacher) => {
                            const stats = getTeacherStats(teacher.id);
                            return (
                              <tr key={teacher.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {teacher.avatar ? (
                                      <img
                                        src={teacher.avatar}
                                        alt={teacher.name}
                                        className="rounded-circle me-2"
                                        width="32"
                                        height="32"
                                      />
                                    ) : (
                                      <div
                                        className="rounded-circle bg-primary text-white me-2"
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {teacher.name.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <div>
                                      <div className="fw-bold">{teacher.name}</div>
                                      <small className="text-muted">ID: {teacher.id}</small>
                                    </div>
                                  </div>
                                </td>
                                <td>{teacher.email}</td>
                                <td>
                                  <span className="badge bg-info">
                                    {teacher.specialization || 'Tidak ada'}
                                  </span>
                                </td>
                                <td>
                                  <small className="text-muted">
                                    {new Date(teacher.createdAt || Date.now()).toLocaleDateString("id-ID")}
                                  </small>
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-primary">
                                    {stats.totalCourses}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-success">
                                    {stats.totalStudents}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className={`badge ${teacher.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                                    {teacher.status === 'active' ? 'Aktif' : 'Pending'}
                                  </span>
                                  <br />
                                  <small className="text-muted">
                                    {teacher.status === 'active' ? 'Bisa membuat kursus' : 'Tidak bisa membuat kursus'}
                                  </small>
                                </td>
                                <td className="text-center">
                                  <div className="d-flex gap-2 justify-content-center">
                                    <button
                                      onClick={() => handleToggleTeacherStatus(teacher.id)}
                                      className={`btn btn-sm ${teacher.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                                      title={teacher.status === 'active' ? 'Nonaktifkan Pengajar (Tidak bisa membuat kursus)' : 'Aktifkan Pengajar (Bisa membuat kursus)'}
                                    >
                                      <i className={`fas ${teacher.status === 'active' ? 'fa-ban' : 'fa-check'}`}></i>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTeacher(teacher.id)}
                                      className="btn btn-danger btn-sm"
                                      title="Hapus Pengajar"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="tab-content">
              {/* Statistics Cards */}
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="text-primary mb-2">
                        <i className="fas fa-user-graduate fa-2x"></i>
                      </div>
                      <h4 className="fw-bold">{students.length}</h4>
                      <p className="text-muted mb-0">Total Pelajar</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="text-success mb-2">
                        <i className="fas fa-book fa-2x"></i>
                      </div>
                      <h4 className="fw-bold">{(localStorageService.getEnrollments() || []).length}</h4>
                      <p className="text-muted mb-0">Total Enrollment</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="text-info mb-2">
                        <i className="fas fa-chart-line fa-2x"></i>
                      </div>
                      <h4 className="fw-bold">{(localStorageService.getProgress() || []).length}</h4>
                      <p className="text-muted mb-0">Total Progress</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-user-graduate me-2"></i>
                    Kelola Semua Pelajar
                  </h5>
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Klik tombol <i className="fas fa-trash text-danger"></i> untuk menghapus pelajar
                  </small>
                </div>
                <div className="card-body">
                  {students.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">Tidak ada pelajar terdaftar</h5>
                      <p className="text-muted">Belum ada pelajar yang mendaftar di platform</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nama Pelajar</th>
                            <th>Email</th>
                            <th>Tanggal Daftar</th>
                            <th className="text-center">Enrollment</th>
                            <th className="text-center">Progress</th>
                            <th className="text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => {
                            const stats = getStudentStats(student.id);
                            return (
                              <tr key={student.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {student.avatar ? (
                                      <img
                                        src={student.avatar}
                                        alt={student.name}
                                        className="rounded-circle me-2"
                                        width="32"
                                        height="32"
                                      />
                                    ) : (
                                      <div
                                        className="rounded-circle bg-primary text-white me-2"
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {student.name.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <div>
                                      <div className="fw-bold">{student.name}</div>
                                      <small className="text-muted">ID: {student.id}</small>
                                    </div>
                                  </div>
                                </td>
                                <td>{student.email}</td>
                                <td>
                                  <small className="text-muted">
                                    {new Date(student.createdAt || Date.now()).toLocaleDateString("id-ID")}
                                  </small>
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-info">
                                    {stats.totalEnrollments}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-primary">
                                    {stats.totalProgress}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <button
                                    onClick={() => handleDeleteStudent(student.id)}
                                    className="btn btn-outline-danger btn-sm"
                                    title="Hapus Pelajar"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
