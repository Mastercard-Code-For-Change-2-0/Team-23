import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from "react-router-dom";
import ThankYouCard from './ThankYouCard';

// Registration Form Modal Component
const RegistrationModal = ({ isOpen, onClose, event, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    phoneNumber: '',
    college: '',
    yearOfStudy: '',
    fieldOfStudy: '',
    otherFieldOfStudy: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    if (!formData.college.trim()) newErrors.college = 'College name is required';
    if (!formData.yearOfStudy) newErrors.yearOfStudy = 'Year of study is required';
    if (!formData.fieldOfStudy) newErrors.fieldOfStudy = 'Field of study is required';
    if (formData.fieldOfStudy === 'Other' && !formData.otherFieldOfStudy.trim()) {
      newErrors.otherFieldOfStudy = 'Please specify your field of study';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      phoneNumber: '',
      college: '',
      yearOfStudy: '',
      fieldOfStudy: '',
      otherFieldOfStudy: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Event Registration</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4 p-3 bg-pink-50 rounded-lg">
            <h4 className="font-semibold text-pink-700">{event?.Title}</h4>
            <p className="text-sm text-pink-600">
              {event?.StartDate && new Date(event.StartDate).toLocaleDateString()} - 
              {event?.EndDate && new Date(event.EndDate).toLocaleDateString()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                  errors.studentName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                disabled={loading}
              />
              {errors.studentName && (
                <p className="text-red-500 text-xs mt-1">{errors.studentName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                disabled={loading}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College/University *
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                  errors.college ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your college/university name"
                disabled={loading}
              />
              {errors.college && (
                <p className="text-red-500 text-xs mt-1">{errors.college}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year of Study *
              </label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                  errors.yearOfStudy ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Select year of study</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
              </select>
              {errors.yearOfStudy && (
                <p className="text-red-500 text-xs mt-1">{errors.yearOfStudy}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study *
              </label>
              <select
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                  errors.fieldOfStudy ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Select field of study</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="EnTC">Electronics & Telecommunications (EnTC)</option>
                <option value="Other">Other</option>
              </select>
              {errors.fieldOfStudy && (
                <p className="text-red-500 text-xs mt-1">{errors.fieldOfStudy}</p>
              )}
            </div>

            {formData.fieldOfStudy === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Please specify your field of study *
                </label>
                <input
                  type="text"
                  name="otherFieldOfStudy"
                  value={formData.otherFieldOfStudy}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                    errors.otherFieldOfStudy ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your field of study"
                  disabled={loading}
                />
                {errors.otherFieldOfStudy && (
                  <p className="text-red-500 text-xs mt-1">{errors.otherFieldOfStudy}</p>
                )}
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EventCard = ({ event, onApply, appliedEvents }) => {
  const isApplied = appliedEvents.includes(event._id);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{event.Title}</h3>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
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
<div className="flex justify-center gap-3">
        <button
          onClick={() => onApply(event)}
          disabled={isApplied}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            isApplied 
              ? 'bg-green-100 text-green-700 cursor-not-allowed' 
              : 'bg-pink-500 text-white hover:bg-pink-600'
          }`}
        >
         Interested
        </button>
        <button
          onClick={() => onApply(event)}
          disabled={isApplied}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            isApplied 
              ? 'bg-green-100 text-green-700 cursor-not-allowed' 
              : 'bg-pink-500 text-white hover:bg-pink-600'
          }`}
        >
          Apply For Event
        </button>
        </div>
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
  const [registrationModal, setRegistrationModal] = useState({
    isOpen: false,
    event: null,
    loading: false
  });
  const [thankYouCard, setThankYouCard] = useState({
    isOpen: false,
    applicantData: null,
    eventData: null
  });

  useEffect(() => {
    fetchEvents();
    // fetchAppliedEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/events');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // const fetchAppliedEvents = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3000/api/v1/events/applied');
  //     setAppliedEvents(response.data.appliedEvents || []);
  //   } catch (error) {
  //     console.error('Failed to fetch applied events:', error);
  //   }
  // };

  const handleApply = (event) => {
    setRegistrationModal({
      isOpen: true,
      event: event,
      loading: false
    });
  };

  const handleRegistrationSubmit = async (registrationData) => {
    setRegistrationModal(prev => ({ ...prev, loading: true }));
    
    try {
      await axios.post('http://localhost:3000/api/v1/events/apply', {
        eventId: registrationModal.event._id,
        ...registrationData
      });
      
      setAppliedEvents([...appliedEvents, registrationModal.event._id]);
      
      // Show thank you card instead of alert
      setThankYouCard({
        isOpen: true,
        applicantData: registrationData,
        eventData: registrationModal.event
      });
      
      // Close registration modal
      setRegistrationModal({ isOpen: false, event: null, loading: false });
    } catch (error) {
      console.error('Failed to apply for event:', error);
      alert(error.response?.data?.error || 'Failed to apply for event. Please try again.');
      setRegistrationModal(prev => ({ ...prev, loading: false }));
    }
  };

  const closeRegistrationModal = () => {
    setRegistrationModal({ isOpen: false, event: null, loading: false });
  };

  const closeThankYouCard = () => {
    setThankYouCard({
      isOpen: false,
      applicantData: null,
      eventData: null
    });
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
              
              {/* <button
                onClick={handleLogout}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Logout
              </button> */}
              <Link
            to="/login?type=admin"
            className="w-full sm:w-auto bg-purple-600 text-white px-8 py-4  font-semibold text-lg  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Admin Login
          </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Available Events</h2>
          <p className="text-gray-600">Discover and apply for events that interest you</p>
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

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={registrationModal.isOpen}
        event={registrationModal.event}
        onClose={closeRegistrationModal}
        onSubmit={handleRegistrationSubmit}
        loading={registrationModal.loading}
      />

      {/* Thank You Card */}
      <ThankYouCard
        isOpen={thankYouCard.isOpen}
        applicantData={thankYouCard.applicantData}
        eventData={thankYouCard.eventData}
        onClose={closeThankYouCard}
      />
    </div>
  );
};

export default UserDashboard;