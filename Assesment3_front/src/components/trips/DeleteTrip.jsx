// src/components/DeleteTrip.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById, deleteTrip } from '../../services/tripService';

const DeleteTrip = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const tripData = await getTripById(id);
                setTrip(tripData);
            } catch (err) {
                setError("Error loading trip");
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteTrip(id);
            navigate('/hub');
        } catch (err) {
            setError("Error deleting trip");
        }
    };

    if (loading) return <div className="container mt-4">Loading...</div>;
    if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
    if (!trip) return <div className="container mt-4"><div className="alert alert-warning">Trip not found</div></div>;

    return (
        <div className="container">
            <h2 className="mb-4">Confirm Deletion</h2>

            <div className="alert alert-danger">
                <h4>Are you sure you want to delete this trip?</h4>
                <p>This action is irreversible.</p>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                    <h5 className="mb-0">Trip Details</h5>
                </div>
                <div className="card-body">
                    <dl className="row">
                            <dt className="col-sm-3">Name</dt>
                        <dd className="col-sm-9">{trip.name}</dd>

                        <dt className="col-sm-3">Description</dt>
                        <dd className="col-sm-9">{trip.description}</dd>

                            <dt className="col-sm-3">Departure</dt>
                        <dd className="col-sm-9">
                                {trip.departure} - {new Date(trip.departureDate).toLocaleDateString('en-GB', {
                            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                        </dd>

                            <dt className="col-sm-3">Arrival</dt>
                        <dd className="col-sm-9">
                                {trip.arrival} - {new Date(trip.arrivalDate).toLocaleDateString('en-GB', {
                            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                        </dd>

                            <dt className="col-sm-3">Price</dt>
                        <dd className="col-sm-9">{trip.price} €</dd>

                            <dt className="col-sm-3">Capacity</dt>
                            <dd className="col-sm-9">{trip.capacity} people</dd>

                        <dt className="col-sm-3">Participants</dt>
                            <dd className="col-sm-9">{trip.participants ? trip.participants.length : 0} registered</dd>
                    </dl>
                </div>
            </div>

            <div className="d-flex gap-3">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/hub')}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DeleteTrip;