// src/routes/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// 路由认证组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const withPrivateRoute = (element: React.ReactNode) => {
  return <PrivateRoute>{element}</PrivateRoute>;
};

export default PrivateRoute;
