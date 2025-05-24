import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Trip from "./Trip.jsx";
import { getUpcomingTrips, leaveTrip } from '../../services/tripService';

const Hub = () => {
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les voyages au montage du composant
    useEffect(() => {
        fetchTrips();
    }, []);

    // Fonction pour charger les voyages
    const fetchTrips = async () => {
        try {
            setLoading(true);
            const tripsData = await getUpcomingTrips();
            // Filtrer pour ne garder que les voyages où l'utilisateur est inscrit
            const userTrips = tripsData.filter(trip =>
                trip.participants && trip.participants.includes(username)
            );
            setTrips(userTrips);
        } catch (err) {
            setError("An error occurred while fetching trips");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour se désinscrire d'un voyage
    const handleLeaveTrip = async (tripId) => {
        try {
            await leaveTrip(tripId);
            // Actualiser la liste des voyages après désinscription
            fetchTrips();
        } catch (err) {
            setError("An error occurred while leaving the trip");
            console.error(err);
        }
    };

    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Welcome, {username} !</h2>
                            <p className="card-text">
                                This is your dashboard where you can manage your trips and explore new adventures.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col">
                    <h3>Your Trips</h3>
                </div>
                <div className="col-auto">
                    <Link to="/trips/create" className="btn btn-primary">
                        <i className="bi bi-plus"></i> Create a Trip
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <div className="row">
                    {trips && trips.length > 0 ? (
                        trips.map(trip => (
                            <div className="col-md-6 col-lg-4 mb-4" key={trip.id}>
                                <Trip
                                    trip={trip}
                                    onLeave={handleLeaveTrip}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="alert alert-info">
                                <p className="mb-0">You are not registered for any trip</p>
                                <Link to="/trips" className="btn btn-primary mt-3">
                                    Discover Trips
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Hub;