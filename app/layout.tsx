import React from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-brand">
                <Image src="/logo.png" alt="DesiVerse Logo" width={50} height={50} className="footer-logo" />
                <p className="footer-description">
                  Connecting Desis worldwide through community, housing, and cultural events.
                </p>
                <div className="social-links">
                  <a href="#" className="social-link">📘</a>
                  <a href="#" className="social-link">📷</a>
                  <a href="#" className="social-link">🐦</a>
                  <a href="#" className="social-link">💼</a>
                </div>
              </div>
              
              <div className="footer-links">
                <div className="footer-column">
                  <h4>Platform</h4>
                  <ul>
                    <li><a href="/desi-rent">DesiRent Hub</a></li>
                    <li><a href="/desi-circle">DesiCircle</a></li>
                    <li><a href="#">How it Works</a></li>
                    <li><a href="#">Success Stories</a></li>
                  </ul>
                </div>
                
                <div className="footer-column">
                  <h4>Community</h4>
                  <ul>
                    <li><a href="#">Events</a></li>
                    <li><a href="#">Groups</a></li>
                    <li><a href="#">Forums</a></li>
                    <li><a href="#">Blog</a></li>
                  </ul>
                </div>
                
                <div className="footer-column">
                  <h4>Support</h4>
                  <ul>
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Safety</a></li>
                    <li><a href="#">Report Issue</a></li>
                  </ul>
                </div>
                
                <div className="footer-column">
                  <h4>Company</h4>
                  <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Press</a></li>
                    <li><a href="#">Partners</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="footer-bottom">
              <div className="footer-bottom-content">
                <p>&copy; 2024 DesiVerse. All rights reserved.</p>
                <div className="footer-legal">
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms of Service</a>
                  <a href="#">Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
