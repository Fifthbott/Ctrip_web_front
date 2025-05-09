import {withPrivateRoute} from './privateRoute';
import Login from '../pages/login';
import AdminHome from '../pages/home';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

const AppRoutes = () => (
<BrowserRouter>
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/admin/*" element={withPrivateRoute(<AdminHome />)} />
  <Route path="/" element={<Navigate to="/login" replace />} />
</Routes>
</BrowserRouter> 
)

export default AppRoutes;