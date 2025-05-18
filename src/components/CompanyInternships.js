import React, { useState } from 'react';
import CompanyNavbar from './CompanyNavbar';
import { FaFilter } from 'react-icons/fa';

const dummyInternships = [
      {
        id: 1,
    company: 'Tech Innovators Ltd.',
    jobTitle: 'Frontend Developer Intern',
    industry: 'Technology',
        duration: '3 months',
    paid: true,
    expectedSalary: 1200,
    skills: ['React', 'JavaScript', 'CSS'],
    jobDescription: 'Work with the frontend team to build modern web applications using React.',
      },
      {
        id: 2,
    company: 'Green Future Corp.',
    jobTitle: 'Sustainability Analyst Intern',
    industry: 'Environmental',
        duration: '2 months',
    paid: false,
    expectedSalary: 0,
    skills: ['Data Analysis', 'Research', 'Excel'],
    jobDescription: 'Assist in analyzing sustainability data and preparing reports for eco-projects.',
  },
  {
    id: 3,
    company: 'MediCare Plus',
    jobTitle: 'Healthcare Data Intern',
    industry: 'Healthcare',
    duration: '6 months',
    paid: true,
    expectedSalary: 1500,
    skills: ['Python', 'Data Science', 'Healthcare'],
    jobDescription: 'Support the data science team in healthcare analytics and reporting.',
  },
  {
    id: 4,
    company: 'EduWorld',
    jobTitle: 'E-learning Content Creator',
    industry: 'Education',
    duration: '3 months',
    paid: false,
    expectedSalary: 0,
    skills: ['Content Writing', 'Instructional Design', 'Creativity'],
    jobDescription: 'Create engaging e-learning content for digital education platforms.',
  },
  {
    id: 5,
    company: 'Tech Innovators Ltd.',
    jobTitle: 'Backend Developer Intern',
    industry: 'Technology',
    duration: '4 months',
    paid: true,
    expectedSalary: 1300,
    skills: ['Node.js', 'APIs', 'Databases'],
    jobDescription: 'Develop and maintain backend services and APIs for scalable applications.',
  },
];

const industries = ['All', ...Array.from(new Set(dummyInternships.map(i => i.industry)))];
const durations = ['All', ...Array.from(new Set(dummyInternships.map(i => i.duration)))];
const paidOptions = ['All', 'Paid', 'Unpaid'];

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

const CompanyInternships = () => {
  const [internships] = useState(dummyInternships);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [duration, setDuration] = useState('All');
  const [paid, setPaid] = useState('All');
  const [expandedInternship, setExpandedInternship] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [pendingIndustry, setPendingIndustry] = useState(industry);
  const [pendingDuration, setPendingDuration] = useState(duration);
  const [pendingPaid, setPendingPaid] = useState(paid);

  const filtered = internships.filter(i =>
    (industry === 'All' || i.industry === industry) &&
    (duration === 'All' || i.duration === duration) &&
    (paid === 'All' || (paid === 'Paid' ? i.paid : !i.paid)) &&
    (
      search.trim() === '' ||
      i.jobTitle.toLowerCase().startsWith(search.toLowerCase()) ||
      i.company.toLowerCase().startsWith(search.toLowerCase())
    )
  );

  React.useEffect(() => {
    if (!showFilter) return;
    const handleClick = (e) => {
      if (!e.target.closest('.scad-filter-dropdown') && !e.target.closest('.scad-filter-btn')) {
        setShowFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showFilter]);

  return (
    <>
      <CompanyNavbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 18 }}>Available Internships</h1>
          {/* Search Bar and Filter Button Row */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 12 }}>
          <input
            type="text"
              placeholder="Search by job title or company name..."
            value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #C0CEDB', fontSize: 16, background: '#fff', color: '#234B73' }}
          />
          <div style={{ position: 'relative' }}>
            <button
                className="scad-filter-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#F08F36', fontWeight: 700, fontSize: 22, cursor: 'pointer', padding: '6px 18px 6px 10px', borderRadius: 8 }}
                onClick={() => {
                  setPendingIndustry(industry);
                  setPendingDuration(duration);
                  setPendingPaid(paid);
                  setShowFilter(v => !v);
                }}
              >
                <FaFilter style={{ fontSize: 22, color: '#F08F36', textDecoration: 'underline' }} />
                <span style={{ fontSize: 22, color: '#F08F36', fontWeight: 700, textDecoration: 'underline' }}>Filter</span>
            </button>
        {showFilter && (
                <div className="scad-filter-dropdown" style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                background: '#fff',
                borderRadius: 16,
                  boxShadow: '0 2px 12px rgba(35,75,115,0.12)',
                  padding: 24,
                  minWidth: 320,
                  zIndex: 10,
                  marginTop: 6
                }}>
                  <div style={{ color: '#F08F36', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <FaFilter style={{ fontSize: 20, color: '#F08F36' }} />
                    <span>Filter by:</span>
              </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ color: '#234B73', fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Industry</label>
                  <select
                      value={pendingIndustry}
                      onChange={e => setPendingIndustry(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 15, background: '#fff', color: '#234B73' }}
                    >
                      {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ color: '#234B73', fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Duration</label>
                    <select
                      value={pendingDuration}
                      onChange={e => setPendingDuration(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 15, background: '#fff', color: '#234B73' }}
                    >
                      {durations.map(dur => <option key={dur} value={dur}>{dur}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ color: '#234B73', fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Paid/Unpaid</label>
                    <select
                      value={pendingPaid}
                      onChange={e => setPendingPaid(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 15, background: '#fff', color: '#234B73' }}
                    >
                      {paidOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button
                      onClick={() => {
                        setPendingIndustry('All');
                        setPendingDuration('All');
                        setPendingPaid('All');
                      }}
                      style={{ padding: '8px 22px', borderRadius: 6, background: '#8C8C8C', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}
                    >
                      Clear
                  </button>
                  <button
                      onClick={() => {
                        setIndustry(pendingIndustry);
                        setDuration(pendingDuration);
                        setPaid(pendingPaid);
                        setShowFilter(false);
                      }}
                      style={{ padding: '8px 22px', borderRadius: 6, background: '#F08F36', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}
                    >
                      Done
                  </button>
                </div>
              </div>
              )}
            </div>
          </div>

        {/* Internships List */}
          {filtered.length === 0 ? (
            <div style={{ color: '#8C8C8C', textAlign: 'center', padding: 32 }}>No internships found.</div>
          ) : (
            filtered.map(internship => (
              <div key={internship.id} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 20, color: '#234B73' }}>{internship.jobTitle}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15 }}>{internship.company}</div>
                  </div>
                  <button
                    onClick={() => setExpandedInternship(expandedInternship === internship.id ? null : internship.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        transform: expandedInternship === internship.id ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <path d="M7 10L12 15L17 10" stroke="#234B73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                </div>
                <div style={{ color: '#8C8C8C', fontSize: 15 }}>{internship.industry} | {internship.duration} | {internship.paid ? 'Paid' : 'Unpaid'}</div>
                
                {expandedInternship === internship.id && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #C0CEDB' }}>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 600, color: '#234B73', marginBottom: 4 }}>Job Description</div>
                      <div style={{ color: '#5A6A7A', fontSize: 15 }}>{internship.jobDescription}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#234B73', marginBottom: 4 }}>Required Skills</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {internship.skills.map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              background: '#F0F4F8',
                              color: '#234B73',
                              padding: '4px 12px',
                              borderRadius: 16,
                              fontSize: 14,
                              fontWeight: 500
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {internship.paid && (
                      <div style={{ marginTop: 12, color: '#5A6A7A', fontSize: 15 }}>
                        Expected Salary: ${internship.expectedSalary}
                    </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyInternships;