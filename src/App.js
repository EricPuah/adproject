import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './admin/component/Login';
import AdminNavbar from './admin/component/pages/AdminNavbar';
import AdminProfile from './admin/component/pages/AdminProfile';
import AdminManage from './admin/component/pages/AdminManage';
import AdminProfileEdit from './admin/component/pages/AdminProfileEdit';
import AddNewAdmin from './admin/component/AddNewStaff';
import AdminMaps from './admin/component/pages/AdminMaps';
import ResetPassword from './admin/component/resetpassword';
import ChangePassword from './admin/component/changepassword';
import LocationTracker from './admin/component/pages/LocationTracker';
import { RequireAuth } from 'react-auth-kit';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/changepassword" element={<ChangePassword />} />

        <Route path={'/'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminNavbar />
          </RequireAuth>
        } />

        <Route path={'/private'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminNavbar />
          </RequireAuth>
        } />

        <Route path={'/AdminProfile'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminProfile />
          </RequireAuth>
        } />

        <Route path={'/AdminManage'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminManage />
          </RequireAuth>
        } />

        <Route path={'/AdminProfileEdit'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminProfileEdit />
          </RequireAuth>
        } />

        <Route path={'/AddNewAdmin'} element={
          <RequireAuth loginPath={'/login'}>
            <AddNewAdmin />
          </RequireAuth>
        } />

        <Route path={'/resetpassword'} element={
          <RequireAuth loginPath={'/login'}>
            <ResetPassword />
          </RequireAuth>
        } />

        <Route path={'/AdminMaps'} element={
          <RequireAuth loginPath={'/login'}>
            <LocationTracker />
          </RequireAuth>
        } />

      </Routes>
    </Router>
  );
};

export default App;
