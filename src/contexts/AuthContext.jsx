import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

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
    // Check for existing user session
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      // TODO: Replace with actual API call
      // Simulate API call
      const mockUser = {
        id: "1",
        name: "Ahmad Fulan",
        email: email,
        role: email.includes("admin") ? "admin" : email.includes("teacher") ? "teacher" : "student",
        avatar: null,
      };

      // Store user data
      localStorage.setItem("userData", JSON.stringify(mockUser));
      if (rememberMe) {
        localStorage.setItem("token", "mock-jwt-token");
      } else {
        sessionStorage.setItem("token", "mock-jwt-token");
      }

      setUser(mockUser);
    } catch (error) {
      throw new Error("Email atau password salah");
    }
  };

  const register = async (userData) => {
    try {
      // TODO: Replace with actual API call
      // Simulate API call
      const mockUser = {
        id: "1",
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: null,
      };

      // Store user data
      localStorage.setItem("userData", JSON.stringify(mockUser));
      localStorage.setItem("token", "mock-jwt-token");

      setUser(mockUser);
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