import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById, updateTrip, setTripOwner } from '../../services/tripService';

const EditTrip = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [tripData, setTripData] = useState({
        id: '',
        name: '',
        description: '',
        departure: '',
        departureDate: '',
        arrival: '',
        arrivalDate: '',
        price: 0,
        capacity: 1,
        image: '',
        owners: [],
        participants: []
    });
    const [newOwner, setNewOwner] = useState('');

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const trip = await getTripById(id);

                // Formatage des dates pour les champs datetime-local
                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    return date.toISOString().slice(0, 16);
                };

                setTripData({
                    ...trip,
                    departureDate: formatDate(trip.departureDate),
                    arrivalDate: formatDate(trip.arrivalDate)
                });
            } catch (err) {
                setError("An error occurred while loading the trip");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!tripData.name) newErrors.name = "Trip's name is required";
        if (!tripData.description) newErrors.description = "A description is required";
        if (!tripData.departure) newErrors.departure = "A departure place is required";
        if (!tripData.departureDate) newErrors.departureDate = "The departure date is required";
        if (!tripData.arrival) newErrors.arrival = "The arrival place is required";
        if (!tripData.arrivalDate) newErrors.arrivalDate = "The arrival date is required";

        // Checking if the departure date is before arrival date
        if (tripData.departureDate && tripData.arrivalDate) {
            const deptDate = new Date(tripData.departureDate);
            const arrDate = new Date(tripData.arrivalDate);
            if (deptDate >= arrDate) {
                newErrors.arrivalDate = "The arrival date must be after the departure date";
            }
        }

        if (tripData.price <= 0) newErrors.price = "The price should be higher than 0";

        // Checking if the capacity is higher or equal to the number of participants
        const participantsCount = tripData.participants ? tripData.participants.length : 0;
        if (tripData.capacity < 1) {
            newErrors.capacity = "The capacity must be at least 1";
        } else if (tripData.capacity < participantsCount) {
            newErrors.capacity = `The capacity must be higher than the number of participants (${participantsCount})`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await updateTrip(id, tripData);

            // If a new owner is specified, set the trip owner
            if (newOwner.trim()) {
                await setTripOwner(id, newOwner);
            }

            navigate(`/trips/${id}`);
        } catch (err) {
            console.error("Error during the trip's update :", err);
            setError("AN error occured during the trip's update");
        }
    };

    if (loading) return <div className="container mt-4">Loading...</div>;
    if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

    return (
        <div className="container">
            <h2 className="mb-4">Edit Trip</h2>

            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {errors.form && <div className="alert alert-danger">{errors.form}</div>}

                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Trip Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        value={tripData.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        rows="4"
                                        value={tripData.description}
                                        onChange={handleChange}
                                    ></textarea>
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="departure" className="form-label">Departure Location</label>
                                        <input
                                            type="text"
                                            id="departure"
                                            name="departure"
                                            className={`form-control ${errors.departure ? 'is-invalid' : ''}`}
                                            value={tripData.departure}
                                            onChange={handleChange}
                                        />
                                        {errors.departure && <div className="invalid-feedback">{errors.departure}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="departureDate" className="form-label">Departure Date</label>
                                        <input
                                            type="datetime-local"
                                            id="departureDate"
                                            name="departureDate"
                                            className={`form-control ${errors.departureDate ? 'is-invalid' : ''}`}
                                            value={tripData.departureDate}
                                            onChange={handleChange}
                                        />
                                        {errors.departureDate && <div className="invalid-feedback">{errors.departureDate}</div>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="arrival" className="form-label">Arrival Location</label>
                                        <input
                                            type="text"
                                            id="arrival"
                                            name="arrival"
                                            className={`form-control ${errors.arrival ? 'is-invalid' : ''}`}
                                            value={tripData.arrival}
                                            onChange={handleChange}
                                        />
                                        {errors.arrival && <div className="invalid-feedback">{errors.arrival}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="arrivalDate" className="form-label">Arrival Date</label>
                                        <input
                                            type="datetime-local"
                                            id="arrivalDate"
                                            name="arrivalDate"
                                            className={`form-control ${errors.arrivalDate ? 'is-invalid' : ''}`}
                                            value={tripData.arrivalDate}
                                            onChange={handleChange}
                                        />
                                        {errors.arrivalDate && <div className="invalid-feedback">{errors.arrivalDate}</div>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="price" className="form-label">Price (€)</label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                            value={tripData.price}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="0"
                                        />
                                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="capacity" className="form-label">Maximum Capacity</label>
                                        <input
                                            type="number"
                                            id="capacity"
                                            name="capacity"
                                            className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
                                            value={tripData.capacity}
                                            onChange={handleChange}
                                            min="1"
                                        />
                                        {errors.capacity && <div className="invalid-feedback">{errors.capacity}</div>}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">Image URL</label>
                                    <input
                                        type="text"
                                        id="image"
                                        name="image"
                                        className="form-control"
                                        value={tripData.image || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="newOwner" className="form-label">Add an owner</label>
                                    <input
                                        type="text"
                                        id="newOwner"
                                        className="form-control"
                                        placeholder="Username"
                                        value={newOwner}
                                        onChange={(e) => setNewOwner(e.target.value)}
                                    />
                                    <small className="text-muted">Enter the username of the future co-owner</small>
                                </div>

                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate(`/trips/${id}`)}
                                    >
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn btn-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Owners</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                {tripData.owners && tripData.owners.map(owner => (
                                    <li key={owner} className="list-group-item">{owner}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTrip;