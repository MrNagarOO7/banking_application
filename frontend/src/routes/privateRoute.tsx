// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem("auth-key");
  if (isLoggedIn) {
    // If the user is logged in, render the children (Dashboard)
    return <>{children}</>;
  } else {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
