'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, MoreVertical, User, Loader2, LogIn, UserPlus, RotateCcw, Image as ImageIcon, FileText, Mic, Smile, Paperclip } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentConversation, setCurrentConversation] = useState('Immigration Assistant');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Predefined conversations
  const conversations = {
    'Immigration Assistant': {
      title: 'Immigration Assistant',
      description: 'Visa help and guidance...',
      messages: [
        {
          id: '1',
          content: "Hello! I'm your Immigration Assistant. I can help you with visa applications, immigration processes, document requirements, and guide you through your journey to a new country. What would you like to know?",
          sender: 'assistant' as const,
          timestamp: new Date()
        }
      ]
    },
    'H1B Visa Application': {
      title: 'H1B Visa Application',
      description: 'Step-by-step guidance needed',
      messages: [
        {
          id: '1',
          content: "I can help you with your H1B visa application process. Let me guide you through the requirements, timeline, and steps needed to apply for an H1B visa.",
          sender: 'assistant' as const,
          timestamp: new Date()
        },
        {
          id: '2',
          content: "What specific aspect of the H1B process would you like help with? I can assist with:",
          sender: 'assistant' as const,
          timestamp: new Date()
        },
        {
          id: '3',
          content: "• Employer requirements and sponsorship\n• Educational qualifications\n• Labor Condition Application (LCA)\n• Form I-129 preparation\n• Documentation checklist\n• Timeline and deadlines",
          sender: 'assistant' as const,
          timestamp: new Date()
        }
      ]
    },
    'Green Card Process': {
      title: 'Green Card Process',
      description: 'Document requirements help',
      messages: [
        {
          id: '1',
          content: "I'll help you understand the Green Card process. There are several paths to permanent residency, each with different requirements and timelines.",
          sender: 'assistant' as const,
          timestamp: new Date()
        },
        {
          id: '2',
          content: "Which Green Card category are you interested in?",
          sender: 'assistant' as const,
          timestamp: new Date()
        },
        {
          id: '3',
          content: "• Employment-based (EB-1, EB-2, EB-3)\n• Family-based sponsorship\n• Diversity Visa Lottery\n• Asylum/Refugee status\n• Investment-based (EB-5)",
          sender: 'assistant' as const,
          timestamp: new Date()
        }
      ]
    }
  };

  const loadConversation = (conversationId: string) => {
    const conversation = conversations[conversationId as keyof typeof conversations];
    if (conversation) {
      setCurrentConversation(conversationId);
      setMessages(conversation.messages);
      setHasStarted(true);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Mark that conversation has started
    if (!hasStarted) {
      setHasStarted(true);
    }

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
        "I'd be happy to help you with your immigration journey! Let me guide you through the process step by step.",
        "Great question about immigration! I can help you understand the requirements and procedures.",
        "I can assist you with visa applications, document preparation, and immigration timelines.",
        "That's an important immigration matter. Let me provide you with accurate information and guidance.",
        "I understand you need help with immigration processes. Let me search for the most current information for you."
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Mark as started when user starts typing
    if (!hasStarted && e.target.value.trim()) {
      setHasStarted(true);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <div className="new-chat-btn">
            <Plus size={20} />
            <span>New Immigration Chat</span>
          </div>
          <button className="sidebar-menu-btn">
            <MoreVertical size={20} />
          </button>
        </div>
        
        <div className="conversation-history">
          <div 
            className={`conversation-item ${currentConversation === 'Immigration Assistant' ? 'active' : ''}`}
            onClick={() => loadConversation('Immigration Assistant')}
          >
            <div className="conversation-preview">
              <h4>Immigration Assistant</h4>
              <p>Visa help and guidance...</p>
            </div>
            <div className="conversation-time">Now</div>
          </div>
          
          <div 
            className={`conversation-item ${currentConversation === 'H1B Visa Application' ? 'active' : ''}`}
            onClick={() => loadConversation('H1B Visa Application')}
          >
            <div className="conversation-preview">
              <h4>H1B Visa Application</h4>
              <p>Step-by-step guidance needed</p>
            </div>
            <div className="conversation-time">2h ago</div>
          </div>
          
          <div 
            className={`conversation-item ${currentConversation === 'Green Card Process' ? 'active' : ''}`}
            onClick={() => loadConversation('Green Card Process')}
          >
            <div className="conversation-preview">
              <h4>Green Card Process</h4>
              <p>Document requirements help</p>
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
              <p>Immigration Seeker</p>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <div className="chat-title">
            <Image src="/logo.png" alt="DesiVerse Logo" width={32} height={32} className="chat-logo" />
            <h2>{currentConversation}</h2>
          </div>
          <div className="chat-actions">
            <button 
              className="action-btn" 
              title="Reset Welcome Animation"
              onClick={() => {
                localStorage.removeItem('desiverse-welcome-seen');
                window.location.reload();
              }}
            >
              <RotateCcw size={18} />
            </button>
            <Link href="/login" className="action-btn" title="Login">
              <LogIn size={18} />
            </Link>
            <Link href="/signup" className="action-btn" title="Signup">
              <UserPlus size={18} />
            </Link>
          </div>
        </div>

        <div className={`messages-container ${!hasStarted ? 'centered' : ''}`}>
          {!hasStarted ? (
            <div className="welcome-message">
              <div className="welcome-content">
                <Image src="/logo.png" alt="DesiVerse Logo" width={60} height={60} className="welcome-logo" />
                <h2 className="welcome-title">What help do you need?</h2>
                <p className="welcome-subtitle">Your AI immigration assistant for the Desi community</p>
                <div className="welcome-suggestions">
                  <button 
                    className="suggestion-btn"
                    onClick={() => {
                      setInputValue("Help me with H1B visa application process");
                      setHasStarted(true);
                    }}
                  >
                    H1B Visa Help
                  </button>
                  <button 
                    className="suggestion-btn"
                    onClick={() => {
                      setInputValue("What documents do I need for green card?");
                      setHasStarted(true);
                    }}
                  >
                    Green Card Documents
                  </button>
                  <button 
                    className="suggestion-btn"
                    onClick={() => {
                      setInputValue("Explain OPT and STEM extension process");
                      setHasStarted(true);
                    }}
                  >
                    OPT & STEM Extension
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.sender}`}>
                  <div className="message-avatar">
                    {message.sender === 'user' ? <User size={20} /> : <Image src="/logo.png" alt="DesiVerse Logo" width={20} height={20} className="rounded-full" />}
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
                    <Image src="/logo.png" alt="DesiVerse Logo" width={20} height={20} className="rounded-full" />
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
            </>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Always Visible Centered Input Box */}
        <div className="centered-input-container">
          <div className="centered-input-wrapper">
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about visas, immigration processes, or document requirements..."
              className="centered-chat-input"
              rows={1}
            />
            
            <button 
              onClick={handleSendMessage}
              className="centered-send-button"
              disabled={!inputValue.trim() || isTyping}
            >
              {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
          
          {/* Input Icons */}
          <div className="centered-input-icons">
            <button className="input-icon-btn" title="Upload Photo">
              <ImageIcon size={16} />
              <input type="file" accept="image/*" className="file-input" />
            </button>
            <button className="input-icon-btn" title="Upload Document">
              <FileText size={16} />
              <input type="file" accept=".pdf,.doc,.docx,.txt" className="file-input" />
            </button>
            <button className="input-icon-btn" title="Attach File">
              <Paperclip size={16} />
              <input type="file" className="file-input" />
            </button>
            <button className="input-icon-btn" title="Voice Message">
              <Mic size={16} />
            </button>
            <button className="input-icon-btn" title="Emoji">
              <Smile size={16} />
            </button>
          </div>
          
          <div className="centered-input-footer">
            <p>DesiVerse Immigration AI can make mistakes. Always verify important immigration information with official sources.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
