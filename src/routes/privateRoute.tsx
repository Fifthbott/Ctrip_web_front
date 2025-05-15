import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// 路由认证组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // 直接从localStorage检查token，确保页面刷新时不会直接跳转
    const token = localStorage.getItem('token');
    setHasToken(!!token);
    setCheckingAuth(false);
  }, []);

  // 如果正在检查认证，显示空内容
  if (checkingAuth) {
    return null;
  }

  // 优先使用AuthContext的isAuthenticated，其次使用本地检查的token
  return (isAuthenticated || hasToken) ? <>{children}</> : <Navigate to="/login" replace state={{ from: location }} />;
};

export const withPrivateRoute = (element: React.ReactNode) => {
  return <PrivateRoute>{element}</PrivateRoute>;
};

export default PrivateRoute;
