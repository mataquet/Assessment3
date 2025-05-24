import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTripById, joinTrip, leaveTrip } from '../../services/tripService';

const TripDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Récupérer l'utilisateur actuel depuis le stockage local
        const user = localStorage.getItem('username');
        setCurrentUser(user);

        const fetchTrip = async () => {
            try {
                const tripData = await getTripById(id);
                setTrip(tripData);
            } catch (err) {
                setError("An error occurred while loading the trip");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id]);

    const handleJoin = async () => {
        try {
            await joinTrip(id);
            // Mettre à jour les données du voyage après l'inscription
            const updatedTrip = await getTripById(id);
            setTrip(updatedTrip);
            setSuccessMessage("You have successfully joined the trip");
        } catch (err) {
            setError("An error occurred while joining the trip");
            console.error(err);
        }
    };

    const handleLeave = async () => {
        try {
            await leaveTrip(id);
            // Mettre à jour les données du voyage après la désinscription
            const updatedTrip = await getTripById(id);
            setTrip(updatedTrip);
            setSuccessMessage("You have successfully left the trip");
        } catch (err) {
            setError("An error occurred while leaving the trip");
            console.error(err);
        }
    };

    if (loading) return <div className="container mt-4">Loading...</div>;
    if (!trip) return <div className="container mt-4">Trip not found</div>;

    const isOwner = currentUser && trip.owners && trip.owners.includes(currentUser);
    const isParticipant = currentUser && trip.participants && trip.participants.includes(currentUser);
    const participantsCount = trip.participants ? trip.participants.length : 0;
    const progressPercentage = (participantsCount * 100) / trip.capacity;

    return (
        <div className="container">
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

            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        {trip.image && (
                            <img src={trip.image} className="card-img-top" alt={trip.name} style={{ height: '300px', objectFit: 'cover' }} />
                        )}
                        <div className="card-body">
                            <h1 className="card-title">{trip.name}</h1>
                            <p className="card-text">{trip.description}</p>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <strong>Departure :</strong> {trip.departure}, le {new Date(trip.departureDate).toLocaleDateString('fr-FR', {
                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                            </li>
                            <li className="list-group-item">
                                <strong>Arrival :</strong> {trip.arrival}, le {new Date(trip.arrivalDate).toLocaleDateString('fr-FR', {
                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                            </li>
                            <li className="list-group-item"><strong>Prix :</strong> {trip.price} €</li>
                            <li className="list-group-item">
                                <strong>Participants :</strong> {participantsCount} / {trip.capacity}
                                <div className="progress mt-2">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: `${progressPercentage}%` }}
                                        aria-valuenow={participantsCount}
                                        aria-valuemin="0"
                                        aria-valuemax={trip.capacity}>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <button
                                    onClick={() => navigate('/hub')}
                                    className="btn btn-outline-secondary">
                                    Back to Dashboard
                                </button>

                                {currentUser && (
                                    isParticipant ? (
                                        <button
                                            onClick={handleLeave}
                                            className="btn btn-outline-danger">
                                            Unsubscribe
                                        </button>
                                    ) : participantsCount < trip.capacity ? (
                                        <button
                                            onClick={handleJoin}
                                            className="btn btn-success">
                                            Subscribe
                                        </button>
                                    ) : (
                                        <button className="btn btn-secondary" disabled>
                                            Trip Full
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    {isOwner && (
                        <div className="card mb-4">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">Admin actions</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-grid gap-2">
                                    <Link to={`/trips/${trip.id}/edit`} className="btn btn-outline-primary">
                                        Edit Trip
                                    </Link>
                                    <Link to={`/trips/${trip.id}/delete`} className="btn btn-outline-danger">
                                        Delete Trip
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Owners</h5>
                        </div>
                        <ul className="list-group list-group-flush">
                            {trip.owners && trip.owners.map(owner => (
                                <li key={owner} className="list-group-item">{owner}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Participants ({participantsCount})</h5>
                        </div>
                        {trip.participants && trip.participants.length > 0 ? (
                            <ul className="list-group list-group-flush">
                                {trip.participants.map(participant => (
                                    <li key={participant} className="list-group-item">{participant}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="card-body">
                                <p className="card-text">There is nor participant on this trip</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDetail;