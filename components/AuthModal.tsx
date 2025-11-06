'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Validation for signup
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          setIsLoading(false);
          return;
        }
      }

      // TODO: Add actual authentication logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On success, close modal
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError(err.message || `${mode === 'login' ? 'Login' : 'Sign up'} failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft' | 'apple') => {
    setError('');
    setIsLoading(true);

    try {
      // TODO: Implement actual OAuth flow
      // For now, simulate the process
      console.log(`Signing in with ${provider}...`);
      
      // Here you would redirect to OAuth provider or handle OAuth popup
      // Example: window.location.href = `/api/auth/${provider}`;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On success, close modal
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="auth-modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="auth-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="auth-modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="auth-modal-header">
            <div className="auth-modal-logo">
              <Image src="/logo.png" alt="DesiVerse" width={60} height={60} />
            </div>
            <h2 className="auth-modal-title">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="auth-modal-subtitle">
              {mode === 'login' ? 'Sign in to continue to DesiVerse' : 'Join DesiVerse to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-modal-form">
            {error && (
              <div className="auth-modal-error">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div className="auth-modal-input-group">
                <label htmlFor="name" className="auth-modal-label">
                  Full Name
                </label>
                <div className="auth-modal-input-wrapper">
                  <User size={18} className="auth-modal-input-icon" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="auth-modal-input"
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-modal-input-group">
              <label htmlFor="email" className="auth-modal-label">
                Email Address
              </label>
              <div className="auth-modal-input-wrapper">
                <Mail size={18} className="auth-modal-input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="auth-modal-input"
                  required
                />
              </div>
            </div>

            <div className="auth-modal-input-group">
              <label htmlFor="password" className="auth-modal-label">
                Password
              </label>
              <div className="auth-modal-input-wrapper">
                <Lock size={18} className="auth-modal-input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create a password (min. 8 characters)'}
                  className="auth-modal-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-modal-password-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="auth-modal-input-group">
                <label htmlFor="confirmPassword" className="auth-modal-label">
                  Confirm Password
                </label>
                <div className="auth-modal-input-wrapper">
                  <Lock size={18} className="auth-modal-input-icon" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="auth-modal-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="auth-modal-password-toggle"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="auth-modal-options">
                <label className="auth-modal-checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="auth-modal-link-btn">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="auth-modal-button"
            >
              {isLoading ? (
                <>
                  <div className="auth-modal-spinner"></div>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
                  {mode === 'login' ? 'Sign In' : 'Sign Up'}
                </>
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="auth-modal-divider">
            <span>or continue with</span>
          </div>

          {/* Social Login Buttons */}
          <div className="auth-modal-social">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="auth-modal-social-btn auth-modal-google"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('microsoft')}
              className="auth-modal-social-btn auth-modal-microsoft"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M11.4 11.4H1V1h10.4v10.4z" fill="#F25022"/>
                <path d="M23 11.4H12.6V1H23v10.4z" fill="#7FBA00"/>
                <path d="M11.4 23H1V12.6h10.4V23z" fill="#00A4EF"/>
                <path d="M23 23H12.6V12.6H23V23z" fill="#FFB900"/>
              </svg>
              <span>Microsoft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('apple')}
              className="auth-modal-social-btn auth-modal-apple"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="auth-modal-footer">
            <p>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" onClick={switchMode} className="auth-modal-link-btn">
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

