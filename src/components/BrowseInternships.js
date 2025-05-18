import React, { useState } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../App';

const industryOptions = [
  'Technology', 'E-Commerce', 'Automotive', 'Finance', 'Media', 'Consulting', 'Manufacturing', 'Healthcare', 'Telecommunications', 'Energy', 'Retail', 'Logistics', 'Design', 'Marketing', 'Engineering', 'Education', 'Government', 'Hospitality', 'Real Estate', 'Aerospace', 'Agriculture', 'Legal', 'Nonprofit', 'Research', 'Sports', 'Travel', 'Utilities', 'Others'
];

const dummyInternships = [
  {
    id: 1,
    company: 'Google',
    industry: 'Technology',
    title: 'Software Engineer Intern',
    location: 'Mountain View, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3500,
    skills: ['Python', 'Cloud', 'Distributed Systems'],
    description: 'Work on scalable backend systems and contribute to Google Cloud.'
  },
  {
    id: 26,
    company: 'BMW',
    industry: 'Automotive',
    title: 'Automotive Engineering Intern',
    location: 'Munich, Germany',
    duration: '6 months',
    paid: true,
    expectedSalary: 6000,
    skills: ['Automotive Engineering', 'CAD', 'Vehicle Dynamics', 'German Language'],
    description: 'Work on next-generation electric vehicle development and testing. Collaborate with international teams on innovative automotive solutions.'
  },
  {
    id: 2,
    company: 'Microsoft',
    industry: 'Technology',
    title: 'Product Manager Intern',
    location: 'Redmond, WA',
    duration: '12 weeks',
    paid: false,
    expectedSalary: 0,
    skills: ['Product Management', 'Communication', 'Leadership'],
    description: 'Drive product vision and collaborate with engineering teams.'
  },
  {
    id: 3,
    company: 'Amazon',
    industry: 'E-Commerce',
    title: 'Data Analyst Intern',
    location: 'Seattle, WA',
    duration: '10 weeks',
    paid: true,
    expectedSalary: 3200,
    skills: ['SQL', 'Data Analysis', 'Python'],
    description: 'Analyze large datasets to improve customer experience.'
  },
  {
    id: 4,
    company: 'Meta',
    industry: 'Technology',
    title: 'UX Designer Intern',
    location: 'Menlo Park, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3400,
    skills: ['UX Design', 'Figma', 'Prototyping'],
    description: 'Design user interfaces for new social media features.'
  },
  {
    id: 5,
    company: 'Tesla',
    industry: 'Automotive',
    title: 'Mechanical Engineer Intern',
    location: 'Fremont, CA',
    duration: '4 months',
    paid: true,
    expectedSalary: 4000,
    skills: ['Mechanical Engineering', 'CAD', 'Manufacturing'],
    description: 'Work on electric vehicle design and manufacturing.'
  },
  {
    id: 6,
    company: 'Apple',
    industry: 'Technology',
    title: 'iOS Developer Intern',
    location: 'Cupertino, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3700,
    skills: ['Swift', 'iOS', 'Mobile Development'],
    description: 'Develop and test new features for iOS devices.'
  },
  {
    id: 7,
    company: 'IBM',
    industry: 'Technology',
    title: 'AI Research Intern',
    location: 'Yorktown Heights, NY',
    duration: '10 weeks',
    paid: true,
    expectedSalary: 3100,
    skills: ['AI', 'Machine Learning', 'Python'],
    description: 'Research and prototype AI models for enterprise solutions.'
  },
  {
    id: 8,
    company: 'Intel',
    industry: 'Technology',
    title: 'Hardware Engineer Intern',
    location: 'Santa Clara, CA',
    duration: '12 weeks',
    paid: true,
    expectedSalary: 3300,
    skills: ['Hardware', 'VHDL', 'Microprocessors'],
    description: 'Design and test next-generation microprocessors.'
  },
  {
    id: 9,
    company: 'Netflix',
    industry: 'Media',
    title: 'Content Analyst Intern',
    location: 'Los Gatos, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3200,
    skills: ['Data Analysis', 'Content', 'SQL'],
    description: 'Analyze viewing data to optimize content recommendations.'
  },
  {
    id: 10,
    company: 'Salesforce',
    industry: 'Technology',
    title: 'Cloud Solutions Intern',
    location: 'San Francisco, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3400,
    skills: ['Cloud', 'Salesforce', 'APEX'],
    description: 'Support cloud platform development and customer onboarding.'
  },
  {
    id: 11,
    company: 'Oracle',
    industry: 'Technology',
    title: 'Database Admin Intern',
    location: 'Austin, TX',
    duration: '10 weeks',
    paid: true,
    expectedSalary: 3100,
    skills: ['Databases', 'SQL', 'Oracle'],
    description: 'Assist in database management and optimization.'
  },
  {
    id: 12,
    company: 'Adobe',
    industry: 'Design',
    title: 'Graphic Designer Intern',
    location: 'San Jose, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3000,
    skills: ['Graphic Design', 'Photoshop', 'Illustrator'],
    description: 'Create marketing materials and digital assets.'
  },
  {
    id: 13,
    company: 'Spotify',
    industry: 'Media',
    title: 'Music Data Intern',
    location: 'New York, NY',
    duration: '12 weeks',
    paid: true,
    expectedSalary: 3200,
    skills: ['Data Analysis', 'Music', 'Python'],
    description: 'Analyze music trends and user listening patterns.'
  },
  {
    id: 14,
    company: 'Twitter',
    industry: 'Media',
    title: 'Backend Developer Intern',
    location: 'San Francisco, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3400,
    skills: ['Backend', 'APIs', 'Node.js'],
    description: 'Build and maintain scalable backend services.'
  },
  {
    id: 15,
    company: 'Uber',
    industry: 'Logistics',
    title: 'Operations Intern',
    location: 'Chicago, IL',
    duration: '10 weeks',
    paid: true,
    expectedSalary: 3100,
    skills: ['Operations', 'Excel', 'Data Analysis'],
    description: 'Support city operations and data-driven decision making.'
  },
  {
    id: 16,
    company: 'Airbnb',
    industry: 'Hospitality',
    title: 'Frontend Developer Intern',
    location: 'San Francisco, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3300,
    skills: ['Frontend', 'React', 'JavaScript'],
    description: 'Develop user-facing features for the Airbnb platform.'
  },
  {
    id: 17,
    company: 'LinkedIn',
    industry: 'Technology',
    title: 'Business Analyst Intern',
    location: 'Sunnyvale, CA',
    duration: '12 weeks',
    paid: true,
    expectedSalary: 3200,
    skills: ['Business Analysis', 'Excel', 'SQL'],
    description: 'Analyze business metrics and support product strategy.'
  },
  {
    id: 18,
    company: 'Snap Inc.',
    industry: 'Media',
    title: 'AR Developer Intern',
    location: 'Los Angeles, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3200,
    skills: ['AR', 'Unity', 'C#'],
    description: 'Prototype augmented reality features for Snapchat.'
  },
  {
    id: 19,
    company: 'Dell',
    industry: 'Technology',
    title: 'IT Support Intern',
    location: 'Round Rock, TX',
    duration: '10 weeks',
    paid: true,
    expectedSalary: 3000,
    skills: ['IT Support', 'Troubleshooting', 'Windows'],
    description: 'Provide technical support and troubleshoot IT issues.'
  },
  {
    id: 20,
    company: 'Siemens',
    industry: 'Engineering',
    title: 'Electrical Engineer Intern',
    location: 'Munich, Germany',
    duration: '4 months',
    paid: true,
    expectedSalary: 3500,
    skills: ['Electrical Engineering', 'Automation', 'PLC'],
    description: 'Work on industrial automation and control systems.'
  },
  {
    id: 21,
    company: 'Samsung',
    industry: 'Technology',
    title: 'Mobile App Developer Intern',
    location: 'Seoul, South Korea',
    duration: '3 months',
    paid: true,
    expectedSalary: 3400,
    skills: ['Android', 'Kotlin', 'Mobile Development'],
    description: 'Develop and test Android applications for Samsung devices.'
  },
  {
    id: 22,
    company: 'Huawei',
    industry: 'Telecommunications',
    title: 'Network Engineer Intern',
    location: 'Shenzhen, China',
    duration: '12 weeks',
    paid: true,
    expectedSalary: 3200,
    skills: ['Networking', 'Cisco', 'Linux'],
    description: 'Support network infrastructure projects and testing.'
  },
  {
    id: 23,
    company: 'BASF',
    industry: 'Manufacturing',
    title: 'Chemical Engineer Intern',
    location: 'Ludwigshafen, Germany',
    duration: '3 months',
    paid: true,
    expectedSalary: 3300,
    skills: ['Chemical Engineering', 'Process Optimization', 'Safety'],
    description: 'Assist in chemical process optimization and safety.'
  },
  {
    id: 24,
    company: 'Procter & Gamble',
    industry: 'Retail',
    title: 'Marketing Intern',
    location: 'Cincinnati, OH',
    duration: '10 weeks',
    paid: true,
    expectedSalary: 3100,
    skills: ['Marketing', 'Consumer Research', 'Excel'],
    description: 'Support marketing campaigns and consumer research.'
  },
  {
    id: 25,
    company: 'Unilever',
    industry: 'Retail',
    title: 'Supply Chain Intern',
    location: 'London, UK',
    duration: '3 months',
    paid: true,
    expectedSalary: 3200,
    skills: ['Supply Chain', 'Logistics', 'Excel'],
    description: 'Optimize supply chain processes and logistics.'
  }
];

const cardStyle = {
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  padding: 24,
  marginBottom: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  cursor: 'pointer',
  transition: 'box-shadow 0.2s',
};
const expandedStyle = {
  background: '#F6F8FA',
  borderRadius: 10,
  marginTop: 12,
  padding: 18,
  color: '#234B73',
  fontSize: 15,
};

const getDurationCategory = (duration) => {
  // Normalize duration to weeks
  if (!duration) return '';
  const lower = duration.toLowerCase();
  let weeks = 0;
  if (lower.includes('month')) {
    const num = parseInt(lower);
    weeks = num * 4;
  } else if (lower.includes('week')) {
    const num = parseInt(lower);
    weeks = num;
  }
  if (weeks < 8) return '<2 months';
  if (weeks <= 12) return '2-3 months';
  return '>3 months';
};

// 1. Add styles for custom file input buttons
const fileInputButton = {
  display: 'inline-block',
  background: '#F08F36',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '8px 18px',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  marginTop: 6,
  marginRight: 10
};
const fileInputLabel = { color: '#234B73', fontWeight: 500, marginBottom: 2 };

const BrowseInternships = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  // Filter state for modal (pending)
  const [pendingIndustry, setPendingIndustry] = useState('');
  const [pendingDuration, setPendingDuration] = useState('');
  const [pendingPaid, setPendingPaid] = useState('');
  // Applied filter state
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [filterPaid, setFilterPaid] = useState('');
  // Application modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyingInternship, setApplyingInternship] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({ cv: null, coverLetter: null, certificates: [] });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { applications, setApplications } = useAuth();

  // Duration categories
  const durationOptions = ['<2 months', '2-3 months', '>3 months'];

  // Filtered and searched internships
  const filteredInternships = dummyInternships.filter(intern => {
    // Search by job title or company (first letters only, case-insensitive)
    const s = search.trim().toLowerCase();
    if (s) {
      const title = intern.title.toLowerCase();
      const company = intern.company.toLowerCase();
      if (!(title.startsWith(s) || company.startsWith(s))) return false;
    }
    // Industry filter
    if (filterIndustry && intern.industry !== filterIndustry) return false;
    // Duration filter
    if (filterDuration && getDurationCategory(intern.duration) !== filterDuration) return false;
    // Paid filter
    if (filterPaid && ((filterPaid === 'Paid' && !intern.paid) || (filterPaid === 'Unpaid' && intern.paid))) return false;
    return true;
  });

  const openFilterModal = () => {
    setPendingIndustry(filterIndustry);
    setPendingDuration(filterDuration);
    setPendingPaid(filterPaid);
    setShowFilter(true);
  };

  const applyFilters = () => {
    setFilterIndustry(pendingIndustry);
    setFilterDuration(pendingDuration);
    setFilterPaid(pendingPaid);
    setShowFilter(false);
  };

  const clearFilters = () => {
    setPendingIndustry('');
    setPendingDuration('');
    setPendingPaid('');
  };

  // Application modal handlers
  const openApplyModal = (intern) => {
    setApplyingInternship(intern);
    setShowApplyModal(true);
    setUploadedFiles({ cv: null, coverLetter: null, certificates: [] });
    setSubmitSuccess(false);
  };
  const closeApplyModal = () => {
    setShowApplyModal(false);
    setApplyingInternship(null);
    setUploadedFiles({ cv: null, coverLetter: null, certificates: [] });
    setSubmitSuccess(false);
  };
  const handleFileChange = (e, type) => {
    if (type === 'certificates') {
      setUploadedFiles(f => ({ ...f, certificates: Array.from(e.target.files) }));
    } else {
      setUploadedFiles(f => ({ ...f, [type]: e.target.files[0] }));
    }
  };
  const handleApplySubmit = (e) => {
    e.preventDefault();
    // Create new application object
    const newApplication = {
      id: Date.now(), // Use timestamp as unique ID
      company: applyingInternship.company,
      position: applyingInternship.title,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      location: applyingInternship.location,
      duration: applyingInternship.duration,
      startDate: '', // These would be filled in when the application is approved
      endDate: '',
      files: uploadedFiles // Store the uploaded files
    };
    
    // Add to applications state
    setApplications(prev => [...prev, newApplication]);
    setSubmitSuccess(true);
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 0', marginTop: 72 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Browse Internships</h1>
          <div style={{ display: 'flex', gap: 18, marginBottom: 32, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 220, padding: '10px 14px', borderRadius: 8, border: '1px solid #C0CEDB', fontSize: 16, outline: 'none', background: '#fff', color: '#234B73' }}
            />
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  color: '#F08F36',
                  fontWeight: 700,
                  fontSize: 22,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  borderBottom: '3px solid #F08F36',
                  padding: 0,
                  marginBottom: 2
                }}
                onClick={() => setShowFilter(f => !f)}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F08F36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h18l-7 8v6l-4 2v-8z"/></svg>
                Filter
              </button>
              {showFilter && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(35,75,115,0.18)',
                  padding: '18px 22px',
                  zIndex: 2001,
                  minWidth: 260,
                  maxWidth: 340
                }}>
                  <div style={{ fontWeight: 700, color: '#234B73', fontSize: 17, marginBottom: 10 }}>Filter by:</div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <input type="checkbox" checked={!!filterIndustry} onChange={e => setFilterIndustry(e.target.checked ? industryOptions[0] : '')} />
                    Industry
                  </label>
                  {filterIndustry && (
                    <select
                      value={filterIndustry}
                      onChange={e => setFilterIndustry(e.target.value)}
                      style={{ width: '100%', marginBottom: 10, borderRadius: 8, border: '1px solid #C0CEDB', padding: 8, fontSize: 15, background: '#fff', color: '#234B73' }}
                    >
                      {industryOptions.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  )}
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <input type="checkbox" checked={!!filterDuration} onChange={e => setFilterDuration(e.target.checked ? durationOptions[0] : '')} />
                    Duration
                  </label>
                  {filterDuration && (
                    <select
                      value={filterDuration}
                      onChange={e => setFilterDuration(e.target.value)}
                      style={{ width: '100%', marginBottom: 10, borderRadius: 8, border: '1px solid #C0CEDB', padding: 8, fontSize: 15, background: '#fff', color: '#234B73' }}
                    >
                      {durationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <input type="checkbox" checked={!!filterPaid} onChange={e => setFilterPaid(e.target.checked ? 'Paid' : '')} />
                    Paid/Unpaid
                  </label>
                  {filterPaid && (
                    <select
                      value={filterPaid}
                      onChange={e => setFilterPaid(e.target.value)}
                      style={{ width: '100%', marginBottom: 10, borderRadius: 8, border: '1px solid #C0CEDB', padding: 8, fontSize: 15, background: '#fff', color: '#234B73' }}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  )}
                  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <button
                      style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                      onClick={() => setShowFilter(false)}
                    >
                      Done
                    </button>
                    <button
                      style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                      onClick={() => { setFilterIndustry(''); setFilterDuration(''); setFilterPaid(''); }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {filteredInternships.length === 0 ? (
            <div style={{ color: '#8C8C8C', textAlign: 'center', padding: 32 }}>No internships found.</div>
          ) : (
            filteredInternships.map((intern) => (
              <div
                key={intern.id}
                style={{
                  ...cardStyle,
                  boxShadow: expandedId === intern.id ? '0 8px 32px rgba(35,75,115,0.18)' : cardStyle.boxShadow,
                  position: 'relative',
                  paddingRight: 36
                }}
                onClick={() => setExpandedId(expandedId === intern.id ? null : intern.id)}
              >
                <div style={{ fontWeight: 700, fontSize: 20, color: '#234B73' }}>{intern.title}</div>
                <div style={{ color: '#F08F36', fontWeight: 600, fontSize: 17 }}>{intern.company}</div>
                <div style={{ color: '#8C8C8C', fontSize: 15 }}>{intern.location} &bull; {intern.duration}</div>
                <div style={{ color: '#234B73', fontSize: 15 }}>{intern.description}</div>
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
                    right: 8,
                    top: '50%',
                    transform: `translateY(-50%) ${expandedId === intern.id ? 'rotate(90deg)' : 'rotate(0deg)'}`,
                    transition: 'transform 0.2s'
                  }}
                >
                  <polyline points="9 6 15 12 9 18" />
                </svg>
                {expandedId === intern.id && (
                  <div style={expandedStyle} onClick={e => e.stopPropagation()}>
                    <div style={{ marginBottom: 10 }}><b>Company:</b> {intern.company}</div>
                    <div style={{ marginBottom: 10 }}><b>Industry:</b> {intern.industry}</div>
                    <div style={{ marginBottom: 10 }}><b>Job Title:</b> {intern.title}</div>
                    <div style={{ marginBottom: 10 }}><b>Duration:</b> {intern.duration}</div>
                    <div style={{ marginBottom: 10 }}><b>Paid:</b> {intern.paid ? 'Paid' : 'Unpaid'}</div>
                    {intern.paid && (
                      <div style={{ marginBottom: 10 }}><b>Expected Salary:</b> ${intern.expectedSalary} / month</div>
                    )}
                    <div style={{ marginBottom: 10 }}><b>Skills Required:</b> {intern.skills && intern.skills.length > 0 ? intern.skills.join(', ') : 'N/A'}</div>
                    <div style={{ marginBottom: 10 }}><b>Job Description:</b> {intern.description}</div>
                    <button
                      style={{ marginTop: 18, background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', opacity: applications.some(app => app.company === intern.company && app.position === intern.title) ? 0.6 : 1 }}
                      onClick={e => { e.stopPropagation(); if (!applications.some(app => app.company === intern.company && app.position === intern.title)) openApplyModal(intern); }}
                      disabled={applications.some(app => app.company === intern.company && app.position === intern.title)}
                    >
                      {applications.some(app => app.company === intern.company && app.position === intern.title) ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      {/* Apply Modal */}
      {showApplyModal && applyingInternship && (
        <>
          <div
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 3000 }}
            onClick={closeApplyModal}
          />
          <div
            style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', padding: '36px 32px 28px 32px', zIndex: 3001, minWidth: 340, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ color: '#234B73', fontWeight: 700, fontSize: 22 }}>Apply for {applyingInternship.title} at {applyingInternship.company}</span>
              <button
                onClick={closeApplyModal}
                style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }}
                aria-label="Close apply modal"
              >
                ×
              </button>
            </div>
            {submitSuccess ? (
              <div style={{ color: '#22C55E', fontWeight: 600, fontSize: 18, textAlign: 'center', padding: 24 }}>
                Application submitted successfully!
                <div style={{ marginTop: 18 }}>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                  <label style={{ color: '#234B73', fontWeight: 600, fontSize: 16, minWidth: 180, marginBottom: 0, display: 'flex', alignItems: 'center' }}>
                    Upload CV:
                    <span style={{ color: '#EF4444', fontWeight: 700, fontSize: 18, marginLeft: 4 }}>*</span>
                  </label>
                  <label style={{ background: '#F08F36', color: '#fff', borderRadius: 7, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', minWidth: 0, marginBottom: 0 }}>
                    Choose File
                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => handleFileChange(e, 'cv')} required style={{ display: 'none' }} />
                  </label>
                  <span style={{ color: '#234B73', fontSize: 14 }}>{uploadedFiles.cv ? uploadedFiles.cv.name : 'No file chosen'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label style={{ color: '#234B73', fontWeight: 600, fontSize: 16, minWidth: 180, marginBottom: 0 }}>Upload Cover Letter:</label>
                  <label style={{ background: '#F08F36', color: '#fff', borderRadius: 7, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', minWidth: 0, marginBottom: 0 }}>
                    Choose File
                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => handleFileChange(e, 'coverLetter')} style={{ display: 'none' }} />
                  </label>
                  <span style={{ color: '#234B73', fontSize: 14 }}>{uploadedFiles.coverLetter ? uploadedFiles.coverLetter.name : 'No file chosen'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label style={{ color: '#234B73', fontWeight: 600, fontSize: 16, minWidth: 180, marginBottom: 0 }}>Upload Certificates :</label>
                  <label style={{ background: '#F08F36', color: '#fff', borderRadius: 7, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', minWidth: 0, marginBottom: 0 }}>
                    Choose Files
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={e => handleFileChange(e, 'certificates')} style={{ display: 'none' }} />
                  </label>
                  <span style={{ color: '#234B73', fontSize: 14 }}>{uploadedFiles.certificates && uploadedFiles.certificates.length > 0 ? uploadedFiles.certificates.map(f => f.name).join(', ') : 'No file chosen'}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'flex-end' }}>
                <button
                    type="button"
                    style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                    onClick={closeApplyModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                  >
                    Submit Application
                  </button>
                  
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default BrowseInternships; 