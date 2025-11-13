import React from 'react';
import './HeroSection.css';
import Button from '../components/UI/Button';
import StatCard from '../components/UI/StatCard';

const HeroSection = () => {
    return (
        <section className="hero-section" id="hero-section">
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <p className="hero-label">Mobile Spa Excellence</p>
                <h1 className="hero-title">Find Your Serenity</h1>
                <p className="hero-subtitle">
                    Discover tranquility in the comfort of your home. Our expert therapists bring premium spa treatments directly to you.
                </p>
                <div className="hero-buttons">
                    <Button type="primary">Book Your Session</Button>
                    <Button type="secondary">Explore Services</Button>
                </div>
            </div>
            <div className="hero-stats-row">
                <StatCard value="500+" label="Happy Clients" />
                <StatCard value="4.9" label="Average Rating" />
                <StatCard value="10+" label="Years Experience" />
                <StatCard value="15+" label="Premium Services" />
            </div>
        </section>
    );
};

export default HeroSection;