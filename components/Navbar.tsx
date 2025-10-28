'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.navbar')) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <Image src="/logo.png" alt="DesiVerse Logo" width={80} height={80} className="logo" />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/desi-rent" className="nav-link">DesiRent Hub</a>
          <a href="/desi-circle" className="nav-link">DesiCircle</a>
        </nav>
        
        {/* Desktop Actions */}
        <div className="navbar-actions desktop-actions">
          <button className="btn btn-outline">Sign In</button>
          <button className="btn">Get Started</button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <nav className="mobile-nav">
          <a href="/" className="mobile-nav-link" onClick={closeMenu}>Home</a>
          <a href="/desi-rent" className="mobile-nav-link" onClick={closeMenu}>DesiRent Hub</a>
          <a href="/desi-circle" className="mobile-nav-link" onClick={closeMenu}>DesiCircle</a>
        </nav>
        <div className="mobile-actions">
          <button className="btn btn-outline mobile-btn" onClick={closeMenu}>Sign In</button>
          <button className="btn mobile-btn" onClick={closeMenu}>Get Started</button>
        </div>
      </div>
    </header>
  );
}
