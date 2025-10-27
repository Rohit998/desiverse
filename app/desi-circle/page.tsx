import EventList from '../../components/EventList';

export default function DesiCirclePage() {
  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="page-hero">
          <h1 className="page-title">DesiCircle</h1>
          <p className="page-subtitle">Connect with your community through events</p>
          <p className="page-description">
            Discover cultural celebrations, networking opportunities, and social gatherings. 
            Join our vibrant Desi community and create lasting connections through shared experiences.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <EventList />

      {/* CTA Section */}
      <section className="cta-section">
        <div className="card">
          <h2>Want to Host Your Own Event?</h2>
          <p>Share your culture and bring the community together by organizing your own Desi event.</p>
          <div className="cta-actions">
            <button className="btn">Create Event</button>
            <button className="btn btn-secondary">Join Community</button>
          </div>
        </div>
      </section>
    </div>
  );
}
