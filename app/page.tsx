export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to DesiVerse</h1>
          <p className="hero-subtitle">Your gateway to Desi community connections</p>
          <p className="hero-description">
            Connect with fellow Desis, find your perfect roommate, and discover amazing community events. 
            Join thousands of Desis building meaningful connections across the diaspora.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2 className="section-title">Explore Our Services</h2>
        <div className="grid grid-2">
          <div className="card service-card">
            <div className="service-icon">🏠</div>
            <h3>DesiRent Hub</h3>
            <p>Find your perfect Desi roommate and housing. Connect with like-minded individuals who share your cultural values and lifestyle preferences.</p>
            <ul className="service-features">
              <li>✓ Language-based matching</li>
              <li>✓ Dietary preference filters</li>
              <li>✓ Location-based search</li>
              <li>✓ Verified profiles</li>
            </ul>
            <a href="/desi-rent" className="btn">Browse Rentals</a>
          </div>
          
          <div className="card service-card">
            <div className="service-icon">🎉</div>
            <h3>DesiCircle</h3>
            <p>Connect with your community through events. Discover cultural celebrations, networking opportunities, and social gatherings.</p>
            <ul className="service-features">
              <li>✓ Cultural events</li>
              <li>✓ Networking meetups</li>
              <li>✓ Sports leagues</li>
              <li>✓ Festival celebrations</li>
            </ul>
            <a href="/desi-circle" className="btn btn-secondary">View Events</a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="card">
          <h2 className="section-title">Join Our Growing Community</h2>
          <div className="grid grid-3">
            <div className="stat-item">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Active Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Events Hosted</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
