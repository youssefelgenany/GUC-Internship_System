import React, { useState } from 'react';
import CompanyNavbar from './CompanyNavbar';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash, FaPlus, FaChevronRight, FaChevronDown, FaStar } from 'react-icons/fa';

const initialInterns = [
  {
    id: 1,
    name: 'Ahmed Mohamed',
    email: 'ahmed.mohamed@student.guc.edu.eg',
    phone: '+20 100 123 4567',
    university: 'German University in Cairo',
    gpa: 3.82,
    supervisor: 'Dr. Youssef Khaled',
    address: 'Villa 12, Fifth Settlement, New Cairo, Egypt',
    jobTitle: 'Software Engineering Intern',
    status: 'current',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    skills: ['JavaScript', 'React', 'Node.js'],
    evaluation: null
  },
  {
    id: 2,
    name: 'Sarah Ahmed',
    email: 'sarah.ahmed@student.guc.edu.eg',
    phone: '+20 100 987 6543',
    university: 'Ain Shams University',
    gpa: 3.95,
    supervisor: 'Dr. Nourhan Ehab',
    address: 'Apt 7, 15 El-Mohandeseen St., Heliopolis, Cairo',
    jobTitle: 'Data Science Intern',
    status: 'complete',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    skills: ['Python', 'SQL', 'Machine Learning'],
    evaluation: {
      text: 'Excellent analytical skills and teamwork.',
      rating: 5
    }
  },
  {
    id: 3,
    name: 'Mona Samir',
    email: 'mona.samir@student.guc.edu.eg',
    phone: '+20 101 555 2222',
    university: 'Cairo University',
    gpa: 3.47,
    supervisor: 'Dr. Salma Ahmed',
    address: 'Building 3, Flat 10, Abbasia, Cairo',
    jobTitle: 'Marketing Intern',
    status: 'current',
    startDate: '2024-07-15',
    endDate: '2024-10-15',
    skills: ['Creativity', 'Social Media'],
    evaluation: null
  }
];

const CompanyCurrentInterns = () => {
  const [interns, setInterns] = useState(initialInterns);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const defaultEvalDraft = {
    professionalism: 3,
    technicalSkills: 3,
    communication: 3,
    teamwork: 3,
    initiative: 3,
    comments: ''
  };
  const [evalDraft, setEvalDraft] = useState({ ...defaultEvalDraft });
  const [editingEvalId, setEditingEvalId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Filter and search
  const filteredInterns = interns.filter(intern => {
    if (filter === 'current' && intern.status !== 'current') return false;
    if (filter === 'complete' && intern.status !== 'complete') return false;
    const s = search.trim().toLowerCase();
    if (s) {
      return intern.name.toLowerCase().includes(s) || intern.jobTitle.toLowerCase().includes(s);
    }
    return true;
  });

  // Set as internship complete
  const handleSetComplete = (id) => {
    setInterns(prev => prev.map(intern =>
      intern.id === id ? { ...intern, status: 'complete' } : intern
    ));
  };

  // CRUD for evaluation
  const handleOpenEval = (intern) => {
    setSelectedIntern(intern);
    setShowEvalModal(true);
    setEditingEvalId(intern.id);
    setEvalDraft(
      intern.evaluation
        ? { ...intern.evaluation }
        : { ...defaultEvalDraft }
    );
  };
  const handleSaveEval = () => {
    setInterns(prev => prev.map(intern =>
      intern.id === editingEvalId ? { ...intern, evaluation: { ...evalDraft } } : intern
    ));
    setShowEvalModal(false);
    setEditingEvalId(null);
    setEvalDraft({ ...defaultEvalDraft });
    setSelectedIntern(null);
  };
  const handleDeleteEval = (id) => {
    setInterns(prev => prev.map(intern =>
      intern.id === id ? { ...intern, evaluation: null } : intern
    ));
  };

  return (
    <>
      <CompanyNavbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px 0 16px' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Current Interns</h1>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by name or job title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 15, color: '#234B73', background: '#fff' }}
              />
              <FaSearch style={{ position: 'absolute', left: 12, top: 12, color: '#C0CEDB', fontSize: 18 }} />
            </div>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 15, color: '#234B73', background: '#fff', minWidth: 200 }}
            >
              <option value="all">All</option>
              <option value="current">Current Intern</option>
              <option value="complete">Internship Complete</option>
            </select>
          </div>
          {/* Interns List */}
          {filteredInterns.length === 0 ? (
            <div style={{ color: '#8C8C8C', textAlign: 'center', padding: 48 }}>No interns found.</div>
          ) : (
            filteredInterns.map(intern => (
              <div key={intern.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(35,75,115,0.08)', padding: 24, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#234B73', fontSize: 20, fontWeight: 700 }}>{intern.name}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15 }}>{intern.jobTitle}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15 }}>{intern.email}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15 }}>Duration: {intern.startDate} - {intern.endDate}</div>
                    <div style={{ color: intern.status === 'current' ? '#2563eb' : '#065F46', fontWeight: 600, marginTop: 8 }}>
                      {intern.status === 'current' ? <FaTimesCircle style={{ color: '#2563eb', marginRight: 6 }} /> : <FaCheckCircle style={{ color: '#2ecc71', marginRight: 6 }} />}
                      {intern.status === 'current' ? 'Current Intern' : 'Internship Complete'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 8 }}
                      onClick={() => setExpandedId(expandedId === intern.id ? null : intern.id)}
                      aria-label={expandedId === intern.id ? 'Hide Details' : 'Show Details'}
                    >
                      {expandedId === intern.id ? <FaChevronDown size={24} color="#234B73" /> : <FaChevronRight size={24} color="#234B73" />}
                    </button>
                    {intern.status === 'current' && (
                      <button
                        style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
                        onClick={() => handleSetComplete(intern.id)}
                      >
                        Set as Internship Complete
                      </button>
                    )}
                    {intern.status === 'complete' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                          onClick={() => handleOpenEval(intern)}
                        >
                          <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                          {intern.evaluation ? 'Edit Evaluation' : 'Add Evaluation'}
                        </button>
                        {intern.evaluation && (
                          <button
                            style={{ background: '#991B1B', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                            onClick={() => handleDeleteEval(intern.id)}
                          >
                            <svg width="20" height="20" fill="none" stroke="#991B1B" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Inline Details */}
                {expandedId === intern.id && (
                  <div style={{ marginTop: 18, background: '#F6F8FA', borderRadius: 8, padding: 16 }}>
                    <div style={{ color: '#234B73', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Intern Details</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>Skills: {intern.skills.join(', ')}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>Phone: {intern.phone}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>University: {intern.university}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>GPA: {intern.gpa}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>Supervisor: {intern.supervisor}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>Address: {intern.address}</div>
                    {/* Evaluation display */}
                    {intern.status === 'complete' && intern.evaluation && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ color: '#234B73', fontWeight: 600 }}>Evaluation:</div>
                        <div style={{ color: '#5A6A7A', marginTop: 4 }}>{intern.evaluation.text}</div>
                        <div style={{ color: '#F08F36', fontWeight: 600, marginTop: 4 }}>Rating: {intern.evaluation.rating} / 5</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {/* Intern Details Modal */}
        {selectedIntern && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 3000 }} onClick={() => setSelectedIntern(null)}>
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
                zIndex: 3001,
                minWidth: 340,
                maxWidth: '90vw',
                textAlign: 'center'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ color: '#234B73', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Intern Details</h2>
              <div style={{ color: '#234B73', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{selectedIntern.name}</div>
              <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>{selectedIntern.jobTitle}</div>
              <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>{selectedIntern.email}</div>
              <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>Duration: {selectedIntern.startDate} - {selectedIntern.endDate}</div>
              <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>Skills: {selectedIntern.skills.join(', ')}</div>
              <div style={{ marginTop: 24 }}>
                <button
                  onClick={() => setSelectedIntern(null)}
                  style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Evaluation Modal */}
        {showEvalModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 4000 }} onClick={() => { setShowEvalModal(false); setSelectedIntern(null); }}>
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
                textAlign: 'left',
                overflowY: 'auto',
                maxHeight: '90vh'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ color: '#234B73', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Evaluate Student</h2>
              <div style={{ color: '#234B73', fontWeight: 600, marginBottom: 10 }}>Rate the following on a scale of 1 to 5:</div>
              {[
                { key: 'professionalism', label: 'Professionalism' },
                { key: 'technicalSkills', label: 'Technical Skills' },
                { key: 'communication', label: 'Communication' },
                { key: 'teamwork', label: 'Teamwork' },
                { key: 'initiative', label: 'Initiative' }
              ].map((item, idx) => (
                <div key={item.key} style={{ marginBottom: 18 }}>
                  <div style={{ color: '#234B73', fontWeight: 600, marginBottom: 4 }}>{item.label}:</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {[1,2,3,4,5].map(num => (
                      <span key={num} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={() => setEvalDraft(d => ({ ...d, [item.key]: num }))}>
                        <span style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: evalDraft[item.key] === num ? '#F08F36' : '#fff',
                          border: '2px solid #C0CEDB',
                          color: evalDraft[item.key] === num ? '#fff' : '#234B73',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 18,
                          marginBottom: 2,
                          transition: 'background 0.2s, color 0.2s'
                        }}>{num}</span>
                        <span style={{ fontSize: 13, color: evalDraft[item.key] === num ? '#F08F36' : '#5A6A7A', fontWeight: evalDraft[item.key] === num ? 700 : 400, marginTop: 2 }}>
                          {num === 1 ? 'Poor' : num === 2 ? 'Fair' : num === 3 ? 'Good' : num === 4 ? 'Very Good' : 'Excellent'}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ marginBottom: 18 }}>
                <div style={{ color: '#234B73', fontWeight: 600, marginBottom: 4 }}>Additional Comments:</div>
                <textarea
                  value={evalDraft.comments}
                  onChange={e => setEvalDraft(d => ({ ...d, comments: e.target.value }))}
                  placeholder="Add any comments..."
                  style={{ width: '100%', minHeight: 70, borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 15, color: '#234B73', padding: 12 }}
                />
              </div>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSaveEval}
                  style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
                >
                  Save
                </button>
                <button
                  onClick={() => { setShowEvalModal(false); setSelectedIntern(null); }}
                  style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CompanyCurrentInterns; 