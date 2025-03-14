import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Vérifiez si l'utilisateur est authentifié
    const isAuthenticated = localStorage.getItem('accessToken'); // ou une autre logique d'authentification

    // Si l'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
    if (!isAuthenticated) {
        return <Navigate to="/connexionadmin" replace />;
    }

    // Si l'utilisateur est authentifié, affichez la route protégée
    return <Outlet />;
};

export default ProtectedRoute;