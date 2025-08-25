import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventsLandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Component mounted, fetching events...');
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events...');
      const response = await axios.get('http://localhost:3000/api/v1/events');
      console.log('Events response:', response.data);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Katalyst Events</h1>
              <p className="mt-2 text-gray-600">Empowering women through education and opportunity</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => window.location.href = '/admin'}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md font-medium transition duration-200"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our community of empowered women. Discover workshops, seminars, and networking events
            designed to help you grow personally and professionally.
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events available</h3>
            <p className="text-gray-500">Check back soon for upcoming events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-pink-100"
              >
                {/* Event Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white truncate">
                    {event.Title}
                  </h3>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.Description || 'No description available'}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-3">
                    {/* Date & Time */}
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="h-4 w-4 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">
                        {formatDate(event.StartDate)}
                      </span>
                      {event.StartDate !== event.EndDate && (
                        <span className="text-gray-400 mx-1"> - {formatDate(event.EndDate)}</span>
                      )}
                    </div>

                    {/* Time */}
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="h-4 w-4 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {formatTime(event.StartDate)} - {formatTime(event.EndDate)}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="h-4 w-4 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">
                        {event.Location || 'Location TBA'}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6">
                    <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105">
                      Register Interest
                    </button>
                  </div>
                </div>

                {/* Event Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Event ID: {event.EventID || event._id.slice(-4)}</span>
                    <span>Created: {formatDate(event.CreatedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Katalyst Student Outreach. Empowering women through education and opportunity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventsLandingPage;
