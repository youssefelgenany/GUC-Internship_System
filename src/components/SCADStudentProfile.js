import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SCADNavbar from './SCADNavbar';

const dummyStudents = [
  {
    id: 1,
    name: 'Youssef Khaled',
    email: 'youssef.khaled@student.guc.edu.eg',
    status: 'Current Internship',
    major: 'Computer engineering',
    profile: {
      year: '3',
      gpa: 1.1,
      phone: '+20 102 222 9219',
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
    major: 'Computer engineering',
    profile: {
      year: '4',
      gpa: 1.3,
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

const SCADStudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = dummyStudents.find(s => String(s.id) === String(id));

  if (!student) {
    return (
      <>
        <SCADNavbar />
        <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#991B1B', fontWeight: 700, fontSize: 24 }}>Student not found.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <SCADNavbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 0' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 16px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: '#C0CEDB', color: '#234B73', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 24 }}
          >
            ← Back
          </button>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(35,75,115,0.08)', padding: 36, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 18 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 36 }}>
                {student.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 28, color: '#234B73' }}>{student.name}</div>
                <div style={{ color: '#5A6A7A', fontSize: 17 }}>{student.email}</div>
                <div style={{ color: '#35708E', fontWeight: 600, fontSize: 16 }}>{student.status}</div>
              </div>
            </div>
            <div style={{ color: '#234B73', fontSize: 17, marginBottom: 8 }}><b>Major:</b> {student.major}</div>
            <div style={{ color: '#234B73', fontSize: 17, marginBottom: 8 }}><b>Year:</b> {student.profile.year}</div>
            <div style={{ color: '#234B73', fontSize: 17, marginBottom: 8 }}><b>GPA:</b> {student.profile.gpa}</div>
            <div style={{ color: '#234B73', fontSize: 17, marginBottom: 8 }}><b>Phone:</b> {student.profile.phone}</div>
            <div style={{ color: '#234B73', fontSize: 17, marginBottom: 18 }}><b>Bio:</b> {student.profile.bio}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(35,75,115,0.08)', padding: 28 }}>
            <h2 style={{ color: '#234B73', fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Submitted Reports</h2>
            {student.reports.length === 0 ? (
              <div style={{ color: '#8C8C8C', fontSize: 16 }}>No reports submitted.</div>
            ) : (
              <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                {student.reports.map(report => (
                  <li key={report.id} style={{ marginBottom: 10, color: '#234B73', fontSize: 16, background: '#C0CEDB', borderRadius: 8, padding: '10px 16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>{report.title}</span>
                    <span style={{ color: report.status === 'Accepted' ? '#065F46' : report.status === 'Flagged' ? '#F08F36' : '#991B1B', fontWeight: 700, fontSize: 15, marginLeft: 'auto' }}>{report.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SCADStudentProfile; 