import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import CompanyTimedNotification from './CompanyTimedNotification';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  // Function to add a new notification
  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const newNotification = {
      id,
      message,
      type,
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, newNotification]);

    // Remove notification after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, duration);
  };

  // Function to remove a notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Export the addNotification function to be used globally
  useEffect(() => {
    window.showNotification = addNotification;
    return () => {
      delete window.showNotification;
    };
  }, []);

  const getNotificationStyle = (type) => {
    const baseStyle = {
      padding: '12px 24px',
      borderRadius: '8px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      animation: 'slideIn 0.3s ease-out',
      maxWidth: '400px',
      width: '100%',
    };

    const typeStyles = {
      success: {
        backgroundColor: '#D1FAE5',
        color: '#065F46',
        borderLeft: '4px solid #059669',
      },
      error: {
        backgroundColor: '#FEE2E2',
        color: '#991B1B',
        borderLeft: '4px solid #DC2626',
      },
      info: {
        backgroundColor: '#DBEAFE',
        color: '#1E40AF',
        borderLeft: '4px solid #2563EB',
      },
      warning: {
        backgroundColor: '#FEF3C7',
        color: '#92400E',
        borderLeft: '4px solid #D97706',
      },
    };

    return { ...baseStyle, ...typeStyles[type] };
  };

  return createPortal(
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {notifications.map((notification) => (
        <CompanyTimedNotification
          key={notification.id}
          type={notification.type || 'info'}
          message={notification.message}
          customIcon={notification.icon}
          onClose={() => removeNotification(notification.id)}
          position={notification.position || 'bottom-left'}
        />
      ))}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>,
    document.body
  );
};

export default NotificationSystem; 