import React from "react";
import "./EventsList.css";

const events = [
  {
    id: 1,
    title: "STEM Bootcamp",
    date: "2025-09-10",
    description: "A 3-day immersive bootcamp for women in STEM. Learn, network, and grow!",
    location: "Mumbai, India",
  },
  {
    id: 2,
    title: "Leadership Workshop",
    date: "2025-10-05",
    description: "Develop leadership skills with top mentors and industry leaders.",
    location: "Delhi, India",
  },
  {
    id: 3,
    title: "Career Guidance Webinar",
    date: "2025-09-20",
    description: "Online session on career planning and opportunities for women students.",
    location: "Online",
  },
];

export default function EventsList() {
  return (
    <div className="events-list-container">
      <h2 className="events-title">Upcoming Events</h2>
      <div className="events-cards">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <h3>{event.title}</h3>
            <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
            <p className="event-desc">{event.description}</p>
            <p className="event-location">{event.location}</p>
            <button className="event-register-btn">Register</button>
          </div>
        ))}
      </div>
    </div>
  );
}
