import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaFilter } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
import Navbar from './Navbar';

const cardStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
  padding: '28px',
  marginBottom: '32px',
};

const badge = {
  display: 'inline-block',
  borderRadius: '999px',
  padding: '2px 10px',
  fontSize: '13px',
  fontWeight: 500,
};

const badgeSuccess = { ...badge, background: '#D1FAE5', color: '#065F46' };
const badgeWarning = { ...badge, background: '#FEF3C7', color: '#92400E' };
const badgeDanger = { ...badge, background: '#FEE2E2', color: '#991B1B' };
const badgeInfo = { ...badge, background: '#DBEAFE', color: '#1E40AF' };
const badgeFinalized = { ...badge, background: '#E9D5FF', color: '#7C3AED' };

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

// Dummy data for demonstration
const dummyApplications = [
  { 
    id: 1, 
    company: 'Microsoft', 
    position: 'Software Engineer Intern', 
    status: 'Pending', 
    date: '2024-06-25',
    location: 'Cairo, Egypt',
    duration: '3 months',
    startDate: '2024-07-01',
    endDate: '2024-09-30'
  },
  { 
    id: 2, 
    company: 'Google', 
    position: 'UX Designer Intern', 
    status: 'Approved', 
    date: '2024-06-20',
    location: 'Remote',
    duration: '3 months',
    startDate: '2024-07-15',
    endDate: '2024-10-15'
  },
  { 
    id: 3, 
    company: 'Amazon', 
    position: 'Product Manager Intern', 
    status: 'Rejected', 
    date: '2024-06-15',
    location: 'Alexandria, Egypt',
    duration: '3 months',
    startDate: '2024-07-01',
    endDate: '2024-09-30'
  },
  {
    id: 4,
    company: 'Meta',
    position: 'Data Analyst Intern',
    status: 'Finalized',
    date: '2024-06-28',
    location: 'Remote',
    duration: '2 months',
    startDate: '2024-08-01',
    endDate: '2024-09-30'
  }
];

const dummyCurrentInternship = {
  id: 1,
  company: 'Google',
  position: 'UX Designer Intern',
  startDate: '2025-01-04',
  endDate: 'present',
  location: 'Remote',
  supervisor: 'John Smith',
  supervisorEmail: 'john.smith@google.com',
  status: 'Active',
  progress: 75,
  paid: true,
  expectedSalary: 1200,
  skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping'],
  jobDescription: 'Work with the UX team to design and prototype new features for Google products. Collaborate with engineers and product managers to deliver user-centered solutions.',
  weeklyReports: [
    { week: 1, status: 'Submitted', grade: 'A', feedback: 'Excellent work!' },
    { week: 2, status: 'Submitted', grade: 'A-', feedback: 'Great progress!' },
    { week: 3, status: 'Submitted', grade: 'A', feedback: 'Outstanding work!' },
    { week: 4, status: 'Submitted', grade: 'A+', feedback: 'Exceptional performance!' },
    { week: 5, status: 'Submitted', grade: 'A', feedback: 'Very good work!' },
    { week: 6, status: 'Submitted', grade: 'A-', feedback: 'Good progress!' },
    { week: 7, status: 'Submitted', grade: 'A', feedback: 'Excellent work!' },
    { week: 8, status: 'Submitted', grade: 'A+', feedback: 'Outstanding performance!' },
    { week: 9, status: 'Submitted', grade: 'A', feedback: 'Very good work!' },
    { week: 10, status: 'Submitted', grade: 'A-', feedback: 'Good progress!' },
    { week: 11, status: 'Submitted', grade: 'A', feedback: 'Excellent work!' },
    { week: 12, status: 'Pending', grade: 'N/A', feedback: 'Not yet reviewed' }
  ]
};

const dummyPastInternships = [
  {
    id: 1,
    company: 'Microsoft',
    position: 'Software Engineer Intern',
    startDate: '2023-07-01',
    endDate: '2023-09-30',
    location: 'Cairo, Egypt',
    supervisor: 'Sarah Johnson',
    supervisorEmail: 'sarah.johnson@microsoft.com',
    finalGrade: 'A',
    certificate: 'https://example.com/certificate1.pdf',
    feedback: 'Excellent performance throughout the internship. Demonstrated strong technical skills and great teamwork.',
    paid: false,
    expectedSalary: 0,
    skills: ['C#', '.NET', 'Azure', 'Teamwork'],
    jobDescription: 'Developed backend services for Microsoft Azure. Participated in code reviews and agile ceremonies.'
  },
  {
    id: 2,
    company: 'Amazon',
    position: 'Product Manager Intern',
    startDate: '2023-01-01',
    endDate: '2023-03-31',
    location: 'Alexandria, Egypt',
    supervisor: 'Michael Brown',
    supervisorEmail: 'michael.brown@amazon.com',
    finalGrade: 'A-',
    certificate: 'https://example.com/certificate2.pdf',
    feedback: 'Good performance with strong analytical skills. Areas for improvement in project management.',
    paid: true,
    expectedSalary: 900,
    skills: ['Product Management', 'Communication', 'Market Research'],
    jobDescription: 'Assisted in product launches and market research. Coordinated with cross-functional teams to deliver product features.'
  },
  {
    id: 3,
    company: 'Spotify',
    position: 'Music Data Intern',
    startDate: '2022-06-01',
    endDate: '2022-08-31',
    location: 'Berlin, Germany',
    supervisor: 'Anna Schmidt',
    supervisorEmail: 'anna.schmidt@spotify.com',
    finalGrade: 'B+',
    certificate: 'https://example.com/certificate3.pdf',
    feedback: 'Creative and analytical work on music data. Great team player.',
    paid: true,
    expectedSalary: 1000,
    skills: ['Data Analysis', 'Python', 'Music Trends'],
    jobDescription: 'Analyzed music listening trends and supported playlist curation.'
  },
  {
    id: 4,
    company: 'Tesla',
    position: 'Mechanical Engineer Intern',
    startDate: '2022-01-15',
    endDate: '2022-04-15',
    location: 'Fremont, CA',
    supervisor: 'Elon Smith',
    supervisorEmail: 'elon.smith@tesla.com',
    finalGrade: 'A',
    certificate: 'https://example.com/certificate4.pdf',
    feedback: 'Outstanding hands-on engineering and innovation.',
    paid: true,
    expectedSalary: 1500,
    skills: ['Mechanical Engineering', 'CAD', 'Manufacturing'],
    jobDescription: 'Worked on electric vehicle design and manufacturing processes.'
  },
  {
    id: 5,
    company: 'Unilever',
    position: 'Supply Chain Intern',
    startDate: '2021-07-01',
    endDate: '2021-09-30',
    location: 'London, UK',
    supervisor: 'James Lee',
    supervisorEmail: 'james.lee@unilever.com',
    finalGrade: 'B',
    certificate: 'https://example.com/certificate5.pdf',
    feedback: 'Solid performance in logistics and supply chain optimization.',
    paid: true,
    expectedSalary: 800,
    skills: ['Supply Chain', 'Logistics', 'Excel'],
    jobDescription: 'Optimized supply chain processes and logistics.'
  }
];

// Replace DotScale with a modern, styled horizontal bar with 5 labeled points and labels below
function DotScale({ value, onChange, name }) {
  const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '8px 0' }}>
      <div style={{ display: 'flex', gap: 18, alignItems: 'center', justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5].map((v, idx) => (
          <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => onChange(v)}
            style={{
                width: 32,
                height: 32,
              borderRadius: '50%',
                background: value === v ? '#F08F36' : '#E5E7EB',
                border: value === v ? '3px solid #F08F36' : '2px solid #C0CEDB',
                color: value === v ? '#fff' : '#234B73',
                fontWeight: 700,
                fontSize: 17,
                boxShadow: value === v ? '0 2px 8px #F08F3622' : 'none',
                transition: 'all 0.18s',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: 4
              }}
              aria-label={labels[idx]}
            >
              {v}
            </button>
            <span style={{ fontSize: 13, color: value === v ? '#F08F36' : '#8C8C8C', fontWeight: value === v ? 700 : 400, marginTop: 2 }}>{labels[idx]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MyInternships = () => {
  const navigate = useNavigate();
  const { user, logout, applications } = useAuth();
  const [currentInternship] = useState(dummyCurrentInternship);
  const [pastInternships] = useState(dummyPastInternships);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState([]);
  const [activeSubItem, setActiveSubItem] = useState('My Internships');
  const [activeCurrentInternship, setActiveCurrentInternship] = useState(null);
  const [activeListInternship, setActiveListInternship] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const notificationsDropdownRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'current', 'complete'
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  // Temporary filter state for modal
  const [pendingFilterType, setPendingFilterType] = useState(filterType);
  const [pendingDateFrom, setPendingDateFrom] = useState(dateFrom);
  const [pendingDateTo, setPendingDateTo] = useState(dateTo);
  // Evaluations state: { [internshipId]: { ratings: {...}, text: string, recommend: boolean } }
  const [evaluations, setEvaluations] = useState({});
  const [editingEvalId, setEditingEvalId] = useState(null);
  const [evalDraft, setEvalDraft] = useState({
    ratings: {
      environment: 3,
      learning: 3,
      mentorship: 3,
      worklife: 3,
    },
    text: '',
    recommend: false
  });
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalModalInternshipId, setEvalModalInternshipId] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterBtnRef = useRef();
  const [saveEvalSuccess, setSaveEvalSuccess] = useState(false);

  // Combine dummy applications with new applications from context
  const allApplications = [...dummyApplications, ...applications];

  // Dummy user major and courses
  const userMajor = user?.major || 'CS';
  const majorCourses = {
    CS: [
      'Data Structures', 'Algorithms', 'Operating Systems', 'Database Systems', 'Software Engineering', 'Computer Networks', 'Web Development', 'Machine Learning'
    ],
    Engineering: [
      'Thermodynamics', 'Fluid Mechanics', 'Control Systems', 'Materials Science', 'Circuits', 'Statics', 'Dynamics', 'Engineering Design'
    ],
    Business: [
      'Accounting', 'Finance', 'Marketing', 'Organizational Behavior', 'Business Law', 'Operations Management', 'Economics', 'Business Strategy'
    ]
  };
  const availableCourses = majorCourses[userMajor] || majorCourses['CS'];

  // Reports state: { [internshipId]: { title, introduction, body, selectedCourses, finalized, status, comments } }
  const [reports, setReports] = useState({
    'past-3': {
      title: 'Spotify Data Analysis Report',
      introduction: 'Overview of music data analysis at Spotify.',
      body: 'Worked on playlist curation and user trend analysis. Used Python and SQL for data mining.',
      selectedCourses: ['Data Structures', 'Machine Learning'],
      finalized: true,
      status: 'Flagged',
      comments: 'Some data sources were not properly cited. Please review the guidelines.'
    },
    'past-4': {
      title: 'Tesla Engineering Report',
      introduction: 'Summary of mechanical engineering internship at Tesla.',
      body: 'Participated in EV design and manufacturing. Learned CAD and hands-on assembly.',
      selectedCourses: ['Engineering Design', 'Materials Science'],
      finalized: true,
      status: 'Accepted',
      comments: 'Excellent technical detail and clear presentation of engineering concepts.'
    },
    'past-1': {
      title: '',
      introduction: '',
      body: '',
      selectedCourses: [],
      finalized: false
    },
    'past-2': {
      title: 'Amazon Product Management Report',
      introduction: 'Analysis of product management internship at Amazon.',
      body: 'Assisted in product launches and market research. Coordinated with cross-functional teams to deliver product features. Conducted user interviews and analyzed feedback.',
      selectedCourses: ['Business Strategy', 'Operations Management'],
      finalized: true,
      status: 'Accepted',
      comments: 'Strong analysis of product management methodologies and market research.'
    },
    'past-5': {
      title: 'Unilever Supply Chain Report',
      introduction: 'Analysis of supply chain optimization at Unilever.',
      body: 'Worked on logistics and supply chain processes. Attempted to optimize delivery routes and inventory management.',
      selectedCourses: ['Supply Chain', 'Logistics'],
      finalized: true,
      status: 'Rejected',
      comments: 'The report lacks sufficient quantitative analysis and concrete examples of optimization methods used. Please provide more detailed metrics, data analysis, and specific examples of improvements made. Also, include more information about the tools and methodologies employed.'
    }
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportModalInternshipId, setReportModalInternshipId] = useState(null);
  const [reportDraft, setReportDraft] = useState({ title: '', introduction: '', body: '', selectedCourses: [], finalized: false });

  // Combine current and past internships with unique keys
  const allInternships = [
    { ...currentInternship, _type: 'current' },
    ...pastInternships.map(p => ({ ...p, _type: 'past' }))
  ];

  // Filter and search logic
  const filteredInternships = allInternships.filter(internship => {
    // Filter by type
    if (filterType === 'current' && internship._type !== 'current') return false;
    if (filterType === 'complete' && internship._type !== 'past') return false;
    // Filter by date range
    if (dateFrom) {
      const internshipEnd = new Date(internship.endDate);
      const from = new Date(dateFrom);
      if (internshipEnd < from) return false;
    }
    if (dateTo) {
      const internshipStart = new Date(internship.startDate);
      const to = new Date(dateTo);
      if (internshipStart > to) return false;
    }
    // Search by job title or company name (starts with only)
    const search = searchTerm.trim().toLowerCase();
    if (search) {
      const job = internship.position.toLowerCase();
      const company = internship.company.toLowerCase();
      return job.startsWith(search) || company.startsWith(search);
    }
    return true;
  });

  // Get first name initial and full name for welcome
  const firstInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S';
  const displayName = user?.fullName || 'Student';

  const menuStructure = [
    {
      label: 'Main',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>,
      submenu: [
        { label: 'Dashboard', action: () => navigate('/dashboard') },
        { label: 'My Profile', action: () => navigate('/profile') },
      ],
    },
    {
      label: 'Internships',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>,
      submenu: [
        { label: 'My Internships', action: () => navigate('/my-internships') },
        { label: 'Browse Internships', action: () => navigate('/browse-internships') },
        { label: 'Internship Guideline', action: () => navigate('/internship-guideline') },
      ],
    },
    // {
    //   label: 'Reservation',
    //   icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v2M8 3v2" /></svg>,
    //   submenu: [
    //     { label: 'SCAD Appointment', action: () => alert('SCAD Appointment') },
    //     { label: 'Career Workshop', action: () => alert('Career Workshop') },
    //     { label: 'Online Assessments', action: () => alert('Online Assessments') },
    //   ],
    // },
    // {
    //   label: 'Certificates',
    //   icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>,
    //   submenu: [
    //     { label: 'My Certificate', action: () => navigate('/workshop-certificates') },
    //   ],
    // },
  ];

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
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileMenuOpen]);

  // PDF download handler
  const handleDownloadReportPDF = async (reportId) => {
    const reportElement = document.getElementById(`finalized-report-${reportId}`);
    if (!reportElement) return;
    const canvas = await html2canvas(reportElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 40;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
    pdf.save('internship-report.pdf');
  };

  // Helper to get unique internship key
  const getInternshipKey = (internship) => `${internship._type}-${internship.id}`;

  // Add state for comments modal
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsModalReportId, setCommentsModalReportId] = useState(null);
  const [appealDraft, setAppealDraft] = useState('');
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showFilterDropdown) return;
    const handleClick = (e) => {
      if (
        !e.target.closest('.myinternships-filter-dropdown') &&
        !e.target.closest('.myinternships-filter-btn')
      ) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showFilterDropdown]);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />
      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <>
          <div style={sidebarOverlay} onClick={handleSidebarClose} />
          <div style={sidebarStyle}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 18 }}>
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
              {menuStructure.map((item, idx) => (
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
                      {item.submenu.map((sub, subIdx) => (
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
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div style={{ padding: '32px', marginTop: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: '#234B73', fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>
            My Internships
          </h1>

          {/* My Applications Section */}
          <div style={cardStyle}>
            <h2 style={{ color: '#234B73', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              My Applications
            </h2>
            {allApplications.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ color: '#234B73', fontWeight: '700', fontSize: '15px', textAlign: 'left', padding: '12px', background: '#C0CEDB' }}>Company</th>
                      <th style={{ color: '#234B73', fontWeight: '700', fontSize: '15px', textAlign: 'left', padding: '12px', background: '#C0CEDB' }}>Position</th>
                      <th style={{ color: '#234B73', fontWeight: '700', fontSize: '15px', textAlign: 'left', padding: '12px', background: '#C0CEDB' }}>Location</th>
                      <th style={{ color: '#234B73', fontWeight: '700', fontSize: '15px', textAlign: 'left', padding: '12px', background: '#C0CEDB' }}>Duration</th>
                      <th style={{ color: '#234B73', fontWeight: '700', fontSize: '15px', textAlign: 'left', padding: '12px', background: '#C0CEDB' }}>Status</th>
                      <th style={{ color: '#234B73', fontWeight: '700', fontSize: '15px', textAlign: 'left', padding: '12px', background: '#C0CEDB' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allApplications.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px', color: '#234B73', fontSize: '15px' }}>{app.company}</td>
                        <td style={{ padding: '12px', color: '#8C8C8C', fontSize: '15px' }}>{app.position}</td>
                        <td style={{ padding: '12px', color: '#8C8C8C', fontSize: '15px' }}>{app.location}</td>
                        <td style={{ padding: '12px', color: '#8C8C8C', fontSize: '15px' }}>{app.duration}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={
                            app.status.toLowerCase() === 'approved' ? badgeSuccess :
                            app.status.toLowerCase() === 'accepted' ? badgeSuccess :
                            app.status.toLowerCase() === 'rejected' ? badgeDanger :
                            app.status.toLowerCase() === 'finalized' ? badgeFinalized :
                            badgeWarning
                          }>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#8C8C8C', fontSize: '15px' }}>{app.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', color: '#8C8C8C' }}>
                No applications found. Start applying for internships!
              </div>
            )}
          </div>

          {/* My Internships Section (current + past) */}
          <div style={cardStyle}>
            <h2 style={{ color: '#234B73', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              My Internships
            </h2>
            {/* Search Bar and Filter Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
              <input
                type="text"
                placeholder="Search by job title or company name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 220,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #C0CEDB',
                  fontSize: 16,
                  outline: 'none',
                  background: '#F9FAFB',
                  color: '#234B73',
                }}
              />
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  className="myinternships-filter-btn"
                  ref={filterBtnRef}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    color: '#F08F36',
                    fontWeight: 700,
                    fontSize: 18,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    letterSpacing: 0.5,
                    userSelect: 'none',
                    borderRadius: 8,
                    padding: '6px 18px 6px 10px',
                    position: 'relative',
                  }}
                  onClick={() => setShowFilterDropdown(v => !v)}
                >
                  <FaFilter style={{ fontSize: 18, color: '#F08F36' }} />
                  Filter
                </button>
                {showFilterDropdown && (
                  <div
                    className="myinternships-filter-dropdown"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: '#fff',
                      borderRadius: 16,
                      boxShadow: '0 2px 12px rgba(35,75,115,0.12)',
                      padding: 24,
                      minWidth: 320,
                      zIndex: 10,
                      marginTop: 6,
                    }}
                  >
                    <div style={{ color: '#F08F36', fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <FaFilter style={{ fontSize: 18, color: '#F08F36' }} />
                      <span>Filter Internships</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      <select
                        value={pendingFilterType}
                        onChange={e => setPendingFilterType(e.target.value)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: '1px solid #C0CEDB',
                          fontSize: 16,
                          background: '#F9FAFB',
                          color: '#234B73',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="all">All</option>
                        <option value="current">Current Intern</option>
                        <option value="complete">Internship Complete</option>
                      </select>
                      {pendingFilterType === 'complete' && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <label style={{ color: '#234B73', fontWeight: 500, fontSize: 15 }}>From:</label>
                            <input
                              type="date"
                              value={pendingDateFrom}
                              onChange={e => setPendingDateFrom(e.target.value)}
                              style={{
                                padding: '8px 10px',
                                borderRadius: 8,
                                border: '1px solid #C0CEDB',
                                fontSize: 15,
                                background: '#F9FAFB',
                                color: '#234B73',
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <label style={{ color: '#234B73', fontWeight: 500, fontSize: 15 }}>To:</label>
                            <input
                              type="date"
                              value={pendingDateTo}
                              onChange={e => setPendingDateTo(e.target.value)}
                              style={{
                                padding: '8px 10px',
                                borderRadius: 8,
                                border: '1px solid #C0CEDB',
                                fontSize: 15,
                                background: '#F9FAFB',
                                color: '#234B73',
                              }}
                            />
                          </div>
                        </>
                      )}
                      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button
                          onClick={() => {
                            setPendingFilterType('all');
                            setPendingDateFrom('');
                            setPendingDateTo('');
                          }}
                          style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                          type="button"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => {
                            setFilterType(pendingFilterType);
                            setDateFrom(pendingDateFrom);
                            setDateTo(pendingDateTo);
                            setShowFilterDropdown(false);
                          }}
                          style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                          type="button"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {allInternships.length > 0 ? (
              <div style={{ display: 'grid', gap: '18px' }}>
                {filteredInternships.length === 0 && (
                  <div style={{ color: '#8C8C8C', textAlign: 'center', padding: '24px' }}>No internships found.</div>
                )}
                {filteredInternships.map(internship => {
                  const uniqueKey = getInternshipKey(internship);
                  return (
                    <React.Fragment key={uniqueKey}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          padding: '18px 0',
                          borderBottom: '1px solid #F3F4F6',
                          position: 'relative',
                          paddingRight: 36
                        }}
                        onClick={() => setActiveListInternship(activeListInternship === uniqueKey ? null : uniqueKey)}
                      >
                        <span style={{ fontWeight: 600, color: '#234B73', fontSize: 18, marginRight: 18 }}>{internship.company}</span>
                        <div style={{ color: '#8C8C8C', fontSize: 16, marginRight: 18 }}>{internship.position}</div>
                        <div style={{ color: '#234B73', fontWeight: 500, fontSize: 15, marginRight: 12 }}>
                          {new Date(internship.startDate).toLocaleDateString()} - {internship.endDate === 'present' ? 'present' : new Date(internship.endDate).toLocaleDateString()}
                        </div>
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#234B73"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: '50%',
                            transform: `translateY(-50%) ${activeListInternship === uniqueKey ? 'rotate(90deg)' : 'rotate(0deg)'}`,
                            transition: 'transform 0.2s'
                          }}
                        >
                          <polyline points="9 6 15 12 9 18" />
                        </svg>
                      </div>
                      {activeListInternship === uniqueKey && (
                        <div style={{ background: '#F6F8FA', borderRadius: 8, margin: '18px 0', padding: 24 }}>
                          <div style={{ marginBottom: 12 }}><b>Company:</b> {internship.company}</div>
                          <div style={{ marginBottom: 12 }}><b>Job Title:</b> {internship.position}</div>
                          <div style={{ marginBottom: 12 }}><b>Duration:</b> {new Date(internship.startDate).toLocaleDateString()} - {internship.endDate === 'present' ? 'present' : new Date(internship.endDate).toLocaleDateString()}</div>
                          <div style={{ marginBottom: 12 }}><b>Paid:</b> {internship.paid ? 'Paid' : 'Unpaid'}</div>
                          {internship.paid && (
                            <div style={{ marginBottom: 12 }}><b>Expected Salary:</b> ${internship.expectedSalary} / month</div>
                          )}
                          <div style={{ marginBottom: 12 }}><b>Skills Required:</b> {internship.skills.join(', ')}</div>
                          <div style={{ marginBottom: 12 }}><b>Job Description:</b> {internship.jobDescription}</div>
                          {'progress' in internship && (
                            <div style={{ marginTop: 24, marginBottom: 8 }}>
                              <b>Progress:</b>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                                <div style={{ width: 200, height: 10, background: '#C0CEDB', borderRadius: 5, overflow: 'hidden' }}>
                                  <div style={{ width: `${internship.progress}%`, height: '100%', background: '#F08F36', borderRadius: 5, transition: 'width 0.3s' }} />
                                </div>
                                <span style={{ color: '#234B73', fontWeight: 600 }}>{internship.progress}%</span>
                              </div>
                            </div>
                          )}
                          {internship._type === 'past' && (
                            <div style={{ marginTop: 32, paddingTop: 18, borderTop: '1px solid #C0CEDB' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <b style={{ color: '#234B73', fontSize: 17 }}>Evaluation</b>
                                {(() => {
                                  const reportKey = getInternshipKey(internship);
                                  const report = reports[reportKey];
                                  if (report && report.finalized) {
                                    return (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{
                                          borderRadius: 8,
                                          padding: '2px 12px',
                                          fontWeight: 700,
                                          fontSize: 14,
                                          background:
                                            report && (report.status === 'Accepted' || report.status === 'Approved') ? '#D1FAE5' :
                                            report && report.status === 'Rejected' ? '#FEE2E2' :
                                            report && report.status === 'Flagged' ? '#FEF3C7' :
                                            '#FEF3C7', // Pending or default
                                          color:
                                            report && (report.status === 'Accepted' || report.status === 'Approved') ? '#065F46' :
                                            report && report.status === 'Rejected' ? '#991B1B' :
                                            report && report.status === 'Flagged' ? '#F08F36' :
                                            '#92400E', // Pending or default
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: 6,
                                          minWidth: 80,
                                          justifyContent: 'center',
                                        }}>
                                          {report && report.status === 'Flagged' && <span style={{ fontSize: 16, marginRight: 2 }}>⚠️</span>}
                                          {report && report.status === 'Rejected' && <span style={{ fontSize: 16, marginRight: 2 }}>⛔</span>}
                                          {report && (report.status === 'Accepted' || report.status === 'Approved') && <span style={{ fontSize: 16, marginRight: 2 }}>✅</span>}
                                          {(!report || !report.status) && <span style={{ fontSize: 16, marginRight: 2 }}>⏳</span>}
                                          {report ? ((report.status === 'Accepted' || report.status === 'Approved') ? 'Accepted' : report.status) : 'Pending'}
                                        </span>
                                        {report && (report.status === 'Flagged' || report.status === 'Rejected') && report.comments && (
                                          <button
                                            style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 14px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                                            onClick={() => { setShowCommentsModal(true); setCommentsModalReportId(reportKey); setAppealDraft(''); setAppealSubmitted(false); }}
                                          >
                                            Comments
                                          </button>
                                        )}
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                              <button
                                style={{ marginTop: 14, padding: '8px 22px', borderRadius: 8, border: 'none', background: '#234B73', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                                onClick={() => {
                                  if (evaluations[internship.id]) {
                                    setEvalDraft({ ...evaluations[internship.id] });
                                  } else {
                                    setEvalDraft({
                                      ratings: { environment: 3, learning: 3, mentorship: 3, worklife: 3 },
                                      text: '',
                                      recommend: false
                                    });
                                  }
                                  setEvalModalInternshipId(internship.id);
                                  setShowEvalModal(true);
                                }}
                              >
                                {evaluations[internship.id] ? 'View Evaluation' : 'Evaluate Company'}
                              </button>
                              {/* Report Button for CRUD (only for past internships) */}
                              <button
                                style={{ marginTop: 14, marginLeft: 12, padding: '8px 22px', borderRadius: 8, border: 'none', background: '#35708E', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                                onClick={() => {
                                  const key = getInternshipKey(internship);
                                  if (reports[key]) {
                                    setReportDraft({ ...reports[key] });
                                  } else {
                                    setReportDraft({ title: '', introduction: '', body: '', selectedCourses: [], finalized: false });
                                  }
                                  setReportModalInternshipId(key);
                                  setShowReportModal(true);
                                }}
                              >
                                {reports[getInternshipKey(internship)] ? (reports[getInternshipKey(internship)].finalized ? 'View Report' : 'Create Report') : 'Create Report'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', color: '#8C8C8C' }}>
                No internships found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Evaluation Modal */}
      {showEvalModal && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.18)',
              zIndex: 3000,
            }}
            onClick={() => { setShowEvalModal(false); setEvalModalInternshipId(null); }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(35,75,115,0.18)',
              padding: '36px 32px 28px 32px',
              zIndex: 3001,
              minWidth: 340,
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              marginTop: 32,
              marginBottom: 32,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ color: '#234B73', fontWeight: 700, fontSize: 22 }}>Evaluate Company</span>
              <button
                onClick={() => { setShowEvalModal(false); setEvalModalInternshipId(null); }}
                style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }}
                aria-label="Close evaluation modal"
              >
                ×
              </button>
            </div>
            <form
              style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
              onSubmit={e => {
                e.preventDefault();
                setEvaluations(evals => ({ ...evals, [evalModalInternshipId]: { ...evalDraft } }));
                setSaveEvalSuccess(true);
                setTimeout(() => {
                  setSaveEvalSuccess(false);
                  setShowEvalModal(false);
                  setEvalModalInternshipId(null);
                }, 500);
              }}
            >
              <div style={{ color: '#234B73', fontWeight: 500, fontSize: 16 }}>Rate the following on a scale of 1 to 5:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ color: '#234B73', fontWeight: 500 }}>
                  Work Environment:
                  <DotScale
                    value={evalDraft.ratings.environment}
                    onChange={v => setEvalDraft(d => ({ ...d, ratings: { ...d.ratings, environment: v } }))}
                    name="environment"
                  />
                </label>
                <label style={{ color: '#234B73', fontWeight: 500 }}>
                  Learning Experience:
                  <DotScale
                    value={evalDraft.ratings.learning}
                    onChange={v => setEvalDraft(d => ({ ...d, ratings: { ...d.ratings, learning: v } }))}
                    name="learning"
                  />
                </label>
                <label style={{ color: '#234B73', fontWeight: 500 }}>
                  Mentorship:
                  <DotScale
                    value={evalDraft.ratings.mentorship}
                    onChange={v => setEvalDraft(d => ({ ...d, ratings: { ...d.ratings, mentorship: v } }))}
                    name="mentorship"
                  />
                </label>
                <label style={{ color: '#234B73', fontWeight: 500 }}>
                  Work-Life Balance:
                  <DotScale
                    value={evalDraft.ratings.worklife}
                    onChange={v => setEvalDraft(d => ({ ...d, ratings: { ...d.ratings, worklife: v } }))}
                    name="worklife"
                  />
                </label>
              </div>
              <label style={{ color: '#234B73', fontWeight: 500 }}>
                Additional Comments:
                <textarea
                  value={evalDraft.text}
                  onChange={e => setEvalDraft(d => ({ ...d, text: e.target.value }))}
                  rows={3}
                  style={{ width: '100%', marginTop: 6, borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, resize: 'vertical', background: '#fff', color: '#234B73' }}
                />
              </label>
              <label style={{ color: '#234B73', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={evalDraft.recommend}
                  onChange={e => setEvalDraft(d => ({ ...d, recommend: e.target.checked }))}
                  style={{ accentColor: '#F08F36', width: 18, height: 18 }}
                />
                I recommend this company to other students
              </label>
              <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 28px',
                    borderRadius: 8,
                    border: 'none',
                    background: saveEvalSuccess ? '#22C55E' : '#F08F36',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: saveEvalSuccess ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: 'none',
                    transition: 'background 0.18s',
                  }}
                  disabled={saveEvalSuccess}
                >
                  {saveEvalSuccess ? <FaCheck style={{ fontSize: 20 }} /> : null}
                  {saveEvalSuccess ? 'Saved' : (evaluations[evalModalInternshipId] ? 'Update' : 'Save')}
                </button>
                <button
                  type="button"
                  style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: '#8C8C8C', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                  onClick={() => { setShowEvalModal(false); setEvalModalInternshipId(null); }}
                  disabled={saveEvalSuccess}
                >
                  Cancel
                </button>
                {evaluations[evalModalInternshipId] && (
                  <button
                    type="button"
                    style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: '#991B1B', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                    onClick={() => {
                      setEvaluations(evals => { const copy = { ...evals }; delete copy[evalModalInternshipId]; return copy; });
                      setShowEvalModal(false);
                      setEvalModalInternshipId(null);
                    }}
                    disabled={saveEvalSuccess}
                  >
                    <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.18)',
              zIndex: 4000,
            }}
            onClick={() => { setShowReportModal(false); setReportModalInternshipId(null); }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(35,75,115,0.18)',
              padding: '36px 32px 28px 32px',
              zIndex: 4001,
              minWidth: 340,
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ color: '#234B73', fontWeight: 700, fontSize: 22 }}>{reportDraft.finalized ? 'View Report' : (reports[reportModalInternshipId] ? 'Edit Report' : 'Create Report')}</span>
              <button
                onClick={() => { setShowReportModal(false); setReportModalInternshipId(null); }}
                style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }}
                aria-label="Close report modal"
              >
                ×
              </button>
            </div>
            {reportDraft.finalized ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    borderRadius: 16,
                    padding: '4px 14px',
                    fontWeight: 700,
                    fontSize: 15,
                    background: !reportDraft.status ? '#FEF3C7' : reportDraft.status === 'Flagged' ? '#DBEAFE' : reportDraft.status === 'Rejected' ? '#FEE2E2' : (reportDraft.status === 'Accepted' || reportDraft.status === 'Approved') ? '#D1FAE5' : '#FEF3C7',
                    color: !reportDraft.status ? '#92400E' : reportDraft.status === 'Flagged' ? '#1E40AF' : reportDraft.status === 'Rejected' ? '#991B1B' : (reportDraft.status === 'Accepted' || reportDraft.status === 'Approved') ? '#065F46' : '#92400E',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    letterSpacing: 0.2,
                  }}>
                    {!reportDraft.status && (<span style={{ fontSize: 18 }}>⏳</span>)}
                    {reportDraft.status === 'Flagged' && (<span style={{ fontSize: 18 }}>⚠️</span>)}
                    {reportDraft.status === 'Rejected' && (<span style={{ fontSize: 18 }}>⛔</span>)}
                    {(reportDraft.status === 'Accepted' || reportDraft.status === 'Approved') && (<span style={{ fontSize: 18 }}>✅</span>)}
                    {reportDraft.status === 'Finalized' && (<span style={{ fontSize: 18 }}>✔️</span>)}
                    {!reportDraft.status ? 'Pending' : (reportDraft.status === 'Accepted' || reportDraft.status === 'Approved') ? 'Accepted' : reportDraft.status}
                  </span>
                  {/* Download PDF button for finalized reports */}
                  <button
                    style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                    onClick={() => handleDownloadReportPDF(reportModalInternshipId)}
                  >
                    Download PDF
                  </button>
                </div>
                <div id={`finalized-report-${reportModalInternshipId}`} style={{ color: '#234B73', fontSize: 16 }}>
                  <div style={{ marginBottom: 12 }}><b>Title:</b> {reportDraft.title}</div>
                  <div style={{ marginBottom: 12 }}><b>Introduction:</b> {reportDraft.introduction}</div>
                  <div style={{ marginBottom: 12 }}><b>Body:</b> {reportDraft.body}</div>
                  <div style={{ marginBottom: 12 }}><b>Courses that helped:</b> {reportDraft.selectedCourses.join(', ')}</div>
                </div>
                {(reportDraft.status === 'Flagged' || reportDraft.status === 'Rejected') && (
                  <div style={{ marginTop: 18, background: '#FEE2E2', borderRadius: 12, padding: 18, color: '#991B1B', fontWeight: 500, boxShadow: '0 1px 8px rgba(255,0,0,0.04)' }}>
                    <div style={{ fontWeight: 700, marginBottom: 6, color: '#991B1B' }}>Comments from Reviewer:</div>
                    <div style={{ marginBottom: 12, color: '#234B73', fontWeight: 400 }}>{reportDraft.comments}</div>
                    {!appealSubmitted ? (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontWeight: 700, color: '#F08F36', marginBottom: 6 }}>Appeal this decision:</div>
                        <textarea
                          value={appealDraft}
                          onChange={e => setAppealDraft(e.target.value)}
                          rows={3}
                          style={{ width: '100%', borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, resize: 'vertical', background: '#fff', color: '#234B73' }}
                          placeholder="Write your appeal message here..."
                        />
                  <button
                          style={{ marginTop: 10, background: '#35708E', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #35708E22' }}
                          onClick={() => setAppealSubmitted(true)}
                        >
                          Submit Appeal
                        </button>
                </div>
                    ) : (
                      <div style={{ marginTop: 10, color: '#35708E', fontWeight: 700 }}>Your appeal has been submitted.</div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setReports(prev => ({
                    ...prev,
                    [reportModalInternshipId]: {
                      ...reportDraft,
                      finalized: true,
                      status: 'Pending'
                    }
                  }));
                  setShowReportModal(false);
                  setReportModalInternshipId(null);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
              >
                <div>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: 500, marginBottom: 6 }}>Title:</label>
                  <input
                    type="text"
                    value={reportDraft.title}
                    onChange={e => setReportDraft(d => ({ ...d, title: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #C0CEDB', fontSize: 15, background: '#fff', color: '#234B73' }}
                    placeholder="Enter report title"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: 500, marginBottom: 6 }}>Introduction:</label>
                  <textarea
                    value={reportDraft.introduction}
                    onChange={e => setReportDraft(d => ({ ...d, introduction: e.target.value }))}
                    rows={3}
                    style={{ width: '100%', borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, resize: 'vertical', background: '#fff', color: '#234B73' }}
                    placeholder="Write a brief introduction..."
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: 500, marginBottom: 6 }}>Body:</label>
                  <textarea
                    value={reportDraft.body}
                    onChange={e => setReportDraft(d => ({ ...d, body: e.target.value }))}
                    rows={6}
                    style={{ width: '100%', borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, resize: 'vertical', background: '#fff', color: '#234B73' }}
                    placeholder="Write your report content..."
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: 500, marginBottom: 6 }}>Courses that helped:</label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                    gap: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '8px',
                    border: '1px solid #C0CEDB',
                    borderRadius: '8px',
                    background: '#fff'
                  }}>
                  {availableCourses.map(course => (
                      <label
                        key={course}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          ':hover': {
                            background: '#F3F4F6'
                          }
                        }}
                      >
                      <input
                        type="checkbox"
                        checked={reportDraft.selectedCourses.includes(course)}
                        onChange={e => {
                            setReportDraft(d => ({
                              ...d,
                              selectedCourses: e.target.checked
                                ? [...d.selectedCourses, course]
                                : d.selectedCourses.filter(c => c !== course)
                            }));
                          }}
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: '#234B73'
                          }}
                        />
                        <span style={{ color: '#234B73', fontSize: '15px' }}>{course}</span>
                    </label>
                  ))}
                  </div>
                  <div style={{ fontSize: 13, color: '#8C8C8C', marginTop: 4 }}>Select all courses that helped you during this internship</div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button
                    type="submit"
                    style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: '#234B73', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                  >
                    {reports[reportModalInternshipId] ? 'Update Report' : 'Submit Report'}
                  </button>
                  <button
                    type="button"
                    style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: '#8C8C8C', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                    onClick={() => { setShowReportModal(false); setReportModalInternshipId(null); }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}

      {/* Comments Modal */}
      {showCommentsModal && commentsModalReportId && (
        <div>
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 5000 }} onClick={() => setShowCommentsModal(false)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', padding: '36px 32px 28px 32px', zIndex: 5001, minWidth: 340, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ color: '#234B73', fontWeight: 700, fontSize: 22 }}>Reviewer Comments</span>
                    <button
                onClick={() => setShowCommentsModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }}
                aria-label="Close comments modal"
              >
                ×
                    </button>
            </div>
            <div style={{ marginBottom: 16, color: '#991B1B', fontWeight: 600 }}>{reports[commentsModalReportId]?.status}</div>
            <div style={{ marginBottom: 16, color: '#234B73', fontWeight: 400 }}>{reports[commentsModalReportId]?.comments}</div>
            {reports[commentsModalReportId]?.comments && !appealSubmitted ? (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 600, color: '#F08F36', marginBottom: 6 }}>Appeal this decision:</div>
                <textarea
                  value={appealDraft}
                  onChange={e => setAppealDraft(e.target.value)}
                  rows={3}
                  style={{ width: '100%', borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, resize: 'vertical', background: '#fff', color: '#234B73' }}
                  placeholder="Write your appeal message here..."
                />
                    <button
                  style={{ marginTop: 8, background: '#35708E', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                  onClick={() => setAppealSubmitted(true)}
                >
                  Submit Appeal
                    </button>
                </div>
            ) : appealSubmitted ? (
              <div style={{ marginTop: 10, color: '#35708E', fontWeight: 600 }}>Your appeal has been submitted.</div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInternships; 