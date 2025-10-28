'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export default function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [currentText, setCurrentText] = useState('');
  const [showLogo, setShowLogo] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const welcomeText = "Welcome to DesiVerse";
  const subtitleText = "Connecting Desis Worldwide";

  useEffect(() => {
    // Show logo first
    setTimeout(() => setShowLogo(true), 300);
    
    // Start typing animation
    setTimeout(() => {
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < welcomeText.length) {
          setCurrentText(welcomeText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          // Show subtitle after typing is complete
          setTimeout(() => setShowSubtitle(true), 500);
          // Complete animation
          setTimeout(() => {
            setAnimationComplete(true);
            setTimeout(() => onComplete(), 1000);
          }, 2000);
        }
      }, 100);
    }, 1000);
  }, [onComplete]);

  return (
    <div className="welcome-animation">
      <div className="welcome-container">
        {/* Animated Background */}
        <div className="welcome-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>


        {/* Logo Animation */}
        <div className={`logo-container ${showLogo ? 'animate-in' : ''}`}>
          <div className="logo-wrapper">
            <Image 
              src="/logo.png" 
              alt="DesiVerse Logo" 
              width={120} 
              height={120} 
              className="welcome-logo"
            />
            <div className="logo-glow"></div>
          </div>
        </div>

        {/* Text Animation */}
        <div className="text-container">
          <h1 className={`welcome-title ${currentText === welcomeText ? 'typing-complete' : ''}`}>
            {currentText}
            <span className="cursor">|</span>
          </h1>
          
          <p className={`welcome-subtitle ${showSubtitle ? 'fade-in' : ''}`}>
            {subtitleText}
          </p>
        </div>

        {/* Loading Bar */}
        <div className={`loading-container ${showSubtitle ? 'fade-in' : ''}`}>
          <div className="loading-bar">
            <div className={`loading-progress ${animationComplete ? 'complete' : ''}`}></div>
          </div>
        </div>
      </div>

    </div>
  );
}
