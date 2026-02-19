import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role"); // We saved this during login
    const location = useLocation();

    // 1. Check if user is logged in
    if (!token) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // 2. Check if the role is allowed for this specific route (RBAC)
    // If allowedRoles is provided, check if user's role is in the list
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        alert("You do not have permission to access this page.");
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;