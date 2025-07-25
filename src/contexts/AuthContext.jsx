import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/authAPI";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session and token
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    // Restore user session if token exists
    if (token) {
      authAPI.getCurrentUser()
        .then(userData => {
          setUser(userData);
        })
        .catch(error => {
          console.error("Failed to restore session:", error);
          // Clear invalid session
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          localStorage.removeItem("userData");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      const response = await authAPI.login(email, password);
      const { user: userData, token } = response;

      // Store user data
      localStorage.setItem("userData", JSON.stringify(userData));
      
      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error(error.message || "Email atau password salah");
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      throw new Error(error.message || "Gagal mendaftar");
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local data even if API call fails
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("userData");
      setUser(null);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authAPI.updateProfile(userData);
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw new Error(error.message || "Gagal memperbarui profil");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === ROLES.ADMIN,
        isTeacher: user?.role === ROLES.TEACHER,
        isStudent: user?.role === ROLES.STUDENT,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };