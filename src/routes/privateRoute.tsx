// src/routes/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

// 路由认证组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const withPrivateRoute = (element: React.ReactNode) => {
  return <PrivateRoute>{element}</PrivateRoute>;
};
