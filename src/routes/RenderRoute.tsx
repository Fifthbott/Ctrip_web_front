import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import {withPrivateRoute} from './privateRoute';
import Loader from '../components/Loader';

// Use React.lazy for code splitting
const Login = React.lazy(() => import('../pages/login'));
const AdminHome = React.lazy(() => import('../pages/home'));

const AppRoutes = () => (
<BrowserRouter>
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={withPrivateRoute(<AdminHome />)} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  </Suspense>
</BrowserRouter> 
)

export default AppRoutes;