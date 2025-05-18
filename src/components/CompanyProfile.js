import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from './CompanyNavbar';
import { useAuth } from '../App';
import { FaCheck } from 'react-icons/fa';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: user?.fullName || 'Tech Solutions Inc.',
    email: user?.email || 'hr@company.com',
    industry: 'Technology',
    size: '100-500',
    location: 'Cairo, Egypt',
    website: 'www.techsolutions.com',
    description: 'Tech Solutions Inc. is a leading technology company specializing in software development and digital transformation solutions. We work with clients across various industries to deliver innovative and scalable solutions.',
    founded: '2010',
    specialties: ['Software Development', 'Cloud Computing', 'AI/ML', 'Digital Transformation'],
    contactEmail: 'careers@techsolutions.com',
    contactPhone: '+20 123 456 7890'
  });

  const [editedInfo, setEditedInfo] = useState(companyInfo);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const titleStyle = {
    color: '#234B73',
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 24
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
    padding: 24,
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
    cursor: 'pointer'
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

  const textareaStyle = {
    ...inputStyle,
    minHeight: 120,
    resize: 'vertical'
  };

  const industryOptions = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Consulting', 'Media', 'Automotive', 'Energy', 'Logistics', 'Design', 'Marketing', 'Legal', 'Other'
  ];
  const sizeOptions = [
    { value: 'small', label: 'Small (50 employees or less)' },
    { value: 'medium', label: 'Medium (51–100 employees)' },
    { value: 'large', label: 'Large (101–500 employees)' },
    { value: 'corporate', label: 'Corporate (more than 500 employees)' }
  ];

  const handleEdit = () => {
    setEditedInfo(companyInfo);
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setCompanyInfo(editedInfo);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    setIsEditing(false);
    }, 1000);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtiesChange = (e) => {
    const specialties = e.target.value.split(',').map(s => s.trim());
    setEditedInfo(prev => ({
      ...prev,
      specialties
    }));
  };

  const profileHeaderStyle = {
    background: '#234B73',
    color: '#fff',
    padding: '40px 0',
    marginBottom: 24
  };

  const profileCardStyle = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
    padding: 24,
    marginBottom: 24
  };

  const sectionTitleStyle = {
    color: '#234B73',
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16
  };

  const editBtn = {
    background: '#F08F36',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 24px',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer',
    marginTop: 16
  };

  return (
    <>
      <CompanyNavbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={profileHeaderStyle}>
          <div style={containerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 36 }}>
                {companyInfo.name.charAt(0)}
              </div>
              <div>
                <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 700, margin: '0 0 8px 0' }}>{companyInfo.name}</h1>
                <div style={{ color: '#C0CEDB', fontSize: 16 }}>{companyInfo.industry} • {companyInfo.size} </div>
              </div>
            </div>
          </div>
        </div>

        <div style={containerStyle}>
          {!isEditing ? (
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <h2 style={{ color: '#234B73', fontSize: 24, fontWeight: 700, margin: 0 }}>{companyInfo.name}</h2>
        </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
                <div>
                  <div style={{ color: '#234B73', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Industry</div>
                  <div style={{ color: '#5A6A7A', fontSize: 15 }}>{companyInfo.industry}</div>
      </div>
                <div>
                  <div style={{ color: '#234B73', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Company Size</div>
                  <div style={{ color: '#5A6A7A', fontSize: 15 }}>{companyInfo.size} </div>
    </div>
                <div>
                  <div style={{ color: '#234B73', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Location</div>
                  <div style={{ color: '#5A6A7A', fontSize: 15 }}>{companyInfo.location}</div>
                </div>
                <div>
                  <div style={{ color: '#234B73', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Founded</div>
                  <div style={{ color: '#5A6A7A', fontSize: 15 }}>{companyInfo.founded}</div>
                  </div>
                <div>
                  <div style={{ color: '#234B73', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Website</div>
                  <div style={{ color: '#5A6A7A', fontSize: 15 }}>{companyInfo.website}</div>
                  </div>
                <div>
                  <div style={{ color: '#234B73', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Contact Email</div>
                  <div style={{ color: '#5A6A7A', fontSize: 15 }}>{companyInfo.contactEmail}</div>
                        </div>
                <div>
                  <div style={{ color: '#234B73', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Contact Phone</div>
                  <div style={{ color: '#5A6A7A', fontSize: 15 }}>{companyInfo.contactPhone}</div>
                    </div>
                  </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: '#234B73', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>About Us</h3>
                <p style={{ color: '#5A6A7A', fontSize: 15, lineHeight: 1.5 }}>{companyInfo.description}</p>
                        </div>

              <div>
                <h3 style={{ color: '#234B73', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Specialties</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {companyInfo.specialties.map((specialty, index) => (
                    <span key={index} style={{ 
                      background: '#C0CEDB',
                      color: '#234B73',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 500
                    }}>
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                <button style={editBtn} onClick={handleEdit}>
                  <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                  Edit Profile
                </button>
                <button
                  style={{ ...editBtn, background: '#234B73' }}
                  onClick={() => navigate('/company-internships')}
                >
                  View All Internships
                </button>
              </div>
            </div>
          ) : (
            <div style={cardStyle}>
              <h2 style={{ color: '#234B73', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Edit Company Profile</h2>
              
              <form onSubmit={handleSave}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Company Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editedInfo.name}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Industry</label>
                  <select
                    name="industry"
                    value={editedInfo.industry}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  >
                    {industryOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
        </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Company Size</label>
                  <select
                    name="size"
                    value={editedInfo.size}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  >
                    {sizeOptions.map(opt => (
                      <option key={opt.value} value={opt.label}>{opt.label}</option>
                    ))}
                  </select>
    </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editedInfo.location}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
          </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Website</label>
                  <input
                    type="text"
                    name="website"
                    value={editedInfo.website}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
          </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Founded</label>
                  <input
                    type="text"
                    name="founded"
                    value={editedInfo.founded}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
        </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={editedInfo.contactEmail}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
      </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={editedInfo.contactPhone}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
        </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>About Us</label>
                  <textarea
                    name="description"
                    value={editedInfo.description}
                    onChange={handleInputChange}
                    style={textareaStyle}
                    required
                  />
      </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Specialties</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    {editedInfo.specialties.map((tag, idx) => (
                      <span key={idx} style={{ background: '#C0CEDB', color: '#234B73', padding: '4px 12px', borderRadius: 12, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {tag}
                        <span
                          style={{ marginLeft: 6, cursor: 'pointer', color: '#991B1B', fontWeight: 700 }}
                          onClick={() => setEditedInfo(prev => ({ ...prev, specialties: prev.specialties.filter((_, i) => i !== idx) }))}
                        >
                          ×
                        </span>
                      </span>
                    ))}
        </div>
                  <input
                    type="text"
                    value={specialtyInput}
                    onChange={e => setSpecialtyInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && specialtyInput.trim()) {
                        e.preventDefault();
                        if (!editedInfo.specialties.includes(specialtyInput.trim())) {
                          setEditedInfo(prev => ({ ...prev, specialties: [...prev.specialties, specialtyInput.trim()] }));
                        }
                        setSpecialtyInput('');
                      }
                    }}
                    style={inputStyle}
                    placeholder="Type a specialty and press Enter"
                  />
    </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 24 }}>
                  <button type="submit" style={{
                    ...buttonStyle,
                    background: saveSuccess ? '#2ecc71' : '#F08F36',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    {saveSuccess ? <FaCheck /> : null}
                    {saveSuccess ? 'Saved!' : 'Save Changes'}
                </button>
                <button
                    type="button"
                  onClick={handleCancel}
                    style={{
                      ...buttonStyle,
                      background: '#8C8C8C'
                    }}
                    disabled={saveSuccess}
                >
                  Cancel
                </button>
          </div>
              </form>
        </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyProfile; 