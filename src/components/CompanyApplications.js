import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from './CompanyNavbar';
import { FaChevronDown, FaChevronUp, FaFilter, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaFlag } from 'react-icons/fa';
import jsPDF from 'jspdf';
import Switch from '@mui/material/Switch';

const CompanyApplications = () => {
  const navigate = useNavigate();
  const [selectedInternship, setSelectedInternship] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedAppId, setExpandedAppId] = useState(null);
  const [appList, setAppList] = useState([
    {
      id: 1,
      student: {
        name: 'Ahmed Mohamed',
        email: 'ahmed.mohamed@student.guc.edu.eg',
        major: 'Computer Science',
        year: '3',
        gpa: 3.8
      },
      internship: {
        id: 1,
        title: 'Software Engineering Intern'
      },
      status: 'pending',
      appliedDate: '2024-02-15',
      resume: 'resume.pdf',
      coverLetter: 'I am excited to apply for the Software Engineering Intern position...'
    },
    {
      id: 2,
      student: {
        name: 'Sarah Ahmed',
        email: 'sarah.ahmed@student.guc.edu.eg',
        major: 'Computer Science',
        year: '4',
        gpa: 3.9
      },
      internship: {
        id: 2,
        title: 'Data Science Intern'
      },
      status: 'accepted',
      appliedDate: '2024-02-10',
      resume: 'resume.pdf',
      coverLetter: 'I am writing to express my interest in the Data Science Intern position...'
    },
    {
      id: 3,
      student: {
        name: 'Mona Samir',
        email: 'mona.samir@student.guc.edu.eg',
        major: 'Business',
        year: '2',
        gpa: 3.5
      },
      internship: {
        id: 1,
        title: 'Software Engineering Intern'
      },
      status: 'pending',
      appliedDate: '2024-02-18',
      resume: 'resume.pdf',
      coverLetter: 'Looking forward to joining your engineering team.'
    },
    {
      id: 4,
      student: {
        name: 'Omar Fathy',
        email: 'omar.fathy@student.guc.edu.eg',
        major: 'Design',
        year: '4',
        gpa: 3.2
      },
      internship: {
        id: 2,
        title: 'Data Science Intern'
      },
      status: 'rejected',
      appliedDate: '2024-02-12',
      resume: 'resume.pdf',
      coverLetter: 'I am passionate about data science.'
    },
    {
      id: 5,
      student: {
        name: 'Laila Hassan',
        email: 'laila.hassan@student.guc.edu.eg',
        major: 'Marketing',
        year: '3',
        gpa: 3.7
      },
      internship: {
        id: 3,
        title: 'Marketing Intern'
      },
      status: 'pending',
      appliedDate: '2024-02-20',
      resume: 'resume.pdf',
      coverLetter: 'Excited to contribute to your marketing team.'
    }
  ]);
  const [currentInterns, setCurrentInterns] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [resumeModal, setResumeModal] = useState({ open: false, file: '', name: '' });

  const internships = [
    { id: 'all', title: 'All Internships' },
    { id: 1, title: 'Software Engineering Intern' },
    { id: 2, title: 'Data Science Intern' },
    { id: 3, title: 'Marketing Intern' }
  ];

  const statuses = [
    { id: 'all', label: 'All Applications' },
    { id: 'pending', label: 'Pending Review' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'finalized', label: 'Finalized' }
  ];

  const filteredApplications = appList.filter(app => {
    const matchesInternship = selectedInternship === 'all' || String(app.internship.id) === String(selectedInternship);
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    return matchesInternship && matchesStatus;
  });

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

  const filterStyle = {
    display: 'flex',
    gap: 16,
    marginBottom: 24,
    alignItems: 'center'
  };

  const selectStyle = {
    padding: '10px 14px',
    borderRadius: 8,
    border: '1.5px solid #C0CEDB',
    fontSize: 15,
    color: '#234B73',
    background: '#fff',
    minWidth: 200
  };

  const buttonStyle = {
    background: '#F08F36',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer'
  };

  const statusBadgeStyle = (status) => ({
    color:
      status === 'accepted' ? '#065F46' :
      status === 'rejected' ? '#991B1B' :
      status === 'finalized' ? '#2563eb' :
      '#F08F36',
    fontWeight: 600,
    fontSize: 14,
    background:
      status === 'accepted' ? '#D1FAE5' :
      status === 'rejected' ? '#FEE2E2' :
      status === 'finalized' ? '#DBEAFE' :
      '#FEF3C7',
    padding: '4px 12px',
    borderRadius: 12
  });

  const handleStatusChange = (applicationId, newStatus) => {
    setAppList(prev => prev.map(app =>
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
    if (newStatus === 'accepted') {
      setCurrentInterns(prev => prev.includes(applicationId) ? prev : [...prev, applicationId]);
    } else {
      setCurrentInterns(prev => prev.filter(id => id !== applicationId));
    }
  };

  const handleToggleExpand = (id) => {
    setExpandedAppId(expandedAppId === id ? null : id);
  };

  const handleSetCurrentIntern = (applicationId) => {
    setCurrentInterns(prev => [...prev, applicationId]);
  };

  const handleDownloadPDF = (name) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Resume for ${name}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 14, 40);
    doc.text('Email: example@student.guc.edu.eg', 14, 50);
    doc.text('Education: Bachelor of Science in Computer Science, GUC', 14, 60);
    doc.text('Skills: JavaScript, React, Node.js, Teamwork', 14, 70);
    doc.text('Experience: Intern at Tech Company (Summer 2023)', 14, 80);
    doc.text('Summary: Motivated student eager to learn and contribute to real-world projects.', 14, 90);
    doc.save(`${name.replace(/ /g, '_')}_CV.pdf`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <FaCheckCircle style={{ color: '#2ecc71', marginRight: 6, fontSize: 18, verticalAlign: 'middle' }} />;
      case 'rejected':
        return <FaTimesCircle style={{ color: '#991B1B', marginRight: 6, fontSize: 18, verticalAlign: 'middle' }} />;
      case 'finalized':
        return <FaFlag style={{ color: '#2563eb', marginRight: 6, fontSize: 18, verticalAlign: 'middle' }} />;
      default:
        return <FaHourglassHalf style={{ color: '#F08F36', marginRight: 6, fontSize: 18, verticalAlign: 'middle' }} />;
    }
  };

  return (
    <>
      <CompanyNavbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{ ...containerStyle, paddingTop: 48, paddingBottom: 0 }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: 0.5, marginBottom: 24 }}>Applications</h1>
        </div>
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ flex: 1 }} />
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
                onClick={() => setShowFilterDropdown(f => !f)}
              >
                <FaFilter style={{ marginRight: 4 }} /> Filter
              </button>
              {showFilterDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(35,75,115,0.18)',
                  padding: '18px 22px',
                  zIndex: 2001,
                  minWidth: 260,
                  maxWidth: 340
                }}>
                  <div style={{ fontWeight: 700, color: '#234B73', fontSize: 17, marginBottom: 10 }}>Filter by:</div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ color: '#234B73', fontWeight: 600, marginBottom: 8, display: 'block' }}>Internship</label>
                    <select
                      value={selectedInternship}
                      onChange={e => setSelectedInternship(e.target.value)}
                      style={selectStyle}
                    >
                      <option value="all">All Internships</option>
                      <option value={1}>Software Engineering Intern</option>
                      <option value={2}>Data Science Intern</option>
                      <option value={3}>Marketing Intern</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ color: '#234B73', fontWeight: 600, marginBottom: 8, display: 'block' }}>Status</label>
                    <select
                      value={selectedStatus}
                      onChange={e => setSelectedStatus(e.target.value)}
                      style={selectStyle}
                    >
                      <option value="all">All Applications</option>
                      <option value="pending">Pending Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="finalized">Finalized</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'flex-end' }}>
                    
                    <button
                      style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                      onClick={() => { setSelectedInternship('all'); setSelectedStatus('all'); }}
                    >
                      Clear
                    </button>
                    <button
                      style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                      onClick={() => setShowFilterDropdown(false)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {filteredApplications.map(application => (
            <div key={application.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h2 style={{ color: '#234B73', fontSize: 20, fontWeight: 700, margin: '0 0 8px 0' }}>
                    {application.student.name}
                  </h2>
                  <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>
                    {application.student.email}
                  </div>
                  <div style={{ color: '#5A6A7A', fontSize: 15 }}>
                    {application.student.major}, Year {application.student.year} • GPA: {application.student.gpa}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', ...statusBadgeStyle(application.status) }}>
                    {getStatusIcon(application.status)}
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                  <button onClick={() => handleToggleExpand(application.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 0, marginRight: 4 }}>
                    {expandedAppId === application.id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>
              {expandedAppId === application.id && (
                <div style={{ marginBottom: 16, position: 'relative' }}>
                  <div style={{ color: '#234B73', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                    Applied for: {application.internship.title}
                  </div>
                  <div style={{ color: '#5A6A7A', fontSize: 14 }}>
                    Applied on: {new Date(application.appliedDate).toLocaleDateString()}
                  </div>
                  <div style={{ margin: '16px 0' }}>
                    <h3 style={{ color: '#234B73', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Cover Letter</h3>
                    <div style={{ color: '#5A6A7A', fontSize: 15 }}>{application.coverLetter}</div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <button
                      style={{ ...buttonStyle, background: '#234B73', color: '#fff', fontWeight: 600 }}
                      onClick={() => setResumeModal({ open: true, file: application.resume, name: application.student.name })}
                    >
                      View Resume
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                    <label style={{ color: '#234B73', fontWeight: 600 }}>Set Status:</label>
                    <select
                      value={application.status}
                      onChange={e => handleStatusChange(application.id, e.target.value)}
                      style={selectStyle}
                    >
                      <option value="pending">Pending Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="finalized">Finalized</option>
                    </select>
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {application.status === 'accepted' && (
                      <>
                        <span style={{ color: '#234B73', fontWeight: 600 }}>Set as Current Intern</span>
                        <Switch
                          checked={currentInterns.includes(application.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setCurrentInterns(prev => prev.includes(application.id) ? prev : [...prev, application.id]);
                            } else {
                              setCurrentInterns(prev => prev.filter(id => id !== application.id));
                            }
                          }}
                          color="primary"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {resumeModal.open && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 4000 }} onClick={() => setResumeModal({ open: false, file: '', name: '' })}>
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
                  textAlign: 'center'
                }}
                onClick={e => e.stopPropagation()}
              >
                <h2 style={{ color: '#234B73', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Resume for {resumeModal.name}</h2>
                <div style={{ margin: '0 auto 18px auto', background: '#F6F8FA', borderRadius: 8, padding: 24, maxWidth: 400, color: '#234B73', textAlign: 'left', fontSize: 16 }}>
                  <div><b>Name:</b> {resumeModal.name}</div>
                  <div><b>Email:</b> example@student.guc.edu.eg</div>
                  <div><b>Education:</b> Bachelor of Science in Computer Science, GUC</div>
                  <div><b>Skills:</b> JavaScript, React, Node.js, Teamwork</div>
                  <div><b>Experience:</b> Intern at Tech Company (Summer 2023)</div>
                  <div><b>Summary:</b> Motivated student eager to learn and contribute to real-world projects.</div>
                </div>
                <button
                  onClick={() => handleDownloadPDF(resumeModal.name)}
                  style={{ ...buttonStyle, background: '#F08F36', color: '#fff', textDecoration: 'none' }}
                >
                  Download Resume
                </button>
                <div style={{ marginTop: 24 }}>
                  <button
                    onClick={() => setResumeModal({ open: false, file: '', name: '' })}
                    style={{ ...buttonStyle, background: '#8C8C8C', marginBottom: 0 }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredApplications.length === 0 && (
            <div style={{ ...cardStyle, textAlign: 'center', color: '#8C8C8C' }}>
              No applications found matching the selected filters.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyApplications; 