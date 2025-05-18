import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import FacultyLayout from './FacultyLayout';
import { FiUser } from 'react-icons/fi';
import { MdOutlineLogout } from 'react-icons/md';

// Styles
const headerGradient = {
  background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
  color: '#fff',
  padding: '48px 0 60px 0',
  textAlign: 'center',
  boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
};

const profileCard = {
  background: '#fff',
  borderRadius: '18px',
  boxShadow: '0 8px 32px rgba(35,75,115,0.10)',
  padding: '36px 40px',
  maxWidth: 540,
  margin: '-80px auto 32px auto',
  display: 'flex',
  alignItems: 'center',
  gap: 32,
  borderTop: '6px solid #F08F36',
};

const avatarStyle = {
  width: 110,
  height: 110,
  borderRadius: '50%',
  background: '#C0CEDB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 54,
  color: '#234B73',
  fontWeight: 700,
  border: '3px solid #fff',
  boxShadow: '0 2px 8px #C0CEDB',
};

const infoBlock = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const nameStyle = {
  color: '#234B73',
  fontWeight: 700,
  fontSize: 28,
  letterSpacing: 1,
  marginBottom: 2,
};

const emailStyle = {
  color: '#8C8C8C',
  fontSize: 16,
  marginBottom: 8,
};

const labelStyle = {
  color: '#234B73',
  fontWeight: 700,
  fontSize: 16,
  marginBottom: 4,
};

const valueStyle = {
  color: '#5A6A7A',
  fontSize: 16,
  fontWeight: 500,
};

const editBtn = {
  background: '#F08F36',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '12px 28px',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
  opacity: 1,
  boxShadow: 'none',
  marginLeft: 24,
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

const sectionTitleStyle = {
  color: '#234B73',
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 16
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

const profileHeaderStyle = {
  background: '#234B73',
  color: '#fff',
  padding: '40px 0',
  marginBottom: 24,
};

const gridLayoutStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '24px',
  marginTop: '24px'
};

const infoItemStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px',
  padding: '8px 0'
};

const infoLabelStyle = {
  color: '#234B73',
  fontWeight: 600,
  fontSize: 15,
  minWidth: '120px',
  marginBottom: 0
};

const formGroupStyle = {
  marginBottom: 24
};

const FacultyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [facultyInfo, setFacultyInfo] = useState({
    name: user?.fullName || 'Faculty Member',
    email: user?.email || 'faculty@guc.edu.eg',
    department: user?.department || 'Computer Science',
    role: 'Faculty Member',
    office: user?.office || 'Building 1, Room 101',
    phone: user?.phone || '+20 123 456 7890',
    bio: user?.bio || 'Faculty member at the German University in Cairo, specializing in computer science and software engineering.',
    specialties: ['Software Engineering', 'Artificial Intelligence', 'Database Systems', 'Web Development'],
    courses: ['CSEN 401', 'CSEN 402', 'CSEN 501', 'CSEN 502']
  });

  const [editedInfo, setEditedInfo] = useState(facultyInfo);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEdit = () => {
    setEditedInfo(facultyInfo);
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFacultyInfo(editedInfo);
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

  const handleCoursesChange = (e) => {
    const courses = e.target.value.split(',').map(c => c.trim());
    setEditedInfo(prev => ({
      ...prev,
      courses
    }));
  };

  return (
    <FacultyLayout>
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={profileHeaderStyle}>
          <div style={containerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 36 }}>
                {facultyInfo.name.charAt(0)}
              </div>
              <div>
                <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 700, margin: '0 0 8px 0' }}>{facultyInfo.name}</h1>
                <div style={{ color: '#C0CEDB', fontSize: 16 }}>{facultyInfo.department} • {facultyInfo.role}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={containerStyle}>
          {!isEditing ? (
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <h2 style={{ color: '#234B73', fontSize: 24, fontWeight: 700, margin: 0 }}>{facultyInfo.name}</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  <div style={labelStyle}>Department</div>
                  <div style={valueStyle}>{facultyInfo.department}</div>
                </div>
                <div>
                  <div style={labelStyle}>Role</div>
                  <div style={valueStyle}>{facultyInfo.role}</div>
                </div>
                <div>
                  <div style={labelStyle}>Office</div>
                  <div style={valueStyle}>{facultyInfo.office}</div>
                </div>
                <div>
                  <div style={labelStyle}>Phone</div>
                  <div style={valueStyle}>{facultyInfo.phone}</div>
                </div>
                <div>
                  <div style={labelStyle}>Email</div>
                  <div style={valueStyle}>{facultyInfo.email}</div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: '#234B73', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>About</h3>
                <p style={{ color: '#5A6A7A', fontSize: 15, lineHeight: 1.5 }}>{facultyInfo.bio}</p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: '#234B73', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Specialties</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {facultyInfo.specialties.map((specialty, index) => (
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

              <div>
                <h3 style={{ color: '#234B73', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Courses</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {facultyInfo.courses.map((course, index) => (
                    <span key={index} style={{ 
                      background: '#E5E7EB',
                      color: '#234B73',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 500
                    }}>
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right', marginTop: 24 }}>
                <button style={editBtn} onClick={handleEdit}>
                  <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <div style={cardStyle}>
              <h2 style={{ color: '#234B73', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Edit Faculty Profile</h2>
              
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8, fontSize: 15 }}>Department</label>
                    <input type="text" name="department" value={editedInfo.department} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8, fontSize: 15 }}>Role</label>
                    <input type="text" name="role" value={editedInfo.role} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8, fontSize: 15 }}>Office</label>
                    <input type="text" name="office" value={editedInfo.office} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8, fontSize: 15 }}>Phone</label>
                    <input type="text" name="phone" value={editedInfo.phone} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8, fontSize: 15 }}>Email</label>
                    <input type="email" name="email" value={editedInfo.email} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8, fontSize: 15 }}>About</label>
                  <textarea name="bio" value={editedInfo.bio} onChange={handleInputChange} style={textareaStyle} required />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8, fontSize: 15 }}>Specialties (comma-separated)</label>
                  <input type="text" value={editedInfo.specialties.join(', ')} onChange={handleSpecialtiesChange} style={inputStyle} required />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8, fontSize: 15 }}>Courses (comma-separated)</label>
                  <input type="text" value={editedInfo.courses.join(', ')} onChange={handleCoursesChange} style={inputStyle} required />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button type="button" onClick={handleCancel} style={{ ...editBtn, background: '#C0CEDB', color: '#234B73' }}>Cancel</button>
                  <button type="submit" style={editBtn}>Save Changes</button>
                </div>
              </form>
            </div>
          )}
        </div>

        {saveSuccess && (
          <div style={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24, 
            background: '#065F46', 
            color: '#fff', 
            padding: '12px 24px', 
            borderRadius: 8, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Changes saved successfully
          </div>
        )}
      </div>
    </FacultyLayout>
  );
};

export default FacultyProfile;
