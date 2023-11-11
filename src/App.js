import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './admin/component/PrivateRoute/PrivateRoute';
import Login from './admin/component/Login';

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
        <Route path="/private" element={<PrivateRoute isAuthenticated={isAuthenticated} />} />
      </Routes>
    </Router>
  );
};

export default App;
