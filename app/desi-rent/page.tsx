import RentListing from '../../components/RentListing';
import RoommateFilter from '../../components/RoommateFilter';

export default function DesiRentPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="page-hero">
          <h1 className="page-title">DesiRent Hub</h1>
          <p className="page-subtitle">Find your perfect Desi roommate and housing</p>
          <p className="page-description">
            Connect with like-minded Desis who share your cultural values, language preferences, 
            and lifestyle. Our platform makes it easy to find compatible roommates and housing options.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <RoommateFilter />

      {/* Listings Section */}
      <RentListing />

      {/* CTA Section */}
      <section className="cta-section">
        <div className="card">
          <h2>Ready to Find Your Perfect Match?</h2>
          <p>Join thousands of Desis who have found their ideal living situation through our platform.</p>
          <div className="cta-actions">
            <button className="btn">Create Your Profile</button>
            <button className="btn btn-secondary">Browse All Listings</button>
          </div>
        </div>
      </section>
    </div>
  );
}
