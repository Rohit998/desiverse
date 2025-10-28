'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, MoreVertical, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your DesiVerse AI assistant. I can help you find roommates, discover events, and connect with the Desi community. What would you like to know?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'd be happy to help you find a roommate! What's your preferred location and budget?",
        "Great question! Let me show you some upcoming Desi events in your area.",
        "I can help you connect with other Desis who share your interests and cultural background.",
        "That's a wonderful idea! The Desi community is very welcoming and supportive.",
        "I understand you're looking for housing. Let me search for some options that match your criteria."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <div className="new-chat-btn">
            <Plus size={20} />
            <span>New Chat</span>
          </div>
          <button className="sidebar-menu-btn">
            <MoreVertical size={20} />
          </button>
        </div>
        
        <div className="conversation-history">
          <div className="conversation-item active">
            <div className="conversation-preview">
              <h4>DesiVerse Assistant</h4>
              <p>Find roommates and events...</p>
            </div>
            <div className="conversation-time">Now</div>
          </div>
          
          <div className="conversation-item">
            <div className="conversation-preview">
              <h4>Housing Search</h4>
              <p>Looking for 2BHK in Jersey City</p>
            </div>
            <div className="conversation-time">2h ago</div>
          </div>
          
          <div className="conversation-item">
            <div className="conversation-preview">
              <h4>Event Planning</h4>
              <p>Diwali celebration ideas</p>
            </div>
            <div className="conversation-time">Yesterday</div>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <h4>Rohit</h4>
              <p>Desi Community Member</p>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <div className="chat-title">
            <Bot size={24} />
            <h2>DesiVerse Assistant</h2>
          </div>
          <div className="chat-actions">
            <button className="action-btn">Share</button>
            <button className="action-btn">Export</button>
          </div>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-avatar">
                {message.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="message-content">
                <div className="message-text">
                  {message.content}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message assistant">
              <div className="message-avatar">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about housing, events, or community connections..."
              className="chat-input"
              rows={1}
            />
            <button 
              onClick={handleSendMessage}
              className="send-button"
              disabled={!inputValue.trim()}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="input-footer">
            <p>DesiVerse AI can make mistakes. Consider checking important information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
