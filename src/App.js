import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './admin/component/Login';
import AdminNavbar from './admin/component/pages/AdminNavbar';
import AdminProfile from './admin/component/pages/AdminProfile';
import AdminManage from './admin/component/pages/AdminManage';
import AdminManageBus from './admin/component/pages/AdminManageBus';
import AdminProfileEdit from './admin/component/pages/AdminProfileEdit';
import AddNewAdmin from './admin/component/AddNewAdmin';
import AddNewBusDriver from './admin/component/AddNewBusDriver';
import ChangePassword from './admin/component/changepassword';
import ResetPassword from './admin/component/resetpassword';
import LocationTracker from './admin/component/pages/LocationTracker';
import { RequireAuth } from 'react-auth-kit';
import UserMap from './admin/component/userpages/UserMap';
import UserFeedback from './admin/component/userpages/UserFeedback';
import DriverBusSelect from './admin/component/driverpages/DriverBusSelect';
import AdminFeedback from './admin/component/pages/AdminFeedback';
import UserReport from './admin/component/userpages/UserReport';
import AdminReport from './admin/component/pages/AdminReport';
import AdminManageBusSchedule from './admin/component/pages/AdminManageBusSchedule';
import UserBusSchedule from './admin/component/userpages/UserBusSchedule';
import DriverBusSchedule from './admin/component/driverpages/DriverBusSchedule'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserMap />} />
        <Route path="/login" element={<Login />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />


        <Route path={'/'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminNavbar />
          </RequireAuth>
        } />

        {/* <Route path={'/private'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminNavbar />
          </RequireAuth>
        } /> */}

        <Route path={'/ProfileInformation'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminProfile />
          </RequireAuth>
        } />

        <Route path={'/AdminManage'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminManage />
          </RequireAuth>
        } />

        <Route path={'/ProfileInformationEdit'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminProfileEdit />
          </RequireAuth>
        } />

        <Route path={'/AddNewAdmin'} element={
          <RequireAuth loginPath={'/login'}>
            <AddNewAdmin />
          </RequireAuth>
        } />

        <Route path={'/AddNewBusDriver'} element={
          <RequireAuth loginPath={'/AddNewBusDriver'}>
            <AddNewBusDriver />
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

        <Route path={'/AdminManageBus'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminManageBus />
          </RequireAuth>
        } />

        <Route path={'/AdminFeedback'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminFeedback />
          </RequireAuth>
        } />

        <Route path={'/UserMap'} element={
          <UserMap />
        } />

        <Route path={'/UserFeedback'} element={
          <UserFeedback />
        } />

        <Route path={'/UserBusSchedule'} element={
          <UserBusSchedule />
        } />

        <Route path={'/DriverBusSelect'} element={
          <RequireAuth loginPath={'/login'}>
            <DriverBusSelect />
          </RequireAuth>
        } />

        <Route path={'/DriverBusSchedule'} element={
          <RequireAuth loginPath={'/login'}>
            <DriverBusSchedule />
          </RequireAuth>
        } />

        <Route path={'/AdminReport'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminReport />
          </RequireAuth>
        } />

        <Route path={'/AdminManageBusSchedule'} element={
          <RequireAuth loginPath={'/login'}>
            <AdminManageBusSchedule />
          </RequireAuth>
        } />

        <Route path={'/UserReport'} element={
          <UserReport />
        } />

      </Routes>
    </Router>
  );
};

export default App;
