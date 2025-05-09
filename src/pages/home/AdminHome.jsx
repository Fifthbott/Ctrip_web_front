import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import AuditList from '../audit';

const AdminHome = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="audit" element={<AuditList />} />
        <Route path="" element={<Navigate to="/admin/audit" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminHome;