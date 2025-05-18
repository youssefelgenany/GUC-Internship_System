import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ userType = "student" }) => {
  // Dummy data for demonstration
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your internship application has been approved", isNew: true },
    { id: 2, message: "New internship opportunity at Google", isNew: true },
    { id: 3, message: "Deadline for submission is approaching", isNew: false }
  ]);

  const [applications, setApplications] = useState([
    { id: 1, company: "Microsoft", position: "Software Engineer", status: "Pending", date: "2025-04-25" },
    { id: 2, company: "Google", position: "UX Designer", status: "Approved", date: "2025-04-20" },
    { id: 3, company: "Amazon", position: "Product Manager", status: "Rejected", date: "2025-04-15" }
  ]);

  const [reports, setReports] = useState([
    { id: 1, title: "Week 1 Report", status: "Submitted", grade: "N/A", feedback: "Pending review" },
    { id: 2, title: "Week 2 Report", status: "Graded", grade: "A", feedback: "Excellent work!" }
  ]);

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isNew: false
    }));
    setNotifications(updatedNotifications);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#234B73] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">GUC Internship System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-[#1a3a5a] focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.some(n => n.isNew) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#F08F36]"></span>
                )}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#C0CEDB] flex items-center justify-center text-[#234B73] font-medium">
                {userType === "student" ? "S" : userType === "admin" ? "A" : "AC"}
              </div>
              <span>John Doe</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar / Navigation */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-[#234B73] mb-4">Navigation</h2>
              <nav className="space-y-2">
                <Link to="/dashboard" className="block px-4 py-2 rounded-md bg-[#234B73] text-white font-medium">Dashboard</Link>
                <Link to="/applications" className="block px-4 py-2 rounded-md text-[#234B73] hover:bg-[#C0CEDB] transition duration-150">Applications</Link>
                <Link to="/reports" className="block px-4 py-2 rounded-md text-[#234B73] hover:bg-[#C0CEDB] transition duration-150">Reports</Link>
                <Link to="/opportunities" className="block px-4 py-2 rounded-md text-[#234B73] hover:bg-[#C0CEDB] transition duration-150">Opportunities</Link>
                <Link to="/profile" className="block px-4 py-2 rounded-md text-[#234B73] hover:bg-[#C0CEDB] transition duration-150">Profile</Link>
                <Link to="/settings" className="block px-4 py-2 rounded-md text-[#234B73] hover:bg-[#C0CEDB] transition duration-150">Settings</Link>
              </nav>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white rounded-lg shadow-md p-4 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#234B73]">Notifications</h2>
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-[#F08F36] hover:underline">
                  Mark all as read
                </button>
              </div>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-[#8C8C8C] text-center py-2">No new notifications</p>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded ${notification.isNew ? 'bg-[#C0CEDB] bg-opacity-40' : 'bg-gray-50'}`}>
                      <p className="text-sm text-[#234B73]">{notification.message}</p>
                      {notification.isNew && (
                        <span className="inline-block w-2 h-2 bg-[#F08F36] rounded-full ml-2"></span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#234B73] to-[#1a3a5a] text-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
              <p className="mb-4">Here's a summary of your current internship status.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-sm opacity-80">Applications</p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-sm opacity-80">Reports</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-sm opacity-80">Days Remaining</p>
                  <p className="text-2xl font-bold">14</p>
                </div>
              </div>
            </div>

            {/* Applications Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#234B73]">Recent Applications</h2>
                <Link to="/applications" className="text-[#F08F36] hover:underline text-sm">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#C0CEDB] bg-opacity-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-[#234B73]">Company</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-[#234B73]">Position</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-[#234B73]">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-[#234B73]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C0CEDB]">
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td className="px-4 py-3 text-sm text-[#234B73]">{app.company}</td>
                        <td className="px-4 py-3 text-sm text-[#8C8C8C]">{app.position}</td>
                        <td className="px-4 py-3 text-sm text-[#8C8C8C]">{app.date}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium
                            ${app.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                            app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Report Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#234B73]">Recent Reports</h2>
                <Link to="/reports" className="text-[#F08F36] hover:underline text-sm">View all</Link>
              </div>
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="border border-[#C0CEDB] rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-[#234B73]">{report.title}</h3>
                      <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium
                        ${report.status === 'Graded' ? 'bg-green-100 text-green-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-[#8C8C8C]">Grade</p>
                        <p className="font-medium text-[#234B73]">{report.grade}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#8C8C8C]">Feedback</p>
                        <p className="font-medium text-[#234B73]">{report.feedback}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#F08F36]">
                <h3 className="font-semibold text-[#234B73] mb-2">Apply for Internship</h3>
                <p className="text-sm text-[#8C8C8C] mb-4">Browse through available internship opportunities.</p>
                <Link to="/opportunities" className="text-[#F08F36] hover:underline text-sm font-medium">
                  Browse Opportunities →
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#234B73]">
                <h3 className="font-semibold text-[#234B73] mb-2">Submit Weekly Report</h3>
                <p className="text-sm text-[#8C8C8C] mb-4">Submit your weekly progress report for evaluation.</p>
                <Link to="/reports/submit" className="text-[#F08F36] hover:underline text-sm font-medium">
                  Submit Report →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#234B73] text-white mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-bold">GUC Internship System</h2>
              <p className="text-sm opacity-80">German University in Cairo © 2025</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#F08F36]">Help</a>
              <a href="#" className="text-white hover:text-[#F08F36]">Privacy Policy</a>
              <a href="#" className="text-white hover:text-[#F08F36]">Terms of Service</a>
              <a href="#" className="text-white hover:text-[#F08F36]">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;