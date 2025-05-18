import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CompanyNavbar from './CompanyNavbar';

const mapStatus = (status, endDate) => {
  const now = new Date();
  if (endDate && new Date(endDate) < now) return 'internship complete';
  if (status === 'accepted') return 'current intern';
  return status || 'current intern';
};

const getLocal = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    console.log(`Reading ${key} from localStorage:`, item);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const AllCurrentInterns = () => {
  const { state } = useLocation();
  const defaultInterns = [
    {
      id: 12,
      name: 'Nourhan Tarek',
      email: 'nourhan.tarek@student.guc.edu.eg',
      phone: '+20 102 345 6789',
      studentId: 'STU012',
      startDate: '2025-05-15',
      endDate: '2025-08-15', // 3 months from startDate
      status: 'accepted',
      gpa: '3.6',
      year: '3',
      major: 'Data Science',
      internshipTitle: 'Data Science Intern',
    },
    {
      id: 13,
      name: 'Ahmed Tarek',
      email: 'ahmed.tarek@student.guc.edu.eg',
      phone: '+20 102 345 6789',
      studentId: 'STU013',
      startDate: '2025-05-15',
      endDate: '2025-08-15', // 3 months from startDate
      status: 'accepted',
      gpa: '3.2',
      year: '4',
      major: 'Computer Science',
      internshipTitle: 'UI/UX Intern',
    },
    {
      id: 14,
      name: 'Dina Magdy',
      email: 'dina.magdy@student.guc.edu.eg',
      phone: '+20 104 567 8901',
      studentId: 'STU014',
      startDate: '2025-05-15',
      endDate: '2025-08-15', // 3 months from startDate
      status: 'accepted',
      gpa: '3.9',
      year: '5',
      major: 'Computer Science',
      internshipTitle: 'Cybersecurity Intern',
    },
    {
      id: 15,
      name: 'Ali Omar',
      email: 'ali.omar@student.guc.edu.eg',
      phone: '+20 102 345 6789',
      studentId: 'STU015',
      startDate: '2025-05-15',
      endDate: '2025-08-15', // 3 months from startDate
      status: 'accepted',
      gpa: '2.7',
      year: '4',
      major: 'Computer Science',
      internshipTitle: 'DevOps Intern',
    },
  ];
  
  const [currentInterns, setCurrentInterns] = useState([]);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');
  const [status, setStatus] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const studentDetails = {
    STU011: {
      skills: 'Python, Java, C++, Git, Docker',
      bio: 'Aspiring software engineer passionate about building scalable backend systems and microservices.',
      previousInternships: ['Software Intern at Microsoft - 2023', 'Backend Developer at GUC Labs - 2022'],
      certificates: ['AWS Certified Developer', 'Java Professional Certificate', 'Docker Essentials'],
    },
    STU012: {
      skills: 'Python, R, TensorFlow, SQL, Pandas',
      bio: 'Data science enthusiast with expertise in machine learning and statistical modeling.',
      previousInternships: ['Data Science Intern at IBM - 2023', 'Analytics Intern at Vodafone - 2022'],
      certificates: ['TensorFlow Developer Certificate', 'Data Science Professional', 'SQL Advanced'],
    },
    STU013: {
      skills: 'Figma, Sketch, Adobe XD, Prototyping, User Research',
      bio: 'Creative UI/UX designer focused on creating intuitive and user-friendly interfaces.',
      previousInternships: ['UI/UX Intern at Google - 2023', 'Design Assistant at Instabug - 2022'],
      certificates: ['Figma Professional', 'UX Design Fundamentals', 'User Research Certification'],
    },
    STU014: {
      skills: 'Wireshark, Kali Linux, Penetration Testing, Firewalls, Encryption',
      bio: 'Cybersecurity enthusiast dedicated to securing systems through ethical hacking and threat analysis.',
      previousInternships: ['Cybersecurity Intern at Cisco - 2023', 'Security Analyst at Orange - 2022'],
      certificates: ['Certified Ethical Hacker', 'CompTIA Security+', 'Network Security Essentials'],
    },
    STU015: {
      skills: 'AWS, Kubernetes, Jenkins, Ansible, Terraform',
      bio: 'DevOps enthusiast skilled in automating infrastructure and optimizing CI/CD pipelines.',
      previousInternships: ['DevOps Intern at Amazon - 2023', 'Cloud Engineer at Dell - 2022'],
      certificates: ['AWS Certified DevOps Engineer', 'Kubernetes Administrator', 'Terraform Associate'],
    },
  };

  const refreshInterns = () => {
    const interns = getLocal('all_interns', defaultInterns);
    console.log('Refreshed currentInterns:', interns);
    setCurrentInterns(interns);
  };

  useEffect(() => {
    refreshInterns();
    const interval = setInterval(refreshInterns, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (state?.internId) {
      setExpandedId(state.internId);
      setSearch('');
      setStatus('');
      console.log('Auto-expanding intern ID:', state.internId);
    }
  }, [state]);

  const applyFilters = () => {
    setStatus(pendingStatus);
    setShowFilter(false);
  };

  const clearFilters = () => {
    setPendingStatus('');
    setStatus('');
    setShowFilter(false);
  };

  const filteredInterns = currentInterns.filter((intern) => {
    if (!intern) return false;
    const matchesSearch =
      (intern.name?.toLowerCase().includes(search.toLowerCase()) || '') ||
      (intern.internshipTitle?.toLowerCase().includes(search.toLowerCase()) || '');
    const displayStatus = mapStatus(intern.status, intern.endDate);
    const matchesStatus = status ? displayStatus === status : true;
    return matchesSearch && matchesStatus;
  });

  const debugData = () => {
    const interns = getLocal('all_interns', defaultInterns);
    console.log('Debug - all_interns:', interns);
    console.log('Debug - currentInterns:', currentInterns);
    console.log('Debug - filteredInterns:', filteredInterns);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <CompanyNavbar />
      <div style={{ padding: 32, maxWidth: 1200, margin: '72px auto 0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(35,75,115,0.10)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700 }}>All Current Interns</h1>
          <div style={{ display: 'flex', gap: 16 }}>
            {/* <button
              onClick={debugData}
              style={{
                background: '#EF4444',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Debug Data
            </button> */}
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
              Go to Company Internships
            </Link>
          </div>
        </div>
        {state?.message && <p style={{ color: '#22C55E', fontWeight: 500, marginBottom: 16 }}>{state.message}</p>}

        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search by student name or job title..."
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
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter by
          </button>
        </div>

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
                  <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8 }}>Intern Status:</label>
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
                  </select>
                </div>
                {pendingStatus && (
                  <div style={{ marginTop: 8, padding: '12px', background: '#F3F4F6', borderRadius: 8, color: '#234B73' }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Current Filter:</div>
                    <div>Status: {pendingStatus}</div>
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

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Student Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Internship Title</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Phone Number</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Email Address</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Start Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>End Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterns.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#6B7280', padding: '32px', fontSize: 16 }}>
                    No current interns found.
                  </td>
                </tr>
              ) : (
                filteredInterns.map((intern) => {
                  const displayStatus = mapStatus(intern.status, intern.endDate).replace('current intern', 'CurrentIntern');
                  return (
                    <React.Fragment key={`${intern.id}`}>
                      <tr style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 8 }}>
                        <td style={{ padding: '16px', color: '#234B73', fontWeight: 500 }}>{intern.name}</td>
                        <td style={{ padding: '16px', color: '#6B7280' }}>{intern.internshipTitle}</td>
                        <td style={{ padding: '16px', color: '#6B7280' }}>{intern.phone}</td>
                        <td style={{ padding: '16px', color: '#6B7280' }}>{intern.email}</td>
                        <td style={{ padding: '16px', color: '#6B7280' }}>{new Date(intern.startDate).toLocaleDateString()}</td>
                        <td style={{ padding: '16px', color: '#6B7280' }}>{intern.endDate ? new Date(intern.endDate).toLocaleDateString() : 'TBD'}</td>
                        <td style={{ padding: '16px' }}>
                          <span
                            style={{
                              padding: '4px 8px',
                              fontSize: 12,
                              fontWeight: 600,
                              borderRadius: 4,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              lineHeight: '1.2',
                              ...(displayStatus === 'CurrentIntern'
                                ? { background: '#DCFCE7', color: '#166534' }
                                : displayStatus === 'internship complete'
                                ? { background: '#F3E8FF', color: '#6B7280' }
                                : { background: '#F3F4F6', color: '#374151' }),
                            }}
                          >
                            {displayStatus === 'CurrentIntern' ? (
                              <>
                                <span>Current</span>
                                <span>Intern</span>
                              </>
                            ) : (
                              displayStatus
                            )}
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
                          <td colSpan={8} style={{ padding: '0 16px 16px' }}>
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
                                      <div style={{ color: '#234B73', fontWeight: 500 }}>{studentDetails[intern.studentId].skills}</div>
                                    </div>
                                    <div>
                                      <div style={{ color: '#6B7280', marginBottom: '4px' }}>Bio:</div>
                                      <div style={{ color: '#234B73', fontWeight: 500 }}>{studentDetails[intern.studentId].bio}</div>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllCurrentInterns;