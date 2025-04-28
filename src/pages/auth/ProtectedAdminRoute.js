import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedAdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Có thể thay bằng spinner tùy chỉnh
  }

  if (!user || user?.role?.name?.toLowerCase() !== "admin") {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
