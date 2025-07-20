import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { localStorageService } from "../services/localStorageService";
import { useAuth } from "../contexts/AuthContext";

const TeacherManagement = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Load all users and filter teachers
    const allUsers = localStorageService.getUsers();
    const teacherUsers = allUsers.filter(user => user.role === 'teacher');
    
    // Load all courses
    const allCourses = localStorageService.getCourses() || [];
    setCourses(allCourses);

    // Calculate course and student counts for each teacher
    const teachersWithStats = teacherUsers.map(teacher => {
      const teacherCourses = allCourses.filter(course => course.teacherId === teacher.id);
      const totalStudents = teacherCourses.reduce((sum, course) => {
        const enrollments = localStorageService.getEnrollments() || [];
        return sum + enrollments.filter(e => e.courseId === course.id).length;
      }, 0);

      return {
        ...teacher,
        coursesCount: teacherCourses.length,
        totalStudents,
        registrationDate: teacher.registrationDate || new Date().toISOString().split('T')[0],
        status: teacher.status || 'pending',
        isActive: teacher.status === 'active'
      };
    });

    setTeachers(teachersWithStats);
  }, []);

  const toggleTeacherStatus = (teacherId) => {
    // Update in users list
    const allUsers = localStorageService.getUsers();
    const updatedUsers = allUsers.map(user =>
      user.id === teacherId
        ? { ...user, status: user.status === 'active' ? 'pending' : 'active' }
        : user
    );
    localStorageService.saveUsers(updatedUsers);

    // Update local state
    const updatedTeachers = teachers.map(teacher =>
      teacher.id === teacherId
        ? { 
            ...teacher, 
            status: teacher.status === 'active' ? 'pending' : 'active',
            isActive: teacher.status !== 'active'
          }
        : teacher
    );
    setTeachers(updatedTeachers);

    // Add notification
    const teacher = teachers.find(t => t.id === teacherId);
    const action = teacher.status === 'active' ? 'dinonaktifkan' : 'diaktifkan';
    const notification = {
      id: Date.now(),
      userId: teacherId,
      message: `Akun Anda telah ${action} oleh admin`,
      type: 'account_status',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    const notifications = localStorageService.getNotifications() || [];
    localStorageService.saveNotifications([...notifications, notification]);
  };

  return (
    <div className="min-vh-100 d-flex flex-column">

      

      {/* Main Content */}
      <main className="flex-grow-1 bg-light py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Kelola Pengajar</h2>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Nama Pengajar</th>
                      <th>Email</th>
                      <th>Spesialisasi</th>
                      <th>Tanggal Registrasi</th>
                      <th>Jumlah Kursus</th>
                      <th>Total Siswa</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td>{teacher.name}</td>
                        <td>{teacher.email}</td>
                        <td>{teacher.specialization || '-'}</td>
                        <td>{teacher.registrationDate}</td>
                        <td>{teacher.coursesCount}</td>
                        <td>{teacher.totalStudents}</td>
                        <td>
                          <span
                            className={`badge ${teacher.status === 'active' ? 'bg-success' : 'bg-danger'}`}
                          >
                            {teacher.status === 'active' ? 'Aktif' : 'Pending'}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm ${teacher.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => toggleTeacherStatus(teacher.id)}
                          >
                            {teacher.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>



    </div>
  );
};

export default TeacherManagement;