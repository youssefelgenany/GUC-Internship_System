import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const sidebarOptions = [
  { label: 'Profile', route: '/profile' },
  { label: 'All Offered Internships', route: '/scad-internships' },
  { label: 'Internships I Offered', route: '/my-internships' },
  { label: 'Rejected Internships', route: '/rejected-internships' },
];

const CompanySidebar = ({ onLogout, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-full w-64 bg-blue-800 flex flex-col py-6 px-3 shadow-lg">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Menu Search..."
          className="w-full px-3 py-2 rounded bg-blue-700 text-white placeholder-blue-200 focus:outline-none"
        />
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {sidebarOptions.map((option) => (
            <li key={option.label}>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  navigate(option.route);
                  if (onNavigate) onNavigate();
                }}
                className={`block px-6 py-3 text-lg rounded-l-full transition-colors duration-150 cursor-pointer
                  ${location.pathname === option.route ? 'bg-blue-900 text-white font-semibold' : 'text-white hover:bg-blue-700 hover:text-white'}`}
              >
                {option.label}
              </a>
            </li>
          ))}
          <li className="mt-8">
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                if (onLogout) onLogout();
                if (onNavigate) onNavigate();
              }}
              className="block px-6 py-3 text-lg rounded-l-full text-red-200 hover:bg-red-700 hover:text-white transition-colors duration-150 cursor-pointer"
            >
              Log Out
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CompanySidebar; 