// src/components/common/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logoutUser } from '../services/authService';

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">TripPlanner</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {isAuthenticated() && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/hub">Hub</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/trips">Trips</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className="d-flex">
                        {isAuthenticated() ? (
                            <button onClick={handleLogout} className="btn btn-outline-danger">
                                <i className="bi bi-box-arrow-right me-1"></i> Log out
                            </button>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link to="/login" className="btn btn-outline-primary">Log in</Link>
                                <Link to="/register" className="btn btn-primary">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;