import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StudentDashboard from './components/StudentDashboard';
import StudentProfile from './components/StudentProfile';
import Login from './components/Login';
import CompanyRegistration from './components/CompanyRegistration';
import MyInternships from './components/MyInternships';
import BrowseInternships from './components/BrowseInternships';
import ProFeature from './components/ProFeature';
import SCADAppointment from './components/SCADAppointment';
import OnlineAssessments from './components/OnlineAssessments';
import CareerWorkshop from './components/CareerWorkshop';
import WorkshopCertificates from './components/WorkshopCertificates';
import InternshipGuideline from './components/InternshipGuideline';
import SCADDashboard from './components/SCADDashboard';
import SCADCompanyApplications from './components/SCADCompanyApplications';
import SCADInternships from './components/ScadInternships';
import SCADInternshipCycle from './components/SCADInternshipCycle';
import SCADManageStudents from './components/SCADManageStudents';
import SCADStudentProfile from './components/SCADStudentProfile';
import SCADInternshipReports from './components/SCADManageReports';
import SCADAppointments from './components/SCADAppointments';
import SCADWorkshops from './components/SCADWorkshops';
import FacultyDashboard from './components/FacultyDashboard';
import FacultyProfile from './components/FacultyProfile';
import FacultyManageReports from './components/FacultyManageReports';
import CompanyDashboard from './components/CompanyDashboard';
import CompanyProfile from './components/CompanyProfile';
import CompanyMyInternships from './components/CompanyMyInternships';
import CompanyApplications from './components/CompanyApplications';
import CompanyCurrentInterns from './components/CompanyCurrentInterns';
import NotificationSystem from './components/NotificationSystem';
import CompanyTimedNotification from './components/CompanyTimedNotification';
import CompanyInternships from './components/CompanyInternships';
import './App.css';

// Create Auth context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

function App() {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('student'); // 'student', 'admin', 'academic'
  const [user, setUser] = useState(null);
  // Shared posts state
  const [posts, setPosts] = useState([]);
  // Shared applications state
  const [applications, setApplications] = useState([]);
  // Shared assessment scores state
  const [assessmentScores, setAssessmentScores] = useState({});
  // Workshop certificates state
  const [registrations, setRegistrations] = useState([]);
  const [attendedWorkshops, setAttendedWorkshops] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  // Login function
  const handleLogin = (email, password) => {
    // Only allow two specific student emails with their own passwords
    const allowedUsers = {
      'youssef.khaled@student.guc.edu.eg': { password: 'youssef123', isProStudent: true, fullName: 'Youssef Khaled', type: 'student' },
      'salma.ahmed@student.guc.edu.eg': { password: 'salma123', isProStudent: false, fullName: 'Salma Ahmed', type: 'student' },
      'nourhan.ehab@guc.edu.eg': { password: 'nourhan123', fullName: 'Nourhan Ehab', type: 'scad' },
      'syn@guc.edu.eg': { password: 'syn123', fullName: 'Dr. Syn', type: 'faculty' },
      'hr@company.com': { password: 'company123', fullName: 'HR Manager', type: 'company' },
      'syn@gmail.com': { password: 'syn123', fullName: 'Syn', type: 'company' },
    };
    const userInfo = allowedUsers[email.toLowerCase()];
    if (email && password && userInfo && password === userInfo.password) {
      setIsAuthenticated(true);
      setUserType(userInfo.type);
      setUser({
        email,
        type: userInfo.type,
        fullName: userInfo.fullName,
        isProStudent: userInfo.isProStudent || false
      });
      return true;
    }
    // Allow any email/password for company login if not in allowedUsers
    if (email && password && email.toLowerCase().endsWith('@company.com')) {
      setIsAuthenticated(true);
      setUserType('company');
      setUser({
        email,
        type: 'company',
        fullName: email.split('@')[0] || 'Company User',
        isProStudent: false
      });
      return true;
    }
    return false;
  };

  // Logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType('');
    setUser(null);
    setApplications([]); // Clear applications on logout
    setAssessmentScores({}); // Clear assessment scores on logout
    setRegistrations([]);
    setAttendedWorkshops([]);
    setCertificates([]);
  };

  // Auth context value
  const authContextValue = {
    isAuthenticated,
    userType,
    user,
    login: handleLogin,
    logout: handleLogout,
    applications,
    setApplications,
    assessmentScores,
    setAssessmentScores,
    posts,
    setPosts
  };

  useEffect(() => {
    if (!isAuthenticated || userType !== 'student') return;

    // Show the first notification immediately, then every 45 seconds
    const showFirst = () => setShowNotification({
      message: "Your internship report has been accepted!",
      icon: "🎉",
      type: "success1"
    });
    showFirst();
    const interval1 = setInterval(showFirst, 45000);

    // Show the second notification after 15 seconds, then every 45 seconds
    let interval2;
    const timeout2 = setTimeout(() => {
      const showSecond = () => setShowNotification({
        message: "A new internship cycle is about to begin!",
        icon: "🔔",
        type: "warning"
      });
      showSecond();
      interval2 = setInterval(showSecond, 45000);
    }, 15000);

    // Show the third notification after 30 seconds, then every 45 seconds
    let interval3;
    const timeout3 = setTimeout(() => {
      const showThird = () => setShowNotification({
        message: "The internship cycle has begun!",
        icon: "✅",
        type: "success"
      });
      showThird();
      interval3 = setInterval(showThird, 45000);
    }, 30000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [isAuthenticated, userType]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to={userType === 'scad' ? "/scad-dashboard" : userType === 'faculty' ? "/faculty-dashboard" : userType === 'company' ? "/company-dashboard" : "/dashboard"} replace /> : <Login onLogin={handleLogin} />} 
          />
          
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <CompanyRegistration />} 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {userType === 'student' ? (
                  <StudentDashboard user={user} userType={userType} onLogout={handleLogout} activePage="dashboard" posts={posts} setPosts={setPosts} />
                ) : (
                  <Dashboard userType={userType} onLogout={handleLogout} activePage="dashboard" />
                )}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my-internships" 
            element={
              <ProtectedRoute>
                <MyInternships />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/applications" 
            element={
              <ProtectedRoute>
                <Dashboard userType={userType} onLogout={handleLogout} activePage="applications" />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Dashboard userType={userType} onLogout={handleLogout} activePage="reports" />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/opportunities" 
            element={
              <ProtectedRoute>
                <Dashboard userType={userType} onLogout={handleLogout} activePage="opportunities" />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <StudentProfile posts={posts} setPosts={setPosts} user={user} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Dashboard userType={userType} onLogout={handleLogout} activePage="settings" />
              </ProtectedRoute>
            } 
          />
          
          <Route
            path="/browse-internships"
            element={
              <ProtectedRoute>
                <BrowseInternships />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/scad-appointment" 
            element={
              <ProtectedRoute>
                <SCADAppointment />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/online-assessments" 
            element={
              <ProtectedRoute>
                <OnlineAssessments />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/career-workshop" 
            element={
              <ProtectedRoute>
                <CareerWorkshop 
                  registrations={registrations}
                  setRegistrations={setRegistrations}
                  attendedWorkshops={attendedWorkshops}
                  setAttendedWorkshops={setAttendedWorkshops}
                  certificates={certificates}
                  setCertificates={setCertificates}
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/workshop-certificates" 
            element={
              <ProtectedRoute>
                <WorkshopCertificates 
                  registrations={registrations}
                  attendedWorkshops={attendedWorkshops}
                  certificates={certificates}
                  user={user}
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/internship-guideline" 
            element={
              <ProtectedRoute>
                <InternshipGuideline user={user} />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/pro-feature" element={<ProFeature />} />
          
          <Route 
            path="/scad-dashboard" 
            element={
              <ProtectedRoute>
                {userType === 'scad' ? <SCADDashboard user={user} /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/scad-company-applications" 
            element={
              <ProtectedRoute>
                {userType === 'scad' ? <SCADCompanyApplications /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/scad-internships" 
            element={
              <ProtectedRoute>
                {userType === 'scad' || userType === 'company' ? <SCADInternships /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/scad-internship-cycle" 
            element={
              <ProtectedRoute>
                {userType === 'scad' ? <SCADInternshipCycle /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/scad-students" 
            element={
              <ProtectedRoute>
                {userType === 'scad' ? <SCADManageStudents /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/scad-students/:id" 
            element={
              <ProtectedRoute>
                {userType === 'scad' ? <SCADStudentProfile /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/scad-internship-reports" 
            element={
              <ProtectedRoute>
                {userType === 'scad' ? <SCADInternshipReports /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/scad-appointments" 
            element={
              <ProtectedRoute>
                {userType === 'scad' ? <SCADAppointments /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/scad-workshops" 
            element={
              <ProtectedRoute>
                {userType === 'scad' ? <SCADWorkshops /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/faculty-dashboard" 
            element={
              <ProtectedRoute>
                {userType === 'faculty' ? <FacultyDashboard /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />
          

          <Route 
            path="/faculty-profile" 
            element={
              <ProtectedRoute>
                {userType === 'faculty' ? <FacultyProfile /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/faculty-reports" 
            element={
              <ProtectedRoute>
                {userType === 'faculty' ? <FacultyManageReports /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />

          
          <Route 
            path="/company-dashboard" 
            element={
              <ProtectedRoute>
                {userType === 'company' ? <CompanyDashboard /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/company-profile" 
            element={
              <ProtectedRoute>
                <CompanyProfile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/company-my-internships" 
            element={
              <ProtectedRoute>
                <CompanyMyInternships />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/company-applications" 
            element={
              <ProtectedRoute>
                <CompanyApplications />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/company-current-interns" 
            element={
              <ProtectedRoute>
                <CompanyCurrentInterns />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/company-internships" 
            element={
              <ProtectedRoute>
                <CompanyInternships />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
              <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
              <p className="mt-4 text-gray-600">The page you're looking for doesn't exist.</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="mt-6 px-4 py-2 bg-[#234B73] text-white rounded hover:bg-[#1a3a5a]"
              >
                Go Home
              </button>
            </div>
          } />
        </Routes>
      </Router>
      <NotificationSystem />
      {isAuthenticated && userType === 'student' && showNotification && (
        <CompanyTimedNotification
          message={showNotification.message}
          icon={showNotification.icon}
          type={showNotification.type}
          duration={5000}
          onClose={() => setShowNotification(false)}
        />
      )}
    </AuthContext.Provider>
  );
}

export default App;