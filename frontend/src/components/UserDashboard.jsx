import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from "react-router-dom";
const EventCard = ({ event, onApply, appliedEvents }) => {
  const isApplied = appliedEvents.includes(event._id);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{event.Title}</h3>
          <span className="px-3 py-1 bg-pink-100 text-black text-sm font-medium">
            Event #{event.EventID}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{event.Description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Start: {new Date(event.StartDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            End: {new Date(event.EndDate).toLocaleDateString()}
          </div>
          {event.Location && (
            <div className="flex items-center text-sm text-gray-500">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.Location}
            </div>
          )}
        </div>
        
        <button
          onClick={() => onApply(event._id)}
          disabled={isApplied}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            isApplied 
              ? 'bg-green-100 text-green-700 cursor-not-allowed' 
              : 'bg-pink-500 text-white hover:bg-pink-600'
          }`}
        >
          {isApplied ? 'Applied ✓' : 'Apply for Event'}
        </button>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchAppliedEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // You'll need to create this endpoint
      const response = await axios.get('/events');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedEvents = async () => {
    try {
      // You'll need to create this endpoint
      const response = await axios.get('/events/applied');
      setAppliedEvents(response.data.appliedEvents || []);
    } catch (error) {
      console.error('Failed to fetch applied events:', error);
    }
  };

  const handleApply = async (eventId) => {
    try {
      // You'll need to create this endpoint
      await axios.post('/events/apply', { eventId });
      setAppliedEvents([...appliedEvents, eventId]);
      // Show success message
      alert('Successfully applied for the event!');
    } catch (error) {
      console.error('Failed to apply for event:', error);
      alert('Failed to apply for event. Please try again.');
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-pink-600">Katalyst Events</h1>
            </div>
            <div className="flex items-center space-x-4">
                    <Link
            to="/login?type=admin"
            className="w-full sm:w-auto bg-purple-600 text-white px-8 py-4   roundedfont-semibold text-lg  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Admin Login
          </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Discover events that interest you</h2>
          <p className="text-gray-600">Empower yourself to break barriers</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-12">
            <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Available</h3>
            <p className="text-gray-500">Check back later for new events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onApply={handleApply}
                appliedEvents={appliedEvents}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
