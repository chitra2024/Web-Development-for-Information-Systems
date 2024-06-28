import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, isAdminRoute, children }) => {
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (isAdminRoute && !user.isAdmin) {
        return <Navigate to="/emp-dashboard" />;
    }

    if (!isAdminRoute && user.isAdmin) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;
