import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from './CompanyNavbar';
import { FaTrash, FaEdit, FaLock, FaUnlock, FaFilter, FaPlus } from 'react-icons/fa';
import jsPDF from 'jspdf';

const CompanyMyInternships = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterPaid, setFilterPaid] = useState('all');
  const [internships, setInternships] = useState([
    {
      id: 1,
      title: 'Software Engineering Intern',
      department: 'Engineering',
      duration: '3 months',
      status: 'Active',
      applicants: 15,
      description: 'Join our engineering team to work on cutting-edge projects.',
      requirements: ['JavaScript', 'React', 'Node.js'],
      responsibilities: [
        'Develop and maintain web applications',
        'Collaborate with the development team',
        'Participate in code reviews'
      ],
      paid: true,
      expectedSalary: 1200,
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript']
    },
    {
      id: 2,
      title: 'Data Science Intern',
      department: 'Data',
      duration: '6 months',
      status: 'Active',
      applicants: 8,
      description: 'Work with our data team to analyze and visualize complex datasets.',
      requirements: ['Python', 'SQL', 'Machine Learning'],
      responsibilities: [
        'Analyze large datasets',
        'Create data visualizations',
        'Implement machine learning models'
      ],
      paid: false,
      expectedSalary: 0,
      skills: ['Python', 'SQL', 'Machine Learning', 'Data Analysis']
    },
    {
      id: 3,
      title: 'Marketing Intern',
      department: 'Marketing',
      duration: '2 months',
      status: 'Closed',
      applicants: 5,
      description: 'Assist the marketing team in campaign planning and execution.',
      requirements: ['Creativity', 'Social Media'],
      responsibilities: [
        'Support campaign planning',
        'Manage social media accounts'
      ],
      paid: true,
      expectedSalary: 900,
      skills: ['Creativity', 'Social Media', 'Content Creation']
    },
    {
      id: 4,
      title: 'HR Intern',
      department: 'Human Resources',
      duration: '4 months',
      status: 'Active',
      applicants: 3,
      description: 'Support HR operations and recruitment.',
      requirements: ['Communication', 'Organization'],
      responsibilities: [
        'Assist in recruitment',
        'Organize employee files'
      ],
      paid: false,
      expectedSalary: 0,
      skills: ['Communication', 'Organization', 'MS Office']
    },
    {
      id: 5,
      title: 'Finance Intern',
      department: 'Finance',
      duration: '3 months',
      status: 'Active',
      applicants: 7,
      description: 'Work with the finance team on budgeting and reporting.',
      requirements: ['Excel', 'Accounting'],
      responsibilities: [
        'Assist with budgeting',
        'Prepare financial reports'
      ],
      paid: true,
      expectedSalary: 1100,
      skills: ['Excel', 'Accounting', 'Attention to Detail']
    },
    {
      id: 6,
      title: 'Graphic Design Intern',
      department: 'Design',
      duration: '2 months',
      status: 'Closed',
      applicants: 2,
      description: 'Create visual content for digital campaigns.',
      requirements: ['Photoshop', 'Illustrator'],
      responsibilities: [
        'Design graphics',
        'Collaborate with marketing'
      ],
      paid: true,
      expectedSalary: 1000,
      skills: ['Photoshop', 'Illustrator', 'Creativity']
    },
    {
      id: 7,
      title: 'Operations Intern',
      department: 'Operations',
      duration: '5 months',
      status: 'Active',
      applicants: 4,
      description: 'Support daily operations and logistics.',
      requirements: ['Logistics', 'Problem Solving'],
      responsibilities: [
        'Coordinate logistics',
        'Support operations team'
      ],
      paid: false,
      expectedSalary: 0,
      skills: ['Logistics', 'Problem Solving', 'Teamwork']
    }
  ]);

  const [newInternship, setNewInternship] = useState({
    title: '',
    department: '',
    duration: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    paid: false,
    expectedSalary: 0,
    skills: ['']
  });

  const [editInternshipId, setEditInternshipId] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedInternshipApplicants, setSelectedInternshipApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Filter internships based on search query and status
  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().startsWith(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || internship.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesDepartment = filterDepartment === 'all' || internship.department.toLowerCase() === filterDepartment.toLowerCase();
    const matchesPaid = filterPaid === 'all' || (filterPaid === 'paid' ? internship.paid : !internship.paid);
    return matchesSearch && matchesStatus && matchesDepartment && matchesPaid;
  });

  const handleCreate = () => {
    setIsCreating(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setInternships(prev => [...prev, {
      ...newInternship,
      id: Date.now(),
      status: 'Active',
      applicants: 0
    }]);
    await new Promise(res => setTimeout(res, 1000));
    setIsSaving(false);
    setIsCreating(false);
    setNewInternship({
      title: '',
      department: '',
      duration: '',
      description: '',
      requirements: [''],
      responsibilities: [''],
      paid: false,
      expectedSalary: 0,
      skills: ['']
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setNewInternship({
      title: '',
      department: '',
      duration: '',
      description: '',
      requirements: [''],
      responsibilities: [''],
      paid: false,
      expectedSalary: 0,
      skills: ['']
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewInternship(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setNewInternship(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleAddArrayItem = (field) => {
    setNewInternship(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveArrayItem = (field, index) => {
    setNewInternship(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleDeleteInternship = (id) => {
    setInternships(prev => prev.filter(internship => internship.id !== id));
  };

  const handleUpdateInternship = (id, updatedData) => {
    setInternships(prev => prev.map(internship => 
      internship.id === id ? { ...internship, ...updatedData } : internship
    ));
  };

  const handleEditInternship = (internship) => {
    setIsEditing(true);
    setEditInternshipId(internship.id);
    setIsCreating(false);
    setNewInternship({ ...internship });
  };

  const handleUpdateSave = (e) => {
    e.preventDefault();
    setInternships(prev => prev.map(internship =>
      internship.id === editInternshipId ? { ...newInternship, id: editInternshipId } : internship
    ));
    setIsEditing(false);
    setEditInternshipId(null);
    setNewInternship({
      title: '',
      department: '',
      duration: '',
      description: '',
      requirements: [''],
      responsibilities: [''],
      paid: false,
      expectedSalary: 0,
      skills: ['']
    });
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditInternshipId(null);
    setNewInternship({
      title: '',
      department: '',
      duration: '',
      description: '',
      requirements: [''],
      responsibilities: [''],
      paid: false,
      expectedSalary: 0,
      skills: ['']
    });
  };

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

  const cardStyle = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
    padding: 24,
    marginBottom: 24
  };

  const titleStyle = {
    color: '#234B73',
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 24
  };

  const buttonStyle = {
    background: '#F08F36',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '12px 24px',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer',
    marginBottom: 24
  };

  const formGroupStyle = {
    marginBottom: 16
  };

  const labelStyle = {
    display: 'block',
    color: '#234B73',
    fontWeight: 600,
    marginBottom: 8,
    fontSize: 15
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1.5px solid #C0CEDB',
    fontSize: 15,
    color: '#234B73',
    background: '#fff'
  };

  const searchFilterStyle = {
    display: 'flex',
    gap: 16,
    marginBottom: 24
  };

  const addButtonStyle = {
    background: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '12px 28px',
    fontWeight: 700,
    fontSize: 17,
    cursor: 'pointer',
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 10
  };

  const filterButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#F08F36',
    fontWeight: 700,
    fontSize: 20,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginLeft: 8
  };

  const iconButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    fontSize: 18
  };

  // Dummy applicants data for demonstration
  const dummyApplicants = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@student.guc.edu.eg',
      phone: '01012345678',
      university: 'GUC',
      gpa: 3.7,
      major: 'Computer Science',
      cv: 'CV.pdf',
      appliedInternshipId: 1
    },
    {
      id: 2,
      name: 'Sara Mostafa',
      email: 'sara.mostafa@student.guc.edu.eg',
      phone: '01087654321',
      university: 'GUC',
      gpa: 3.9,
      major: 'Data Science',
      cv: 'CV.pdf',
      appliedInternshipId: 2
    },
    {
      id: 3,
      name: 'Omar Khaled',
      email: 'omar.khaled@student.guc.edu.eg',
      phone: '01123456789',
      university: 'GUC',
      gpa: 3.5,
      major: 'Marketing',
      cv: 'CV.pdf',
      appliedInternshipId: 1
    }
  ];

  // Add a function to generate and download a dummy CV PDF
  function downloadDummyCV(applicant) {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Curriculum Vitae', 20, 20);
    doc.setFontSize(14);
    doc.text(`Name: ${applicant.name}`, 20, 40);
    doc.text(`Email: ${applicant.email}`, 20, 50);
    doc.text(`Phone: ${applicant.phone}`, 20, 60);
    doc.text(`University: ${applicant.university}`, 20, 70);
    doc.text(`GPA: ${applicant.gpa}`, 20, 80);
    doc.text(`Major: ${applicant.major}`, 20, 90);
    doc.save(`${applicant.name.replace(/ /g, '_')}_CV.pdf`);
  }

  return (
    <>
      <CompanyNavbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{ ...containerStyle, paddingTop: 48, paddingBottom: 0 }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: 0.5, marginBottom: 10 }}>My Internships</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button style={addButtonStyle} onClick={() => { setIsCreating(true); setIsEditing(false); }}>
              <FaPlus /> Add Internship
            </button>
          </div>
        </div>
        <div style={containerStyle}>
          {/* Search/Filter Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, width: '100%' }}>
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...inputStyle, width: '100%', maxWidth: '100%', flex: 1 }}
            />
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
                  left: 0,
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
                    <label style={{ color: '#234B73', fontWeight: 600, marginBottom: 8, display: 'block' }}>Status</label>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, maxWidth: 220 }}>
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ color: '#234B73', fontWeight: 600, marginBottom: 8, display: 'block' }}>Department</label>
                    <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} style={{ ...inputStyle, maxWidth: 220 }}>
                      <option value="all">All Departments</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Data">Data</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="Design">Design</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ color: '#234B73', fontWeight: 600, marginBottom: 8, display: 'block' }}>Paid/Unpaid</label>
                    <select value={filterPaid} onChange={e => setFilterPaid(e.target.value)} style={{ ...inputStyle, maxWidth: 220 }}>
                      <option value="all">All</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'flex-end' }}>
                    
                    <button
                      style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                      onClick={() => { setFilterDepartment('all'); setFilterStatus('all'); setFilterPaid('all'); }}
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
          {/* List or Form */}
          {(!isCreating && !isEditing) ? (
            <>
              {filteredInternships.map(internship => (
                <div key={internship.id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ color: '#234B73', fontSize: 24, fontWeight: 700, margin: 0 }}>{internship.title}</h2>
                    <span style={{
                      color: internship.status === 'Active' ? '#065F46' : '#991B1B',
                      fontWeight: 600,
                      fontSize: 14,
                      background: internship.status === 'Active' ? '#D1FAE5' : '#FEE2E2',
                      padding: '4px 12px',
                      borderRadius: 12
                    }}>
                      {internship.status}
                    </span>
                  </div>
                  <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 8 }}>{internship.department}</div>
                  <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 16 }}>
                    Duration: {internship.duration} | {internship.paid ? `Paid (${internship.expectedSalary} EGP/month)` : 'Unpaid'}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <h3 style={{ color: '#234B73', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Description</h3>
                    <p style={{ color: '#5A6A7A', fontSize: 15 }}>{internship.description}</p>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <h3 style={{ color: '#234B73', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Skills Required</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {internship.skills.map((skill, index) => (
                        <span key={index} style={{
                          background: '#C0CEDB',
                          color: '#234B73',
                          padding: '4px 12px',
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 500
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <h3 style={{ color: '#234B73', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Responsibilities</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {internship.responsibilities.map((resp, index) => (
                        <li key={index} style={{
                          color: '#5A6A7A',
                          fontSize: 15,
                          marginBottom: 8,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}>
                          <span style={{ color: '#F08F36' }}>•</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#35708E', fontSize: 15, fontWeight: 500 }}>
                      {internship.applicants} applicants
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        style={{ ...iconButtonStyle, color: '#234B73' }}
                        title="Edit"
                        onClick={() => handleEditInternship(internship)}
                      >
                        <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                      </button>
                      <button
                        style={{ ...iconButtonStyle, color: '#991B1B' }}
                        title="Delete"
                        onClick={() => handleDeleteInternship(internship.id)}
                      >
                        <svg width="20" height="20" fill="none" stroke="#991B1B" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                      </button>
                      {internship.status === 'Active' ? (
                        <button
                          style={{ ...iconButtonStyle, color: '#F08F36' }}
                          title="Close Post"
                          onClick={() => handleUpdateInternship(internship.id, { status: 'Closed' })}
                        >
                          <FaLock />
                        </button>
                      ) : (
                        <button
                          style={{ ...iconButtonStyle, color: '#2ecc71' }}
                          title="Reopen Post"
                          onClick={() => handleUpdateInternship(internship.id, { status: 'Active' })}
                        >
                          <FaUnlock />
                        </button>
                      )}
                      <button
                        style={{ ...buttonStyle, margin: 0, background: '#35708E', padding: '8px 16px', fontSize: 15 }}
                        onClick={() => {
                          setSelectedInternshipApplicants(dummyApplicants.filter(a => a.appliedInternshipId === internship.id));
                          setShowApplicantsModal(true);
                        }}
                        title="View Applicants"
                      >
                        View Applicants
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.18)',
                zIndex: 3000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={isEditing ? handleEditCancel : handleCancel}
            >
              <div
                style={{
                  position: 'relative',
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 8px 32px rgba(35,75,115,0.18)',
                  width: 500,
                  maxWidth: '95vw',
                  maxHeight: '90vh',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  minHeight: 0
                }}
                onClick={e => e.stopPropagation()}
              >
                <h2 style={{ color: '#234B73', fontSize: 28, fontWeight: 800, margin: '32px 0 24px 32px', letterSpacing: 0.5 }}>
                  {isEditing ? 'Edit Internship' : 'Create New Internship'}
                </h2>
                <form
                  onSubmit={isEditing ? handleUpdateSave : handleSave}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                    height: '100%'
                  }}
                >
                  <div style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    padding: '0 32px 0 32px'
                  }}>
                    <div style={formGroupStyle}>
                      <label style={labelStyle}>Title</label>
                      <input
                        type="text"
                        name="title"
                        value={newInternship.title}
                        onChange={handleInputChange}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div style={formGroupStyle}>
                      <label style={labelStyle}>Department</label>
                      <input
                        type="text"
                        name="department"
                        value={newInternship.department}
                        onChange={handleInputChange}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div style={formGroupStyle}>
                      <label style={labelStyle}>Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={newInternship.duration}
                        onChange={handleInputChange}
                        style={inputStyle}
                        placeholder="e.g., 3 months"
                        required
                      />
                    </div>
                    <div style={formGroupStyle}>
                      <label style={labelStyle}>Description</label>
                      <textarea
                        name="description"
                        value={newInternship.description}
                        onChange={handleInputChange}
                        style={{ ...inputStyle, minHeight: 100 }}
                        required
                      />
                    </div>
                    <div style={formGroupStyle}>
                      <label style={labelStyle}>Skills Required</label>
                      <TagInput
                        tags={newInternship.skills.filter(Boolean)}
                        setTags={tags => setNewInternship(prev => ({ ...prev, skills: tags }))}
                        placeholder="Type a skill and press Enter"
                      />
                    </div>
                    <div style={formGroupStyle}>
                      <label style={labelStyle}>Responsibilities</label>
                      <TagInput
                        tags={newInternship.responsibilities.filter(Boolean)}
                        setTags={tags => setNewInternship(prev => ({ ...prev, responsibilities: tags }))}
                        placeholder="Type a responsibility and press Enter"
                      />
                    </div>
                    <div style={formGroupStyle}>
                      <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="checkbox"
                          name="paid"
                          checked={newInternship.paid}
                          onChange={handleInputChange}
                        />
                        Paid Internship
                      </label>
                    </div>
                    {newInternship.paid && (
                      <div style={formGroupStyle}>
                        <label style={labelStyle}>Expected Salary (EGP/month)</label>
                        <input
                          type="number"
                          name="expectedSalary"
                          value={newInternship.expectedSalary}
                          onChange={handleInputChange}
                          style={inputStyle}
                          min="0"
                          required
                        />
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: 16,
                      background: '#fff',
                      padding: '18px 32px 18px 32px',
                      borderTop: '1px solid #eee',
                      zIndex: 10
                    }}
                  >
                    <button
                      type="submit"
                      style={{
                        ...buttonStyle,
                        background: isSaving ? '#2ecc71' : '#F08F36',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        minWidth: 160
                      }}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M5 10l4 4 6-8" /></svg>
                          Success
                        </span>
                      ) : (
                        isEditing ? 'Update Internship' : 'Create Internship'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={isEditing ? handleEditCancel : handleCancel}
                      style={{
                        ...buttonStyle,
                        background: '#8C8C8C',
                        minWidth: 120
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        {showApplicantsModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowApplicantsModal(false)}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', width: 480, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: 32, position: 'relative' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ color: '#234B73', fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Applicants</h2>
              {selectedInternshipApplicants.length === 0 ? (
                <div style={{ color: '#8C8C8C', textAlign: 'center', padding: 32 }}>No applicants for this post.</div>
              ) : (
                selectedInternshipApplicants.map(applicant => (
                  <div key={applicant.id} style={{ background: '#F9FAFB', borderRadius: 10, padding: 16, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#234B73', fontSize: 17 }}>{applicant.name}</div>
                      <div style={{ color: '#5A6A7A', fontSize: 15 }}>{applicant.email}</div>
                    </div>
                    <button
                      style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                      onClick={() => { setSelectedApplicant(applicant); setShowProfileModal(true); }}
                    >
                      View Profile
                    </button>
                  </div>
                ))
              )}
              <button
                style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 26, color: '#F08F36', cursor: 'pointer', fontWeight: 900, borderRadius: 6 }}
                onClick={() => setShowApplicantsModal(false)}
                aria-label="Close applicants modal"
              >
                ×
              </button>
            </div>
          </div>
        )}
        {showProfileModal && selectedApplicant && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowProfileModal(false)}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', width: 420, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: 32, position: 'relative' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ color: '#234B73', fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Applicant Profile</h2>
              <div style={{ marginBottom: 12 }}><b>Name:</b> {selectedApplicant.name}</div>
              <div style={{ marginBottom: 12 }}><b>Email:</b> {selectedApplicant.email}</div>
              <div style={{ marginBottom: 12 }}><b>Phone:</b> {selectedApplicant.phone}</div>
              <div style={{ marginBottom: 12 }}><b>University:</b> {selectedApplicant.university}</div>
              <div style={{ marginBottom: 12 }}><b>GPA:</b> {selectedApplicant.gpa}</div>
              <div style={{ marginBottom: 12 }}><b>Major:</b> {selectedApplicant.major}</div>
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                <b>CV:</b>
                <button
                  onClick={e => { e.preventDefault(); downloadDummyCV(selectedApplicant); }}
                  style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #234B7322', display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><path d="M12 5v12M5 12l7 7 7-7" /><rect x="5" y="19" width="14" height="2" rx="1" /></svg>
                  Download CV
                </button>
              </div>
              <button
                style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 26, color: '#F08F36', cursor: 'pointer', fontWeight: 900, borderRadius: 6 }}
                onClick={() => setShowProfileModal(false)}
                aria-label="Close profile modal"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

function TagInput({ tags, setTags, placeholder }) {
  const [input, setInput] = useState('');
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
      }
      setInput('');
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };
  const removeTag = idx => setTags(tags.filter((_, i) => i !== idx));
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, border: '1.5px solid #C0CEDB', borderRadius: 8, padding: 6, background: '#fff' }}>
      {tags.map((tag, idx) => (
        <span key={idx} style={{ background: '#C0CEDB', color: '#234B73', padding: '4px 12px', borderRadius: 12, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
          {tag}
          <span style={{ cursor: 'pointer', marginLeft: 4 }} onClick={() => removeTag(idx)}>&times;</span>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{ border: 'none', outline: 'none', fontSize: 15, flex: 1, minWidth: 120, background: 'transparent', color: '#234B73' }}
      />
    </div>
  );
}

export default CompanyMyInternships; 