import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { FaCheck } from 'react-icons/fa';
import Navbar from './Navbar';
import CompanyTimedNotification from './CompanyTimedNotification';

const headerGradient = {
  background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
  color: '#fff',
  padding: '48px 0 60px 0',
  textAlign: 'center',
  boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
};
const profileCard = {
  background: '#fff',
  borderRadius: '18px',
  boxShadow: '0 8px 32px rgba(35,75,115,0.10)',
  padding: '36px 40px',
  maxWidth: 540,
  margin: '-80px auto 32px auto',
  display: 'flex',
  alignItems: 'center',
  gap: 32,
  borderTop: '6px solid #F08F36',
};
const avatarStyle = {
  width: 110,
  height: 110,
  borderRadius: '50%',
  background: '#C0CEDB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 54,
  color: '#234B73',
  fontWeight: 700,
  border: '3px solid #fff',
  boxShadow: '0 2px 8px #C0CEDB',
};
const infoBlock = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};
const nameStyle = {
  color: '#234B73',
  fontWeight: 700,
  fontSize: 28,
  letterSpacing: 1,
  marginBottom: 2,
};
const emailStyle = {
  color: '#8C8C8C',
  fontSize: 16,
  marginBottom: 8,
};
const labelStyle = {
  color: '#234B73',
  fontWeight: 600,
  fontSize: 15,
  marginRight: 8,
};
const valueStyle = {
  color: '#1a3a5a',
  fontWeight: 500,
  fontSize: 15,
};
const editBtn = {
  background: '#F08F36',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '12px 28px',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
  opacity: 1,
  boxShadow: 'none',
  marginLeft: 24,
};
const postsSection = {
  maxWidth: 700,
  margin: '0 auto',
  padding: '0 16px 40px 16px',
};
const postsTitle = {
  color: '#234B73',
  fontWeight: 700,
  fontSize: 22,
  marginBottom: 18,
  marginLeft: 8,
};
const postCard = {
  background: '#fff',
  borderRadius: '14px',
  boxShadow: '0 4px 24px rgba(35,75,115,0.10)',
  padding: '22px 28px',
  marginBottom: 24,
  color: '#234B73',
  fontSize: 17,
  fontWeight: 500,
  borderLeft: '6px solid #234B73',
  transition: 'box-shadow 0.2s',
};
const postTitle = {
  fontWeight: 700,
  fontSize: 19,
  marginBottom: 8,
  color: '#234B73',
};
const postDate = {
  color: '#8C8C8C',
  fontSize: 14,
  marginBottom: 12,
};

const dummyPosts = [
  {
    id: 1,
    title: 'Looking for a summer internship',
    content: 'I am looking for a software engineering internship this summer. Any recommendations?',
    date: '2024-06-01',
  },
  {
    id: 2,
    title: 'Completed my first project!',
    content: 'Excited to share that I have completed my first web app project for the internship system.',
    date: '2024-05-20',
  },
  {
    id: 3,
    title: 'Question about report submission',
    content: 'Does anyone know the deadline for the week 3 report?',
    date: '2024-05-15',
  },
];

// Job interest options by major
const jobInterestOptions = {
  'Computer Science': ['Software Development', 'Machine Learning', 'Web Development', 'AI Research', 'Cybersecurity'],
  'Computer Engineering': ['Embedded Systems', 'Chip Design', 'IoT', 'Robotics', 'Software Engineering'],
  'Information Systems': ['Business Analysis', 'ERP', 'IT Consulting', 'Data Analytics'],
  'Mechanical Engineering': ['Automotive', 'Aerospace', 'Manufacturing', 'Robotics'],
  'Electrical Engineering': ['Power Systems', 'Electronics', 'Telecommunications', 'Control Systems'],
  'Civil Engineering': ['Structural Design', 'Construction Management', 'Urban Planning'],
  'Architecture': ['Urban Design', 'Interior Design', 'Landscape Architecture'],
  'Business Administration': ['Marketing', 'Finance', 'HR', 'Management', 'Consulting'],
  'Economics': ['Market Analysis', 'Banking', 'Policy Research', 'Finance'],
  'Pharmacy': ['Clinical Pharmacy', 'Pharmaceutical Research', 'Regulatory Affairs'],
  'Biotechnology': ['Genetic Engineering', 'Bioinformatics', 'Pharma Research'],
};

// Helper for semester options
function getSemesterOptions(major) {
  if ([
    'Computer Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Architecture', 'Pharmacy', 'Biotechnology'
  ].includes(major)) {
    return Array.from({ length: 10 }, (_, i) => `${i + 1}`);
  }
  if ([
    'Information Systems', 'Economics', 'Business Administration'
  ].includes(major)) {
    return Array.from({ length: 8 }, (_, i) => `${i + 1}`);
  }
  return Array.from({ length: 8 }, (_, i) => `${i + 1}`);
}

// Custom MultiSelect component for job interests
function MultiSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleToggle = (opt) => {
    if (value.includes(opt)) {
      onChange(value.filter(v => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative', minHeight: 44 }}>
      <div
        style={{
          minHeight: 44,
          border: '1px solid #C0CEDB',
          borderRadius: 6,
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 6,
          background: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(o => !o)}
        tabIndex={0}
      >
        {value.length === 0 && (
          <span style={{ color: '#8C8C8C' }}>{placeholder}</span>
        )}
        {value.map(opt => (
          <span key={opt} style={{ background: '#F0F4FA', color: '#234B73', borderRadius: 12, padding: '2px 10px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #C0CEDB' }}>
            {opt}
            <span style={{ marginLeft: 4, cursor: 'pointer', fontWeight: 700 }} onClick={e => { e.stopPropagation(); onChange(value.filter(v => v !== opt)); }}>×</span>
          </span>
        ))}
        <span style={{ flex: 1 }} />
        <svg width="18" height="18" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 6, opacity: 0.7 }}><polyline points="6 9 12 15 18 9" /></svg>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 44, left: 0, background: '#fff', border: '1px solid #C0CEDB', borderRadius: 8, boxShadow: '0 2px 12px rgba(35,75,115,0.10)', zIndex: 10, minWidth: 220, padding: 8 }}>
          {options.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 15, color: '#234B73', background: value.includes(opt) ? '#F5F7FA' : 'transparent', fontWeight: value.includes(opt) ? 700 : 400 }}>
              <input
                type="checkbox"
                checked={value.includes(opt)}
                onChange={() => handleToggle(opt)}
                style={{ accentColor: '#F08F36', width: 16, height: 16 }}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

const StudentProfile = ({ posts, setPosts, user, ...props }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);
  const [showAddInternship, setShowAddInternship] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddPartTime, setShowAddPartTime] = useState(false);
  const [openMenus, setOpenMenus] = useState([]);
  const [activeSubItem, setActiveSubItem] = useState('Profile');
  const [postInput, setPostInput] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [postMedia, setPostMedia] = useState({ photo: null, video: null, document: null });
  const [mediaURLs, setMediaURLs] = useState({ photo: null, video: null, document: null });
  const [postObjectURLs, setPostObjectURLs] = useState([]);
  const [postMenuOpen, setPostMenuOpen] = useState(null);
  const [editPostModal, setEditPostModal] = useState(null);
  const [editPostInput, setEditPostInput] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState(null);
  const [editVideoURL, setEditVideoURL] = useState(null);
  const [editDocURL, setEditDocURL] = useState(null);
  const [editDocName, setEditDocName] = useState('');
  const editPhotoInputRef = useRef();
  const editVideoInputRef = useRef();
  const editDocumentInputRef = useRef();
  const [showCompaniesModal, setShowCompaniesModal] = useState(false);
  // Add state for save feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showWorkshopNotification, setShowWorkshopNotification] = useState(false);

  // List of available majors
  const majors = [
    'Computer Science',
    'Computer Engineering',
    'Information Systems',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Architecture',
    'Business Administration',
    'Economics',
    'Pharmacy',
    'Biotechnology'
  ];

  // Enhanced student data structure
  const [student, setStudent] = useState({
    name: user?.fullName || 'John Doe',
    email: user?.email || 'john.doe@guc.edu.eg',
    id: '20-12345',
    major: 'Computer Engineering',
    year: '3',
    semester: '6',
    jobInterests: ['Software Development', 'Machine Learning', 'Web Development'],
    previousInternships: [
      {
        company: 'Tech Corp',
        position: 'Software Developer Intern',
        duration: '3 months',
        responsibilities: 'Developed web applications using React and Node.js',
        startDate: '2023-06',
        endDate: '2023-09'
      }
    ],
    partTimeJobs: [
      {
        company: 'Freelance Platform',
        position: 'Web Developer',
        duration: '6 months',
        responsibilities: 'Developed and maintained client websites',
        startDate: '2023-01',
        endDate: '2023-07',
        hoursPerWeek: '20'
      }
    ],
    collegeActivities: [
      {
        name: 'ACM Student Chapter',
        role: 'Member',
        duration: '2022-Present',
        description: 'Participated in coding competitions and workshops'
      }
    ]
  });

  // New internship form data
  const [newInternship, setNewInternship] = useState({
    company: '',
    position: '',
    duration: '',
    responsibilities: '',
    startDate: '',
    endDate: ''
  });

  // New activity form data
  const [newActivity, setNewActivity] = useState({
    name: '',
    role: '',
    duration: '',
    description: ''
  });

  // New part-time job form data
  const [newPartTime, setNewPartTime] = useState({
    company: '',
    position: '',
    duration: '',
    responsibilities: '',
    startDate: '',
    endDate: '',
    hoursPerWeek: ''
  });

  // File input refs
  const photoInputRef = React.useRef();
  const videoInputRef = React.useRef();
  const documentInputRef = React.useRef();

  // Clean up all post object URLs on unmount
  useEffect(() => {
    return () => {
      postObjectURLs.forEach(urls => {
        Object.values(urls).forEach(url => url && URL.revokeObjectURL(url));
      });
    };
  }, [postObjectURLs]);

  // Delete post handler
  const handleDeletePost = (id) => {
    setPosts(posts => posts.filter(post => post.id !== id));
    setPostMenuOpen(null);
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.post-menu')) setPostMenuOpen(null);
    };
    if (postMenuOpen !== null) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [postMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 500);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInternship = (e) => {
    e.preventDefault();
    setStudent(prev => ({
      ...prev,
      previousInternships: [...prev.previousInternships, newInternship]
    }));
    setNewInternship({
      company: '',
      position: '',
      duration: '',
      responsibilities: '',
      startDate: '',
      endDate: ''
    });
    setShowAddInternship(false);
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    setStudent(prev => ({
      ...prev,
      collegeActivities: [...prev.collegeActivities, newActivity]
    }));
    setNewActivity({
      name: '',
      role: '',
      duration: '',
      description: ''
    });
    setShowAddActivity(false);
  };

  const handleAddPartTime = (e) => {
    e.preventDefault();
    setStudent(prev => ({
      ...prev,
      partTimeJobs: [...prev.partTimeJobs, newPartTime]
    }));
    setNewPartTime({
      company: '',
      position: '',
      duration: '',
      responsibilities: '',
      startDate: '',
      endDate: '',
      hoursPerWeek: ''
    });
    setShowAddPartTime(false);
  };

  const handleNewInternshipChange = (e) => {
    const { name, value } = e.target;
    setNewInternship(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewActivityChange = (e) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewPartTimeChange = (e) => {
    const { name, value } = e.target;
    setNewPartTime(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaChange = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPostMedia(prev => ({ ...prev, [type]: file }));
    setMediaURLs(prev => {
      if (prev[type]) URL.revokeObjectURL(prev[type]);
      return { ...prev, [type]: url };
    });
  };

  const handleRemoveMedia = (type) => {
    setPostMedia(prev => ({ ...prev, [type]: null }));
    if (mediaURLs[type]) URL.revokeObjectURL(mediaURLs[type]);
    setMediaURLs(prev => ({ ...prev, [type]: null }));
    if (type === 'photo') photoInputRef.current.value = '';
    if (type === 'video') videoInputRef.current.value = '';
    if (type === 'document') documentInputRef.current.value = '';
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!postInput.trim() && !postMedia.photo && !postMedia.video && !postMedia.document) return;
    // Store the current mediaURLs for this post
    setPosts(prevPosts => [
      {
        id: Date.now(),
        title: '',
        content: postInput,
        date: new Date().toISOString().slice(0, 10),
        media: postMedia,
        mediaURLs: { ...mediaURLs },
      },
      ...prevPosts,
    ]);
    setPostObjectURLs(prev => [{ ...mediaURLs }, ...prev]);
    setPostInput('');
    setPostMedia({ photo: null, video: null, document: null });
    // Do NOT revoke URLs here, keep them for post rendering
    setMediaURLs({ photo: null, video: null, document: null });
    setShowPostModal(false);
  };

  // Open edit modal
  const handleEditPost = (post) => {
    setEditPostModal(post);
    setEditPostInput(post.content || '');
    setEditPhotoURL(post.mediaURLs && post.mediaURLs.photo ? post.mediaURLs.photo : null);
    setEditVideoURL(post.mediaURLs && post.mediaURLs.video ? post.mediaURLs.video : null);
    setEditDocURL(post.mediaURLs && post.mediaURLs.document ? post.mediaURLs.document : null);
    setEditDocName(post.media && post.media.document ? post.media.document.name : '');
    setPostMenuOpen(null);
  };

  // Edit media change
  const handleEditMediaChange = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'photo') {
      setEditPhotoURL(url);
    } else if (type === 'video') {
      setEditVideoURL(url);
    } else if (type === 'document') {
      setEditDocURL(url);
      setEditDocName(file.name);
    }
  };

  const handleRemoveEditMedia = (type) => {
    if (type === 'photo') setEditPhotoURL(null);
    if (type === 'video') setEditVideoURL(null);
    if (type === 'document') { setEditDocURL(null); setEditDocName(''); }
  };

  // Save edited post
  const handleSaveEditPost = () => {
    setPosts(posts => posts.map(post =>
      post.id === editPostModal.id
        ? {
            ...post,
            content: editPostInput,
            mediaURLs: {
              photo: editPhotoURL,
              video: editVideoURL,
              document: editDocURL,
            },
            media: {
              ...post.media,
              photo: editPhotoURL ? { name: 'photo' } : null,
              video: editVideoURL ? { name: 'video' } : null,
              document: editDocURL ? { name: editDocName } : null,
            },
          }
        : post
    ));
    setEditPostModal(null);
    setEditPostInput('');
    setEditPhotoURL(null);
    setEditVideoURL(null);
    setEditDocURL(null);
    setEditDocName('');
  };

  const navbarStyle = {
    background: '#234B73',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const navButtonStyle = {
    background: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const formGroupStyle = {
    marginBottom: '16px'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #C0CEDB',
    fontSize: '14px'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  };

  const saveButtonStyle = {
    ...editBtn,
    cursor: 'pointer',
    opacity: 1
  };

  const cancelButtonStyle = {
    ...editBtn,
    background: '#C0CEDB',
    cursor: 'pointer',
    opacity: 1
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23234B73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
    paddingRight: '32px'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px'
  };

  const profileHeaderStyle = {
    background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
    padding: '120px 0 60px 0',
    marginBottom: '80px',
    position: 'relative'
  };

  const profileCardStyle = {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
    padding: '24px',
    marginBottom: '24px'
  };

  const sectionTitleStyle = {
    color: '#234B73',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '2px solid #C0CEDB'
  };

  const gridLayoutStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    marginTop: '24px'
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    padding: '8px 0'
  };

  const infoLabelStyle = {
    ...labelStyle,
    minWidth: '120px',
    marginBottom: 0
  };

  const burgerMenuStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '250px',
    height: '100vh',
    background: '#234B73',
    color: 'white',
    padding: '20px',
    transform: showBurgerMenu ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1000
  };

  const burgerButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '10px'
  };

  const menuItemStyle = {
    padding: '12px 16px',
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const menuIconStyle = {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const submenuStyle = {
    marginLeft: '32px',
    marginTop: '4px'
  };

  const addButtonStyle = {
    background: '#F08F36',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    marginBottom: '16px'
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    background: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

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
        { label: 'Browse Internships', action: () => alert('Browse Internships') },
      ],
    },
    {
      label: 'Reservation',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v2M8 3v2" /></svg>,
      submenu: [
        { label: 'SCAD Appointment', action: () => alert('SCAD Appointment') },
        { label: 'Career Workshop', action: () => alert('Career Workshop') },
        { label: 'Online Assessments', action: () => alert('Online Assessments') },
      ],
    },
    {
      label: 'Certificates',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>,
      submenu: [
        { label: 'My Certificate', action: () => alert('My Certificate') },
      ],
    },
  ];

  const handleMenuClick = (label) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isMenuOpen = (label) => openMenus.includes(label);

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
    transform: showBurgerMenu ? 'translateX(0)' : 'translateX(-100%)',
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

  // Dummy data for companies that viewed the profile
  const companiesViewed = [
    { name: 'Google', date: '2024-06-01' },
    { name: 'Microsoft', date: '2024-06-03' },
    { name: 'Amazon', date: '2024-06-05' },
    { name: 'BMW', date: '2024-06-07' },
  ];

  useEffect(() => {
    // Show notification every 30 seconds
    const interval = setInterval(() => {
      setShowWorkshopNotification(true);
      // Hide after 5 seconds
      setTimeout(() => setShowWorkshopNotification(false), 5000);
    },55000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      {/* Navbar */}
      <Navbar />
      {/* Sidebar Drawer */}
      {showBurgerMenu && (
        <>
          <div style={sidebarOverlay} onClick={() => setShowBurgerMenu(false)} />
          <div style={sidebarStyle}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 18 }}>
              <button
                onClick={() => setShowBurgerMenu(false)}
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
            {menuStructure.map((item) => (
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
                {isMenuOpen(item.label) && (
                  <div style={{ marginLeft: 0, marginTop: 0, marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {item.submenu.map((sub) => (
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
        </>
      )}

      {/* Profile Header - More Compact */}
      <div style={{...profileHeaderStyle, padding: '60px 0 30px 0', marginTop: 48}}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{...avatarStyle, width: '80px', height: '80px', fontSize: '32px', position: 'relative'}}>
              {(user?.fullName ? user.fullName[0] : student.name[0]) || 'S'}
              {user?.isProStudent && (
                <span style={{ position: 'absolute', bottom: 4, right: 4, fontSize: 22, color: '#FFD700', background: '#fff', borderRadius: '50%', padding: '2px 4px', boxShadow: '0 1px 4px #C0CEDB' }} title="Pro Student">★</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h1 style={{ color: 'white', fontSize: '24px', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                {user?.fullName || student.name}
                {user?.isProStudent && (
                  <span style={{ fontSize: 20, color: '#FFD700', marginLeft: 4 }} title="Pro Student">★</span>
                )}
              </h1>
              {user?.isProStudent && (
                <button
                  style={{
                    marginLeft: 12,
                    padding: '7px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#F08F36',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px #234B7322',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => setShowCompaniesModal(true)}
                >
                  👁️ Company Profile Visits
                </button>
              )}
            </div>
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 15, marginTop: 2 }}>
              {student.major}, Semester {student.semester}
            </div>
          </div>
        </div>
      </div>

      <div style={containerStyle}>
        <div style={gridLayoutStyle}>
          {/* Left Column */}
          <div>
            {/* Basic Information - now at the top of the left column */}
            <div style={profileCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h2 style={sectionTitleStyle}>Basic Information</h2>
                {!isEditing && (
                  <button style={{ ...editBtn, display: 'flex', alignItems: 'center', gap: 8 }} onClick={handleEdit}>
                    <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                    Edit Profile
                  </button>
                )}
              </div>
              {isEditing ? (
                <form onSubmit={handleSave}>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={student.name}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Major</label>
                    <select
                      name="major"
                      value={student.major}
                      onChange={handleInputChange}
                      style={selectStyle}
                    >
                      {majors.map(major => (
                        <option key={major} value={major}>{major}</option>
                      ))}
                    </select>
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Semester</label>
                    <select
                      name="semester"
                      value={student.semester}
                      onChange={handleInputChange}
                      style={selectStyle}
                    >
                      {getSemesterOptions(student.major).map(semester => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Job Interests</label>
                    <MultiSelect
                      options={jobInterestOptions[student.major]}
                      value={student.jobInterests}
                      onChange={val => setStudent(prev => ({ ...prev, jobInterests: val }))}
                      placeholder="Select job interests"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', margin: '18px 0', alignItems: 'center' }}>
                    <button type="button" style={{ background: '#F08F36', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 14px 6px 10px', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', minWidth: 0 }} onClick={() => setShowAddInternship(true)}>
                      <span style={{ fontSize: 18, fontWeight: 700, marginRight: 2 }}>+</span> Add Internship
                    </button>
                    <button type="button" style={{ background: '#F08F36', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 14px 6px 10px', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', minWidth: 0 }} onClick={() => setShowAddPartTime(true)}>
                      <span style={{ fontSize: 18, fontWeight: 700, marginRight: 2 }}>+</span> Add Part-Time Job
                    </button>
                    <button type="button" style={{ background: '#F08F36', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 14px 6px 10px', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', minWidth: 0 }} onClick={() => setShowAddActivity(true)}>
                      <span style={{ fontSize: 18, fontWeight: 700, marginRight: 2 }}>+</span> Add Activity
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      style={{
                        background: saveSuccess ? '#22C55E' : '#F08F36',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '12px 32px',
                        fontWeight: 700,
                        fontSize: 17,
                        cursor: saveSuccess ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: 'none',
                        transition: 'background 0.18s',
                      }}
                      disabled={saveSuccess}
                    >
                      {saveSuccess ? <FaCheck style={{ fontSize: 20 }} /> : null}
                      {saveSuccess ? 'Saved' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      style={{
                        background: '#C0CEDB',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '12px 32px',
                        fontWeight: 700,
                        fontSize: 17,
                        cursor: 'pointer',
                        boxShadow: 'none',
                        transition: 'background 0.18s',
                      }}
                      disabled={saveSuccess}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Student ID:</span>
                    <span style={valueStyle}>{student.id}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Email:</span>
                    <span style={valueStyle}>{user?.email || student.email}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Major:</span>
                    <span style={valueStyle}>{student.major}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Semester:</span>
                    <span style={valueStyle}>{student.semester}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Job Interests:</span>
                    <span style={valueStyle}>{student.jobInterests.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>
            {/* Posts Section - now below Basic Information */}
            <div style={profileCardStyle}>
              <h2 style={sectionTitleStyle}>Posts</h2>
              {/* Button-like input to open modal */}
              <div
                onClick={() => setShowPostModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: '#F5F7FA',
                  borderRadius: 20,
                  padding: '12px 18px',
                  marginBottom: 24,
                  cursor: 'pointer',
                  border: '1px solid #C0CEDB',
                  color: '#8C8C8C',
                  fontSize: 16,
                  fontWeight: 500,
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20 }}>
                  {(user?.fullName ? user.fullName[0] : student.name[0]) || 'S'}
                </div>
                What's on your mind, {student.name.split(' ')[0]}?
              </div>
              {/* Posts List */}
              {[...dummyPosts, ...posts]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(post => (
                  <div
                    key={post.id}
                    style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: post.id < dummyPosts.length + posts.length ? '1px solid #C0CEDB' : 'none', position: 'relative', background: '#fff', borderRadius: '14px', boxShadow: '0 4px 24px rgba(35,75,115,0.10)', padding: '22px 28px', color: '#234B73', fontSize: 17, fontWeight: 500, borderLeft: '6px solid #234B73', transition: 'box-shadow 0.2s' }}
                  >
                    {post.title && <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 8, color: '#234B73' }}>{post.title}</div>}
                    <p style={{ color: '#666', margin: '0 0 8px 0' }}>{post.date}</p>
                    <p style={{ color: '#1a3a5a', margin: '0 0 8px 0', fontWeight: 400 }}>{post.content}</p>
                    {/* Media preview in post */}
                    {post.media && (
                      <div style={{ marginTop: 10 }}>
                        {post.media.photo && post.mediaURLs && post.mediaURLs.photo && (
                          <img
                            src={post.mediaURLs.photo}
                            alt="post-img"
                            style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 10, marginBottom: 8 }}
                          />
                        )}
                        {post.media.video && post.mediaURLs && post.mediaURLs.video && (
                          <video controls style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 10, marginBottom: 8 }}>
                            <source src={post.mediaURLs.video} />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {post.media.document && post.mediaURLs && post.mediaURLs.document && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#C0CEDB', borderRadius: 8, padding: '6px 12px', color: '#234B73', fontWeight: 600, marginBottom: 8 }}>
                            <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
                            {post.media.document.name}
                            {/* View and Download buttons */}
                            <button
                              type="button"
                              style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', marginLeft: 8, cursor: 'pointer', fontWeight: 500 }}
                              onClick={() => window.open(post.mediaURLs.document, '_blank')}
                            >
                              View
                            </button>
                            <a
                              href={post.mediaURLs.document}
                              download={post.media.document.name}
                              style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', marginLeft: 6, cursor: 'pointer', fontWeight: 500, textDecoration: 'none' }}
                            >
                              Download
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          {/* Right Column */}
          <div>
            {/* Previous Internships */}
            <div style={profileCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={sectionTitleStyle}>Previous Internships</h2>
              </div>
              {student.previousInternships.map((internship, index) => (
                <div key={index} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: index < student.previousInternships.length - 1 ? '1px solid #C0CEDB' : 'none' }}>
                  <h3 style={{ color: '#234B73', fontSize: '18px', margin: '0 0 8px 0' }}>{internship.position}</h3>
                  <p style={{ color: '#F08F36', margin: '0 0 8px 0' }}>{internship.company}</p>
                  <p style={{ color: '#666', margin: '0 0 8px 0' }}>{internship.duration}</p>
                  <p style={{ color: '#1a3a5a', margin: '0' }}>{internship.responsibilities}</p>
                </div>
              ))}
            </div>
            {/* Part-Time Jobs */}
            <div style={profileCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={sectionTitleStyle}>Part-Time Jobs</h2>
              </div>
              {student.partTimeJobs.map((job, index) => (
                <div key={index} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: index < student.partTimeJobs.length - 1 ? '1px solid #C0CEDB' : 'none' }}>
                  <h3 style={{ color: '#234B73', fontSize: '18px', margin: '0 0 8px 0' }}>{job.position}</h3>
                  <p style={{ color: '#F08F36', margin: '0 0 8px 0' }}>{job.company}</p>
                  <p style={{ color: '#666', margin: '0 0 8px 0' }}>{job.duration} • {job.hoursPerWeek} hours/week</p>
                  <p style={{ color: '#1a3a5a', margin: '0' }}>{job.responsibilities}</p>
                </div>
              ))}
            </div>
            {/* College Activities */}
            <div style={profileCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={sectionTitleStyle}>College Activities</h2>
                
              </div>
              {student.collegeActivities.map((activity, index) => (
                <div key={index} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: index < student.collegeActivities.length - 1 ? '1px solid #C0CEDB' : 'none' }}>
                  <h3 style={{ color: '#234B73', fontSize: '18px', margin: '0 0 8px 0' }}>{activity.name}</h3>
                  <p style={{ color: '#F08F36', margin: '0 0 8px 0' }}>{activity.role}</p>
                  <p style={{ color: '#666', margin: '0 0 8px 0' }}>{activity.duration}</p>
                  <p style={{ color: '#1a3a5a', margin: '0' }}>{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Internship Modal */}
      {showAddInternship && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ color: '#234B73', marginBottom: '20px' }}>Add New Internship</h2>
            <form onSubmit={handleAddInternship}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={newInternship.company}
                  onChange={handleNewInternshipChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Position</label>
                <input
                  type="text"
                  name="position"
                  value={newInternship.position}
                  onChange={handleNewInternshipChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Start Date</label>
                <input
                  type="month"
                  name="startDate"
                  value={newInternship.startDate}
                  onChange={handleNewInternshipChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>End Date</label>
                <input
                  type="month"
                  name="endDate"
                  value={newInternship.endDate}
                  onChange={handleNewInternshipChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Responsibilities</label>
                <textarea
                  name="responsibilities"
                  value={newInternship.responsibilities}
                  onChange={handleNewInternshipChange}
                  style={textareaStyle}
                  required
                />
              </div>
              <div style={buttonGroupStyle}>
                <button type="submit" style={saveButtonStyle}>Add Internship</button>
                <button type="button" onClick={() => setShowAddInternship(false)} style={cancelButtonStyle}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ color: '#234B73', marginBottom: '20px' }}>Add New Activity</h2>
            <form onSubmit={handleAddActivity}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Activity Name</label>
                <input
                  type="text"
                  name="name"
                  value={newActivity.name}
                  onChange={handleNewActivityChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Role</label>
                <input
                  type="text"
                  name="role"
                  value={newActivity.role}
                  onChange={handleNewActivityChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={newActivity.duration}
                  onChange={handleNewActivityChange}
                  style={inputStyle}
                  placeholder="e.g., 2022-Present"
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Description</label>
                <textarea
                  name="description"
                  value={newActivity.description}
                  onChange={handleNewActivityChange}
                  style={textareaStyle}
                  required
                />
              </div>
              <div style={buttonGroupStyle}>
                <button type="submit" style={saveButtonStyle}>Add Activity</button>
                <button type="button" onClick={() => setShowAddActivity(false)} style={cancelButtonStyle}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Part-Time Job Modal */}
      {showAddPartTime && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ color: '#234B73', marginBottom: '20px' }}>Add New Part-Time Job</h2>
            <form onSubmit={handleAddPartTime}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={newPartTime.company}
                  onChange={handleNewPartTimeChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Position</label>
                <input
                  type="text"
                  name="position"
                  value={newPartTime.position}
                  onChange={handleNewPartTimeChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Start Date</label>
                <input
                  type="month"
                  name="startDate"
                  value={newPartTime.startDate}
                  onChange={handleNewPartTimeChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>End Date</label>
                <input
                  type="month"
                  name="endDate"
                  value={newPartTime.endDate}
                  onChange={handleNewPartTimeChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Hours per Week</label>
                <input
                  type="number"
                  name="hoursPerWeek"
                  value={newPartTime.hoursPerWeek}
                  onChange={handleNewPartTimeChange}
                  style={inputStyle}
                  required
                  min="1"
                  max="40"
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Responsibilities</label>
                <textarea
                  name="responsibilities"
                  value={newPartTime.responsibilities}
                  onChange={handleNewPartTimeChange}
                  style={textareaStyle}
                  required
                />
              </div>
              <div style={buttonGroupStyle}>
                <button type="submit" style={saveButtonStyle}>Add Part-Time Job</button>
                <button type="button" onClick={() => setShowAddPartTime(false)} style={cancelButtonStyle}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(35,75,115,0.18)',
            width: '100%',
            maxWidth: 520,
            padding: 0,
            position: 'relative',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22 }}>
                  {(user?.fullName ? user.fullName[0] : student.name[0]) || 'S'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#234B73', fontSize: 17 }}>{student.name}</div>
                  <div style={{ color: '#8C8C8C', fontSize: 13 }}>Post to Anyone</div>
                </div>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 26, color: '#8C8C8C', cursor: 'pointer', borderRadius: 6, padding: 4, transition: 'background 0.15s' }}
                aria-label="Close"
                onMouseOver={e => (e.currentTarget.style.background = '#F08F36')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
              >
                ×
              </button>
            </div>
            {/* Modal Body */}
            <form onSubmit={handlePostSubmit}>
              <textarea
                value={postInput}
                onChange={e => setPostInput(e.target.value)}
                placeholder="What do you want to talk about?"
                style={{
                  width: '100%',
                  minHeight: 120,
                  border: 'none',
                  outline: 'none',
                  resize: 'vertical',
                  fontSize: 18,
                  color: '#234B73',
                  margin: '18px 0 0 0',
                  padding: '0 24px',
                  background: 'transparent',
                  fontFamily: 'inherit',
                }}
                maxLength={1000}
                autoFocus
              />
              {/* Media Previews */}
              <div style={{ padding: '0 24px', marginTop: 10, marginBottom: 0 }}>
                {postMedia.photo && (
                  <div style={{ position: 'relative', display: 'inline-block', marginRight: 10 }}>
                    <img src={URL.createObjectURL(postMedia.photo)} alt="preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} />
                    <button type="button" onClick={() => handleRemoveMedia('photo')} style={{ position: 'absolute', top: -8, right: -8, background: '#F08F36', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                )}
                {postMedia.video && (
                  <div style={{ position: 'relative', display: 'inline-block', marginRight: 10 }}>
                    <video src={URL.createObjectURL(postMedia.video)} style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} controls />
                    <button type="button" onClick={() => handleRemoveMedia('video')} style={{ position: 'absolute', top: -8, right: -8, background: '#F08F36', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                )}
                {postMedia.document && (
                  <div style={{ position: 'relative', display: 'inline-block', marginRight: 10, background: '#C0CEDB', borderRadius: 8, padding: '6px 12px', color: '#234B73', fontWeight: 600 }}>
                    <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24" style={{ verticalAlign: 'middle', marginRight: 4 }}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
                    {postMedia.document.name}
                    <button type="button" onClick={() => handleRemoveMedia('document')} style={{ position: 'absolute', top: -8, right: -8, background: '#F08F36', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                )}
              </div>
              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px 0 24px' }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} ref={photoInputRef} onChange={e => handleMediaChange('photo', e)} />
                <button type="button" style={{ background: '#C0CEDB', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#234B73', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => photoInputRef.current.click()}>
                  <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="2.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  Photo
                </button>
                <input type="file" accept="video/*" style={{ display: 'none' }} ref={videoInputRef} onChange={e => handleMediaChange('video', e)} />
                <button type="button" style={{ background: '#C0CEDB', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#234B73', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => videoInputRef.current.click()}>
                  <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" /><polygon points="10 9 15 12 10 15 10 9" /></svg>
                  Video
                </button>
                <input type="file" style={{ display: 'none' }} ref={documentInputRef} onChange={e => handleMediaChange('document', e)} />
                <button type="button" style={{ background: '#C0CEDB', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#234B73', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => documentInputRef.current.click()}>
                  <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
                  Document
                </button>
                <div style={{ flex: 1 }} />
                <button
                  type="submit"
                  disabled={!(postInput.trim() || postMedia.photo || postMedia.video || postMedia.document)}
                  style={{
                    background: '#F08F36',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 20,
                    padding: '10px 22px',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: (postInput.trim() || postMedia.photo || postMedia.video || postMedia.document) ? 'pointer' : 'not-allowed',
                    opacity: (postInput.trim() || postMedia.photo || postMedia.video || postMedia.document) ? 1 : 0.6,
                    boxShadow: '0 2px 8px #F08F36',
                    transition: 'background 0.2s',
                  }}
                >
                  Post
                </button>
              </div>
              <div style={{ height: 18 }} />
            </form>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editPostModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(35,75,115,0.18)',
            width: '100%',
            maxWidth: 520,
            padding: 0,
            position: 'relative',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0 24px' }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 17 }}>Edit Post</div>
              <button
                onClick={() => setEditPostModal(null)}
                style={{ background: 'none', border: 'none', fontSize: 26, color: '#8C8C8C', cursor: 'pointer', borderRadius: 6, padding: 4, transition: 'background 0.15s' }}
                aria-label="Close"
                onMouseOver={e => (e.currentTarget.style.background = '#F08F36')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
              >
                ×
              </button>
            </div>
            {/* Modal Body */}
            <form onSubmit={e => { e.preventDefault(); handleSaveEditPost(); }}>
              <textarea
                value={editPostInput}
                onChange={e => setEditPostInput(e.target.value)}
                placeholder="Edit your post..."
                style={{
                  width: '100%',
                  minHeight: 120,
                  border: 'none',
                  outline: 'none',
                  resize: 'vertical',
                  fontSize: 18,
                  color: '#234B73',
                  margin: '18px 0 0 0',
                  padding: '0 24px',
                  background: 'transparent',
                  fontFamily: 'inherit',
                }}
                maxLength={1000}
                autoFocus
              />
              {/* Media Previews */}
              <div style={{ padding: '0 24px', marginTop: 10, marginBottom: 0 }}>
                {editPhotoURL && (
                  <div style={{ position: 'relative', display: 'inline-block', marginRight: 10 }}>
                    <img src={editPhotoURL} alt="preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} />
                    <button type="button" onClick={() => handleRemoveEditMedia('photo')} style={{ position: 'absolute', top: -8, right: -8, background: '#F08F36', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                )}
                {editVideoURL && (
                  <div style={{ position: 'relative', display: 'inline-block', marginRight: 10 }}>
                    <video src={editVideoURL} style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} controls />
                    <button type="button" onClick={() => handleRemoveEditMedia('video')} style={{ position: 'absolute', top: -8, right: -8, background: '#F08F36', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                )}
                {editDocURL && editDocName && (
                  <div style={{ position: 'relative', display: 'inline-block', marginRight: 10, background: '#C0CEDB', borderRadius: 8, padding: '6px 12px', color: '#234B73', fontWeight: 600 }}>
                    <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24" style={{ verticalAlign: 'middle', marginRight: 4 }}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
                    {editDocName}
                    <button type="button" onClick={() => handleRemoveEditMedia('document')} style={{ position: 'absolute', top: -8, right: -8, background: '#F08F36', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                )}
              </div>
              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px 0 24px' }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} ref={editPhotoInputRef} onChange={e => handleEditMediaChange('photo', e)} />
                <button type="button" style={{ background: '#C0CEDB', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#234B73', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => editPhotoInputRef.current && editPhotoInputRef.current.click()}>
                  <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="2.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  Photo
                </button>
                <input type="file" accept="video/*" style={{ display: 'none' }} ref={editVideoInputRef} onChange={e => handleEditMediaChange('video', e)} />
                <button type="button" style={{ background: '#C0CEDB', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#234B73', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => editVideoInputRef.current && editVideoInputRef.current.click()}>
                  <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" /><polygon points="10 9 15 12 10 15 10 9" /></svg>
                  Video
                </button>
                <input type="file" style={{ display: 'none' }} ref={editDocumentInputRef} onChange={e => handleEditMediaChange('document', e)} />
                <button type="button" style={{ background: '#C0CEDB', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#234B73', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => editDocumentInputRef.current && editDocumentInputRef.current.click()}>
                  <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
                  Document
                </button>
                <div style={{ flex: 1 }} />
                <button
                  type="submit"
                  style={{
                    background: '#F08F36',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 20,
                    padding: '10px 22px',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer',
                    opacity: 1,
                    boxShadow: '0 2px 8px #F08F36',
                    transition: 'background 0.2s',
                  }}
                >
                  Save Changes
                </button>
              </div>
              <div style={{ height: 18 }} />
            </form>
          </div>
        </div>
      )}

      {/* Companies Viewed Modal */}
      {showCompaniesModal && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.18)',
              zIndex: 3000
            }}
            onClick={() => setShowCompaniesModal(false)}
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
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ color: '#234B73', fontWeight: 700, fontSize: 22 }}>Companies That Viewed My Profile</span>
              <button
                onClick={() => setShowCompaniesModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }}
                aria-label="Close companies modal"
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: 16, color: '#234B73', fontWeight: 500, fontSize: 17 }}>Recent Views</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {companiesViewed.map((company, idx) => (
                <li key={idx} style={{ padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#234B73', fontWeight: 600 }}>{company.name}</span>
                  <span style={{ color: '#8C8C8C', fontSize: 14 }}>{company.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {showWorkshopNotification && (
        <CompanyTimedNotification
          type="warning"
          message="You have an upcoming workshop! Don't forget to attend."
          onClose={() => setShowWorkshopNotification(false)}
          position="top-right"
        />
      )}
    </div>
  );
};

export default StudentProfile; 