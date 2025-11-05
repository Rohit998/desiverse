'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Menu, User, Loader2, LogIn, Settings, HelpCircle, Paperclip, MessageSquare, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Function to format markdown text with headings and bold text
const formatMessageText = (text: string) => {
  // Split by lines to process headings separately
  const lines = text.split('\n');
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for headings first (they should be at start of line)
    if (/^##\s+/.test(line)) {
      // ## Heading (h2) - block element, no <br> needed
      processedLines.push(line.replace(/^##\s+(.+)$/, '<h2 class="ai-heading">$1</h2>'));
    } else if (/^###\s+/.test(line)) {
      // ### Subheading (h3) - block element, no <br> needed
      processedLines.push(line.replace(/^###\s+(.+)$/, '<h3 class="ai-subheading">$1</h3>'));
    } else if (/^####\s+/.test(line)) {
      // #### Sub-subheading (h4) - block element, no <br> needed
      processedLines.push(line.replace(/^####\s+(.+)$/, '<h4 class="ai-sub-subheading">$1</h4>'));
    } else if (/^\*\s+/.test(line)) {
      // * Bullet point - convert to styled bullet
      const bulletText = line.replace(/^\*\s+(.+)$/, '$1');
      // Convert bold text in bullet
      const processedBullet = bulletText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      processedLines.push(`<div class="ai-bullet-item">${processedBullet}</div>`);
    } else if (/^-\s+/.test(line)) {
      // - Bullet point (alternative format) - convert to styled bullet
      const bulletText = line.replace(/^-\s+(.+)$/, '$1');
      // Convert bold text in bullet
      const processedBullet = bulletText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      processedLines.push(`<div class="ai-bullet-item">${processedBullet}</div>`);
    } else if (line.trim() === '') {
      // Empty line - add a line break
      processedLines.push('<br>');
    } else {
      // Regular line - convert bold text **text** to <strong>
      const processedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      processedLines.push(processedLine);
      // Add <br> after regular lines (except before headings and bullets)
      if (i < lines.length - 1 && !/^#{2,4}\s+/.test(lines[i + 1]) && !/^[\*\-]\s+/.test(lines[i + 1])) {
        processedLines.push('<br>');
      }
    }
  }
  
  return processedLines.join('');
};

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle mobile sidebar - close on outside click
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarOpen) {
        const target = e.target as HTMLElement;
        const sidebar = document.querySelector('.chatgpt-sidebar');
        const backdrop = document.querySelector('.sidebar-backdrop');
        if (sidebar && !sidebar.contains(target) && target !== backdrop) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen, isMobile]);

  // Cleanup streaming interval on unmount
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const typeMessage = (messageId: string, fullText: string) => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
    }

    let currentIndex = 0;
    const maxLength = fullText.length;

    streamingIntervalRef.current = setInterval(() => {
      currentIndex++;
      
      if (currentIndex <= maxLength) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: fullText.slice(0, currentIndex), isStreaming: true }
            : msg
        ));
        scrollToBottom();
      } else {
        if (streamingIntervalRef.current) {
          clearInterval(streamingIntervalRef.current);
          streamingIntervalRef.current = null;
        }
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isStreaming: false }
            : msg
        ));
        setIsTyping(false);
      }
    }, 15);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }

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

    // Prepare messages for API (format: user/assistant)
    const messagesForAPI = [...messages, userMessage].map(msg => ({
      sender: msg.sender,
      content: msg.content
    }));

    try {
      console.log('Calling API with messages:', messagesForAPI);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messagesForAPI }),
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      const aiResponse = data.message || data.error || 'Sorry, I could not generate a response.';

      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: '',
        sender: 'assistant',
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Type out the response character by character
      setTimeout(() => {
        typeMessage(assistantMessageId, aiResponse);
      }, 100);
    } catch (error: any) {
      console.error('Error calling API:', error);
      setIsTyping(false);
      
      const errorMessageId = (Date.now() + 1).toString();
      const errorMessage: Message = {
        id: errorMessageId,
        content: error.message || 'Sorry, I encountered an error. Please try again or check your API key configuration.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    // Save current conversation to history if it has messages
    if (messages.length > 0) {
      const firstUserMessage = messages.find(msg => msg.sender === 'user');
      let title = firstUserMessage?.content || 'New Chat';
      
      // Truncate title if too long
      if (title.length > 50) {
        title = title.slice(0, 50) + '...';
      }
      
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: title,
        messages: [...messages],
        timestamp: new Date()
      };
      
      setConversations(prev => [newConversation, ...prev]);
    }
    
    // Clear current chat
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    setMessages([]);
    setHasStarted(false);
    setInputValue('');
    setIsTyping(false);
    setUploadedFiles([]);
    
    // Close sidebar on mobile when new chat is pressed
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLoadConversation = (conversation: Conversation) => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    setMessages(conversation.messages);
    setHasStarted(conversation.messages.length > 0);
    setInputValue('');
    setIsTyping(false);
    // Close sidebar on mobile after selecting conversation
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
      
      // You can handle file upload logic here
      console.log('Files uploaded:', fileArray);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="chatgpt-container">
      {/* Mobile backdrop overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar - ChatGPT/Perplexity Style */}
      <aside className={`chatgpt-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          {/* Hamburger Toggle Button at Top */}
          <button 
            className="sidebar-toggle-btn-top"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <div className="menu-icon-wrapper">
              <Menu size={20} className={`menu-icon ${sidebarOpen ? 'hidden' : 'visible'}`} />
              <X size={20} className={`close-icon ${sidebarOpen ? 'visible' : 'hidden'}`} />
            </div>
          </button>
          
          {/* New Chat Button */}
          <button className="new-chat-sidebar-btn" onClick={handleNewChat}>
            <Plus size={18} />
            {sidebarOpen && <span>New chat</span>}
          </button>
          
          {/* Conversation History */}
          {sidebarOpen && (
            <>
              <div className="sidebar-divider"></div>
              <div className="sidebar-conversations">
                {conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className="conversation-item-minimal"
                    onClick={() => handleLoadConversation(conversation)}
                  >
                    <div className="conversation-icon">
                      <MessageSquare size={16} />
                    </div>
                    <span>{conversation.title}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Footer Section */}
          <div className="sidebar-footer-content">
            {sidebarOpen && (
              <>
                <div className="sidebar-footer-divider"></div>
                <div className="sidebar-actions">
                  <button className="sidebar-action-btn">
                    <HelpCircle size={18} />
                    <span>Help & FAQ</span>
                  </button>
                  <button className="sidebar-action-btn">
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                </div>
                <div className="sidebar-footer-divider"></div>
                {/* User Profile Section */}
                <div className="sidebar-user-profile">
                  <div className="user-profile-content">
                    <div className="user-profile-avatar">
                      <User size={20} />
                    </div>
                    <div className="user-profile-info">
                      <div className="user-profile-name">Rohit</div>
                      <div className="user-profile-email">rohit@example.com</div>
                    </div>
                  </div>
                  <button className="login-btn-sidebar">
                    <LogIn size={18} />
                    <span>Login</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="chatgpt-main">
        {/* Logo at top left - shown after chat starts (desktop only) */}
        {hasStarted && (
          <div className="top-left-logo">
            <Image src="/logo.png" alt="DesiVerse" width={60} height={60} />
          </div>
        )}

        {/* Mobile transparent navbar with hamburger */}
        {isMobile && (
          <nav className="mobile-navbar">
            <button
              className="mobile-menu-button-navbar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Close menu" : "Open menu"}
            >
              <div className="menu-icon-wrapper">
                <Menu size={24} className={`menu-icon ${sidebarOpen ? 'hidden' : 'visible'}`} />
                <X size={24} className={`close-icon ${sidebarOpen ? 'visible' : 'hidden'}`} />
              </div>
            </button>
          </nav>
        )}

        {/* Messages Area */}
        <div className={`chatgpt-messages ${!hasStarted ? 'centered' : ''}`}>
          {!hasStarted ? (
            <div className="welcome-screen">
              {/* Big Logo at Start - Above Input Box */}
              <div className="welcome-logo-container">
                <Image src="/logo.png" alt="DesiVerse" width={180} height={180} />
              </div>
              
              {/* Centered Input Box in Welcome Screen */}
              <div className="centered-input-wrapper-welcome">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  style={{ display: 'none' }}
                />
                <div className="input-wrapper">
                  <button
                    className="attach-button"
                    onClick={handleAttachClick}
                    type="button"
                    title="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Message DesiVerse AI..."
                    className="chat-input"
                    rows={1}
                    disabled={isTyping}
                    style={{ color: '#343541' }}
                  />
                  <button
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                  >
                    {isTyping ? (
                      <Loader2 size={18} className="spinning" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files-preview">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="file-preview-item">
                        <span className="file-name">{file.name}</span>
                        <button
                          className="remove-file-btn"
                          onClick={() => removeFile(index)}
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="messages-list">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={`message-wrapper ${message.sender}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`message-container ${message.sender}`}>
                      {message.sender === 'user' ? (
                        <div className="message-text-wrapper user-message">
                          <div className="message-text-content">
                            {message.content}
                          </div>
                        </div>
                      ) : (
                        <div className="message-text-wrapper assistant-message">
                          <div 
                            className="message-text-content"
                            dangerouslySetInnerHTML={{ 
                              __html: formatMessageText(message.content) + (message.isStreaming ? '<span class="streaming-cursor">▊</span>' : '')
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && !messages.some(m => m.isStreaming) && (
                <div className="message-wrapper assistant">
                  <div className="message-container assistant">
                    <div className="message-text-wrapper assistant-message">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
              
              {/* Input Area - Inside Main Messages Area */}
              {hasStarted && (
                <div className="chatgpt-input-area">
                  <div className="input-container">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      style={{ display: 'none' }}
                    />
                    <div className="input-wrapper">
                      <button
                        className="attach-button"
                        onClick={handleAttachClick}
                        type="button"
                        title="Attach file"
                      >
                        <Paperclip size={18} />
                      </button>
                      <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Message DesiVerse AI..."
                        className="chat-input"
                        rows={1}
                        disabled={isTyping}
                        style={{ color: '#343541' }}
                      />
                      <button
                        className="send-button"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                      >
                        {isTyping ? (
                          <Loader2 size={18} className="spinning" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="uploaded-files-preview">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="file-preview-item">
                            <span className="file-name">{file.name}</span>
                            <button
                              className="remove-file-btn"
                              onClick={() => removeFile(index)}
                              type="button"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}