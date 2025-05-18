import React from 'react';
import Navbar from './Navbar';

const InternshipGuideline = () => {
  return (
    <>
      <Navbar />
      <div style={{ padding: 32, maxWidth: 700, margin: '72px auto 0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(35,75,115,0.10)' }}>
        <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Internship Guideline</h1>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: 24, borderRadius: 12, overflow: 'hidden' }}>
          <iframe
            src="https://www.youtube.com/embed/OgNnIn_juPo?si=bp-KINeUt4Hok8zd"
            title="Internship Guideline Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>
        <div style={{ color: '#234B73', fontSize: 18, fontWeight: 500, marginBottom: 12 }}>
          What kinds of internships count towards your requirement?
        </div>
        <div style={{ color: '#5A6A7A', fontSize: 16, lineHeight: 1.7 }}>
          Internships in your field of study (e.g., software development, engineering, business, etc.) that are relevant to your major and provide practical experience typically count towards your requirement. Please consult your department for specific guidelines.
        </div>
      </div>
    </>
  );
};

export default InternshipGuideline; 