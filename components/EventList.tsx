const events = [
  { 
    id: 1, 
    name: 'Diwali Night', 
    location: 'Chicago', 
    date: '2025-11-10',
    time: '7:00 PM',
    description: 'Join us for a magical Diwali celebration with traditional food, music, and fireworks!',
    attendees: 150,
    price: 'Free'
  },
  { 
    id: 2, 
    name: 'Cricket League Finals', 
    location: 'Dallas', 
    date: '2025-12-05',
    time: '10:00 AM',
    description: 'Watch the championship match of our Desi cricket league with food trucks and entertainment.',
    attendees: 300,
    price: '$10'
  },
  {
    id: 3,
    name: 'Holi Festival',
    location: 'Austin',
    date: '2025-03-15',
    time: '2:00 PM',
    description: 'Celebrate the festival of colors with music, dance, and traditional Holi activities.',
    attendees: 200,
    price: '$15'
  }
];

export default function EventList() {
  return (
    <div className="events-section">
      <h2 className="section-title">Upcoming Events</h2>
      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3 className="event-name">{event.name}</h3>
              <div className="event-price">{event.price}</div>
            </div>
            <div className="event-details">
              <div className="event-location">📍 {event.location}</div>
              <div className="event-datetime">📅 {event.date} at {event.time}</div>
              <div className="event-attendees">👥 {event.attendees} attendees</div>
            </div>
            <p className="event-description">{event.description}</p>
            <button className="btn event-btn">Join Event</button>
          </div>
        ))}
      </div>
    </div>
  );
}
