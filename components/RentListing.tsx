const listings = [
  { 
    id: 1, 
    title: '2BHK - Veg, Telugu', 
    location: 'Jersey City', 
    price: 1200,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1200,
    available: 'Available Now',
    preferences: ['Vegetarian', 'Telugu', 'Non-smoking'],
    description: 'Beautiful 2BHK apartment near PATH station. Perfect for working professionals.'
  },
  { 
    id: 2, 
    title: '1BHK - Tamil, Non-Veg', 
    location: 'Sunnyvale', 
    price: 1500,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 800,
    available: 'Available Dec 1',
    preferences: ['Non-Vegetarian', 'Tamil', 'Pet-friendly'],
    description: 'Cozy 1BHK in Silicon Valley. Close to major tech companies and public transport.'
  },
  {
    id: 3,
    title: '3BHK - Hindi, Mixed Diet',
    location: 'Austin',
    price: 1800,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1500,
    available: 'Available Now',
    preferences: ['Mixed Diet', 'Hindi', 'Furnished'],
    description: 'Spacious 3BHK house with modern amenities. Great for families or roommates.'
  }
];

export default function RentListing() {
  return (
    <div className="listings-section">
      <h2 className="section-title">Available Listings</h2>
      <div className="listings-grid">
        {listings.map(listing => (
          <div key={listing.id} className="listing-card">
            <div className="listing-header">
              <h3 className="listing-title">{listing.title}</h3>
              <div className="listing-price">${listing.price}<span>/mo</span></div>
            </div>
            <div className="listing-location">📍 {listing.location}</div>
            <div className="listing-details">
              <div className="detail-item">
                <span className="detail-label">Bedrooms:</span>
                <span className="detail-value">{listing.bedrooms}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Bathrooms:</span>
                <span className="detail-value">{listing.bathrooms}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sq Ft:</span>
                <span className="detail-value">{listing.sqft}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Available:</span>
                <span className="detail-value available-badge">{listing.available}</span>
              </div>
            </div>
            <p className="listing-description">{listing.description}</p>
            <div className="listing-preferences">
              {listing.preferences.map((pref, index) => (
                <span key={index} className="preference-tag">{pref}</span>
              ))}
            </div>
            <button className="btn listing-btn">Contact Roommate</button>
          </div>
        ))}
      </div>
    </div>
  );
}
