export default function RoommateFilter() {
  return (
    <div className="filter-section">
      <h3 className="filter-title">Find Your Perfect Match</h3>
      <form className="filter-form">
        <div className="form-row">
          <div className="form-group">
            <label>Language Preference</label>
            <select>
              <option>Any Language</option>
              <option>Telugu</option>
              <option>Tamil</option>
              <option>Hindi</option>
              <option>Gujarati</option>
              <option>Punjabi</option>
              <option>Bengali</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Dietary Preference</label>
            <select>
              <option>Any Diet</option>
              <option>Vegetarian</option>
              <option>Non-Vegetarian</option>
              <option>Mixed Diet</option>
              <option>Vegan</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Budget Range</label>
            <select>
              <option>Any Budget</option>
              <option>$800 - $1200</option>
              <option>$1200 - $1600</option>
              <option>$1600 - $2000</option>
              <option>$2000+</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <select>
              <option>Any Location</option>
              <option>Jersey City</option>
              <option>Sunnyvale</option>
              <option>Austin</option>
              <option>Dallas</option>
              <option>Chicago</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn">Apply Filters</button>
          <button type="button" className="btn btn-secondary">Clear All</button>
        </div>
      </form>
    </div>
  );
}
