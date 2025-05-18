import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../App';
import FacultyNavbar from './FacultyNavbar';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaFilter } from 'react-icons/fa';

// Dummy data for demonstration
const dummyReports = [
  {
    id: 1,
    student: { name: 'Youssef Khaled', major: 'CS', email: 'youssef.khaled@student.guc.edu.eg' },
    company: 'Google',
    supervisor: 'John Smith',
    startDate: '2024-07-15',
    endDate: '2024-10-15',
    status: 'Accepted',
    submissionDate: '2024-07-20',
    title: 'UX Internship Report',
    body: 'Worked on Google UX team...',
    courses: ['Data Structures', 'Machine Learning'],
    evaluation: { rating: 4.8, comments: 'Excellent performance.' },
    clarification: '',
    reviewTime: 3,
    cycle: 'Summer 2024'
  },
  {
    id: 2,
    student: { name: 'Salma Ahmed', major: 'CS', email: 'salma.ahmed@student.guc.edu.eg' },
    company: 'Amazon',
    supervisor: 'Sarah Johnson',
    startDate: '2024-07-10',
    endDate: '2024-09-10',
    status: 'Flagged',
    submissionDate: '2024-07-18',
    title: 'Backend Internship Report',
    body: 'Worked on AWS backend...',
    courses: ['Operating Systems', 'Database Systems'],
    evaluation: { rating: 4.2, comments: 'Needs improvement.' },
    clarification: 'Please clarify the data sources used.',
    reviewTime: 5,
    cycle: 'Summer 2024'
  },
  {
    id: 3,
    student: { name: 'Ahmed Mohamed', major: 'Engineering', email: 'ahmed.mohamed@student.guc.edu.eg' },
    company: 'Microsoft',
    supervisor: 'Michael Brown',
    startDate: '2024-07-05',
    endDate: '2024-09-05',
    status: 'Accepted',
    submissionDate: '2024-07-19',
    title: 'Engineering Internship Report',
    body: 'Worked on Azure cloud...',
    courses: ['Control Systems', 'Dynamics'],
    evaluation: { rating: 4.9, comments: 'Outstanding.' },
    clarification: '',
    reviewTime: 2,
    cycle: 'Summer 2024'
  },
  {
    id: 4,
    student: { name: 'Sarah Ali', major: 'Business', email: 'sarah.ali@student.guc.edu.eg' },
    company: 'Meta',
    supervisor: 'Anna Schmidt',
    startDate: '2024-07-12',
    endDate: '2024-09-12',
    status: 'Rejected',
    submissionDate: '2024-07-21',
    title: 'Business Internship Report',
    body: 'Worked on Meta business analytics...',
    courses: ['Marketing', 'Business Strategy'],
    evaluation: { rating: 3.5, comments: 'Report incomplete.' },
    clarification: 'Missing key sections.',
    reviewTime: 4,
    cycle: 'Summer 2024'
  },
  {
    id: 5,
    student: { name: 'Mohamed Hassan', major: 'CS', email: 'mohamed.hassan@student.guc.edu.eg' },
    company: 'Google',
    supervisor: 'David Wilson',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    status: 'Accepted',
    submissionDate: '2024-01-20',
    title: 'Software Engineering Internship',
    body: 'Worked on Google Cloud Platform...',
    courses: ['Cloud Computing', 'Software Engineering'],
    evaluation: { rating: 4.7, comments: 'Great technical skills.' },
    clarification: '',
    reviewTime: 3,
    cycle: 'Winter 2024'
  },
  {
    id: 6,
    student: { name: 'Nour Ibrahim', major: 'Business', email: 'nour.ibrahim@student.guc.edu.eg' },
    company: 'Microsoft',
    supervisor: 'Lisa Chen',
    startDate: '2024-01-10',
    endDate: '2024-03-10',
    status: 'Flagged',
    submissionDate: '2024-01-18',
    title: 'Business Analytics Internship',
    body: 'Worked on Microsoft Analytics...',
    courses: ['Business Analytics', 'Data Science'],
    evaluation: { rating: 4.3, comments: 'Good analytical skills.' },
    clarification: 'Please provide more details on methodology.',
    reviewTime: 4,
    cycle: 'Winter 2024'
  }
];

const majors = ['All', 'CS', 'Engineering', 'Business'];
const statuses = ['All', 'pending', 'flagged', 'rejected', 'accepted'];

const statusStyles = {
  Accepted: { background: '#D1FAE5', color: '#065F46' },
  Rejected: { background: '#FEE2E2', color: '#991B1B' },
  Flagged:  { background: '#FEF3C7', color: '#B45309' },
  Pending:  { background: '#DBEAFE', color: '#2563eb' }
};

const FacultyManageReports = () => {
  const [reports, setReports] = useState(dummyReports);
  const [filterMajor, setFilterMajor] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [clarificationText, setClarificationText] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [tempMajor, setTempMajor] = useState(filterMajor);
  const [tempStatus, setTempStatus] = useState(filterStatus);
  const reportContentRef = useRef();
  const chartSectionRef = useRef();
  const { user } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    if (!showFilterDropdown) return;
    const handleClick = (e) => {
      if (!e.target.closest('.faculty-filter-dropdown') && !e.target.closest('.faculty-filter-btn')) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showFilterDropdown]);

  // Filtered reports
  const filteredReports = reports.filter(r =>
    (filterMajor === 'All' || r.student.major === filterMajor) &&
    (filterStatus === 'All' || r.status === filterStatus) &&
    (r.student.name.toLowerCase().includes(search.toLowerCase()) || r.company.toLowerCase().includes(search.toLowerCase()))
  );

  // Statistics
  const stats = {
    accepted: reports.filter(r => r.status === 'Accepted').length,
    rejected: reports.filter(r => r.status === 'Rejected').length,
    flagged: reports.filter(r => r.status === 'Flagged').length,
    pending: reports.filter(r => r.status === 'Pending').length,
    avgReviewTime: reports.length ? (reports.reduce((a, b) => a + b.reviewTime, 0) / reports.length).toFixed(1) : 0,
    mostUsedCourses: (() => {
      const courseCount = {};
      reports.forEach(r => r.courses.forEach(c => { courseCount[c] = (courseCount[c] || 0) + 1; }));
      return Object.entries(courseCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c);
    })(),
    topRatedCompanies: (() => {
      const companyRatings = {};
      reports.forEach(r => {
        if (r.evaluation) {
          companyRatings[r.company] = companyRatings[r.company] || [];
          companyRatings[r.company].push(r.evaluation.rating);
        }
      });
      return Object.entries(companyRatings)
        .map(([company, ratings]) => ({ company, avg: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 3);
    })(),
    topCompaniesByCount: (() => {
      const companyCount = {};
      reports.forEach(r => { companyCount[r.company] = (companyCount[r.company] || 0) + 1; });
      return Object.entries(companyCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c);
    })(),
    cycleStats: (() => {
      const cycles = [...new Set(reports.map(r => r.cycle))];
      return cycles.map(cycle => {
        const cycleReports = reports.filter(r => r.cycle === cycle);
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
        reports.filter(r => r.courses.includes(course)).length
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
        reports.filter(r => r.company === company).length
      ),
      backgroundColor: '#234B73',
      borderRadius: 8,
    }]
  };

  const topCompanies = stats.topCompaniesByCount;
  const cycles = stats.cycleStats.map(s => s.cycle);
  const internshipsPerCompanyByCycleData = {
    labels: cycles,
    datasets: topCompanies.map((company, idx) => ({
      label: company,
      data: cycles.map(cycle => reports.filter(r => r.company === company && r.cycle === cycle).length),
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
    pdf.save('faculty-reports-graphs.pdf');
  };

  // Change report status
  const setStatus = (id, status) => {
    setReports(reports => reports.map(r => r.id === id ? { ...r, status } : r));
  };

  // Submit clarification
  const submitClarification = (id) => {
    setReports(reports => reports.map(r => r.id === id ? { ...r, clarification: clarificationText } : r));
    setClarificationText('');
    setSelectedReport(null);
  };

  // Generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();
    doc.text('Internship Reports Statistics', 10, 10);
    doc.text(`Accepted: ${stats.accepted}`, 10, 20);
    doc.text(`Rejected: ${stats.rejected}`, 10, 30);
    doc.text(`Flagged: ${stats.flagged}`, 10, 40);
    doc.text(`Pending: ${stats.pending}`, 10, 50);
    doc.text(`Avg. Review Time: ${stats.avgReviewTime} days`, 10, 60);
    doc.text(`Top Courses: ${stats.mostUsedCourses.join(', ')}`, 10, 70);
    doc.text(`Top Rated Companies: ${stats.topRatedCompanies.map(c => c.company + ' (' + c.avg + ')').join(', ')}`, 10, 80);
    doc.text(`Top Companies by Count: ${stats.topCompaniesByCount.join(', ')}`, 10, 90);
    doc.save('faculty-internship-report.pdf');
  };

  // Download full report as PDF
  const downloadReportPDF = (report) => {
    const doc = new jsPDF();
    doc.text('Internship Report', 10, 10);
    doc.text(`Title: ${report.title}`, 10, 20);
    doc.text(`Student: ${report.student.name} (${report.student.major})`, 10, 30);
    doc.text(`Email: ${report.student.email}`, 10, 40);
    doc.text(`Company: ${report.company}`, 10, 50);
    doc.text(`Supervisor: ${report.supervisor}`, 10, 60);
    doc.text(`Internship Dates: ${report.startDate} to ${report.endDate}`, 10, 70);
    doc.text(`Status: ${report.status}`, 10, 80);
    doc.text(`Courses: ${report.courses.join(', ')}`, 10, 90);
    doc.text('Body:', 10, 100);
    doc.text(report.body, 10, 110, { maxWidth: 180 });
    doc.text(`Evaluation: ${report.evaluation.rating} - ${report.evaluation.comments}`, 10, 140);
    if (report.clarification) {
      doc.text(`Clarification: ${report.clarification}`, 10, 150, { maxWidth: 180 });
    }
    doc.save('internship-report.pdf');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <FacultyNavbar />
      <div style={{ padding: '32px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Manage Reports</h1>
          <div style={{ color: '#35708E', fontSize: 20, fontWeight: 500, marginBottom: 32 }}>
            Review and manage internship reports. Use the filters and actions below to get started.
          </div>

          {/* Download Graphs Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <button onClick={handleDownloadPDF} style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #234B7322', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><path d="M12 5v12M5 12l7 7 7-7" /><rect x="5" y="19" width="14" height="2" rx="1" /></svg>
              Download Graphs as PDF
            </button>
          </div>

          {/* Statistics Charts Section */}
          <div ref={chartSectionRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 32 }}>
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
            <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '14px', minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 16, marginBottom: 10 }}>Internships per Company by Cycle</div>
              <div style={{ height: 180 }}>
                <Bar data={internshipsPerCompanyByCycleData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Reports Section */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#234B73', fontSize: 24, fontWeight: 700, margin: 0 }}>Reports</h2>
              <button onClick={generateReport} style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                Generate Report
              </button>
            </div>

            {/* Search and Filter Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <input
                type="text"
                placeholder="Search by student or company..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #C0CEDB', fontSize: 16, background: '#fff', color: '#234B73' }}
              />
              <div style={{ position: 'relative' }}>
                <button
                  className="faculty-filter-btn"
                  onClick={() => {
                    setTempMajor(filterMajor);
                    setTempStatus(filterStatus);
                    setShowFilterDropdown(v => !v);
                  }}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer', 
                    fontWeight: 600, 
                    fontSize: 24, 
                    color: '#F08F36', 
                    outline: 'none', 
                    position: 'relative', 
                    padding: 0 
                  }}
                >
                  <FaFilter style={{ marginRight: 7, fontSize: 28, color: '#F08F36' }} />
                  <span style={{ fontWeight: 600, fontSize: 24, color: '#F08F36', letterSpacing: 0.5 }}>Filter</span>
                  <div style={{ position: 'absolute', left: 0, bottom: -4, width: '100%', height: 4, background: '#F08F36', borderRadius: 2 }} />
                </button>
                {showFilterDropdown && (
                  <div className="faculty-filter-dropdown" style={{ position: 'absolute', zIndex: 2001, top: '100%', right: 0, background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', padding: '28px 28px 20px 28px', minWidth: 270, maxWidth: 340, marginTop: 8 }}>
                    <div style={{ fontWeight: 700, color: '#234B73', fontSize: 18, marginBottom: 18 }}>Filter by:</div>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontWeight: 600, color: '#234B73', fontSize: 16, marginBottom: 8 }}>Major</div>
                      <select
                        value={tempMajor}
                        onChange={e => setTempMajor(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 15, color: '#234B73', background: '#fff', marginBottom: 10 }}
                      >
                        {majors.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontWeight: 600, color: '#234B73', fontSize: 16, marginBottom: 8 }}>Status</div>
                      <select
                        value={tempStatus}
                        onChange={e => setTempStatus(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 15, color: '#234B73', background: '#fff' }}
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setTempMajor('All');
                          setTempStatus('All');
                          setFilterMajor('All');
                          setFilterStatus('All');
                          setShowFilterDropdown(false);
                        }}
                        style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => {
                          setFilterMajor(tempMajor);
                          setFilterStatus(tempStatus);
                          setShowFilterDropdown(false);
                        }}
                        style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reports Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#C0CEDB', color: '#234B73', fontWeight: 700 }}>
                    <th style={{ padding: 12, textAlign: 'left' }}>Student</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Major</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Company</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Submission</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#8C8C8C', padding: 32 }}>No reports found.</td></tr>
                  ) : filteredReports.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: 12 }}>{r.student.name}</td>
                      <td style={{ padding: 12 }}>{r.student.major}</td>
                      <td style={{ padding: 12 }}>{r.company}</td>
                      <td style={{ padding: 12 }}>
                        <span
                          style={{
                            borderRadius: 8,
                            padding: '2px 12px',
                            fontWeight: 700,
                            fontSize: 14,
                            ...statusStyles[r.status.charAt(0).toUpperCase() + r.status.slice(1)]
                          }}
                        >
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: 12 }}>{r.submissionDate}</td>
                      <td style={{ padding: 12 }}>
                        <button onClick={() => { setSelectedReport(r); setClarificationText(r.clarification || ''); }} style={{ background: '#35708E', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginRight: 8 }}>View</button>
                        <select value={r.status} onChange={e => setStatus(r.id, e.target.value)} style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid #C0CEDB', fontSize: 14, color: '#234B73' }}>
                          <option value="pending">Pending</option>
                          <option value="flagged">Flagged</option>
                          <option value="rejected">Rejected</option>
                          <option value="accepted">Accepted</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000 }} onClick={() => setSelectedReport(null)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', padding: '36px 32px 28px 32px', zIndex: 2001, minWidth: 340, maxWidth: '95vw', width: 540 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ color: '#234B73', fontWeight: 700, fontSize: 22 }}>Internship Report Details</span>
              <button onClick={() => setSelectedReport(null)} style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }} aria-label="Close modal">×</button>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: '#234B73', fontWeight: 600, fontSize: 17, marginBottom: 8 }}>{selectedReport.title}</div>
              <div style={{ color: '#35708E', fontSize: 15, marginBottom: 8 }}>{selectedReport.body}</div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Courses:</b> {selectedReport.courses.join(', ')}</div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Status:</b> <span style={{ borderRadius: 8, padding: '2px 12px', fontWeight: 700, fontSize: 14, ...statusStyles[selectedReport.status] }}>{selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}</span></div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Student:</b> {selectedReport.student.name} ({selectedReport.student.major}) - {selectedReport.student.email}</div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Company:</b> {selectedReport.company}</div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Supervisor:</b> {selectedReport.supervisor}</div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Internship Dates:</b> {selectedReport.startDate} to {selectedReport.endDate}</div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Evaluation:</b> {selectedReport.evaluation.rating} ★ - {selectedReport.evaluation.comments}</div>
              {selectedReport.clarification && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ color: '#991B1B', fontWeight: 700, marginBottom: 6 }}>Clarification</div>
                  <div style={{ color: '#234B73', fontSize: 15 }}>{selectedReport.clarification}</div>
                </div>
              )}
              <div style={{ marginTop: 18 }}>
                <div style={{ color: '#991B1B', fontWeight: 700, marginBottom: 6 }}>Add Clarification</div>
                <textarea value={clarificationText} onChange={e => setClarificationText(e.target.value)} rows={3} style={{ width: '100%', borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, resize: 'vertical', background: '#fff', color: '#234B73' }} placeholder="Submit a clarification..." />
                <button onClick={() => submitClarification(selectedReport.id)} style={{ marginTop: 10, background: '#35708E', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Submit Clarification</button>
              </div>
            </div>
            <button onClick={() => downloadReportPDF(selectedReport)} style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Download Report</button>
          </div>
        </>
      )}
    </div>
  );
};

export default FacultyManageReports;