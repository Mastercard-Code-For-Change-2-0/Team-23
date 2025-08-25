import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackApplication = () => {
    if (!trackingId.trim()) {
      setError('Please enter your tracking ID');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const leads = JSON.parse(localStorage.getItem('katalyst_leads') || '[]');
      const foundStudent = leads.find(lead => lead.trackingId === trackingId);
      
      if (foundStudent) {
        setStudent(foundStudent);
      } else {
        setError('No application found with this tracking ID. Please check and try again.');
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'registered':
        return '#28a745';
      case 'started':
        return '#ffc107';
      case 'completed':
        return '#17a2b8';
      case 'rejected':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'registered':
        return '✅';
      case 'started':
        return '🔄';
      case 'completed':
        return '🎉';
      case 'rejected':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>🎓 Student Application Tracker</h1>
          <p>Track your Katalyst application status and stay updated on your journey</p>
        </div>

        {!student ? (
          <div className="tracking-section">
            <div className="tracking-card">
              <h3>Track Your Application</h3>
              <p>Enter your tracking ID to view your application status and event details</p>
              
              <div className="tracking-form">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter your tracking ID (e.g., STU-ABC123)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className={error ? 'error' : ''}
                  />
                  <button 
                    onClick={handleTrackApplication}
                    disabled={loading}
                    className="track-btn"
                  >
                    {loading ? '🔍 Searching...' : '🔍 Track Application'}
                  </button>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="tracking-info">
                  <p><strong>Don't have a tracking ID?</strong></p>
                  <p>Your tracking ID was provided when you registered for an event. Check your email or contact support if you need help.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="application-details">
            <div className="welcome-section">
              <h2>Welcome back, {student.name}! 👋</h2>
              <p>Here's the latest update on your Katalyst application</p>
            </div>

            <div className="status-overview">
              <div className="status-card">
                <div className="status-icon" style={{ color: getStatusColor(student.status) }}>
                  {getStatusIcon(student.status)}
                </div>
                <div className="status-info">
                  <h3>Application Status</h3>
                  <p className="status-text" style={{ color: getStatusColor(student.status) }}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-card">
                <h4>📋 Personal Information</h4>
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{student.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{student.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{student.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">College:</span>
                  <span className="detail-value">{student.college}</span>
                </div>
              </div>

              <div className="detail-card">
                <h4>🎓 Academic Details</h4>
                <div className="detail-item">
                  <span className="detail-label">Year of Study:</span>
                  <span className="detail-value">{student.year}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Field of Study:</span>
                  <span className="detail-value">{student.fieldOfStudy}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Registration Date:</span>
                  <span className="detail-value">
                    {new Date(student.registrationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="detail-card">
                <h4>📅 Event Information</h4>
                <div className="detail-item">
                  <span className="detail-label">Event:</span>
                  <span className="detail-value">{student.eventTitle}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tracking ID:</span>
                  <span className="detail-value tracking-id">{student.trackingId}</span>
                </div>
              </div>
            </div>

            <div className="next-steps-section">
              <h3>📋 Next Steps</h3>
              {student.status === 'registered' && (
                <div className="steps-list">
                  <div className="step-item">
                    <span className="step-number">1</span>
                    <div className="step-content">
                      <h4>Complete Application</h4>
                      <p>Fill out the detailed application form for your selected event</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <span className="step-number">2</span>
                    <div className="step-content">
                      <h4>Submit Documents</h4>
                      <p>Upload required documents and certificates</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <span className="step-number">3</span>
                    <div className="step-content">
                      <h4>Wait for Review</h4>
                      <p>Our team will review your application and get back to you</p>
                    </div>
                  </div>
                </div>
              )}

              {student.status === 'started' && (
                <div className="steps-list">
                  <div className="step-item completed">
                    <span className="step-number">✓</span>
                    <div className="step-content">
                      <h4>Application Started</h4>
                      <p>Great! You've begun your application process</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <span className="step-number">2</span>
                    <div className="step-content">
                      <h4>Complete Remaining Sections</h4>
                      <p>Finish all required sections of your application</p>
                    </div>
                  </div>
                </div>
              )}

              {student.status === 'completed' && (
                <div className="steps-list">
                  <div className="step-item completed">
                    <span className="step-number">✓</span>
                    <div className="step-content">
                      <h4>Application Completed</h4>
                      <p>Congratulations! Your application is complete</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <span className="step-number">📧</span>
                    <div className="step-content">
                      <h4>Check Your Email</h4>
                      <p>You'll receive confirmation and next steps via email</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button 
                onClick={() => {
                  setStudent(null);
                  setTrackingId('');
                  setError('');
                }}
                className="btn-secondary"
              >
                Track Another Application
              </button>
              <button className="btn-primary">
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
