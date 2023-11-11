import React, { Component } from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isAuthenticated }) => (
    <Route
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
);

export default PrivateRoute;
