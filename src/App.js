import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './admin/component/Login';
import AdminNavbar from './admin/component/pages/AdminNavbar';
import AdminProfile from './admin/component/pages/AdminProfile';
import AdminManage from './admin/component/pages/AdminManage';
import AdminProfileEdit from './admin/component/pages/AdminProfileEdit';
import AddNewAdmin from './admin/component/AddNewStaff';
import AdminMaps from './admin/component/pages/AdminMaps';
import ResetPassword from './admin/component/forgotpassword';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Redirect from / to /login if not authenticated */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/private" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        <Route path="/resetpassowrd" element={<ResetPassword/>} />
        
        
        {/* Private route */}
        <Route path="/private" element={<AdminNavbar />} isAuthenticated={isAuthenticated}/>
        <Route path='/AdminProfile' element={<AdminProfile />} />
        <Route path='/AdminManage' element={<AdminManage />} />
        <Route path='/AdminMaps' element={<AdminMaps />} />
        <Route path='/AdminProfileEdit' element={<AdminProfileEdit />}></Route>
        <Route path='/AddNewAdmin' element={<AddNewAdmin />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
