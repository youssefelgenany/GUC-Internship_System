import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CompanyNavbar from './CompanyNavbar';

const mapStatus = (status, endDate, isTerminated) => {
  const now = new Date();
  if (isTerminated) return 'rejected';
  if (endDate < now) return 'internship complete';
  if (!status) return 'current intern';
  const s = status.toLowerCase();
  if (s === 'pending' || s === 'shortlisted' || s === 'under review') return 'finalized';
  if (s === 'accepted' || s === 'current intern' || s === 'active') return 'current intern';
  if (s === 'rejected') return 'rejected';
  if (s === 'finalized') return 'finalized';
  return status;
};

const getInternshipTitle = (internshipId, internships) => {
  const found = internships.find((i) => String(i.id) === String(internshipId));
  return found ? found.title : 'N/A';
};

const getLocal = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    console.log(`Reading ${key} from localStorage:`, item);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const setLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`Saved ${key} to localStorage:`, value);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const AllCompletedInterns = () => {
  const [completedInterns, setCompletedInterns] = useState([]);
  const [internships, setInternships] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Hardcoded internship data
  const initialInternships = [
    { id: 1, title: 'Software Engineering Intern' },
    { id: 2, title: 'Marketing Intern' },
    { id: 3, title: 'Data Analyst Intern' },
    { id: 4, title: 'Cybersecurity Intern' },
  ];

  // Hardcoded intern data with varied performance
  const initialCompletedInterns = [
    {
      id: 101,
      name: 'Mina Gerges',
      email: 'mina.gerges@student.guc.edu.eg',
      phone: '+20 101 234 5678',
      studentId: 'STU011',
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      status: 'internship complete',
      gpa: '3.8',
      year: '4',
      major: 'Electrical Engineering',
      performance: 'Excellent',
      internshipId: '1',
      internshipTitle: 'Software Engineering Intern',
    },
    {
      id: 102,
      name: 'Nourhan Tarek',
      email: 'nourhan.tarek@student.guc.edu.eg',
      phone: '+20 102 345 6789',
      studentId: 'STU012',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      status: 'internship complete',
      gpa: '3.6',
      year: '3',
      major: 'Architecture',
      performance: 'Good',
      internshipId: '2',
      internshipTitle: 'Marketing Intern',
    },
    {
      id: 103,
      name: 'Karim Fathy',
      email: 'karim.fathy@student.guc.edu.eg',
      phone: '+20 103 456 7890',
      studentId: 'STU013',
      startDate: '2024-03-01',
      endDate: '2024-06-01',
      status: 'internship complete',
      gpa: '3.2',
      year: '2',
      major: 'Business Administration',
      performance: 'Average',
      internshipId: '3',
      internshipTitle: 'Data Analyst Intern',
    },
    {
      id: 104,
      name: 'Dina Magdy',
      email: 'dina.magdy@student.guc.edu.eg',
      phone: '+20 103 987 6543',
      studentId: 'STU014',
      startDate: '2024-02-15',
      endDate: '2024-05-15',
      status: 'internship complete',
      gpa: '3.9',
      year: '3',
      major: 'Cybersecurity',
      performance: 'Outstanding',
      internshipId: '4',
      internshipTitle: 'Cybersecurity Intern',
    },
  ];

  // Dummy student details for profiles
  const studentDetails = {
    STU011: {
      skills: 'Python, Java, C++, Git, Docker',
      bio: 'Aspiring software engineer passionate about building scalable backend systems.',
      previousInternships: ['Software Intern at Microsoft - 2023', 'Backend Developer at GUC Labs - 2022'],
      certificates: ['AWS Certified Developer', 'Java Professional Certificate'],
    },
    STU012: {
      skills: 'Marketing Strategy, SEO, Content Creation, Social Media',
      bio: 'Creative marketer with a knack for digital campaigns and brand storytelling.',
      previousInternships: ['Marketing Intern at Unilever - 2023', 'Social Media Assistant at Ogilvy - 2022'],
      certificates: ['Google Ads Certification', 'HubSpot Content Marketing'],
    },
    STU013: {
      skills: 'Data Analysis, Excel, Tableau, Business Strategy',
      bio: 'Business analyst focused on data-driven decision-making and process optimization.',
      previousInternships: ['Business Analyst Intern at PWC - 2023', 'Data Intern at EY - 2022'],
      certificates: ['Tableau Desktop Specialist', 'Lean Six Sigma Yellow Belt'],
    },
    STU014: {
      skills: 'Network Security, Penetration Testing, Linux, Wireshark',
      bio: 'Cybersecurity enthusiast dedicated to protecting digital infrastructure.',
      previousInternships: ['Security Intern at Cisco - 2023', 'IT Assistant at Vodafone - 2022'],
      certificates: ['Certified Ethical Hacker', 'CompTIA Security+'],
    },
  };

  // Performance styling
  const performanceStyles = {
    Outstanding: 'bg-purple-100 text-purple-800',
    Excellent: 'bg-green-100 text-green-800',
    Good: 'bg-blue-100 text-blue-800',
    Average: 'bg-yellow-100 text-yellow-800',
    Poor: 'bg-red-100 text-red-800',
  };

  useEffect(() => {
    // Initialize internships
    const storedInternships = getLocal('internships', initialInternships);
    setInternships(storedInternships);
    setLocal('internships', storedInternships);

    // Initialize completed interns
    const storedCompletedInterns = getLocal('completed_interns', initialCompletedInterns);
    console.log('Stored Completed Interns:', storedCompletedInterns);

    // Filter for completed interns
    const filteredCompletedInterns = storedCompletedInterns.filter((intern) => {
      const endDate = new Date(intern.endDate);
      const isTerminated = intern.status === 'terminated';
      const displayStatus = mapStatus(intern.status, endDate, isTerminated);
      return displayStatus === 'internship complete';
    });

    setCompletedInterns(filteredCompletedInterns);
    setLocal('completed_interns', filteredCompletedInterns);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CompanyNavbar />
      <div className="container mx-auto px-4 max-w-5xl bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6 pt-6">
          <h1 className="text-2xl font-bold text-[#234B73]">All Completed Interns</h1>
          <Link
            to="/company-internships"
            className="bg-[#234B73] text-white px-4 py-2 rounded-lg hover:bg-[#1a3a5a] transition-colors"
          >
            Go to Company Internships
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate" style={{ borderSpacing: '0 8px' }}>
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left text-gray-600 font-semibold">Student Name</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Internship Title</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Phone Number</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Email Address</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Start Date</th>
                <th className="p-4 text-left text-gray-600 font-semibold">End Date</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Status</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Performance</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Actions</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Evaluation</th>
              </tr>
            </thead>
            <tbody>
              {completedInterns.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-600">
                    No completed interns found.
                  </td>
                </tr>
              ) : (
                completedInterns.map((intern) => {
                  const displayStatus = mapStatus(intern.status, new Date(intern.endDate), intern.status === 'terminated');
                  return (
                    <React.Fragment key={`${intern.id}-${intern.internshipId}`}>
                      <tr className="bg-white shadow-sm rounded-lg">
                        <td className="p-4 text-[#234B73] font-medium">{intern.name}</td>
                        <td className="p-4 text-gray-600">{intern.internshipTitle}</td>
                        <td className="p-4 text-gray-600">{intern.phone}</td>
                        <td className="p-4 text-gray-600">{intern.email}</td>
                        <td className="p-4 text-gray-600">{new Date(intern.startDate).toLocaleDateString()}</td>
                        <td className="p-4 text-gray-600">{new Date(intern.endDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              displayStatus === 'internship complete'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {displayStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              performanceStyles[intern.performance] || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {intern.performance}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setExpandedId(expandedId === intern.id ? null : intern.id)}
                            className="text-[#F08F36] font-medium flex items-center gap-1 hover:underline"
                          >
                            View Profile
                            <svg
                              width="16"
                              height="16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              className={`transform transition-transform ${
                                expandedId === intern.id ? 'rotate-180' : ''
                              }`}
                            >
                              <path d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </td>
                        <td className="p-4">
                          <Link
                            to={`/company-evaluation`}
                            className="text-[#F08F36] font-medium hover:underline"
                            onClick={() => console.log(`Navigating to evaluation: ${intern.studentId}`)}
                          >
                            Evaluate
                          </Link>
                        </td>
                      </tr>
                      {expandedId === intern.id && (
                        <tr>
                          <td colSpan={10} className="p-4">
                            {studentDetails[intern.studentId] ? (
                              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div>
                                    <div className="mb-4">
                                      <div className="text-gray-600 mb-1">Student ID:</div>
                                      <div className="text-[#234B73] font-medium">{intern.studentId}</div>
                                    </div>
                                    <div className="mb-4">
                                      <div className="text-gray-600 mb-1">Email:</div>
                                      <div className="text-[#234B73] font-medium">{intern.email}</div>
                                    </div>
                                    <div className="mb-4">
                                      <div className="text-gray-600 mb-1">Major:</div>
                                      <div className="text-[#234B73] font-medium">{intern.major}</div>
                                    </div>
                                    <div className="mb-4">
                                      <div className="text-gray-600 mb-1">Year:</div>
                                      <div className="text-[#234B73] font-medium">{intern.year}</div>
                                    </div>
                                    <div>
                                      <div className="text-gray-600 mb-1">GPA:</div>
                                      <div className="text-[#234B73] font-medium">{intern.gpa}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="mb-4">
                                      <div className="text-gray-600 mb-1">Skills:</div>
                                      <div className="text-[#234B73] font-medium">
                                        {studentDetails[intern.studentId].skills}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-gray-600 mb-1">Bio:</div>
                                      <div className="text-[#234B73] font-medium">
                                        {studentDetails[intern.studentId].bio}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="mb-4">
                                      <div className="text-gray-600 mb-1">Previous Internships:</div>
                                      <ul className="text-[#234B73] font-medium list-disc pl-5">
                                        {studentDetails[intern.studentId].previousInternships.map(
                                          (internship, idx) => (
                                            <li key={idx}>{internship}</li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                    <div>
                                      <div className="text-gray-600 mb-1">Certificates:</div>
                                      <ul className="text-[#234B73] font-medium list-disc pl-5">
                                        {studentDetails[intern.studentId].certificates.map((cert, idx) => (
                                          <li key={idx}>{cert}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 text-red-600">
                                Student details not found for {intern.studentId}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllCompletedInterns;
