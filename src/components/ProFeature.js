import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProFeature = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: '#f5f7fa',
      textAlign: 'center'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: '#F08F36',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#234B73',
          marginBottom: '16px'
        }}>
          Pro Feature
        </h1>
        <p style={{
          fontSize: '17px',
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          This feature is exclusively available for Pro students. Upgrade your account to access SCAD appointments, career workshops, and online assessments.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: '#234B73',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.background = '#1a3a5a'}
          onMouseOut={e => e.currentTarget.style.background = '#234B73'}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProFeature; 