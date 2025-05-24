import React from 'react';
import { Link } from 'react-router-dom';

const Trip = ({ trip, onLeave }) => (
    <div className="card h-100">
        <div className="card-body">
            <h5 className="card-title">{trip.name}</h5>
            <p className="card-text text-truncate">{trip.description}</p>
            <p className="card-text">
                <small className="text-muted">
                    From {new Date(trip.departureDate).toLocaleDateString()} to {new Date(trip.arrivalDate).toLocaleDateString()}
                </small>
            </p>
            <p className="card-text">
                <strong>Price:</strong> {trip.price} €
            </p>
        </div>
        <div className="card-footer">
            <Link to={`/trips/${trip.id}`} className="btn btn-sm btn-outline-primary">
                Details
            </Link>
            <button
                onClick={() => onLeave(trip.id)}
                className="btn btn-sm btn-outline-danger ms-2"
            >
                Sign Out
            </button>
        </div>
    </div>
);

export default Trip;