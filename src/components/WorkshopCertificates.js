import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { dummyWorkshops } from './CareerWorkshop';
import jsPDF from 'jspdf';

// Helper to get attended workshops and certificates from local state
const getAttendedWorkshops = (registrations, attendedWorkshops) => {
  return dummyWorkshops.filter(ws => registrations[ws.id] && attendedWorkshops.includes(ws.id));
};

const WorkshopCertificates = ({ registrations, attendedWorkshops, certificates, user }) => {
  const navigate = useNavigate();
  const [viewCert, setViewCert] = useState(null);
  const attended = getAttendedWorkshops(registrations, attendedWorkshops);

  // Restrict access to pro students only
  if (!user?.isProStudent) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#f6f8fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 32px rgba(35,75,115,0.10)', padding: '56px 48px 48px 48px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F08F36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2" /></svg>
              </div>
            </div>
            <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 18 }}>Pro Feature</h1>
            <div style={{ color: '#5A6A7A', fontSize: 18, marginBottom: 32, lineHeight: 1.6 }}>
              This feature is exclusively available for Pro students. Upgrade your account to access SCAD appointments, career workshops, and online assessments.
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 38px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #234B7322' }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  // Dummy certificates with realistic workshop names
  const dummyCertificates = [
    {
      id: 'dummy-1',
      title: 'CV & Resume Building',
      date: '2024-05-10',
      time: '15:00',
      icon: true
    },
    {
      id: 'dummy-2',
      title: 'Technical Interview Preparation',
      date: '2024-04-22',
      time: '13:00',
      icon: true
    },
    {
      id: 'dummy-3',
      title: 'Networking for Success',
      date: '2024-03-18',
      time: '17:00',
      icon: true
    }
  ];

  // Merge real and dummy certificates
  const allCertificates = [
    ...attended.map(ws => ({ ...ws, id: ws.id, icon: false })),
    ...dummyCertificates
  ];

  const handleDownloadCertificate = (ws) => {
    const pdf = new jsPDF();
    pdf.setFontSize(22);
    pdf.text('Certificate of Attendance', 20, 30);
    pdf.setFontSize(16);
    pdf.text(`This certifies that`, 20, 50);
    pdf.setFontSize(18);
    pdf.text(`${user?.fullName || 'Student'}`, 20, 65);
    pdf.setFontSize(16);
    pdf.text(`attended the workshop:`, 20, 85);
    pdf.setFontSize(18);
    pdf.text(`${ws.title}`, 20, 100);
    pdf.setFontSize(16);
    pdf.text(`on ${ws.date} at ${ws.time}.`, 20, 120);
    pdf.save(`Certificate-${ws.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 32, maxWidth: 1400, margin: '72px auto 0 auto' }}>
        <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 32 }}>My Workshop Certificates</h1>
        {allCertificates.length === 0 ? (
          <div style={{ color: '#8C8C8C', textAlign: 'center', padding: '32px', fontSize: 18 }}>
            You have not earned any workshop certificates yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
            {allCertificates.map(ws => (
              <div key={ws.id} style={{ width: 210, height: 210, background: '#F5F7FA', borderRadius: 18, boxShadow: '0 2px 8px #234B7312', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 18 }}>
                <div style={{ marginBottom: 12 }}>
                  {/* Certificate Icon */}
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F08F36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="M7 9h10M7 13h6" />
                    <circle cx="18" cy="17" r="2" />
                    <path d="M18 19v2" />
                  </svg>
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#234B73', textAlign: 'center', marginBottom: 6 }}>{ws.title}</div>
                <div style={{ color: '#8C8C8C', fontSize: 14, marginBottom: 10 }}>{ws.date} {ws.time}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <button onClick={() => setViewCert(ws)} style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>View</button>
                  <button onClick={() => handleDownloadCertificate(ws)} style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><path d="M12 5v12M5 12l7 7 7-7" /><rect x="5" y="19" width="14" height="2" rx="1" /></svg>
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Certificate View Modal */}
      {viewCert && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 5000 }} onClick={() => setViewCert(null)}>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', padding: '48px 38px 38px 38px', minWidth: 340, maxWidth: '90vw', minHeight: 320, zIndex: 5001, display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
            {/* Close X button */}
            <button onClick={() => setViewCert(null)} aria-label="Close" style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 28, color: '#8C8C8C', cursor: 'pointer', borderRadius: 6, padding: 4, transition: 'background 0.15s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#F08F36')}
              onMouseOut={e => (e.currentTarget.style.background = 'none')}
            >
              ×
            </button>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#F08F36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 18 }}>
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="M7 9h10M7 13h6" />
              <circle cx="18" cy="17" r="2" />
              <path d="M18 19v2" />
            </svg>
            <div style={{ fontWeight: 700, fontSize: 26, color: '#234B73', marginBottom: 10, textAlign: 'center' }}>Certificate of Attendance</div>
            <div style={{ color: '#234B73', fontSize: 18, marginBottom: 8, textAlign: 'center' }}>This certifies that</div>
            <div style={{ color: '#F08F36', fontWeight: 700, fontSize: 22, marginBottom: 8, textAlign: 'center' }}>{user?.fullName || 'Student'}</div>
            <div style={{ color: '#234B73', fontSize: 18, marginBottom: 8, textAlign: 'center' }}>attended the workshop:</div>
            <div style={{ color: '#234B73', fontWeight: 700, fontSize: 20, marginBottom: 8, textAlign: 'center' }}>{viewCert.title}</div>
            <div style={{ color: '#8C8C8C', fontSize: 16, marginBottom: 18, textAlign: 'center' }}>on {viewCert.date} at {viewCert.time}</div>
            <button onClick={() => handleDownloadCertificate(viewCert)} style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><path d="M12 5v12M5 12l7 7 7-7" /><rect x="5" y="19" width="14" height="2" rx="1" /></svg>
              Download PDF
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkshopCertificates; 