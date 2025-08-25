

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./RegistrationPage.css";

export default function RegistrationPage() {
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setRegistered(true);

    navigate('/');
  };

  return (
    <div className="registration-container">
      <h2>Student Registration</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Phone:
          <input type="tel" name="phone" required />
        </label>
        <label>
          College/University:
          <input type="text" name="college" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit" className="register-btn">Register</button>
      </form>
    </div>
  );
}
