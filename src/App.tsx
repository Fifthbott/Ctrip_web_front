import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/login';
import AuditList from './pages/audit';
import AdminLayout from './components/layout/AdminLayout';
import ResizeTracker from './ResizeTracker';
import './styles/main.scss';

// 路由认证组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <ResizeTracker>
        <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminLayout />
                    </PrivateRoute>
                  }
                >
                  <Route path="audit" element={<AuditList />} />
                  <Route path="" element={<Navigate to="/admin/audit" replace />} />
                </Route>
                <Route path="/" element={<Navigate to="/admin" replace />} />
              </Routes>
            </BrowserRouter>
        </AuthProvider>
      </ResizeTracker>
    </ConfigProvider>
  );
}

export default App;
