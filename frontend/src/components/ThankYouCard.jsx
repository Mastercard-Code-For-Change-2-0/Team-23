import React from 'react';

const ThankYouCard = ({ isOpen, onClose, applicantData, eventData }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="relative">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-8 rounded-t-xl">
            <div className="text-center">
              <div className="mb-4">
                <svg className="h-16 w-16 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2">Application Submitted!</h2>
              <p className="text-green-100 text-lg">
                Thank you for registering. We'll be in touch soon!
              </p>
            </div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-8">
            {/* Applicant Details Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="h-6 w-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Your Details
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                      <p className="text-lg text-gray-800 font-medium">{applicantData.studentName}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Phone Number</label>
                      <p className="text-lg text-gray-800">{applicantData.phoneNumber}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">College/University</label>
                      <p className="text-lg text-gray-800">{applicantData.college}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Year of Study</label>
                      <p className="text-lg text-gray-800">{applicantData.yearOfStudy}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Field of Study</label>
                      <p className="text-lg text-gray-800">
                        {applicantData.fieldOfStudy === 'Other' 
                          ? applicantData.otherFieldOfStudy 
                          : applicantData.fieldOfStudy}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Application Date</label>
                      <p className="text-lg text-gray-800">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="h-6 w-6 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Event Information
              </h3>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Event Name</label>
                    <p className="text-xl text-gray-800 font-bold">{eventData.Title}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
                    <p className="text-gray-700 leading-relaxed">{eventData.Description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Event Date</label>
                      <p className="text-lg text-gray-800">{formatDate(eventData.StartDate)}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Event Time</label>
                      <p className="text-lg text-gray-800">
                        {formatTime(eventData.StartDate)} - {formatTime(eventData.EndDate)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Location</label>
                      <p className="text-lg text-gray-800 flex items-center">
                        <svg className="h-4 w-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {eventData.Location}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Event ID</label>
                      <p className="text-lg text-gray-800 font-mono">#{eventData.EventID || eventData._id?.slice(-4)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Section */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What's Next?
              </h3>
              <div className="space-y-2 text-blue-700">
                <p className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  You will receive a confirmation email within 24 hours
                </p>
                <p className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Event details and joining instructions will be shared before the event
                </p>
                <p className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Application Form link - https://localhost:5173/864723tvgy7
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
              >
                Continue Exploring Events
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouCard;
