import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig, backendConfig } from './config/backend.js';
import "./EventsList.css";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const resp = await axios.get(`${backendConfig.baseURL}/api/v1/admin/events`, axiosConfig);
        const items = resp.data?.events || [];
        // Map backend fields to frontend expectations
        const mapped = items.map((e) => ({
          id: e._id || e.id,
          uniqueId: e.uniqueId || e._id || '',
          title: e.Title || e.title || '',
          date: e.StartDate || e.date || new Date().toISOString(),
          description: e.Description || e.description || '',
          location: e.Location || e.location || '',
          eventType: e.eventType || 'workshop',
          maxCapacity: e.maxCapacity || 100,
          registrations: e.registrations || 0,
          status: e.status || 'active',
        }));
        setEvents(mapped);
      } catch (err) {
        console.error('Failed to fetch events from API, falling back to local data.', err);
        setError('Unable to load events from server. Showing any local data if available.');
        const saved = JSON.parse(localStorage.getItem('katalyst_events') || '[]');
        setEvents(saved);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventRegistration = (event) => {
    navigate(`/register?event=${event.uniqueId}`);
  };

  const getEventTypeIcon = (eventType) => {
    switch (eventType) {
      case 'bootcamp':
        return '🚀';
      case 'workshop':
        return '⚡';
      case 'webinar':
        return '💻';
      case 'conference':
        return '🎯';
      default:
        return '📚';
    }
  };

  const getEventTypeLabel = (eventType) => {
    switch (eventType) {
      case 'bootcamp':
        return 'Bootcamp';
      case 'workshop':
        return 'Workshop';
      case 'webinar':
        return 'Webinar';
      case 'conference':
        return 'Conference';
      default:
        return 'Event';
    }
  };

  const getRegistrationStatus = (event) => {
    if (event.registrations >= event.maxCapacity) {
      return { status: 'full', text: 'Fully Booked', color: '#dc3545' };
    } else if (event.registrations >= event.maxCapacity * 0.8) {
      return { status: 'limited', text: 'Limited Spots', color: '#ffc107' };
    } else {
      return { status: 'available', text: 'Available', color: '#28a745' };
    }
  };

  if (loading) {
    return (
      <div className="events-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-list-container">
      <div className="events-header">
        <h2 className="events-title">Upcoming Events</h2>
        <p className="events-subtitle">
          Join our empowering events designed specifically for women in STEM
        </p>
      </div>

      {error && (
        <div className="event-highlight">
          <p>⚠️ {error}</p>
        </div>
      )}

      {eventId && (
        <div className="event-highlight">
          <p>🎯 You're registering for a specific event. Complete your registration below!</p>
        </div>
      )}

      <div className="events-cards">
        {events
          .filter(event => event.status === 'active')
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((event) => {
            const registrationStatus = getRegistrationStatus(event);
            return (
              <div className="event-card" key={event.id}>
                <div className="event-header">
                  <div className="event-type-badge">
                    {getEventTypeIcon(event.eventType)} {getEventTypeLabel(event.eventType)}
                  </div>
                  <span className="event-id">{event.uniqueId}</span>
                </div>
                
                <h3 className="event-title">{event.title}</h3>
                
                <div className="event-meta">
                  <div className="event-date">
                    <span className="meta-icon">📅</span>
                    {new Date(event.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="event-location">
                    <span className="meta-icon">📍</span>
                    {event.location}
                  </div>
                </div>
                
                <p className="event-desc">{event.description}</p>
                
                <div className="event-stats">
                  <div className="stat-item">
                    <span className="stat-label">Capacity:</span>
                    <span className="stat-value">{event.maxCapacity} students</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Registered:</span>
                    <span className="stat-value">{event.registrations} students</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Status:</span>
                    <span 
                      className="stat-value status-indicator"
                      style={{ color: registrationStatus.color }}
                    >
                      {registrationStatus.text}
                    </span>
                  </div>
                </div>
                
                <div className="event-actions">
                  <button 
                    className={`event-register-btn ${registrationStatus.status === 'full' ? 'disabled' : ''}`}
                    onClick={() => handleEventRegistration(event)}
                    disabled={registrationStatus.status === 'full'}
                  >
                    {registrationStatus.status === 'full' ? 'Fully Booked' : 'Register Now'}
                  </button>
                  
                  {registrationStatus.status === 'limited' && (
                    <span className="limited-spots">⚠️ Limited spots remaining!</span>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {events.filter(event => event.status === 'active').length === 0 && (
        <div className="no-events">
          <div className="no-events-icon">📅</div>
          <h3>No Events Available</h3>
          <p>Check back soon for upcoming events and opportunities!</p>
        </div>
      )}
    </div>
  );
}
