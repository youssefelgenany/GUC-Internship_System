import React, { useState } from 'react';
import SCADNavbar from './SCADNavbar';

const SCADInternshipCycle = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <SCADNavbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 0' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 18 }}>Set Internship Cycle Dates</h1>
          <form onSubmit={handleSave} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(35,75,115,0.08)', padding: 36, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={{ color: '#234B73', fontWeight: 700, fontSize: 17, marginBottom: 8, display: 'block' }}>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
                style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 16, background: '#fff', color: '#234B73', width: '100%', boxShadow: '0 1px 4px #C0CEDB22' }}
              />
            </div>
            <div>
              <label style={{ color: '#234B73', fontWeight: 700, fontSize: 17, marginBottom: 8, display: 'block' }}>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
                style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 16, background: '#fff', color: '#234B73', width: '100%', boxShadow: '0 1px 4px #C0CEDB22' }}
              />
            </div>
            <button
              type="submit"
              style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginTop: 10, transition: 'background 0.18s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#35708E')}
              onMouseOut={e => (e.currentTarget.style.background = '#F08F36')}
            >
              Save
            </button>
            {saved && <div style={{ color: '#065F46', fontWeight: 700, marginTop: 10 }}>Internship cycle dates saved!</div>}
          </form>
        </div>
      </div>
    </>
  );
};

export default SCADInternshipCycle; 