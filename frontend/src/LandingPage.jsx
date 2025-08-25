import React from "react";
import "./LandingPage.css";
import katalystLogo from "./assets/katalyst.jpg";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <img src={katalystLogo} alt="Katalyst NGO" className="landing-logo" />
        <h1>Katalyst Student Outreach & Application Tracking</h1>
        <p className="landing-tagline">
          Empowering women through education and opportunity. Join us to track your application and become a part of the Katalyst community.
        </p>
      </header>
      <main className="landing-main">
        <div className="landing-actions">
          <a href="#admin-login" className="landing-btn admin-btn">Admin Login</a>
          <a href="#student-register" className="landing-btn student-btn">Student Registration</a>
        </div>
      </main>
    </div>
  );
}
