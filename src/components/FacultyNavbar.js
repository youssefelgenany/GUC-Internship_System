import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const sidebarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: 300,
  background: '#234B73',
  color: '#fff',
  boxShadow: '2px 0 16px rgba(0,0,0,0.10)',
  zIndex: 1001,
  padding: '32px 18px 18px 18px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s',
};

const sidebarOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.18)',
  zIndex: 1000,
};

const sidebarMenuItem = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 0',
  fontSize: 17,
  fontWeight: 500,
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'background 0.15s',
};

const sidebarMenuSection = {
  borderRadius: 10,
  marginBottom: 6,
  transition: 'background 0.15s',
};

const sidebarSubMenu = {
  paddingLeft: 18,
  paddingBottom: 8,
  paddingTop: 2,
  color: '#fff',
  fontSize: 16,
  cursor: 'pointer',
};

const sidebarActiveItem = {
  background: '#35708E',
  borderRadius: 7,
  color: '#fff',
  fontWeight: 600,
};

const notifications = [
  { id: 1, message: 'New internship report submitted for review', isNew: true },
  { id: 2, message: 'Report deadline approaching for 3 students', isNew: true },
  { id: 3, message: 'Weekly report summary available', isNew: false },
];

const FacultyNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState([]);
  const [activeSubItem, setActiveSubItem] = useState('Dashboard');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const notificationsDropdownRef = useRef();
  const [search, setSearch] = useState('');

  // Define menuStructure inside component to access navigate
  const menuStructure = [
    {
      label: 'Dashboard',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>,
      action: () => { setActiveSubItem('Dashboard'); navigate('/faculty-dashboard'); setSidebarOpen(false); }
    },
    {
      label: 'Manage Reports',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
      action: () => { setActiveSubItem('Manage Reports'); navigate('/faculty-reports'); setSidebarOpen(false); }
    }
  ];

  // Get first name initial and full name for welcome
  const firstInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'F';
  const displayName = user?.fullName || 'Faculty Member';

  // Sidebar open/close logic
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const handleMenuClick = (label) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };
  const isMenuOpen = (label) => openMenus.includes(label);

  // Close menu on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
      if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(e.target)) {
        setShowNotificationsDropdown(false);
      }
    };
    if (profileMenuOpen || showNotificationsDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileMenuOpen, showNotificationsDropdown]);

  return (
    <>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button
              style={{ background: 'rgba(255,255,255,0.10)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer' }}
              onClick={handleSidebarOpen}
              aria-label="Open sidebar"
            >
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
            <span style={{ fontWeight: 700, fontSize: 28, letterSpacing: 0.5 }}>GUC Internship System</span>
          </div>
          {/* Right: Notifications and Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 15, position: 'relative' }}>
            {/* Notification Bell */}
            <div ref={notificationsDropdownRef} style={{ position: 'relative' }}>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', marginRight: 8 }}
                onClick={() => setShowNotificationsDropdown((v) => !v)}
                aria-label="Notifications"
              >
                <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 16v-5a6 6 0 10-12 0v5a2 2 0 01-2 2h16a2 2 0 01-2-2z" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: '#F08F36' }}></span>
              </button>
              {showNotificationsDropdown && (
                <div style={{ position: 'absolute', top: 44, right: 0, background: '#fff', color: '#234B73', borderRadius: 14, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', minWidth: 320, zIndex: 100, padding: '18px 0' }}>
                  <div style={{ fontWeight: 700, fontSize: 17, padding: '0 20px 10px 20px', borderBottom: '1px solid #eee' }}>Notifications</div>
                  <div style={{ maxHeight: 260, overflowY: 'auto', padding: '0 20px' }}>
                    {notifications.length === 0 ? (
                      <div style={{ color: '#8C8C8C', textAlign: 'center', padding: 12 }}>No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{ padding: '12px 0', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center' }}>
                          <span style={{ color: '#234B73', fontSize: 15 }}>{n.message}</span>
                          {n.isNew && <span style={{ display: 'inline-block', width: 10, height: 10, background: '#F08F36', borderRadius: '50%', marginLeft: 10 }}></span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Profile Icon */}
            <div
              style={{ width: 40, height: 40, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 20, cursor: 'pointer', position: 'relative' }}
              onClick={() => setProfileMenuOpen((open) => !open)}
            >
              {firstInitial}
            </div>
            {profileMenuOpen && (
              <div ref={profileMenuRef} style={{ position: 'absolute', top: 50, right: 0, background: '#fff', color: '#234B73', borderRadius: 14, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', minWidth: 260, zIndex: 100, padding: '18px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px 10px 20px', borderBottom: '1px solid #eee' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22 }}>
                    {firstInitial}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{displayName}</div>
                    <div style={{ color: '#8C8C8C', fontSize: 13 }}>{user?.email || '--'}</div>
                  </div>
                </div>
                <button
                  style={{ width: '90%', margin: '14px 5%', padding: '8px 0', borderRadius: 22, border: '1.5px solid #234B73', color: '#234B73', background: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginBottom: 10 }}
                  onClick={() => { setProfileMenuOpen(false); navigate('/faculty-profile'); }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>
                    View Profile
                  </span>
                </button>
                <button
                  style={{ width: '90%', margin: '0 5%', padding: '8px 0', borderRadius: 22, border: '1.5px solid #991B1B', color: '#991B1B', background: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
                  onClick={() => { setProfileMenuOpen(false); logout(); navigate('/login'); }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="20" height="20" fill="none" stroke="#991B1B" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" /><path d="M9 20H5a2 2 0 01-2-2V6a2 2 0 012-2h4" /></svg>
                    Log Out
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <>
          <div style={sidebarOverlay} onClick={handleSidebarClose} />
          <div style={sidebarStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: 1, textAlign: 'left', paddingLeft: 2 }}>Faculty Portal</span>
              <button
                onClick={handleSidebarClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  color: '#fff',
                  fontSize: 28,
                  lineHeight: 1,
                  borderRadius: 6,
                  transition: 'background 0.15s',
                }}
                aria-label="Close sidebar"
                onMouseOver={e => (e.currentTarget.style.background = '#F08F36')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              placeholder="Menu Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '90%',
                padding: '10px 12px',
                borderRadius: 8,
                border: 'none',
                marginBottom: 24,
                fontSize: 16,
                color: '#234B73',
                background: '#fff',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {menuStructure.map((item) => (
                <button
                  key={item.label}
                  style={{
                    ...sidebarMenuItem,
                    ...sidebarMenuSection,
                    background: activeSubItem === item.label ? '#35708E' : 'none',
                    color: '#fff',
                    fontWeight: activeSubItem === item.label ? 700 : 600,
                    fontSize: 17,
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: 'pointer',
                    marginBottom: 2,
                    padding: '12px 18px',
                    borderRadius: 8,
                    transition: 'background 0.15s',
                  }}
                  onClick={item.action}
                  onMouseOver={e => e.currentTarget.style.background = '#35708E'}
                  onMouseOut={e => { if (activeSubItem !== item.label) e.currentTarget.style.background = 'none'; }}
                >
                  {item.icon}
                  <span style={{ fontWeight: activeSubItem === item.label ? 700 : 600 }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FacultyNavbar;
