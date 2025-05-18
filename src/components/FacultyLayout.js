import React from 'react';
import FacultyNavbar from './FacultyNavbar';

const FacultyLayout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      <FacultyNavbar />
      <div style={{ padding: '32px 48px', marginTop: 0 }}>
        {children}
      </div>
    </div>
  );
};

export default FacultyLayout; 