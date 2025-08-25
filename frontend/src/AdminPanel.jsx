import React, { useState, useEffect } from 'react';
import AdminAuth from './AdminAuth';
import './AdminPanel.css';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    description: '',
    location: '',
    maxCapacity: '',
    eventType: 'workshop'
  });

  useEffect(() => {
  
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    const savedEvents = JSON.parse(localStorage.getItem('katalyst_events') || '[]');
    const savedLeads = JSON.parse(localStorage.getItem('katalyst_leads') || '[]');
    setEvents(savedEvents);
    setLeads(savedLeads);
  }, []);

  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const event = {
      ...newEvent,
      id: Date.now().toString(),
      uniqueId: `KAT-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      registrations: 0
    };
    
    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    saveToStorage('katalyst_events', updatedEvents);
    
    setNewEvent({
      title: '',
      date: '',
      description: '',
      location: '',
      maxCapacity: '',
      eventType: 'workshop'
    });
  };

  const exportLeadsToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'College', 'Year', 'Field of Study', 'Event', 'Registration Date', 'Status'],
      ...leads.map(lead => [
        lead.name,
        lead.email,
        lead.phone,
        lead.college,
        lead.year,
        lead.fieldOfStudy,
        lead.eventTitle,
        new Date(lead.registrationDate).toLocaleDateString(),
        lead.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `katalyst_leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getConversionStats = () => {
    const total = leads.length;
    const registered = leads.filter(lead => lead.status === 'registered').length;
    const started = leads.filter(lead => lead.status === 'started').length;
    const completed = leads.filter(lead => lead.status === 'completed').length;
    
    return { total, registered, started, completed };
  };

  const stats = getConversionStats();

  if (!isAuthenticated) {
    return <AdminAuth onLogin={setIsAuthenticated} />;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Katalyst Admin Dashboard</h1>
        <p>Manage events, track leads, and monitor student engagement</p>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          Lead Tracking
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            <div className="stat-card">
              <h3>Total Events</h3>
              <p className="stat-number">{events.length}</p>
            </div>
            <div className="stat-card">
              <h3>Total Leads</h3>
              <p className="stat-number">{stats.total}</p>
            </div>
            <div className="stat-card">
              <h3>Active Registrations</h3>
              <p className="stat-number">{stats.registered}</p>
            </div>
            <div className="stat-card">
              <h3>Applications Started</h3>
              <p className="stat-number">{stats.started}</p>
            </div>
            <div className="stat-card">
              <h3>Applications Completed</h3>
              <p className="stat-number">{stats.completed}</p>
            </div>
            <div className="stat-card">
              <h3>Conversion Rate</h3>
              <p className="stat-number">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </p>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-management">
            <div className="create-event-section">
              <h3>Create New Event</h3>
              <form onSubmit={handleCreateEvent} className="event-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Event Title</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Event Date</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Capacity</label>
                    <input
                      type="number"
                      value={newEvent.maxCapacity}
                      onChange={(e) => setNewEvent({...newEvent, maxCapacity: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Event Type</label>
                  <select
                    value={newEvent.eventType}
                    onChange={(e) => setNewEvent({...newEvent, eventType: e.target.value})}
                  >
                    <option value="workshop">Workshop</option>
                    <option value="bootcamp">Bootcamp</option>
                    <option value="webinar">Webinar</option>
                    <option value="conference">Conference</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    required
                    rows="3"
                  />
                </div>
                <button type="submit" className="create-event-btn">Create Event</button>
              </form>
            </div>

            <div className="events-list-section">
              <h3>Active Events</h3>
              <div className="events-grid">
                {events.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="event-header">
                      <h4>{event.title}</h4>
                      <span className="event-id">{event.uniqueId}</span>
                    </div>
                    <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                    <p className="event-location">{event.location}</p>
                    <p className="event-description">{event.description}</p>
                    <div className="event-stats">
                      <span>Registrations: {event.registrations}</span>
                      <span>Capacity: {event.maxCapacity}</span>
                    </div>
                    <div className="event-actions">
                      <button className="share-link-btn" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/register?event=${event.uniqueId}`)}>
                        Copy Link
                      </button>
                      <button className="view-leads-btn">View Leads</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="leads-tracking">
            <div className="leads-header">
              <h3>Lead Management</h3>
              <button onClick={exportLeadsToCSV} className="export-btn">
                Export to CSV
              </button>
            </div>
            <div className="leads-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>College</th>
                    <th>Event</th>
                    <th>Status</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id}>
                      <td>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.college}</td>
                      <td>{lead.eventTitle}</td>
                      <td>
                        <span className={`status-badge ${lead.status}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>{new Date(lead.registrationDate).toLocaleDateString()}</td>
                      <td>
                        <select 
                          value={lead.status}
                          onChange={(e) => {
                            const updatedLeads = leads.map(l => 
                              l.id === lead.id ? {...l, status: e.target.value} : l
                            );
                            setLeads(updatedLeads);
                            saveToStorage('katalyst_leads', updatedLeads);
                          }}
                        >
                          <option value="registered">Registered</option>
                          <option value="started">Started</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h3>Conversion Funnel Analytics</h3>
            <div className="funnel-chart">
              <div className="funnel-stage">
                <div className="stage-label">Total Leads</div>
                <div className="stage-number">{stats.total}</div>
                <div className="stage-bar" style={{width: '100%'}}></div>
              </div>
              <div className="funnel-stage">
                <div className="stage-label">Registered</div>
                <div className="stage-number">{stats.registered}</div>
                <div className="stage-bar" style={{width: `${(stats.registered/stats.total)*100}%`}}></div>
              </div>
              <div className="funnel-stage">
                <div className="stage-label">Started Application</div>
                <div className="stage-number">{stats.started}</div>
                <div className="stage-bar" style={{width: `${(stats.started/stats.total)*100}%`}}></div>
              </div>
              <div className="funnel-stage">
                <div className="stage-label">Completed</div>
                <div className="stage-number">{stats.completed}</div>
                <div className="stage-bar" style={{width: `${(stats.completed/stats.total)*100}%`}}></div>
              </div>
            </div>
            
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>Event Performance</h4>
                {events.map(event => (
                  <div key={event.id} className="event-performance">
                    <span>{event.title}</span>
                    <span>{event.registrations}/{event.maxCapacity}</span>
                  </div>
                ))}
              </div>
              
              <div className="analytics-card">
                <h4>Top Performing Events</h4>
                {events
                  .sort((a, b) => b.registrations - a.registrations)
                  .slice(0, 3)
                  .map(event => (
                    <div key={event.id} className="top-event">
                      <span>{event.title}</span>
                      <span>{Math.round((event.registrations/event.maxCapacity)*100)}%</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
