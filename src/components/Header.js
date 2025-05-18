import React from 'react';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, userType } = useAuth();
  // Use 'N' for Nour Company, otherwise first initial
  const initial = userType === 'company' ? 'N' : (user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U');
  const profileLink = userType === 'company' ? '/company-profile' : '/profile';

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#234B73] text-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Remove the GUC Internship System title and any large header text */}
        {/* Only keep profile/avatar logic if needed */}
        <div className="flex items-center space-x-4">
          {/* Notification bell (optional, keep or remove as needed) */}
          {/* <button className="p-2 rounded-full hover:bg-[#1a3a5a] focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button> */}
          <Link to={profileLink} className="flex items-center group">
            <div className="w-10 h-10 rounded-full bg-[#C0CEDB] flex items-center justify-center text-[#234B73] font-bold text-lg cursor-pointer border-2 border-white shadow group-hover:ring-2 group-hover:ring-[#F08F36]">
              {initial}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 