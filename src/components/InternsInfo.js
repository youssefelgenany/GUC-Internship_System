import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CompanyNavbar from './CompanyNavbar';

const InternsInfo = () => {
  const { internshipId } = useParams();

  // Version for dummy data to reset localStorage
  const DATA_VERSION = '1.0';

  // Helper to get and set localStorage
  const getLocal = (key, fallback) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return fallback;
    }
  };

  const setLocal = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  };

  const internsKey = `interns_${internshipId}`;

  // Initialize with mock data
  const initialInterns = [
    {
      id: 11,
      name: 'Mina Gerges',
      email: 'mina.gerges@student.guc.edu.eg',
      phone: '+20 101 234 5678',
      studentId: 'STU011',
      startDate: '2024-04-01',
      endDate: '2024-07-01',
      status: 'current intern',
      gpa: '3.8',
      year: '4',
      major: 'Computer Engineering',
      performance: 'Excellent',
      jobTitle: 'Software Engineering Intern',
      lastEmailSent: 'Acceptance',
      emailType: 'acceptance',
    },
    {
      id: 12,
      name: 'Nourhan Tarek',
      email: 'nourhan.tarek@student.guc.edu.eg',
      phone: '+20 102 345 6789',
      studentId: 'STU012',
      startDate: '2024-04-02',
      endDate: '2024-07-02',
      status: 'current intern',
      gpa: '3.6',
      year: '3',
      major: 'Architecture',
      performance: 'Good',
      jobTitle: 'Urban Planning Intern',
      lastEmailSent: 'Acceptance',
      emailType: 'acceptance',
    },
    {
      id: 13,
      name: 'Karim Fathy',
      email: 'karim.fathy@student.guc.edu.eg',
      phone: '+20 103 456 7890',
      studentId: 'STU013',
      startDate: '2024-04-03',
      endDate: '2024-07-03',
      status: 'current intern',
      gpa: '3.2',
      year: '2',
      major: 'Business Administration',
      performance: 'Average',
      jobTitle: 'Business Analyst Intern',
      lastEmailSent: 'Acceptance',
      emailType: 'acceptance',
    },
    {
      id: 14,
      name: 'Dina Magdy',
      email: 'dina.magdy@student.guc.edu.eg',
      phone: '+20 104 567 8901',
      studentId: 'STU014',
      startDate: '2024-04-04',
      endDate: '2024-07-04',
      status: 'current intern',
      gpa: '3.9',
      year: '5',
      major: 'Pharmacy',
      performance: 'Excellent',
      jobTitle: 'Pharmaceutical Research Intern',
      lastEmailSent: 'Acceptance',
      emailType: 'acceptance',
    },
  ];

  // Initialize interns state with versioned localStorage
  const [interns, setInterns] = useState(() => {
    const storedData = getLocal(internsKey, null);
    if (!storedData || storedData.version !== DATA_VERSION) {
      const newData = {
        version: DATA_VERSION,
        interns: initialInterns,
      };
      setLocal(internsKey, newData);
      return initialInterns;
    }
    return storedData.interns;
  });

  // Update localStorage when interns change
  useEffect(() => {
    setLocal(internsKey, {
      version: DATA_VERSION,
      interns,
    });
  }, [interns, internsKey]);

  // Simulate sending an email
  const sendEmail = (to, subject, body) => {
    console.log(`Email sent to ${to}: ${subject}\n${body}`);
  };

  const handlePerformanceChange = (internId, newPerformance) => {
    setInterns((prev) =>
      prev.map((intern) => {
        if (intern.id === internId) {
          const emailSubject = 'Internship Performance Update';
          const emailBody = `Dear ${intern.name},\n\nYour performance for the ${intern.jobTitle} position has been updated to: ${newPerformance}.\n\nBest regards,\nGUC Internship System`;
          sendEmail(intern.email, emailSubject, emailBody);
          return {
            ...intern,
            performance: newPerformance,
            lastEmailSent: 'Performance Update',
            emailType: 'performance_update',
          };
        }
        return intern;
      })
    );
  };

  const handleStatusChange = (internId, newStatus) => {
    setInterns((prev) =>
      prev.map((intern) => {
        if (intern.id === internId) {
          let emailSubject = 'Internship Status Update';
          let emailBody = `Dear ${intern.name},\n\nYour status for the ${intern.jobTitle} position has been updated to: ${newStatus}.\n\nBest regards,\nGUC Internship System`;
          let emailType = 'status_update';

          if (newStatus === 'internship complete') {
            emailSubject = 'Internship Completion';
            emailBody = `Dear ${intern.name},\n\nCongratulations on completing your ${intern.jobTitle} internship! We appreciate your hard work and dedication.\n\nBest regards,\nGUC Internship System`;
            emailType = 'completion';
          } else if (newStatus === 'terminated') {
            emailSubject = 'Internship Termination';
            emailBody = `Dear ${intern.name},\n\nWe regret to inform you that your ${intern.jobTitle} internship has been terminated.\n\nBest regards,\nGUC Internship System`;
            emailType = 'termination';
          }

          sendEmail(intern.email, emailSubject, emailBody);
          return {
            ...intern,
            status: newStatus,
            lastEmailSent: emailSubject.split(' ').pop(),
            emailType,
          };
        }
        return intern;
      })
    );
  };

  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [pendingPerformance, setPendingPerformance] = useState('');
  const [pendingStatus, setPendingStatus] = useState('');
  const [performance, setPerformance] = useState('');
  const [status, setStatus] = useState('');

  const applyFilters = () => {
    setPerformance(pendingPerformance);
    setStatus(pendingStatus);
    setShowFilter(false);
  };

  const clearFilters = () => {
    setPendingPerformance('');
    setPendingStatus('');
    setPerformance('');
    setStatus('');
    setShowFilter(false);
  };

  const filteredInterns = interns.filter((intern) => {
    const matchesSearch =
      intern.name.toLowerCase().includes(search.toLowerCase()) ||
      intern.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchesPerformance = performance ? intern.performance === performance : true;
    const matchesStatus = status ? intern.status === status : true;
    return matchesSearch && matchesPerformance && matchesStatus;
  });

  const [expandedId, setExpandedId] = useState(null);

  const studentDetails = {
    STU011: {
      skills: 'Python, C++, Java, Git, Docker',
      bio: 'Passionate about software development and building scalable systems.',
      previousInternships: ['Software Intern at Microsoft - 2023', 'Backend Developer at GUC Labs - 2022'],
      certificates: ['AWS Certified Developer', 'Python Professional Certificate'],
    },
    STU012: {
      skills: 'AutoCAD, Revit, Urban Design, GIS',
      bio: 'Dedicated to innovative urban planning and sustainable architecture.',
      previousInternships: ['Architecture Intern at Dar Al-Handasah - 2023', 'Urban Planning Assistant at GUC - 2022'],
      certificates: ['AutoCAD Certified Professional', 'GIS Fundamentals'],
    },
    STU013: {
      skills: 'Data Analysis, Excel, Tableau, Business Strategy',
      bio: 'Focused on data-driven decision-making and process optimization.',
      previousInternships: ['Business Analyst Intern at PWC - 2023', 'Data Intern at EY - 2022'],
      certificates: ['Tableau Desktop Specialist', 'Lean Six Sigma Yellow Belt'],
    },
    STU014: {
      skills: 'Pharmaceutical Research, Lab Techniques, Data Analysis',
      bio: 'Committed to advancing pharmaceutical innovation and research.',
      previousInternships: ['Research Intern at Novartis - 2023', 'Lab Assistant at GUC - 2022'],
      certificates: ['Good Clinical Practice (GCP)', 'Pharmacy Research Certificate'],
    },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <CompanyNavbar />
      <div
        style={{
          padding: 32,
          maxWidth: 1200,
          margin: '72px auto 0 auto',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(35,75,115,0.10)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700 }}>Interns Information</h1>
          <Link
            to="/company-internships"
            style={{
              background: '#234B73',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 16,
              transition: 'background 0.2s',
            }}
          >
            Back to Internships
          </Link>
        </div>

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search by name or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid #C0CEDB',
              fontSize: 16,
              color: '#234B73',
              outline: 'none',
            }}
          />
          <button
            onClick={() => setShowFilter(true)}
            style={{
              background: '#F08F36',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter by
          </button>
        </div>

        {/* Filter Modal */}
        {showFilter && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.18)',
                zIndex: 2000,
              }}
              onClick={() => setShowFilter(false)}
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
                padding: '32px',
                zIndex: 2001,
                minWidth: 400,
                maxWidth: '90vw',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: '#234B73', fontSize: 24, fontWeight: 700, margin: 0 }}>Filter Interns</h2>
                <button
                  onClick={() => setShowFilter(false)}
                  style={{ background: 'none', border: 'none', fontSize: 24, color: '#F08F36', cursor: 'pointer', padding: 4 }}
                >
                  ×
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8 }}>Performance</label>
                  <select
                    value={pendingPerformance}
                    onChange={(e) => setPendingPerformance(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #C0CEDB',
                      fontSize: 16,
                      color: '#234B73',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23234B73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '16px',
                    }}
                  >
                    <option value="">All</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8 }}>Status</label>
                  <select
                    value={pendingStatus}
                    onChange={(e) => setPendingStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #C0CEDB',
                      fontSize: 16,
                      color: '#234B73',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23234B73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '16px',
                    }}
                  >
                    <option value="">All</option>
                    <option value="current intern">Current Intern</option>
                    <option value="internship complete">Internship Complete</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
                {(performance || status) && (
                  <div style={{ marginTop: 8, padding: '12px', background: '#F3F4F6', borderRadius: 8, color: '#234B73' }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Current Filter:</div>
                    {performance && <div>Performance: {performance}</div>}
                    {status && <div>Status: {status}</div>}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <button
                    onClick={clearFilters}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#E5E7EB',
                      color: '#374151',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={applyFilters}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#F08F36',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Interns Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>
                  Student Name
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>
                  Phone Number
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>
                  Email Address
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>
                  Job Title
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>
                  Start Date
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>
                  End Date
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>
                  Performance
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>
                  Last Email Sent
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>
                  Email Type
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInterns.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    style={{ textAlign: 'center', color: '#6B7280', padding: '32px', fontSize: 16 }}
                  >
                    No interns found.
                  </td>
                </tr>
              ) : (
                filteredInterns.map((intern) => (
                  <React.Fragment key={intern.id}>
                    <tr style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 8 }}>
                      <td style={{ padding: '16px', color: '#234B73', fontWeight: 500 }}>{intern.name}</td>
                      <td style={{ padding: '16px', color: '#6B7280' }}>{intern.phone}</td>
                      <td style={{ padding: '16px', color: '#6B7280' }}>{intern.email}</td>
                      <td style={{ padding: '16px', color: '#6B7280' }}>{intern.jobTitle}</td>
                      <td style={{ padding: '16px', color: '#6B7280' }}>
                        {new Date(intern.startDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px', color: '#6B7280' }}>
                        {intern.endDate ? new Date(intern.endDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <select
                          value={intern.status}
                          onChange={(e) => handleStatusChange(intern.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            border: '1px solid #C0CEDB',
                            color:
                              intern.status === 'current intern'
                                ? '#22C55E'
                                : intern.status === 'internship complete'
                                ? '#234B73'
                                : '#EF4444',
                            background:
                              intern.status === 'current intern'
                                ? '#F0FDF4'
                                : intern.status === 'internship complete'
                                ? '#F0F9FF'
                                : '#FEF2F2',
                            fontWeight: '600',
                          }}
                        >
                          <option
                            value="current intern"
                            style={{ color: '#22C55E', background: '#F0FDF4' }}
                          >
                            Current Intern
                          </option>
                          <option
                            value="internship complete"
                            style={{ color: '#234B73', background: '#F0F9FF' }}
                          >
                            Internship Complete
                          </option>
                          <option value="terminated" style={{ color: '#EF4444', background: '#FEF2F2' }}>
                            Terminated
                          </option>
                        </select>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <select
                          value={intern.performance}
                          onChange={(e) => handlePerformanceChange(intern.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            border: '1px solid #C0CEDB',
                            color:
                              intern.performance === 'Excellent'
                                ? '#22C55E'
                                : intern.performance === 'Good'
                                ? '#234B73'
                                : intern.performance === 'Average'
                                ? '#F59E0B'
                                : '#EF4444',
                            background:
                              intern.performance === 'Excellent'
                                ? '#F0FDF4'
                                : intern.performance === 'Good'
                                ? '#F0F9FF'
                                : intern.performance === 'Average'
                                ? '#FEFCE8'
                                : '#FEF2F2',
                            fontWeight: '600',
                          }}
                        >
                          <option
                            value="Excellent"
                            style={{ color: '#22C55E', background: '#F0FDF4' }}
                          >
                            Excellent
                          </option>
                          <option value="Good" style={{ color: '#234B73', background: '#F0F9FF' }}>
                            Good
                          </option>
                          <option
                            value="Average"
                            style={{ color: '#F59E0B', background: '#FEFCE8' }}
                          >
                            Average
                          </option>
                          <option value="Poor" style={{ color: '#EF4444', background: '#FEF2F2' }}>
                            Poor
                          </option>
                        </select>
                      </td>
                      <td style={{ padding: '16px', color: '#6B7280' }}>{intern.lastEmailSent}</td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                            color:
                              intern.emailType === 'acceptance'
                                ? '#22C55E'
                                : intern.emailType === 'completion'
                                ? '#234B73'
                                : intern.emailType === 'termination'
                                ? '#EF4444'
                                : '#F59E0B',
                            background:
                              intern.emailType === 'acceptance'
                                ? '#F0FDF4'
                                : intern.emailType === 'completion'
                                ? '#F0F9FF'
                                : intern.emailType === 'termination'
                                ? '#FEF2F2'
                                : '#FEFCE8',
                          }}
                        >
                          {intern.emailType === 'acceptance'
                            ? 'Acceptance'
                            : intern.emailType === 'completion'
                            ? 'Completion'
                            : intern.emailType === 'termination'
                            ? 'Termination'
                            : intern.emailType === 'performance_update'
                            ? 'Performance Update'
                            : 'Status Update'}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button
                          onClick={() => setExpandedId(expandedId === intern.id ? null : intern.id)}
                          style={{
                            color: '#F08F36',
                            background: 'none',
                            border: 'none',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          View Profile
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            style={{
                              transform: expandedId === intern.id ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s',
                            }}
                          >
                            <path d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {expandedId === intern.id && (
                      <tr>
                        <td colSpan={11} style={{ padding: '0 16px 16px' }}>
                          {studentDetails[intern.studentId] ? (
                            <div
                              style={{
                                background: '#F8FAFC',
                                padding: '24px',
                                borderRadius: 8,
                                border: '1px solid #E2E8F0',
                                marginTop: -8,
                              }}
                            >
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                                <div>
                                  <div style={{ marginBottom: '16px' }}>
                                    <div style={{ color: '#6B7280', marginBottom: '4px' }}>Student ID:</div>
                                    <div style={{ color: '#234B73', fontWeight: 500 }}>{intern.studentId}</div>
                                  </div>
                                  <div style={{ marginBottom: '16px' }}>
                                    <div style={{ color: '#6B7280', marginBottom: '4px' }}>Email:</div>
                                    <div style={{ color: '#234B73', fontWeight: 500 }}>{intern.email}</div>
                                  </div>
                                  <div style={{ marginBottom: '16px' }}>
                                    <div style={{ color: '#6B7280', marginBottom: '4px' }}>Major:</div>
                                    <div style={{ color: '#234B73', fontWeight: 500 }}>{intern.major}</div>
                                  </div>
                                  <div style={{ marginBottom: '16px' }}>
                                    <div style={{ color: '#6B7280', marginBottom: '4px' }}>Year:</div>
                                    <div style={{ color: '#234B73', fontWeight: 500 }}>{intern.year}</div>
                                  </div>
                                  <div>
                                    <div style={{ color: '#6B7280', marginBottom: '4px' }}>GPA:</div>
                                    <div style={{ color: '#234B73', fontWeight: 500 }}>{intern.gpa}</div>
                                  </div>
                                </div>
                                <div>
                                  <div style={{ marginBottom: '16px' }}>
                                    <div style={{ color: '#6B7280', marginBottom: '4px' }}>Skills:</div>
                                    <div style={{ color: '#234B73', fontWeight: 500 }}>
                                      {studentDetails[intern.studentId].skills}
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ color: '#6B7280', marginBottom: '4px' }}>Bio:</div>
                                    <div style={{ color: '#234B73', fontWeight: 500 }}>
                                      {studentDetails[intern.studentId].bio}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div style={{ marginBottom: '16px' }}>
                                    <div style={{ color: '#6B7280', marginBottom: '4px' }}>Previous Internships:</div>
                                    <ul style={{ color: '#234B73', fontWeight: 500, paddingLeft: '20px' }}>
                                      {studentDetails[intern.studentId].previousInternships.map((internship, idx) => (
                                        <li key={idx}>{internship}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <div style={{ color: '#6B7280', marginBottom: '4px' }}>Certificates:</div>
                                    <ul style={{ color: '#234B73', fontWeight: 500, paddingLeft: '20px' }}>
                                      {studentDetails[intern.studentId].certificates.map((cert, idx) => (
                                        <li key={idx}>{cert}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div style={{ padding: '16px', color: '#EF4444' }}>
                              Student details not found for {intern.studentId}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InternsInfo;