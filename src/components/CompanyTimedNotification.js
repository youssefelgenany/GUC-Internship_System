import React, { useEffect, useState } from 'react';

const notificationTypes = {
  success: {
    background: '#D1FAE5',
    color: '#065F46',
    icon: '✅'
  },
  success1: {
    background: '#D1FAE5',
    color: '#065F46',
    icon: '🎉'
  },

  error: {
    background: '#FEE2E2',
    color: '#991B1B',
    icon: '❌'
  },
  info: {
    background: '#DBEAFE',
    color: '#1E40AF',
    icon: 'ℹ️'
  },
  warning: {
    background: '#FEF3C7',
    color: '#92400E',
    icon: '⚠️'
  }
};

const notificationBarStyle = (type = 'info', position = 'bottom-left') => {
  const baseStyle = {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '18px 28px',
    boxShadow: '0 4px 32px rgba(35,75,115,0.10)',
    fontSize: 18,
    fontWeight: 600,
    zIndex: 9999,
    borderRadius: 16,
    minWidth: 320,
    maxWidth: 400,
    background: notificationTypes[type].background,
    color: notificationTypes[type].color,
  };

  const positionStyles = {
    'bottom-left': { left: 32, bottom: 32 },
    'top-right': { right: 32, top: 32 },
    'bottom-right': { right: 32, bottom: 32 },
    'top-left': { left: 32, top: 32 }
  };

  return { ...baseStyle, ...positionStyles[position] };
};

const iconStyle = {
  fontSize: 26,
  marginRight: 14,
};

const closeBtnStyle = (type = 'info') => ({
  background: 'none',
  border: 'none',
  color: notificationTypes[type].color,
  fontSize: 24,
  marginLeft: 24,
  cursor: 'pointer',
  fontWeight: 700,
  lineHeight: 1,
});

const CompanyTimedNotification = ({
  message = "Your application has been accepted!",
  type = 'success', // 'success', 'error', 'info', 'warning'
  customIcon = null,
  duration = 5000, // 5 seconds
  onClose,
  position = 'bottom-left', // 'bottom-left', 'top-right', 'bottom-right', 'top-left'
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div style={notificationBarStyle(type, position)}>
      <span style={iconStyle}>{customIcon || notificationTypes[type].icon}</span>
      <span>{message}</span>
      <button 
        style={closeBtnStyle(type)} 
        onClick={() => { setVisible(false); if (onClose) onClose(); }}
      >
        ×
      </button>
    </div>
  );
};

export default CompanyTimedNotification;