import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

const ProtectedRoute = () => {
    const location = useLocation();

    if (!isAuthenticated()) {
        // Rediriger vers la page de connexion en conservant l'URL d'origine
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si l'utilisateur est authentifié, afficher le composant enfant
    return <Outlet />;
};

export default ProtectedRoute;