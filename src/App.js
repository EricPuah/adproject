import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './admin/component/Login';
import AdminNavbar from './admin/component/pages/AdminNavbar';
import AdminDashBoard from './admin/component/pages/AdminDashBoard';
import AdminSettings from './admin/component/pages/AdminSettings';
import AdminProfile from './admin/component/pages/AdminProfile';
import AdminManage from './admin/component/pages/AdminManage';
import AdminProfileEdit from './admin/component/pages/AdminProfileEdit';


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
        
        {/* Private route */}
        <Route path="/private" element={<AdminNavbar />} isAuthenticated={isAuthenticated}/>
        <Route path='/AdminDashBoard' element={<AdminDashBoard />} />
        <Route path='/AdminProfile' element={<AdminProfile />} />
        <Route path='/AdminManage' element={<AdminManage />} />
        <Route path='/AdminSettings' element={<AdminSettings />} />
        <Route path='/AdminProfileEdit' element={<AdminProfileEdit />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
