import React, { createContext, useContext, useState, useEffect } from "react";
import { localStorageService } from "../services/localStorageService";

const AuthContext = createContext(null);

const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing user session and token
    // We're using localStorageService to ensure consistency
    localStorageService.getUsers(); // This initializes default users if none exist
    const storedUser = localStorage.getItem("userData");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    // Restore user session if both user data and token exist
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      // Clear incomplete session data
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const login = async (email, password, rememberMe) => {
    const users = localStorageService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    try {
      if (!user) {
        throw new Error("Email atau password salah");
      }

      if (user.role === ROLES.TEACHER && user.status === 'pending') {
        throw new Error("Akun pengajar Anda masih menunggu persetujuan admin");
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        status: user.status,
        specialization: user.specialization || '',
        bio: user.bio || '',
        joinDate: user.joinDate || user.createdAt ? new Date(user.createdAt).toLocaleDateString("id-ID", { year: 'numeric', month: 'long' }) : '',
        createdAt: user.createdAt || new Date().toISOString(),
      };

      // Store user data
      localStorage.setItem("userData", JSON.stringify(userData));
      const token = `mock-token-${Date.now()}`;
      
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      setUser(userData);
    } catch (error) {
      throw new Error(error.message || "Email atau password salah");
    }
  };

  const register = async (userData) => {
    const users = localStorageService.getUsers();
    const existingUser = users.find(u => u.email === userData.email);
    try {
      if (existingUser) {
        throw new Error("Email sudah terdaftar");
      }

      // Generate unique ID berdasarkan role
      const userId = userData.role === ROLES.TEACHER 
        ? `teacher${Date.now()}` 
        : userData.role === ROLES.ADMIN 
        ? `admin${Date.now()}`
        : `student${Date.now()}`;

      const currentDate = new Date().toISOString();
      const newUser = {
        id: userId,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || ROLES.STUDENT,
        avatar: null,
        createdAt: currentDate,
        joinDate: new Date(currentDate).toLocaleDateString("id-ID", { year: 'numeric', month: 'long' }),
        status: userData.role === ROLES.TEACHER ? 'pending' : 'active'
      };

      // Add new user to users list
      localStorageService.saveUsers([...users, newUser]);

      // Create notification for admin if new teacher registers
      if (userData.role === ROLES.TEACHER) {
        const notifications = localStorageService.getNotifications() || [];
        const newNotification = {
          id: `notif${Date.now()}`,
          type: 'TEACHER_REGISTRATION',
          message: `Pengajar baru ${userData.name} mendaftar dan menunggu persetujuan`,
          userId: 'admin1', // Send to admin
          read: false,
          createdAt: new Date().toISOString()
        };
        localStorageService.saveNotifications([...notifications, newNotification]);
      }

      const registeredUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: null,
        status: newUser.status,
        joinDate: newUser.joinDate,
        createdAt: newUser.createdAt,
      };

      // Store user data
      localStorage.setItem("userData", JSON.stringify(registeredUser));
      const token = `mock-token-${Date.now()}`;
      localStorage.setItem("token", token);

      setUser(registeredUser);
    } catch (error) {
      throw new Error("Gagal mendaftar. Email mungkin sudah terdaftar.");
    }
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      // TODO: Replace with actual API call
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setUser(updatedUser);
      // Data sudah disimpan di Profile.jsx, tidak perlu disimpan lagi di sini
    } catch (error) {
      throw new Error("Gagal memperbarui profil");
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};