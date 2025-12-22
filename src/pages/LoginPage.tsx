import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const API_URL = 'https://api.race-pilot.app';

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setResetLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetSuccess('If that email address is registered, we\'ve sent you a password reset link. Please check your email.');
        setResetEmail('');
      } else {
        setResetError(data.detail || 'Failed to send reset email');
      }
    } catch (err: any) {
      setResetError(err.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="https://raw.githubusercontent.com/GP14BUILD/racepilotimages/main/ChatGPT%20Image%20Nov%208%2C%202025%2C%2002_34_49%20PM.png"
            alt="RacePilot Logo"
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 16px',
              display: 'block'
            }}
          />
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #38bdf8, #0284c7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px 0'
          }}>
            RacePilot
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>Sign in to your dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#fca5a5',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#e2e8f0',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
              placeholder="you@example.com"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#e2e8f0'
              }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#475569' : 'linear-gradient(to right, #38bdf8, #0284c7)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Note */}
        <p style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#64748b'
        }}>
          Use the same credentials from the mobile app
        </p>

        {/* Sign Up Link */}
        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: '#38bdf8',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }} onClick={() => setShowForgotPassword(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '32px',
              width: '100%',
              maxWidth: '450px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#e2e8f0',
              marginBottom: '8px',
              marginTop: 0
            }}>
              Reset Password
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#94a3b8',
              marginBottom: '24px',
              marginTop: 0
            }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {resetSuccess && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#86efac',
                fontSize: '14px'
              }}>
                {resetSuccess}
              </div>
            )}

            {resetError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#fca5a5',
                fontSize: '14px'
              }}>
                {resetError}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#e2e8f0',
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="you@example.com"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setResetError('');
                    setResetSuccess('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(100, 116, 139, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#94a3b8',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={resetLoading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: resetLoading ? '#475569' : 'linear-gradient(to right, #38bdf8, #0284c7)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: resetLoading ? 'not-allowed' : 'pointer',
                    opacity: resetLoading ? 0.5 : 1
                  }}
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
