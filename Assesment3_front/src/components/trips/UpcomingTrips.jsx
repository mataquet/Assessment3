import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUpcomingTrips, joinTrip, leaveTrip } from '../../services/tripService';

const UpcomingTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Récupérer l'utilisateur actuel depuis le stockage local
        const user = localStorage.getItem('username');
        setCurrentUser(user);

        const fetchTrips = async () => {
            try {
                const data = await getUpcomingTrips();
                setTrips(data);
            } catch (err) {
                setError("Error during the trips loading.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    const handleJoin = async (id) => {
        try {
            await joinTrip(id);
            // Mettre à jour la liste après inscription
            const updatedTrips = await getUpcomingTrips();
            setTrips(updatedTrips);
            setSuccessMessage("You are now registered to this trip !");
        } catch (err) {
            setError("Error during the trip's registration.");
            console.error(err);
        }
    };

    const handleLeave = async (id) => {
        try {
            await leaveTrip(id);
            // Mettre à jour la liste après désinscription
            const updatedTrips = await getUpcomingTrips();
            setTrips(updatedTrips);
            setSuccessMessage("You left the trip.");
        } catch (err) {
            setError("Error during the unsubscription.");
            console.error(err);
        }
    };

    const truncateDescription = (description, maxLength = 100) => {
        if (!description) return '';
        return description.length > maxLength
            ? description.substring(0, maxLength - 3) + "..."
            : description;
    };

    if (loading) return <div className="container mt-4">Loading...</div>;

    return (
        <div className="container">
            <h2 className="mb-4">Upcoming Trips</h2>

            <div className="row mb-3">
                <div className="col">
                    <p>Here is the list of upcoming trips you can join.</p>
                </div>
                <div className="col-auto">
                    <Link to="/trips/create" className="btn btn-primary">
                        <i className="bi bi-plus"></i> Create a new trip
                    </Link>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)} aria-label="Close"></button>
                </div>
            )}

            {trips.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {trips.map(trip => (
                        <div className="col" key={trip.id}>
                            <div className="card h-100 shadow-sm">
                                {trip.image ? (
                                    <img src={trip.image} className="card-img-top" alt={trip.name} style={{ height: '200px', objectFit: 'cover' }} />
                                ) : (
                                    <div className="bg-light text-center py-5" style={{ height: '200px' }}>
                                        <i className="bi bi-image text-secondary" style={{ fontSize: '4rem' }}></i>
                                    </div>
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{trip.name}</h5>
                                    <p className="card-text">{truncateDescription(trip.description)}</p>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <strong>Departure:</strong> {trip.departure}, on {new Date(trip.departureDate).toLocaleDateString('en-GB', {
                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                    })}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Arrival:</strong> {trip.arrival}, on {new Date(trip.arrivalDate).toLocaleDateString('en-GB', {
                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                    })}
                                    </li>
                                    <li className="list-group-item"><strong>Price:</strong> {trip.price} €</li>
                                    <li className="list-group-item">
                                        <strong>Participants:</strong> {trip.participants ? trip.participants.length : 0}
                                    </li>
                                </ul>
                                <div className="card-footer d-flex justify-content-between bg-white">
                                    <Link to={`/trips/${trip.id}`} className="btn btn-sm btn-outline-primary">Details</Link>

                                    {currentUser ? (
                                        trip.participants && trip.participants.includes(currentUser) ? (
                                            <button
                                                onClick={() => handleLeave(trip.id)}
                                                className="btn btn-sm btn-outline-danger">
                                                Unsubscribe
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleJoin(trip.id)}
                                                className="btn btn-sm btn-success">
                                                Subscribe
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="btn btn-sm btn-outline-secondary">
                                            Login required
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <p>No upcoming trips at the moment. Please check back later!</p>
                </div>
            )}
        </div>
    );
};

export default UpcomingTrips;