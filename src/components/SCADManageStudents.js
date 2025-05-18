import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SCADNavbar from './SCADNavbar';
import { FaFilter } from 'react-icons/fa';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import jsPDF from 'jspdf';

const dummyStudents = [
  {
    id: 1,
    name: 'Youssef Khaled',
    email: 'youssef.khaled@student.guc.edu.eg',
    status: 'Current Internship',
    major: 'CS',
    profile: {
      year: '3',
      gpa: 3.7,
      phone: '+20 100 123 4567',
      bio: 'Passionate about software engineering and AI.',
    },
    reports: [
      { id: 1, title: 'Google Internship Report', status: 'Accepted' },
      { id: 2, title: 'Microsoft Internship Report', status: 'Flagged' },
    ],
  },
  {
    id: 2,
    name: 'Salma Ahmed',
    email: 'salma.ahmed@student.guc.edu.eg',
    status: 'Completed Internship',
    major: 'CS',
    profile: {
      year: '4',
      gpa: 3.9,
      phone: '+20 101 234 5678',
      bio: 'Interested in UX/UI and product design.',
    },
    reports: [
      { id: 3, title: 'Amazon Internship Report', status: 'Accepted' },
    ],
  },
  {
    id: 3,
    name: 'Omar Fathy',
    email: 'omar.fathy@student.guc.edu.eg',
    status: 'No Internship',
    major: 'Engineering',
    profile: {
      year: '2',
      gpa: 3.2,
      phone: '+20 102 345 6789',
      bio: 'Aspiring mechanical engineer.',
    },
    reports: [],
  },
];

const statuses = ['All', 'No Internship', 'Current Internship', 'Completed Internship'];
const majors = ['All', ...Array.from(new Set(dummyStudents.map(s => s.major)))];

const cardStyle = {
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
  padding: 24,
  marginBottom: 18,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const SCADManageStudents = () => {
  const [students] = useState(dummyStudents);
  const [status, setStatus] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showReports, setShowReports] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [tempStatus, setTempStatus] = useState(status);
  const [tempMajor, setTempMajor] = useState('All');
  const navigate = useNavigate();

  const filtered = students.filter(s => (status === 'All' || s.status === status) && (tempMajor === 'All' || s.major === tempMajor));

  function handleDownloadReportPDF(student, report) {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(report.title, 14, 18);
    doc.setFontSize(12);
    let y = 32;
    doc.text(`Student: ${student.name} (${student.email})`, 14, y); y += 8;
    doc.text(`Major: ${student.major}`, 14, y); y += 8;
    doc.text(`Status: ${student.status}`, 14, y); y += 8;
    doc.text(`Report Status: ${report.status}`, 14, y); y += 8;
    doc.text('Body: ...', 14, y); y += 8;
    doc.save(`${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_report.pdf`);
  }

  return (
    <>
      <SCADNavbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 18 }}>Manage Students</h1>
          {/* Filter Label and Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '0 0 8px 0', justifyContent: 'flex-end', position: 'relative' }}>
            <button
              onClick={() => { setTempStatus(status); setTempMajor('All'); setShowFilterDropdown(v => !v); }}
              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 600, fontSize: 24, color: '#F08F36', outline: 'none', position: 'relative', padding: 0 }}
            >
              <FaFilter style={{ marginRight: 7, fontSize: 28, color: '#F08F36' }} />
              <span style={{ fontWeight: 600, fontSize: 24, color: '#F08F36', letterSpacing: 0.5 }}>Filter</span>
              <div style={{ position: 'absolute', left: 0, bottom: -4, width: '100%', height: 4, background: '#F08F36', borderRadius: 2 }} />
            </button>
            {showFilterDropdown && (
              <div style={{ position: 'absolute', zIndex: 2001, top: '100%', right: 0, background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', padding: '28px 28px 20px 28px', minWidth: 270, maxWidth: 340 }}>
                <div style={{ fontWeight: 700, color: '#234B73', fontSize: 18, marginBottom: 18 }}>Filter by:</div>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 600, color: '#234B73', fontSize: 16, marginBottom: 8 }}>Status</div>
                  <select
                    value={tempStatus}
                    onChange={e => setTempStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 15, color: '#234B73', background: '#fff', marginBottom: 10 }}
                  >
                    {statuses.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 600, color: '#234B73', fontSize: 16, marginBottom: 8 }}>Major</div>
                  <select
                    value={tempMajor}
                    onChange={e => setTempMajor(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 15, color: '#234B73', background: '#fff' }}
                  >
                    {majors.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setTempStatus('All');
                      setTempMajor('All');
                      setStatus('All');
                      setShowFilterDropdown(false);
                    }}
                    style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      setStatus(tempStatus);
                      setShowFilterDropdown(false);
                    }}
                    style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
          {filtered.length === 0 ? (
            <div style={{ color: '#8C8C8C', textAlign: 'center', padding: 32 }}>No students found.</div>
          ) : (
            filtered.map(student => {
              const expanded = expandedStudentId === student.id;
              return (
                <div key={student.id} style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setExpandedStudentId(expanded ? null : student.id)}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 20, color: '#234B73' }}>{student.name}</div>
                      <div style={{ color: '#5A6A7A', fontSize: 15 }}>{student.email}</div>
                      <div style={{ color: '#35708E', fontWeight: 600, fontSize: 15 }}>{student.status}</div>
                    </div>
                    <div style={{ marginLeft: 18, display: 'flex', alignItems: 'center' }}>
                      {expanded ? (
                        <FiChevronDown size={22} color="#234B73" />
                      ) : (
                        <FiChevronRight size={22} color="#234B73" />
                      )}
                    </div>
                  </div>
                  {expanded && (
                    <div style={{ marginTop: 18, borderTop: '1px solid #E5E7EB', paddingTop: 18 }}>
                      <div style={{ fontWeight: 700, color: '#234B73', fontSize: 17, marginBottom: 10 }}>Reports</div>
                      {student.reports.length === 0 ? (
                        <div style={{ color: '#8C8C8C', fontSize: 16 }}>No reports submitted.</div>
                      ) : (
                        <ul style={{ paddingLeft: 0, listStyle: 'none', marginBottom: 12 }}>
                          {student.reports.map(report => (
                            <li key={report.id} style={{ marginBottom: 10, color: '#234B73', fontSize: 16, background: '#C0CEDB', borderRadius: 8, padding: '10px 16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                              <span>{report.title}</span>
                              <span style={{ color: report.status === 'Accepted' ? '#065F46' : report.status === 'Flagged' ? '#F08F36' : '#991B1B', fontWeight: 700, fontSize: 15 }}>{report.status}</span>
                              <button
                                onClick={e => { e.stopPropagation(); handleDownloadReportPDF(student, report); }}
                                style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginLeft: 8 }}
                              >
                                Download PDF
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.18s' }}
                          onClick={e => { e.stopPropagation(); setSelectedStudent(student); setShowProfile(true); }}
                          onMouseOver={e => (e.currentTarget.style.background = '#35708E')}
                          onMouseOut={e => (e.currentTarget.style.background = '#F08F36')}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        {/* Reports Modal */}
        {showReports && selectedStudent && (
          <div>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000 }} onClick={() => setShowReports(false)} />
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(53,112,142,0.18)', border: '2px solid #C0CEDB', padding: '32px 28px 24px 28px', zIndex: 2001, minWidth: 340, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ color: '#234B73', fontWeight: 700, fontSize: 24, marginBottom: 10 }}>Reports for {selectedStudent.name}</h2>
              {selectedStudent.reports.length === 0 ? (
                <div style={{ color: '#8C8C8C', fontSize: 16 }}>No reports submitted.</div>
              ) : (
                <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                  {selectedStudent.reports.map(report => (
                    <li key={report.id} style={{ marginBottom: 10, color: '#234B73', fontSize: 16, background: '#C0CEDB', borderRadius: 8, padding: '10px 16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span>{report.title}</span>
                      <span style={{ color: report.status === 'Accepted' ? '#065F46' : report.status === 'Flagged' ? '#F08F36' : '#991B1B', fontWeight: 700, fontSize: 15, marginLeft: 'auto' }}>{report.status}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 10 }}
                onClick={() => setShowReports(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {/* Profile Modal */}
        {showProfile && selectedStudent && (
          <div>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000 }} onClick={() => setShowProfile(false)} />
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(53,112,142,0.18)', border: '2px solid #C0CEDB', padding: '32px 28px 24px 28px', zIndex: 2001, minWidth: 340, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 18 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 36 }}>
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 28, color: '#234B73' }}>{selectedStudent.name}</div>
                  <div style={{ color: '#5A6A7A', fontSize: 17 }}>{selectedStudent.email}</div>
                  <div style={{ color: '#35708E', fontWeight: 600, fontSize: 16 }}>{selectedStudent.status}</div>
                </div>
              </div>
              <div style={{ color: '#234B73', fontSize: 17, marginBottom: 8 }}><b>Major:</b> {selectedStudent.major}</div>
              <div style={{ color: '#234B73', fontSize: 17, marginBottom: 8 }}><b>Year:</b> {selectedStudent.profile.year}</div>
              <div style={{ color: '#234B73', fontSize: 17, marginBottom: 8 }}><b>GPA:</b> {selectedStudent.profile.gpa}</div>
              <div style={{ color: '#234B73', fontSize: 17, marginBottom: 8 }}><b>Phone:</b> {selectedStudent.profile.phone}</div>
              <div style={{ color: '#234B73', fontSize: 17, marginBottom: 18 }}><b>Bio:</b> {selectedStudent.profile.bio}</div>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(35,75,115,0.08)', padding: 18, marginBottom: 12 }}>
                <h2 style={{ color: '#234B73', fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Submitted Reports</h2>
                {selectedStudent.reports.length === 0 ? (
                  <div style={{ color: '#8C8C8C', fontSize: 16 }}>No reports submitted.</div>
                ) : (
                  <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                    {selectedStudent.reports.map(report => (
                      <li key={report.id} style={{ marginBottom: 10, color: '#234B73', fontSize: 16, background: '#C0CEDB', borderRadius: 8, padding: '10px 16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span>{report.title}</span>
                        <span style={{ color: report.status === 'Accepted' ? '#065F46' : report.status === 'Flagged' ? '#F08F36' : '#991B1B', fontWeight: 700, fontSize: 15, marginLeft: 'auto' }}>{report.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 10 }}
                onClick={() => setShowProfile(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SCADManageStudents; 