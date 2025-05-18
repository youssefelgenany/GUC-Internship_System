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

const menuStructure = [
  {
    label: 'Dashboard',
    icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>,
    action: (navigate, setSidebarOpen) => { navigate('/company-dashboard'); setSidebarOpen(false); }
  },
  {
    label: 'Internships',
    icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>,
    submenu: [
      { label: 'My Internships', action: (navigate, setSidebarOpen) => { navigate('/company-my-internships'); setSidebarOpen(false); } },
      { label: 'Applications', action: (navigate, setSidebarOpen) => { navigate('/company-applications'); setSidebarOpen(false); } },
      { label: 'Current Interns', action: (navigate, setSidebarOpen) => { navigate('/company-current-interns'); setSidebarOpen(false); } },
      { label: 'All Internships', action: (navigate, setSidebarOpen) => { navigate('/company-internships'); setSidebarOpen(false); } },
    ],
  },
];

const dummyNotifications = [
  { id: 1, message: 'New application for Software Engineering Intern.' },
  { id: 2, message: 'Internship "Data Science Intern" was approved.' },
  { id: 3, message: 'Ahmed Mohamed accepted your offer.' },
];

const CompanyNavbar = () => {
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

  // Get first name initial and full name for welcome
  const firstInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'C';
  const displayName = user?.fullName || 'Company';

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

  // Filtered menu items by search
  const filteredMenu = menuStructure
    .map(section => {
      if (section.submenu) {
        // Section with submenu: filter submenu items
        const filteredSubmenu = section.submenu.filter(item =>
          item.label.toLowerCase().includes(search.toLowerCase())
        );
        return { ...section, submenu: filteredSubmenu };
      } else {
        // Direct item: filter by its own label
        if (section.label.toLowerCase().includes(search.toLowerCase())) {
          return section;
        }
        return null;
      }
    })
    .filter(section => section && (section.submenu ? section.submenu.length > 0 : true));

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
                    {dummyNotifications.length === 0 ? (
                      <div style={{ color: '#8C8C8C', textAlign: 'center', padding: 12 }}>No new notifications</div>
                    ) : (
                      dummyNotifications.map(n => (
                        <div key={n.id} style={{ padding: '12px 0', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center' }}>
                          <span style={{ color: '#234B73', fontSize: 15 }}>{n.message}</span>
                          <span style={{ display: 'inline-block', width: 10, height: 10, background: '#F08F36', borderRadius: '50%', marginLeft: 10 }}></span>
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
                  onClick={() => { setProfileMenuOpen(false); navigate('/company-profile'); }}
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
          <div style={{ ...sidebarStyle, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{ fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: 1, textAlign: 'left', paddingLeft: 2 }}>
                Company Portal
              </span>
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
              onChange={e => setSearch(e.target.value)}
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
            {filteredMenu.map(item => (
              item.submenu ? (
                <div key={item.label} style={sidebarMenuSection}>
                  <div
                    style={{ ...sidebarMenuItem, background: isMenuOpen(item.label) ? '#35708E' : 'none', color: isMenuOpen(item.label) ? '#fff' : '#fff' }}
                    onClick={() => handleMenuClick(item.label)}
                  >
                    {item.icon}
                    {item.label}
                    <span style={{ marginLeft: 'auto', fontSize: 18 }}>{isMenuOpen(item.label) ? '▾' : '▸'}</span>
                  </div>
                  {isMenuOpen(item.label) && (
                    <div style={{ marginLeft: 0, marginTop: 0, marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {item.submenu.map(sub => (
                        <div
                          key={sub.label}
                          style={{
                            ...sidebarSubMenu,
                            ...(activeSubItem === sub.label ? sidebarActiveItem : {}),
                            marginBottom: 2,
                            borderRadius: 7,
                            padding: '10px 18px',
                            display: 'block',
                          }}
                          onClick={e => { e.stopPropagation(); setActiveSubItem(sub.label); sub.action(navigate, setSidebarOpen); }}
                          onMouseOver={e => e.currentTarget.style.background = '#35708E'}
                          onMouseOut={e => e.currentTarget.style.background = 'none'}
                        >
                          {sub.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  key={item.label}
                  style={{ ...sidebarMenuItem, color: '#fff' }}
                  onClick={() => { item.action(navigate, setSidebarOpen); setActiveSubItem(item.label); }}
                  onMouseOver={e => e.currentTarget.style.background = '#35708E'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  {item.icon}
                  {item.label}
                </div>
              )
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default CompanyNavbar; 