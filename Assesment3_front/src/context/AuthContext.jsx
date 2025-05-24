import React, { createContext, useState, useContext } from 'react';
import { logoutUser, isAuthenticated } from '../services/authService';

const AuthContext = createContext({ username: null, login: () => {}, logout: () => {} });

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [authenticated, setAuthenticated] = useState(isAuthenticated());

    const login = (username) => {
        setUsername(username);
        setAuthenticated(true);
    };

    const logout = () => {
        logoutUser();
        setUsername(null);
        setAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ username, authenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);