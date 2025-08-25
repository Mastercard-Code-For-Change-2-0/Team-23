

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig, backendConfig } from './config/backend.js';
import "./RegistrationPage.css";

export default function RegistrationPage() {
  const [registered, setRegistered] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: '',
    fieldOfStudy: '',
    eventId: '',
    eventTitle: '',
    password: '',
    confirmPassword: '',
    consent: false
  });
  const [errors, setErrors] = useState({});
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('katalyst_events') || '[]');
    setEvents(savedEvents);
    
    const eventId = searchParams.get('event');
    if (eventId) {
      const event = savedEvents.find(e => (e.uniqueId === eventId || e._id === eventId));
      if (event) {
        setFormData(prev => ({
          ...prev,
          eventId: event.uniqueId || event._id,
          eventTitle: event.title
        }));
      }
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.college.trim()) newErrors.college = 'College/University is required';
    }
    
    if (step === 2) {
      if (!formData.year) newErrors.year = 'Year of study is required';
      if (!formData.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Field of study is required';
      if (!formData.eventId) newErrors.eventId = 'Please select an event';
    }
    
    if (step === 3) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.consent) newErrors.consent = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        year: formData.year,
        field_of_study: formData.fieldOfStudy,
        event: formData.eventId,
      };

      let ok = false;
      try {
        const resp = await axios.post(`${backendConfig.baseURL}/api/v1/students/register`, payload, axiosConfig);
        if (resp.status === 201) {
          ok = true;
        }
      } catch (err) {
        console.error('Student registration API failed, falling back to local save.', err);
      }

      if (!ok) {
        const student = {
          id: Date.now().toString(),
          ...formData,
          registrationDate: new Date().toISOString(),
          status: 'registered',
          trackingId: `STU-${Date.now().toString(36).toUpperCase()}`
        };
        const existingLeads = JSON.parse(localStorage.getItem('katalyst_leads') || '[]');
        const updatedLeads = [...existingLeads, student];
        localStorage.setItem('katalyst_leads', JSON.stringify(updatedLeads));

        if (formData.eventId) {
          const updatedEvents = events.map(event => 
            (event.uniqueId === formData.eventId || event._id === formData.eventId)
              ? { ...event, registrations: (event.registrations || 0) + 1 }
              : event
          );
          localStorage.setItem('katalyst_events', JSON.stringify(updatedEvents));
        }
      }
      
      setRegistered(true);
    }
  };

  const getStepProgress = () => {
    return (currentStep / 3) * 100;
  };

  if (registered) {
    return (
      <div className="registration-success">
        <div className="success-content">
          <div className="success-icon">🎉</div>
          <h2>Registration Successful!</h2>
          <p>Welcome to the Katalyst community, <strong>{formData.name}</strong>!</p>
          
          <div className="registration-details">
            <h3>Your Registration Details</h3>
            <div className="detail-item">
              <span className="detail-label">Event:</span>
              <span className="detail-value">{formData.eventTitle}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value status-badge">Registered</span>
            </div>
          </div>
          
          <div className="next-steps">
            <h3>Next Steps</h3>
            <ul>
              <li>Check your email for confirmation and event details</li>
              <li>Save your tracking details for future reference</li>
              <li>Join our WhatsApp group for updates (link will be shared)</li>
              <li>Prepare for the event by reviewing materials</li>
            </ul>
          </div>
          
          <div className="success-actions">
            <button onClick={() => navigate('/events')} className="btn-secondary">
              View All Events
            </button>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Register for Another Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h2>Student Registration</h2>
        <p>Join Katalyst and unlock your potential in STEM</p>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getStepProgress()}%` }}></div>
        </div>
        <div className="progress-steps">
          <span className={`step ${currentStep >= 1 ? 'active' : ''}`}>Personal Info</span>
          <span className={`step ${currentStep >= 2 ? 'active' : ''}`}>Academic Details</span>
          <span className={`step ${currentStep >= 3 ? 'active' : ''}`}>Account Setup</span>
        </div>
      </div>

      <form className="registration-form" onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="form-step">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email address"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="college">College/University *</label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className={errors.college ? 'error' : ''}
                  placeholder="Enter your college/university name"
                />
                {errors.college && <span className="error-message">{errors.college}</span>}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <h3>Academic Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="year">Year of Study *</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className={errors.year ? 'error' : ''}
                >
                  <option value="">Select your year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Final Year">Final Year</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
                {errors.year && <span className="error-message">{errors.year}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="fieldOfStudy">Field of Study *</label>
                <input
                  type="text"
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  className={errors.fieldOfStudy ? 'error' : ''}
                  placeholder="e.g., Computer Science, Engineering, etc."
                />
                {errors.fieldOfStudy && <span className="error-message">{errors.fieldOfStudy}</span>}
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="eventId">Select Event *</label>
                <select
                  id="eventId"
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleInputChange}
                  className={errors.eventId ? 'error' : ''}
                >
                  <option value="">Choose an event to register for</option>
                  {events
                    .filter(event => event.status === 'active')
                    .map(event => (
                      <option key={event.id} value={event.uniqueId}>
                        {event.title} - {new Date(event.date).toLocaleDateString()} ({event.location})
                      </option>
                    ))
                  }
                </select>
                {errors.eventId && <span className="error-message">{errors.eventId}</span>}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            <h3>Account Setup</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="password">Create Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Create a strong password"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
              
              <div className="form-group full-width">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className={errors.consent ? 'error' : ''}
                  />
                  <label htmlFor="consent">
                    I agree to the <a href="#" className="terms-link">Terms and Conditions</a> and 
                    consent to receive communications from Katalyst regarding events and opportunities.
                  </label>
                </div>
                {errors.consent && <span className="error-message">{errors.consent}</span>}
              </div>
            </div>
          </div>
        )}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" className="btn-primary">
              Complete Registration
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
