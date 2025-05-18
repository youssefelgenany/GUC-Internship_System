import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { FiUser } from 'react-icons/fi';
import { MdOutlineLogout } from 'react-icons/md';
import CompanyTimedNotification from './CompanyTimedNotification';

const navbarStyle = {
  background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
  color: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  width: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2000,
};
const navInner = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 48px',
  maxWidth: 1600,
  margin: '0 auto',
};
const navLinks = {
  display: 'flex',
  alignItems: 'center',
  gap: 28,
  fontSize: 17,
  fontWeight: 500,
};
const navLink = {
  color: '#fff',
  textDecoration: 'none',
  cursor: 'pointer',
  padding: '6px 12px',
  borderRadius: 6,
  transition: 'background 0.15s',
};
const navLinkActive = {
  background: '#F08F36',
  color: '#fff',
};
const bellBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
  marginRight: 18,
};
const profileBtn = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: '#C0CEDB',
  color: '#234B73',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: 20,
  cursor: 'pointer',
  position: 'relative',
};
const burgerBtn = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: 28,
  cursor: 'pointer',
  marginRight: 18,
  padding: 4,
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// Sidebar styles (from StudentDashboard.js)
const sidebarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: 300,
  background: '#234B73',
  color: '#fff',
  boxShadow: '2px 0 16px rgba(0,0,0,0.10)',
  zIndex: 3000,
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
  zIndex: 2999,
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

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState([]);
  const [active, setActive] = useState('Dashboard');
  const [activeSubItem, setActiveSubItem] = useState('Dashboard');
  const [cycleToast, setCycleToast] = useState(null);
  const [cycleToast2, setCycleToast2] = useState(null);
  const profileMenuRef = useRef();
  const notificationsRef = useRef();
  const firstInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S';
  const displayName = user?.fullName || 'Student';
  const notifications = [
    { id: 1, message: 'Your internship application has been approved', isNew: true },
    { id: 2, message: 'New internship opportunity at Google', isNew: true },
    { id: 3, message: 'Deadline for submission is approaching', isNew: false }
  ];

  // Sidebar menu structure (from StudentDashboard.js)
  let menuStructure = [
    {
      label: 'Main',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>,
      submenu: [
        { label: 'Dashboard', action: () => { setActive('Dashboard'); setActiveSubItem('Dashboard'); navigate('/dashboard'); setSidebarOpen(false); } },
        { label: 'My Profile', action: () => { setActive('My Profile'); setActiveSubItem('My Profile'); navigate('/profile'); setSidebarOpen(false); } },
      ],
    },
    {
      label: 'Internships',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>,
      submenu: [
        { label: 'My Internships', action: () => { setActive('My Internships'); setActiveSubItem('My Internships'); navigate('/my-internships'); setSidebarOpen(false); } },
        { label: 'Browse Internships', action: () => { setActive('Browse Internships'); setActiveSubItem('Browse Internships'); navigate('/browse-internships'); setSidebarOpen(false); } },
        { label: 'Internship Guideline', action: () => { setActive('Internship Guideline'); setActiveSubItem('Internship Guideline'); navigate('/internship-guideline'); setSidebarOpen(false); } },
      ],
    },
  ];
  if (user && user.isProStudent === true) {
    menuStructure = [
      ...menuStructure,
    {
      label: 'Reservation',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v2M8 3v2" /></svg>,
      submenu: [
          { 
            label: 'SCAD Appointment', 
            action: () => {
              setActive('SCAD Appointment');
              setActiveSubItem('SCAD Appointment');
              navigate('/scad-appointment');
              setSidebarOpen(false);
            }
          },
          { 
            label: 'Career Workshop', 
            action: () => {
              setActive('Career Workshop');
              setActiveSubItem('Career Workshop');
              navigate('/career-workshop');
              setSidebarOpen(false);
            }
          },
          { 
            label: 'Online Assessments', 
            action: () => {
              setActive('Online Assessments');
              setActiveSubItem('Online Assessments');
              navigate('/online-assessments');
              setSidebarOpen(false);
            }
          },
      ],
    },
    {
      label: 'Certificates',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>,
      submenu: [
          { label: 'My Certificate', action: () => { setActive('My Certificate'); setActiveSubItem('My Certificate'); navigate('/workshop-certificates'); setSidebarOpen(false); } },
      ],
      }
  ];
  }
  

  const handleNav = (label, path) => {
    setActive(label);
    setActiveSubItem(label);
    navigate(path);
  };

  const handleMenuClick = (label) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };
  const isMenuOpen = (label) => openMenus.includes(label);

  // Timed internship cycle notifications
  useEffect(() => {
    if (!user || user.type !== 'student') return;
    if (sessionStorage.getItem('cycleToastShown')) return; // Already shown this session

    // About to begin
    const t1 = setTimeout(() => {
      setCycleToast('The new internship cycle is about to begin!');
    }, 3000);
    // Has begun
    const t2 = setTimeout(() => {
      setCycleToast(null);
      setCycleToast2('The new internship cycle has begun! Start applying now!');
      sessionStorage.setItem('cycleToastShown', 'true'); // Mark as shown
    }, 10000);
    // Auto-dismiss second toast after 8s
    const t3 = setTimeout(() => {
      setCycleToast2(null);
    }, 18000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showProfileMenu || showNotifications) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showProfileMenu, showNotifications]);

  return (
    <>
      {/* Internship cycle notifications */}
      {cycleToast && (
        <CompanyTimedNotification
          type="info"
          message={cycleToast}
          customIcon="⏰"
          onClose={() => setCycleToast(null)}
          position="bottom-left"
        />
      )}
      {cycleToast2 && (
        <CompanyTimedNotification
          type="success"
          message={cycleToast2}
          customIcon="🎉"
          onClose={() => setCycleToast2(null)}
          position="bottom-left"
        />
      )}
      <nav style={navbarStyle}>
        <div style={navInner}>
          <button style={burgerBtn} onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span style={{ fontWeight: 700, fontSize: 26, letterSpacing: 0.5, cursor: 'pointer' }} onClick={() => handleNav('Dashboard', '/dashboard')}>GUC Internship System</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            <button style={bellBtn} onClick={() => setShowNotifications((v) => !v)} aria-label="Show notifications">
              <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M18 16v-5a6 6 0 10-12 0v5l-1 2h14l-1-2z" />
                <circle cx="12" cy="21" r="1.5" />
              </svg>
              {notifications.some(n => n.isNew) && (
                <span style={{ position: 'absolute', top: 2, right: 2, width: 10, height: 10, background: '#F08F36', borderRadius: '50%', border: '2px solid #234B73' }}></span>
              )}
            </button>
            {showNotifications && (
              <div ref={notificationsRef} style={{ position: 'absolute', top: 44, right: 60, background: '#fff', color: '#234B73', borderRadius: 14, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', minWidth: 320, zIndex: 100, padding: '18px 0' }}>
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
            <div style={profileBtn} onClick={() => setShowProfileMenu((v) => !v)}>
              {firstInitial}
              {user?.isProStudent && (
                <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 16, color: '#FFD700', background: '#fff', borderRadius: '50%', padding: '1px 3px', boxShadow: '0 1px 4px #C0CEDB' }} title="Pro Student">★</span>
              )}
            </div>
            {showProfileMenu && (
              <div ref={profileMenuRef} style={{ position: 'absolute', top: 50, right: 0, background: '#fff', color: '#234B73', borderRadius: 18, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', minWidth: 320, zIndex: 100, padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* User Info Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px 8px 24px', borderBottom: '1px solid #E5EAF2', marginBottom: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 28 }}>
                    {firstInitial}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700, fontSize: 20, color: '#234B73' }}>{displayName}</span>
                    <span style={{ color: '#8C8C8C', fontSize: 15, marginTop: 2 }}>{user?.email || '--'}</span>
                  </div>
                </div>
                {/* Action Buttons */}
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, width: '90%', margin: '0 auto 10px auto',
                    background: '#fff', color: '#234B73', border: '1.5px solid #234B73', borderRadius: 32, padding: '7px 0', fontWeight: 600, fontSize: 17, cursor: 'pointer', justifyContent: 'center', transition: 'background 0.15s, color 0.15s, border 0.15s',
                  }}
                >
                  <FiUser style={{ fontSize: 20, marginRight: 2 }} />
                  View Profile
                </button>
                  <button
                    onClick={() => { setShowProfileMenu(false); logout(); navigate('/login'); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, width: '90%', margin: '0 auto',
                    background: '#fff', color: '#991B1B', border: '1.5px solid #991B1B', borderRadius: 32, padding: '7px 0', fontWeight: 600, fontSize: 17, cursor: 'pointer', justifyContent: 'center', transition: 'background 0.15s, color 0.15s, border 0.15s',
                  }}
                  >
                  <MdOutlineLogout style={{ fontSize: 20, marginRight: 2 }} />
                  Log Out
                  </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <>
          <div style={sidebarOverlay} onClick={() => setSidebarOpen(false)} />
          <div style={sidebarStyle}>
            {/* Sidebar Header: X and Student Portal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ fontWeight: 800, fontSize: 25, color: '#fff', letterSpacing: 1, textAlign: 'left', paddingLeft: 2 }}>Student Portal</span>
              <button
                onClick={() => setSidebarOpen(false)}
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
                  marginLeft: 8
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
              {menuStructure.map((item, idx) => {
                // Remove 'My Profile' from 'Main' section
                const filteredSubmenu = item.label === 'Main'
                  ? item.submenu.filter(sub => sub.label !== 'My Profile')
                  : item.submenu;
                if (filteredSubmenu && filteredSubmenu.length === 1) {
                  // Render as a single button
                  return (
                    <div key={item.label} style={{ marginBottom: 8 }}>
                      <button
                        style={{
                          ...sidebarMenuItem,
                          background: activeSubItem === filteredSubmenu[0].label ? '#35708E' : 'none',
                          color: activeSubItem === filteredSubmenu[0].label ? '#fff' : '#fff',
                          fontWeight: activeSubItem === filteredSubmenu[0].label ? 700 : 500,
                          width: '100%',
                          border: 'none',
                          textAlign: 'left',
                          padding: '12px 0 12px 24px', // left padding for alignment
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}
                        onClick={() => { setActiveSubItem(filteredSubmenu[0].label); filteredSubmenu[0].action(); }}
                        onMouseOver={e => e.currentTarget.style.background = '#35708E'}
                        onMouseOut={e => e.currentTarget.style.background = activeSubItem === filteredSubmenu[0].label ? '#35708E' : 'none'}
                      >
                        {item.icon}
                        <span style={{ fontWeight: activeSubItem === filteredSubmenu[0].label ? 700 : 500 }}>{filteredSubmenu[0].label}</span>
                      </button>
                    </div>
                  );
                } else if (filteredSubmenu && filteredSubmenu.length > 1) {
                  // Render as a collapsible section
                  return (
                <div key={item.label}>
                  <div
                    style={{
                      ...sidebarMenuItem,
                      ...sidebarMenuSection,
                      position: 'relative',
                      flexDirection: 'row',
                      alignItems: 'center',
                      background: isMenuOpen(item.label) ? '#35708E' : 'none',
                      color: isMenuOpen(item.label) ? '#fff' : '#fff',
                      fontWeight: isMenuOpen(item.label) ? 700 : 500,
                          width: '100%',
                          textAlign: 'left',
                          padding: '12px 0 12px 24px', // left padding for alignment
                          borderRadius: 8,
                          display: 'flex',
                          gap: 14,
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                    }}
                    onClick={() => handleMenuClick(item.label)}
                  >
                    <span>{item.icon}</span>
                    <span style={{ fontWeight: isMenuOpen(item.label) ? 700 : 500 }}>{item.label}</span>
                    <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 'auto', opacity: 0.7, transform: isMenuOpen(item.label) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                  {/* Submenu as a vertical list below the open menu */}
                  {isMenuOpen(item.label) && (
                    <div style={{ marginLeft: 0, marginTop: 0, marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 0 }}>
                          {filteredSubmenu.map((sub, subIdx) => (
                        <div
                          key={sub.label}
                          style={{
                            ...sidebarSubMenu,
                            ...(activeSubItem === sub.label ? sidebarActiveItem : {}),
                            marginBottom: 2,
                            borderRadius: 7,
                                padding: '10px 0 10px 54px', // more left padding for submenu
                            display: 'block',
                          }}
                          onClick={e => { e.stopPropagation(); setActiveSubItem(sub.label); sub.action(); }}
                          onMouseOver={e => e.currentTarget.style.background = '#35708E'}
                          onMouseOut={e => e.currentTarget.style.background = 'none'}
                        >
                          {sub.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar; 