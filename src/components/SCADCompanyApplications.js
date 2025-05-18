import React, { useState } from 'react';
import SCADNavbar from './SCADNavbar';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { FaFilter } from 'react-icons/fa';

const dummyCompanies = [
  {
    id: 1,
    name: 'Tech Innovators Ltd.',
    industry: 'Technology',
    email: 'contact@techinnovators.com',
    phone: '+20 100 123 4567',
    description: 'A leading technology solutions provider specializing in AI and cloud computing.',
    status: 'pending',
    address: 'Cairo, Egypt',
    website: 'https://techinnovators.com',
    details: 'Founded in 2010, Tech Innovators has worked with Fortune 500 companies and is expanding in the MENA region.'
  },
  {
    id: 2,
    name: 'Green Future Corp.',
    industry: 'Environmental',
    email: 'info@greenfuture.com',
    phone: '+20 101 234 5678',
    description: 'Sustainable solutions for a greener tomorrow.',
    status: 'pending',
    address: 'Alexandria, Egypt',
    website: 'https://greenfuture.com',
    details: 'Green Future Corp. is a pioneer in renewable energy and eco-friendly products.'
  },
  {
    id: 3,
    name: 'MediCare Plus',
    industry: 'Healthcare',
    email: 'hr@medicareplus.com',
    phone: '+20 102 345 6789',
    description: 'Healthcare services and medical equipment supplier.',
    status: 'pending',
    address: 'Giza, Egypt',
    website: 'https://medicareplus.com',
    details: 'MediCare Plus has been serving hospitals and clinics across Egypt since 2005.'
  },
  {
    id: 4,
    name: 'EduWorld',
    industry: 'Education',
    email: 'admin@eduworld.com',
    phone: '+20 103 456 7890',
    description: 'Innovative educational platforms and e-learning.',
    status: 'pending',
    address: 'Mansoura, Egypt',
    website: 'https://eduworld.com',
    details: 'EduWorld provides digital learning solutions for schools and universities.'
  },
];

const industries = ['All', ...Array.from(new Set(dummyCompanies.map(c => c.industry)))];

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

const statusBadge = (status) => {
  if (status === 'accepted') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#D1FAE5', color: '#059669', fontWeight: 600, fontSize: 16, borderRadius: 999, padding: '6px 18px' }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#6EE7B7"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Accepted
      </span>
    );
  } else if (status === 'pending') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FEF3C7', color: '#F59E1B', fontWeight: 600, fontSize: 16, borderRadius: 999, padding: '6px 18px' }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#FDE68A"/><path d="M10 6v4l2 2" stroke="#F59E1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Pending
      </span>
    );
  } else if (status === 'rejected') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FEE2E2', color: '#B91C1C', fontWeight: 600, fontSize: 16, borderRadius: 999, padding: '6px 18px' }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#FCA5A5"/><path d="M7 7l6 6M13 7l-6 6" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round"/></svg>
        Rejected
      </span>
    );
  }
  return null;
};

const SCADCompanyApplications = () => {
  const [companies, setCompanies] = useState(dummyCompanies);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [expandedCompanyId, setExpandedCompanyId] = useState(null);
  const statusOptions = ['All Applications', 'pending', 'accepted', 'rejected'];
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [tempIndustry, setTempIndustry] = useState(industry);
  const [tempStatus, setTempStatus] = useState('All Applications');

  const filtered = companies.filter(c =>
    (tempIndustry === 'All' || c.industry === tempIndustry) &&
    (tempStatus === 'All Applications' || c.status === tempStatus) &&
    c.name.toLowerCase().startsWith(search.toLowerCase())
  );

  const handleDecision = (id, decision) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: decision } : c));
    setExpandedCompanyId(null);
  };

  return (
    <>
      <SCADNavbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 18 }}>Company Applications</h1>
            
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '0 0 24px 0', justifyContent: 'flex-end', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by company name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #C0CEDB', fontSize: 16, background: '#fff', color: '#234B73' }}
            />
            <button
              onClick={() => { setTempIndustry(industry); setTempStatus('All Applications'); setShowFilterDropdown(v => !v); }}
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
                  <div style={{ fontWeight: 600, color: '#234B73', fontSize: 16, marginBottom: 8 }}>Industry</div>
                  <select
                    value={tempIndustry}
                    onChange={e => setTempIndustry(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 15, color: '#234B73', background: '#fff', marginBottom: 10 }}
                  >
                    {industries.map(ind => (
                      <option key={ind} value={ind}>{ind === 'All' ? 'All Internships' : ind}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 600, color: '#234B73', fontSize: 16, marginBottom: 8 }}>Status</div>
                  <select
                    value={tempStatus}
                    onChange={e => setTempStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 15, color: '#234B73', background: '#fff' }}
                  >
                    {statusOptions.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setTempIndustry('All');
                      setTempStatus('All Applications');
                      setIndustry('All');
                      setShowFilterDropdown(false);
                    }}
                    style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      setIndustry(tempIndustry);
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
            <div style={{ color: '#8C8C8C', textAlign: 'center', padding: 32 }}>No company applications found.</div>
          ) : (
            filtered.map(company => {
              const expanded = expandedCompanyId === company.id;
              return (
                <div key={company.id} style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setExpandedCompanyId(expanded ? null : company.id)}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 20, color: '#234B73' }}>{company.name}</div>
                      <div style={{ color: '#5A6A7A', fontSize: 15 }}>{company.industry}</div>
                    </div>
                    <div style={{ marginLeft: 18, display: 'flex', alignItems: 'center' }}>
                      {expanded ? (
                        <FiChevronDown size={22} color="#234B73" />
                      ) : (
                        <FiChevronRight size={22} color="#234B73" />
                      )}
                    </div>
                  </div>
                  <div style={{ color: '#8C8C8C', fontSize: 15 }}>{company.description}</div>
                  <div style={{ marginTop: 6 }}>
                    {statusBadge(company.status)}
                  </div>
                  {expanded && (
                    <div style={{ marginTop: 18, borderTop: '1px solid #E5E7EB', paddingTop: 18 }}>
                      <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Email:</b> {company.email}</div>
                      <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Phone:</b> {company.phone}</div>
                      <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Address:</b> {company.address}</div>
                      <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Website:</b> <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: '#35708E', textDecoration: 'underline' }}>{company.website}</a></div>
                      <div style={{ color: '#234B73', fontSize: 16, marginBottom: 16 }}><b>About:</b> {company.details}</div>
                      {company.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
                          <button
                            style={{ background: '#065F46', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                            onClick={e => { e.stopPropagation(); handleDecision(company.id, 'accepted'); }}
                          >
                            Accept
                          </button>
                          <button
                            style={{ background: '#991B1B', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                            onClick={e => { e.stopPropagation(); handleDecision(company.id, 'rejected'); }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default SCADCompanyApplications; 