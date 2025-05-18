import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from './CompanyNavbar';
import CompanyTimedNotification from './CompanyTimedNotification';

const randomMessages = [
  { message: "Your application has been accepted!", icon: "🎉", type: "success" },
  { message: "Your application has been rejected.", icon: "❌", type: "error" },
  { message: "A new application has arrived!", icon: "📥", type: "info" },
  { message: "Internship cycle is about to begin!", icon: "⏰", type: "warning" }
];

const CompanyDashboard = () => {
  const navigate = useNavigate();

  const containerStyle = {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 16px'
  };

  const headerStyle = {
    background: '#234B73',
    color: '#fff',
    padding: '40px 0',
    marginBottom: 24
  };

  const titleStyle = {
    color: '#234B73',
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 24
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
    padding: 24,
    marginBottom: 24
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 24,
    marginBottom: 24
  };

  const statCardStyle = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
    padding: 24,
    textAlign: 'center'
  };

  const statValueStyle = {
    color: '#234B73',
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 8
  };

  const statLabelStyle = {
    color: '#5A6A7A',
    fontSize: 15
  };

  const sectionTitleStyle = {
    color: '#234B73',
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16
  };

  const activityItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: '16px 0',
    borderBottom: '1px solid #E5E7EB'
  };

  const activityIconStyle = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#F5F7FA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  };

  const activityContentStyle = {
    flex: 1
  };

  const activityTitleStyle = {
    color: '#234B73',
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 4
  };

  const activityTimeStyle = {
    color: '#8C8C8C',
    fontSize: 14
  };

  const buttonStyle = {
    background: '#F08F36',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '12px 24px',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer',
    width: '100%'
  };

  // Dummy data
  const stats = [
    { label: 'Active Internships', value: 7 },
    { label: 'Total Applications', value: 48 },
    { label: 'Pending Review', value: 12 },
    { label: 'Current Interns', value: 122 }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'application',
      title: 'New application received for Software Engineering Intern',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'internship',
      title: 'Data Science Intern position created',
      time: '5 hours ago'
    },
    {
      id: 3,
      type: 'review',
      title: 'Application reviewed for Frontend Development Intern',
      time: '1 day ago'
    },
    {
      id: 4,
      type: 'intern',
      title: 'New intern joined: Ahmed Mohamed',
      time: '2 days ago'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'application':
        return (
          <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'internship':
        return (
          <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'review':
        return (
          <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'intern':
        return (
          <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Notification state
  const [showNotif, setShowNotif] = useState(false);
  const [notifContent] = useState({
    message: "John Doe has applied to Software Engineering Intern!",
    icon: "📥",
    type: "info"
  });

  useEffect(() => {
    // Show the dummy notification 2 seconds after page load
    const timer = setTimeout(() => setShowNotif(true), 2000);
    // Hide after 5 seconds
    const hideTimer = setTimeout(() => setShowNotif(false), 7000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      <CompanyNavbar />
      <div style={{ width: '100%', height: 24, background: '#fff' }} />
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={containerStyle}>
          <div style={statsGridStyle}>
            {stats.map((stat, index) => (
              <div key={index} style={statCardStyle}>
                <div style={statValueStyle}>{stat.value}</div>
                <div style={statLabelStyle}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Recent Activity</h2>
              {recentActivity.map(activity => (
                <div key={activity.id} style={activityItemStyle}>
                  <div style={activityIconStyle}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div style={activityContentStyle}>
                    <div style={activityTitleStyle}>{activity.title}</div>
                    <div style={activityTimeStyle}>{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div style={cardStyle}>
                <h2 style={sectionTitleStyle}>Quick Actions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button
                    style={buttonStyle}
                    onClick={() => navigate('/company-my-internships')}
                  >
                    My Internships
                  </button>
                  <button
                    style={{
                      ...buttonStyle,
                      background: '#234B73'
                    }}
                    onClick={() => navigate('/company-applications')}
                  >
                    Review Applications
                  </button>
                  <button
                    style={{
                      ...buttonStyle,
                      background: '#35708E'
                    }}
                    onClick={() => navigate('/company-profile')}
                  >
                    Company Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNotif && (
        <CompanyTimedNotification
          type={notifContent.type || 'info'}
          message={notifContent.message}
          customIcon={notifContent.icon}
          onClose={() => setShowNotif(false)}
          position="bottom-left"
        />
      )}
    </>
  );
};

export default CompanyDashboard; 