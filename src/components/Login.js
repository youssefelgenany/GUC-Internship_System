import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    // Call the login function passed from App.js
    const success = onLogin(email, password);
    if (!success) {
      alert('Email or password is incorrect or not in the system.');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(240, 143, 54, 0.15)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(192, 206, 219, 0.2)',
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: '#234B73',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#FFFFFF',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            GUC
          </div>
          
          <h2 style={{ 
            textAlign: 'center', 
            color: '#234B73', 
            marginBottom: '5px',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            GUC Internship System
          </h2>
          <p style={{ 
            color: '#8C8C8C', 
            fontSize: '14px', 
            textAlign: 'center', 
            marginBottom: '30px' 
          }}>
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ 
                backgroundColor: '#FEE2E2', 
                color: '#DC2626', 
                padding: '10px 15px', 
                borderRadius: '4px', 
                marginBottom: '15px',
                fontSize: '14px' 
              }}>
                {error}
              </div>
            )}
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#234B73'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px',
                  border: '1px solid #C0CEDB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                placeholder="Enter your email"
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#234B73'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px',
                  border: '1px solid #C0CEDB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                placeholder="Your password"
              />
            </div>
            
            <button 
              type="submit" 
              style={{ 
                width: '100%',
                padding: '12px',
                backgroundColor: '#234B73',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginBottom: '20px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1a3a5a'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#234B73'}
            >
              Sign in
            </button>
          </form>
          
          <div style={{ 
            borderTop: '1px solid #EEE', 
            paddingTop: '15px', 
            textAlign: 'center' 
          }}>
            <span style={{ color: '#F08F36', fontSize: '14px', fontWeight: '500' }}>
              New company?{' '}
            </span>
            <a 
              href="/register" 
              style={{ 
                color: '#234B73', 
                textDecoration: 'underline', 
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onMouseOver={e => e.target.style.color = '#F08F36'}
              onMouseOut={e => e.target.style.color = '#234B73'}
            >
              Register now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;