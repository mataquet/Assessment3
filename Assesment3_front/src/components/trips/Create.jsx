import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../../services/tripService';

const Create = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [tripData, setTripData] = useState({
        name: '',
        description: '',
        departure: '',
        departureDate: '',
        arrival: '',
        arrivalDate: '',
        price: 0,
        capacity: 1,
        image: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!tripData.name) newErrors.name = "Trip name is required";
        if (!tripData.description) newErrors.description = "Description is required";
        if (!tripData.departure) newErrors.departure = "Departure location is required";
        if (!tripData.departureDate) newErrors.departureDate = "Departure date is required";
        if (!tripData.arrival) newErrors.arrival = "Arrival location is required";
        if (!tripData.arrivalDate) newErrors.arrivalDate = "Arrival date is required";

        // Vérification que la date de départ est antérieure à la date d'arrivée
        if (tripData.departureDate && tripData.arrivalDate) {
            const deptDate = new Date(tripData.departureDate);
            const arrDate = new Date(tripData.arrivalDate);
            if (deptDate >= arrDate) {
                newErrors.arrivalDate = "Arrival date must be after departure date";
            }
        }

        if (tripData.price <= 0) newErrors.price = "Price must be greater than 0";
        if (tripData.capacity < 1) newErrors.capacity = "Capacity must be at least 1 person";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await createTrip(tripData);
            navigate('/hub'); // Redirection vers le tableau de bord après création
        } catch (error) {
            console.error("Error creating trip:", error);
            setErrors({ form: "An error occurred while creating the trip" });
        }
    };

    return (
        <div className="container">
            <h2 className="mb-4">Create Trip</h2>

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
                                        className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                        value={tripData.image}
                                        onChange={handleChange}
                                    />
                                    {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                                    <small className="form-text text-muted">Enter the URL of an image representing your trip</small>
                                </div>

                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate('/hub')}
                                    >
                                        Back to list
                                    </button>
                                    <button type="submit" className="btn btn-primary">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Information</h5>
                        </div>
                        <div className="card-body">
                            <p>Complete this form to create a new trip.</p>
                            <p>All fields are mandatory except for the image URL.</p>
                            <p>The departure date must be before the arrival date.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;