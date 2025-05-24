import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const destinations = [
    {
        title: "Bahamas",
        desc: "Paradisiacal beaches and turquoise waters for an unforgettable holiday.",
        price: "€450",
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Ibiza",
        desc: "Party, sun and relaxation on the liveliest island in the Mediterranean.",
        price: "€620",
        img: "https://images.unsplash.com/photo-1465156799763-2c087c332922?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Myconos",
        desc: "Greek charm, white houses and spectacular sunsets.",
        price: "€890",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

const Home = () => (
    <main>
        <section className="hero-section text-white position-relative mb-5" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 400
        }}>
            <div className="hero-overlay" style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.55)'
            }}></div>
            <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
                <div className="row align-items-center py-5">
                    <div className="col-lg-7">
                        <h1 className="display-2 fw-bold mb-3">Travel differently with <span className="text-primary">Business Airlines</span></h1>
                        <p className="lead fs-4 mb-4">Easily book your next adventures and enjoy unique experiences all over the world.</p>
                        <div className="d-flex gap-3">
                            <Link to="/trips/upcoming" className="btn btn-primary btn-lg px-4">Discover our trips</Link>
                            <Link to="/register" className="btn btn-outline-light btn-lg px-4">Create an account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="container mb-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold">Why choose Business Airlines?</h2>
                <p className="text-muted">A simple, fast and secure booking experience</p>
            </div>
            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body text-center p-4">
                            <div className="feature-icon bg-primary bg-gradient text-white rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ width: 56, height: 56, fontSize: 28, margin: "0 auto" }}>
                                <i className="bi bi-globe"></i>
                            </div>
                            <h5 className="card-title">Exclusive destinations</h5>
                            <p className="card-text">Selected places for unforgettable memories.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body text-center p-4">
                            <div className="feature-icon bg-primary bg-gradient text-white rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ width: 56, height: 56, fontSize: 28, margin: "0 auto" }}>
                                <i className="bi bi-star"></i>
                            </div>
                            <h5 className="card-title">Personalized service</h5>
                            <p className="card-text">Experts at your service for a tailor-made trip.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body text-center p-4">
                            <div className="feature-icon bg-primary bg-gradient text-white rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ width: 56, height: 56, fontSize: 28, margin: "0 auto" }}>
                                <i className="bi bi-shield-check"></i>
                            </div>
                            <h5 className="card-title">Guaranteed security</h5>
                            <p className="card-text">Book with confidence, 24/7 assistance.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-light py-5 mb-5">
            <div className="container">
                <h2 className="text-center fw-bold mb-5">Popular destinations</h2>
                <div className="row g-4">
                    {destinations.map(dest => (
                        <div className="col-md-4" key={dest.title}>
                            <div className="card destination-card border-0 shadow-sm h-100">
                                <div className="destination-img" style={{
                                    backgroundImage: `url('${dest.img}')`,
                                    height: 200,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8
                                }}></div>
                                <div className="card-body">
                                    <h5 className="card-title">{dest.title}</h5>
                                    <p className="card-text">{dest.desc}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-primary fw-bold">From {dest.price}</span>
                                        <Link to="/trips" className="btn btn-sm btn-outline-primary">See offers</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="container mb-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card border-0 shadow">
                        <div className="row g-0">
                            <div className="col-md-6 bg-primary text-white p-4 d-flex flex-column justify-content-center">
                                <div>
                                    <h3 className="fw-bold">Already a member?</h3>
                                    <p className="mb-4">Log in to manage your bookings and enjoy exclusive offers.</p>
                                    <Link to="/login" className="btn btn-light text-primary fw-bold px-4">Login</Link>
                                </div>
                            </div>
                            <div className="col-md-6 p-4 d-flex flex-column justify-content-center">
                                <div>
                                    <h3 className="fw-bold">New here?</h3>
                                    <p className="mb-4">Create your account and start planning your trips in just a few clicks.</p>
                                    <Link to="/register" className="btn btn-primary fw-bold px-4">Sign up</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
);

export default Home;