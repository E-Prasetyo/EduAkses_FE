import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const dashboardRoutes = {
      student: "/pelajar/dashboard",
      teacher: "/pengajar/dashboard",
      admin: "/admin/dashboard",
    };

    return <Navigate to={dashboardRoutes[user.role]} replace />;
  }

  return children;
};

export default ProtectedRoute;