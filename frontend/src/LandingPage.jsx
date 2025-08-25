import React from "react";
import { Link } from 'react-router-dom';
import "./LandingPage.css";

import katalystLogo from './assets/katalyst.jpg';
import EventsList from './EventsList';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <img src={katalystLogo} alt="Katalyst NGO" className="landing-logo" />
        <h1>Katalyst Student Outreach & Application Tracking</h1>
        <p className="landing-tagline">
          Empowering women through education and opportunity. Join us and become a part of the Katalyst community.
        </p>
      </header>
      <section className="hero-section">
        <h2 className="hero-title">Unlock Your Potential</h2>
        <p className="hero-desc">Katalyst helps women students achieve their dreams with mentorship, resources, and a supportive community. Track your application and start your journey today!</p>
      </section>
          <main className="landing-main">
        <div className="landing-actions">
          <a href="#admin-login" className="landing-btn admin-btn">Admin Login</a>
          <Link to="/register" className="landing-btn student-btn">Student Registration</Link>
        </div>
      </main>

      {/* Events section */}
      <section className="events-section">
        <EventsList />
      </section>

      <section className="testimonials-section">
        <h3 className="testimonials-title">What Our Students Say</h3>
        <div className="testimonials-list">
          <div className="testimonial">
            <p>"Katalyst gave me the confidence and support to pursue my goals!"</p>
            <span>- Priya, Student</span>
          </div>
          <div className="testimonial">
            <p>"The mentorship and resources are amazing. I highly recommend Katalyst!"</p>
            <span>- Anjali, Alumna</span>
          </div>
        </div>
      </section>
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Katalyst NGO | Empowering Women in India</p>
      </footer>
    </div>
  );
}
