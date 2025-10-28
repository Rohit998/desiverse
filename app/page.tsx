'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import WelcomeAnimation from '../components/WelcomeAnimation';

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setShowChat(true);
  };

  // Check if user has seen welcome before (using localStorage)
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('desiverse-welcome-seen');
    if (hasSeenWelcome) {
      setShowWelcome(false);
      setShowChat(true);
    }
  }, []);

  const handleWelcomeFinish = () => {
    localStorage.setItem('desiverse-welcome-seen', 'true');
    handleWelcomeComplete();
  };

  return (
    <>
      {showWelcome && <WelcomeAnimation onComplete={handleWelcomeFinish} />}
      {showChat && <ChatInterface />}
    </>
  );
}
