import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Loader from '../../components/Loader';

// Lazy load the AuditList component
const AuditList = lazy(() => import('../audit'));

const AdminHome = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="audit" element={<AuditList />} />
          <Route path="" element={<Navigate to="/admin/audit" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};

export default AdminHome;