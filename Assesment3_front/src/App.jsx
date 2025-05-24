import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';
import Home from "./components/Home.jsx";
import Hub from "./components/hub/Hub.jsx";
import Create from "./components/trips/Create.jsx";
import UpcomingTrips from "./components/trips/UpcomingTrips.jsx";
import TripDetail from "./components/trips/TripDetails";
import EditTrip from "./components/trips/EditTrip";
import DeleteTrip from "./components/trips/DeleteTrip";
import NavBar from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
    return (
        <Router>
        <NavBar />
            <Routes>
                {/* Routes publiques */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />

                {/* Routes protégées */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/hub" element={<Hub />} />
                    <Route path="/trips/create" element={<Create />} />
                    <Route path="/trips" element={<UpcomingTrips />} />
                    <Route path="/trips/:id" element={<TripDetail />} />
                    <Route path="/trips/:id/edit" element={<EditTrip />} />
                    <Route path="/trips/:id/delete" element={<DeleteTrip />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;