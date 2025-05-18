import React, { useState, useRef } from 'react';
import SCADNavbar from './SCADNavbar';
import { useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const sidebarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: 300,
  background: '#234B73',
  color: '#fff',
  boxShadow: '2px 0 16px rgba(0,0,0,0.10)',
  zIndex: 3000,
  padding: '32px 18px 18px 18px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s',
};
const sidebarOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.18)',
  zIndex: 2999,
};
const sidebarMenuItem = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 0',
  fontSize: 17,
  fontWeight: 500,
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'background 0.15s',
};
const sidebarMenuSection = {
  borderRadius: 10,
  marginBottom: 6,
  transition: 'background 0.15s',
};
const sidebarSubMenu = {
  paddingLeft: 18,
  paddingBottom: 8,
  paddingTop: 2,
  color: '#fff',
  fontSize: 16,
  cursor: 'pointer',
};
const sidebarActiveItem = {
  background: '#35708E',
  borderRadius: 7,
  color: '#fff',
  fontWeight: 600,
};

const menuStructure = [
  {
    label: 'Main',
    icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>,
    submenu: [
      { label: 'Dashboard', action: (navigate, setSidebarOpen) => { navigate('/scad-dashboard'); setSidebarOpen(false); } },
    ],
  },
  {
    label: 'Company',
    icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>,
    submenu: [
      { label: 'Company Requests', action: (navigate, setSidebarOpen) => { setSidebarOpen(false); } },
    ],
  },
  {
    label: 'Students',
    icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
    submenu: [
      { label: 'View Students', action: (navigate, setSidebarOpen) => { setSidebarOpen(false); } },
    ],
  },
  {
    label: 'Internships',
    icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>,
    submenu: [
      { label: 'View Internships', action: (navigate, setSidebarOpen) => { setSidebarOpen(false); } },
      { label: 'Internship Cycle', action: (navigate, setSidebarOpen) => { setSidebarOpen(false); } },
    ],
  },
];

const cardStyle = {
  background: '#fff',
  borderRadius: 14,
  boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
  padding: '24px',
  marginBottom: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 180,
  minHeight: 110,
  width: 210,
  height: 180,
};

const statData = [
  { label: 'Students', value: 1158, color: '#35708E', icon: '👨‍🎓' },
  { label: 'Companies', value: 155, color: '#F08F36', icon: '🏢' },
  { label: 'Internships', value: 52, color: '#234B73', icon: '💼' },
  { label: 'Reports', value: 87, color: '#7C3AED', icon: '📄' },
  { label: 'Workshops', value: 5, color: '#065F46', icon: '🎤' },
];

const quickLinks = [
  { label: 'Manage Students', path: '/scad-students', color: '#35708E', icon: '👨‍🎓' },
  { label: 'Company Applications', path: '/scad-company-applications', color: '#F08F36', icon: '🏢' },
  { label: 'Available Internships', path: '/scad-internships', color: '#234B73', icon: '💼' },
  { label: 'Internship Reports', path: '/scad-internship-reports', color: '#7C3AED', icon: '📄' },
  { label: 'Workshops', path: '/scad-workshops', color: '#065F46', icon: '🎤' },
  { label: 'Appointments', path: '/scad-appointments', color: '#F08F36', icon: '📅' },
];

// Dummy data for demonstration
const dummyReports = [
  { status: 'Accepted', reviewTime: 6, courses: ['Data Structures', 'Machine Learning'], company: 'Google', evaluation: { companyRating: 4.8 }, cycle: 'Summer 2024' },
  { status: 'Accepted', reviewTime: 2, courses: ['Web Development', 'Database Systems'], company: 'Microsoft', evaluation: { companyRating: 4.9 }, cycle: 'Summer 2024' },
  { status: 'Accepted', reviewTime: 3, courses: ['Software Engineering', 'Computer Networks'], company: 'Meta', evaluation: { companyRating: 4.7 }, cycle: 'Summer 2024' },
  { status: 'Flagged', reviewTime: 8, courses: ['Business Strategy', 'Operations Management'], company: 'Amazon', evaluation: { companyRating: 4.2 }, cycle: 'Summer 2024' },
  { status: 'Flagged', reviewTime: 2, courses: ['Marketing', 'Business Law'], company: 'Unilever', evaluation: { companyRating: 4.0 }, cycle: 'Summer 2024' },
  { status: 'Rejected', reviewTime: 7, courses: ['Engineering Design', 'Materials Science'], company: 'Tesla', evaluation: { companyRating: 3.1 }, cycle: 'Summer 2024' },
  { status: 'Rejected', reviewTime: 8, courses: ['Supply Chain', 'Logistics'], company: 'DHL', evaluation: { companyRating: 3.5 }, cycle: 'Summer 2024' },
  { status: 'Pending', reviewTime: 2, courses: ['Supply Chain', 'Logistics'], company: 'Unilever', evaluation: null, cycle: 'Summer 2024' },
  { status: 'Pending', reviewTime: 1, courses: ['Data Analysis', 'Statistics'], company: 'IBM', evaluation: null, cycle: 'Summer 2024' },
  { status: 'Pending', reviewTime: 3, courses: ['AI', 'Machine Learning'], company: 'Intel', evaluation: null, cycle: 'Summer 2024' },
  
  { status: 'Accepted', reviewTime: 4, courses: ['Data Structures', 'Algorithms'], company: 'Google', evaluation: { companyRating: 4.7 }, cycle: 'Winter 2024' },
  { status: 'Accepted', reviewTime: 3, courses: ['Web Development', 'UI/UX'], company: 'Microsoft', evaluation: { companyRating: 4.8 }, cycle: 'Winter 2024' },
  { status: 'Flagged', reviewTime: 5, courses: ['Business Analytics', 'Marketing'], company: 'Amazon', evaluation: { companyRating: 4.3 }, cycle: 'Winter 2024' },
  { status: 'Rejected', reviewTime: 6, courses: ['Mechanical Design', 'CAD'], company: 'Tesla', evaluation: { companyRating: 3.2 }, cycle: 'Winter 2024' },
  { status: 'Accepted', reviewTime: 2, courses: ['Data Science', 'Python'], company: 'IBM', evaluation: null, cycle: 'Winter 2024' },
];

// Statistics
const stats = {
  accepted: dummyReports.filter(r => r.status === 'Accepted').length,
  rejected: dummyReports.filter(r => r.status === 'Rejected').length,
  flagged: dummyReports.filter(r => r.status === 'Flagged').length,
  pending: dummyReports.filter(r => r.status === 'Pending').length,
  avgReviewTime: dummyReports.length ? (dummyReports.reduce((a, b) => a + b.reviewTime, 0) / dummyReports.length).toFixed(1) : 0,
  mostUsedCourses: (() => {
    const courseCount = {};
    dummyReports.forEach(r => r.courses.forEach(c => { courseCount[c] = (courseCount[c] || 0) + 1; }));
    return Object.entries(courseCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c);
  })(),
  topRatedCompanies: (() => {
    const companyRatings = {};
    dummyReports.forEach(r => {
      if (r.evaluation) {
        companyRatings[r.company] = companyRatings[r.company] || [];
        companyRatings[r.company].push(r.evaluation.companyRating);
      }
    });
    return Object.entries(companyRatings)
      .map(([company, ratings]) => ({ company, avg: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);
  })(),
  topCompaniesByCount: (() => {
    const companyCount = {};
    dummyReports.forEach(r => { companyCount[r.company] = (companyCount[r.company] || 0) + 1; });
    return Object.entries(companyCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c);
  })(),
  cycleStats: (() => {
    const cycles = [...new Set(dummyReports.map(r => r.cycle))];
    return cycles.map(cycle => {
      const cycleReports = dummyReports.filter(r => r.cycle === cycle);
      return {
        cycle,
        accepted: cycleReports.filter(r => r.status === 'Accepted').length,
        rejected: cycleReports.filter(r => r.status === 'Rejected').length,
        flagged: cycleReports.filter(r => r.status === 'Flagged').length,
        pending: cycleReports.filter(r => r.status === 'Pending').length,
        avgReviewTime: cycleReports.length ? 
          (cycleReports.reduce((a, b) => a + b.reviewTime, 0) / cycleReports.length).toFixed(1) : 0
      };
    });
  })(),
};

// Chart configurations
const cycleChartData = {
  labels: stats.cycleStats.map(s => s.cycle),
  datasets: [
    {
      label: 'Accepted',
      data: stats.cycleStats.map(s => s.accepted),
      backgroundColor: '#065F46',
      borderRadius: 8,
    },
    {
      label: 'Rejected',
      data: stats.cycleStats.map(s => s.rejected),
      backgroundColor: '#991B1B',
      borderRadius: 8,
    },
    {
      label: 'Flagged',
      data: stats.cycleStats.map(s => s.flagged),
      backgroundColor: '#F08F36',
      borderRadius: 8,
    },
    {
      label: 'Pending',
      data: stats.cycleStats.map(s => s.pending),
      backgroundColor: '#35708E',
      borderRadius: 8,
    }
  ]
};

const reviewTimeChartData = {
  labels: stats.cycleStats.map(s => s.cycle),
  datasets: [{
    label: 'Average Review Time (days)',
    data: stats.cycleStats.map(s => s.avgReviewTime),
    backgroundColor: '#35708E',
    borderRadius: 8,
    borderColor: '#234B73',
    borderWidth: 2,
    fill: true,
    tension: 0.4
  }]
};

const coursesChartData = {
  labels: stats.mostUsedCourses,
  datasets: [{
    label: 'Number of Reports',
    data: stats.mostUsedCourses.map(course => 
      dummyReports.filter(r => r.courses.includes(course)).length
    ),
    backgroundColor: '#7C3AED',
    borderRadius: 8,
  }]
};

const companyRatingsChartData = {
  labels: stats.topRatedCompanies.map(c => c.company),
  datasets: [{
    label: 'Average Rating',
    data: stats.topRatedCompanies.map(c => c.avg),
    backgroundColor: '#F08F36',
    borderRadius: 8,
  }]
};

const companyCountChartData = {
  labels: stats.topCompaniesByCount,
  datasets: [{
    label: 'Number of Internships',
    data: stats.topCompaniesByCount.map(company => 
      dummyReports.filter(r => r.company === company).length
    ),
    backgroundColor: '#234B73',
    borderRadius: 8,
  }]
};

// Add new chart data for Internships per Company by Cycle
const topCompanies = stats.topCompaniesByCount;
const cycles = stats.cycleStats.map(s => s.cycle);
const internshipsPerCompanyByCycleData = {
  labels: cycles,
  datasets: topCompanies.map((company, idx) => ({
    label: company,
    data: cycles.map(cycle => dummyReports.filter(r => r.company === company && r.cycle === cycle).length),
    backgroundColor: ['#35708E', '#F08F36', '#234B73'][idx % 3],
    borderRadius: 8,
  }))
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      display: true,
      position: 'top',
      labels: {
        font: {
          weight: 600
        }
      }
    },
    tooltip: {
      backgroundColor: '#234B73',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      cornerRadius: 8,
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { 
        color: '#234B73',
        font: {
          weight: 600
        }
      },
      grid: {
        color: '#E5E7EB',
        drawBorder: false
      }
    },
    x: {
      ticks: {
        color: '#234B73',
        font: {
          weight: 600
        }
      },
      grid: {
        display: false
      }
    }
  },
};

// Dummy cycle info
const currentCycle = {
  name: 'Summer 2024',
  start: '2024-06-01',
  end: '2024-08-31',
};

const smallCardStyle = {
  background: '#fff',
  borderRadius: 10,
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  padding: '14px',
  marginBottom: '18px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 100,
  minHeight: 60,
  width: 120,
  height: 90,
};

const SCADDashboard = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState([]);
  const [activeSubItem, setActiveSubItem] = useState('Dashboard');
  const navigate = useNavigate();
  const handleMenuClick = (label) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };
  const isMenuOpen = (label) => openMenus.includes(label);
  const chartSectionRef = useRef();

  const handleDownloadPDF = async () => {
    if (!chartSectionRef.current) return;
    const canvas = await html2canvas(chartSectionRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 40;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
    pdf.save('scad-dashboard-graphs.pdf');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <SCADNavbar />
      <div style={{ padding: '32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: '#234B73', fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Welcome, SCAD Officer!</h1>
          <div style={{ color: '#35708E', fontSize: 20, fontWeight: 500, marginBottom: 18 }}>
            Here's a quick overview of the system. Use the shortcuts below to manage students, companies, internships, reports, workshops, and appointments.
          </div>
          {/* Current Cycle Info */}
          <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '16px 24px', marginBottom: 18, display: 'inline-block' }}>
            <span style={{ color: '#234B73', fontWeight: 700, fontSize: 18 }}>Current Cycle: </span>
            <span style={{ color: '#35708E', fontWeight: 700, fontSize: 18 }}>{currentCycle.name}</span>
            <span style={{ color: '#8C8C8C', fontWeight: 500, fontSize: 15, marginLeft: 18 }}>
              ({new Date(currentCycle.start).toLocaleDateString()} - {new Date(currentCycle.end).toLocaleDateString()})
            </span>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'nowrap', marginBottom: 40, justifyContent: 'center' }}>
            {statData.map(stat => (
              <div key={stat.label} style={{ ...cardStyle, borderTop: `5px solid ${stat.color}` }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 26, color: stat.color }}>{stat.value}</div>
                <div style={{ color: '#234B73', fontWeight: 600, fontSize: 16 }}>{stat.label}</div>
              </div>
            ))}
          </div>
          {/* Download Graphs Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <button onClick={handleDownloadPDF} style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #234B7322', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><path d="M12 5v12M5 12l7 7 7-7" /><rect x="5" y="19" width="14" height="2" rx="1" /></svg>
              Download Graphs as PDF
            </button>
          </div>
          {/* Statistics Charts Section */}
          <div ref={chartSectionRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 40 }}>
            {/* Each graph box smaller */}
            <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '14px', minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 16, marginBottom: 10 }}>Report Status by Cycle</div>
              <div style={{ height: 180 }}>
                <Bar data={cycleChartData} options={chartOptions} />
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '14px', minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 16, marginBottom: 10 }}>Average Review Time by Cycle</div>
              <div style={{ height: 180 }}>
                <Line data={reviewTimeChartData} options={chartOptions} />
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '14px', minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 16, marginBottom: 10 }}>Most Used Courses</div>
              <div style={{ height: 180 }}>
                <Bar data={coursesChartData} options={chartOptions} />
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '14px', minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 16, marginBottom: 10 }}>Top Rated Companies</div>
              <div style={{ height: 180 }}>
                <Bar data={companyRatingsChartData} options={chartOptions} />
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '14px', minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 16, marginBottom: 10 }}>Top Companies by Internship Count</div>
              <div style={{ height: 180 }}>
                <Bar data={companyCountChartData} options={chartOptions} />
              </div>
            </div>
            {/* Sixth graph: Internships per Company by Cycle */}
            <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '14px', minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 16, marginBottom: 10 }}>Internships per Company by Cycle</div>
              <div style={{ height: 180 }}>
                <Bar data={internshipsPerCompanyByCycleData} options={chartOptions} />
              </div>
            </div>
          </div>
          {/* Quick Links */}
          <div style={{ fontWeight: 700, color: '#234B73', fontSize: 22, marginBottom: 18 }}>Quick Access</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {quickLinks.map(link => (
              <div
                key={link.label}
                onClick={() => navigate(link.path)}
                style={{
                  ...cardStyle,
                  borderLeft: `6px solid ${link.color}`,
                  minWidth: 220,
                  textDecoration: 'none',
                  color: '#234B73',
                  alignItems: 'flex-start',
                  transition: 'box-shadow 0.2s',
                  boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
                  fontWeight: 600,
                  fontSize: 18,
                  cursor: 'pointer',
                }}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(link.path); }}
              >
                <span style={{ fontSize: 28, marginRight: 10 }}>{link.icon}</span>
                {link.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SCADDashboard; 