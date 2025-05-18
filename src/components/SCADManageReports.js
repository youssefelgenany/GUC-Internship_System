import React, { useState, useRef } from 'react';
import SCADNavbar from './SCADNavbar';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaFilter } from 'react-icons/fa';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import SCADInternships from './ScadInternships';

const dummyReports = [
  {
    id: 1,
    student: {
      name: 'Youssef Khaled',
      email: 'youssef.khaled@student.guc.edu.eg',
      major: 'CS',
      year: '3',
    },
    company: 'Google',
    supervisor: 'John Smith',
    startDate: '2024-07-15',
    endDate: '2024-10-15',
    status: 'Accepted',
    title: 'Google Internship Report',
    body: 'Worked on UX design and prototyping.',
    courses: ['Data Structures', 'Machine Learning'],
    reviewTime: 3, // days
    evaluation: {
      environment: 5,
      learning: 5,
      mentorship: 4,
      worklife: 4,
      text: 'Great experience!',
      recommend: true,
      companyRating: 4.8,
    },
    clarification: '',
  },
  {
    id: 2,
    student: {
      name: 'Salma Ahmed',
      email: 'salma.ahmed@student.guc.edu.eg',
      major: 'CS',
      year: '4',
    },
    company: 'Amazon',
    supervisor: 'Michael Brown',
    startDate: '2023-01-01',
    endDate: '2023-03-31',
    status: 'Flagged',
    title: 'Amazon Internship Report',
    body: 'Product management and market research.',
    courses: ['Business Strategy', 'Operations Management'],
    reviewTime: 5,
    evaluation: {
      environment: 4,
      learning: 4,
      mentorship: 3,
      worklife: 4,
      text: 'Good learning, but some challenges.',
      recommend: false,
      companyRating: 4.2,
    },
    clarification: '',
  },
  {
    id: 3,
    student: {
      name: 'Omar Fathy',
      email: 'omar.fathy@student.guc.edu.eg',
      major: 'Engineering',
      year: '2',
    },
    company: 'Tesla',
    supervisor: 'Elon Smith',
    startDate: '2022-01-15',
    endDate: '2022-04-15',
    status: 'Rejected',
    title: 'Tesla Engineering Report',
    body: 'Worked on EV design and manufacturing.',
    courses: ['Engineering Design', 'Materials Science'],
    reviewTime: 7,
    evaluation: {
      environment: 3,
      learning: 3,
      mentorship: 2,
      worklife: 3,
      text: 'Difficult environment.',
      recommend: false,
      companyRating: 3.1,
    },
    clarification: '',
  },
  {
    id: 4,
    student: {
      name: 'Sara Mostafa',
      email: 'sara.mostafa@student.guc.edu.eg',
      major: 'Business',
      year: '3',
    },
    company: 'Unilever',
    supervisor: 'James Lee',
    startDate: '2021-07-01',
    endDate: '2021-09-30',
    status: 'Pending',
    title: 'Unilever Supply Chain Report',
    body: 'Optimized supply chain processes.',
    courses: ['Supply Chain', 'Logistics'],
    reviewTime: 2,
    evaluation: null,
    clarification: '',
  },
];

const majors = ['All', ...Array.from(new Set(dummyReports.map(r => r.student.major)))];
const statuses = ['All', 'Pending', 'Flagged', 'Rejected', 'Accepted'];

const SCADInternshipReports = () => {
  const [reports, setReports] = useState(dummyReports);
  const [major, setMajor] = useState('All');
  const [status, setStatus] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [clarification, setClarification] = useState('');
  const [clarificationSubmitted, setClarificationSubmitted] = useState(false);
  const [editingReportId, setEditingReportId] = useState(null);
  const downloadLinkRef = useRef(null);
  const [csvUrl, setCsvUrl] = useState('');
  const chartRef = useRef();
  const [showFilterCard, setShowFilterCard] = useState(false);
  const [tempMajor, setTempMajor] = useState(major);
  const [tempStatus, setTempStatus] = useState(status);
  const [expandedReportId, setExpandedReportId] = useState(null);

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
      reports.forEach(r => { companyCount[r.company] = (companyCount[r.company] || 0) + 1; });
      return Object.entries(companyCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c);
    })(),
    cycleStats: (() => {
      const cycles = [...new Set(reports.map(r => r.cycle || 'Default'))];
      return cycles.map(cycle => {
        const cycleReports = reports.filter(r => (r.cycle || 'Default') === cycle);
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

  const filtered = reports.filter(r =>
    (major === 'All' || r.student.major === major) &&
    (status === 'All' || r.status === status)
  );

  const handleClarificationSubmit = (reportId) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, clarification } : r
    ));
    setClarificationSubmitted(true);
    setEditingReportId(null);
  };

  const handleStartEditing = (report) => {
    setClarification(report.clarification || '');
    setClarificationSubmitted(false);
    setEditingReportId(report.id);
  };

  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setClarification(report.clarification || '');
    setClarificationSubmitted(false);
    setShowReportModal(true);
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Internship Reports Statistics', 20, 20);
    doc.setFontSize(14);
    doc.text(`Accepted: ${stats.accepted}`, 20, 40);
    doc.text(`Rejected: ${stats.rejected}`, 20, 50);
    doc.text(`Flagged: ${stats.flagged}`, 20, 60);
    doc.text(`Pending: ${stats.pending}`, 20, 70);
    doc.text(`Average Review Time: ${stats.avgReviewTime} days`, 20, 80);
    doc.text(`Most Used Courses: ${stats.mostUsedCourses.join(', ')}`, 20, 90);
    doc.text(`Top Rated Companies: ${stats.topRatedCompanies.map(c => `${c.company} (${c.avg})`).join(', ')}`, 20, 100);
    doc.text(`Top Companies by Count: ${stats.topCompaniesByCount.join(', ')}`, 20, 110);
    doc.save('internship-reports.pdf');
  };

  const handleDownloadGraphPDF = () => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const url = chart.toBase64Image();
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.setFontSize(20);
      doc.text('Internship Reports - Status Overview', 14, 20);
      doc.addImage(url, 'PNG', 14, 30, 260, 100);
      doc.save('report-status-graph.pdf');
    }
  };

  // Dummy current cycle
  const currentCycle = {
    name: 'Summer 2024',
    start: '2024-06-01',
    end: '2024-09-01',
  };

  // Chart data for report statuses
  const chartData = {
    labels: ['Accepted', 'Rejected', 'Flagged', 'Pending'],
    datasets: [
      {
        label: 'Reports',
        data: [stats.accepted, stats.rejected, stats.flagged, stats.pending],
        backgroundColor: [
          '#07a316', // Accepted
          '#f50202', // Rejected
          '#a35707', // Flagged
          '#f0df26', // Pending
        ],
        borderRadius: 8,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

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

  // Add sixth graph data: Internships per Company by Cycle
  const topCompanies = stats.topCompaniesByCount;
  const cycles = stats.cycleStats.map(s => s.cycle);
  const internshipsPerCompanyByCycleData = {
    labels: cycles,
    datasets: topCompanies.map((company, idx) => ({
      label: company,
      data: cycles.map(cycle => reports.filter(r => r.company === company && (r.cycle || 'Default') === cycle).length),
      backgroundColor: ['#35708E', '#F08F36', '#234B73'][idx % 3],
      borderRadius: 8,
    }))
  };

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
    pdf.save('scad-reports-graphs.pdf');
  };

  const handleDownloadReportPDF = (report) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(report.title, 14, 18);
    doc.setFontSize(12);
    let y = 32;
    doc.text(`Student: ${report.student.name} (${report.student.email})`, 14, y); y += 8;
    doc.text(`Major: ${report.student.major}`, 14, y); y += 8;
    doc.text(`Company: ${report.company}`, 14, y); y += 8;
    doc.text(`Supervisor: ${report.supervisor}`, 14, y); y += 8;
    doc.text(`Courses: ${report.courses.join(', ')}`, 14, y); y += 8;
    doc.text(`Body: ${report.body}`, 14, y); y += 12;
    doc.setFontSize(14);
    doc.text('Evaluation', 14, y); y += 8;
    doc.setFontSize(12);
    if (report.evaluation) {
      doc.text(`Environment: ${report.evaluation.environment}/5`, 14, y); y += 8;
      doc.text(`Learning: ${report.evaluation.learning}/5`, 14, y); y += 8;
      doc.text(`Mentorship: ${report.evaluation.mentorship}/5`, 14, y); y += 8;
      doc.text(`Work-Life Balance: ${report.evaluation.worklife}/5`, 14, y); y += 8;
      doc.text(`Comments: ${report.evaluation.text}`, 14, y); y += 8;
      doc.text(`Recommend: ${report.evaluation.recommend ? 'Yes' : 'No'}`, 14, y); y += 8;
      doc.text(`Company Rating: ${report.evaluation.companyRating}`, 14, y); y += 8;
    } else {
      doc.text('No evaluation submitted.', 14, y); y += 8;
    }
    if (report.status === 'Flagged' || report.status === 'Rejected') {
      y += 8;
      doc.setFontSize(14);
      doc.text('Clarification', 14, y); y += 8;
      doc.setFontSize(12);
      doc.text(report.clarification || 'Needs more details.', 14, y); y += 8;
    }
    doc.save(`${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_report.pdf`);
  };

  return (
    <>
      <SCADNavbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 18 }}>Internship Reports</h1>
          <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '16px 24px', marginBottom: 18, display: 'inline-block' }}>
            <span style={{ color: '#234B73', fontWeight: 700, fontSize: 18 }}>Current Cycle: </span>
            <span style={{ color: '#35708E', fontWeight: 700, fontSize: 18 }}>{currentCycle.name}</span>
            <span style={{ color: '#8C8C8C', fontWeight: 500, fontSize: 15, marginLeft: 18 }}>
              ({new Date(currentCycle.start).toLocaleDateString()} - {new Date(currentCycle.end).toLocaleDateString()})
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <button onClick={handleDownloadPDF} style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #234B7322', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><path d="M12 5v12M5 12l7 7 7-7" /><rect x="5" y="19" width="14" height="2" rx="1" /></svg>
              Download Graphs as PDF
            </button>
          </div>
          <div ref={chartSectionRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 40 }}>
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
              <div style={{ height: 220 }}>
                <Bar data={internshipsPerCompanyByCycleData} options={chartOptions} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ color: '#234B73', fontSize: 24, fontWeight: 700, margin: 0 }}>Reports</h2>
            <button onClick={handleGenerateReport} style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              Generate Report
            </button>
          </div>
          {/* Filter Label and Controls - now under the graphs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '32px 0 8px 0', justifyContent: 'flex-end', position: 'relative' }}>
            <button
              onClick={() => {
                setTempMajor(major);
                setTempStatus(status);
                setShowFilterCard(v => !v);
              }}
              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 600, fontSize: 28, color: '#F08F36', outline: 'none', position: 'relative', padding: 0 }}
            >
              <FaFilter style={{ marginRight: 7, fontSize: 32, color: '#F08F36' }} />
              <span style={{ fontWeight: 600, fontSize: 28, color: '#F08F36', letterSpacing: 0.5 }}>Filter</span>
              <div style={{ position: 'absolute', left: 0, bottom: -4, width: '100%', height: 5, background: '#F08F36', borderRadius: 2 }} />
            </button>
          </div>
          {showFilterCard && (
            <div style={{ position: 'absolute', zIndex: 2001, marginTop: 8, background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', padding: '28px 28px 20px 28px', minWidth: 270, maxWidth: 340, right: 0 }}>
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
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setTempMajor('All');
                    setTempStatus('All');
                    setMajor('All');
                    setStatus('All');
                    setShowFilterCard(false);
                  }}
                  style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setMajor(tempMajor);
                    setStatus(tempStatus);
                    setShowFilterCard(false);
                  }}
                  style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
          {/* Reports Table Layout - No Submission column, no status dropdown */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(35,75,115,0.08)', padding: 24, marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#C0CEDB' }}>
                  <th style={{ textAlign: 'left', padding: '14px 8px', color: '#234B73', fontWeight: 700, fontSize: 17 }}>Student</th>
                  <th style={{ textAlign: 'left', padding: '14px 8px', color: '#234B73', fontWeight: 700, fontSize: 17 }}>Major</th>
                  <th style={{ textAlign: 'left', padding: '14px 8px', color: '#234B73', fontWeight: 700, fontSize: 17 }}>Company</th>
                  <th style={{ textAlign: 'left', padding: '14px 8px', color: '#234B73', fontWeight: 700, fontSize: 17 }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '14px 8px', color: '#234B73', fontWeight: 700, fontSize: 17 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(report => (
                  <tr key={report.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 8px', color: '#234B73', fontSize: 16 }}>{report.student.name}</td>
                    <td style={{ padding: '12px 8px', color: '#234B73', fontSize: 16 }}>{report.student.major}</td>
                    <td style={{ padding: '12px 8px', color: '#234B73', fontSize: 16 }}>{report.company}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        background:
                          report.status === 'Accepted' ? '#D1FAE5' :
                          report.status === 'Rejected' ? '#FEE2E2' :
                          report.status === 'Flagged' ? '#FEF3C7' :
                          report.status === 'Pending' ? '#FEF3C7' :
                          '#DBEAFE',
                        color:
                          report.status === 'Accepted' ? '#065F46' :
                          report.status === 'Rejected' ? '#991B1B' :
                          report.status === 'Flagged' ? '#92400E' :
                          report.status === 'Pending' ? '#92400E' :
                          '#1E40AF',
                        borderRadius: 8,
                        padding: '4px 16px',
                        fontWeight: 700,
                        fontSize: 15,
                        display: 'inline-block',
                      }}>{report.status}</span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <button
                        style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                        onClick={() => { setSelectedReport(report); setShowReportModal(true); }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Report Modal */}
        {showReportModal && selectedReport && (
          <div>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000 }} onClick={() => setShowReportModal(false)} />
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(53,112,142,0.18)', border: '2px solid #C0CEDB', padding: '32px 28px 24px 28px', zIndex: 2001, minWidth: 340, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ color: '#234B73', fontWeight: 700, fontSize: 24, marginBottom: 10 }}>{selectedReport.title}</h2>
              <div style={{ color: '#5A6A7A', fontSize: 17, marginBottom: 8 }}>{selectedReport.student.name} ({selectedReport.student.email})</div>
              <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Major:</b> {selectedReport.student.major}</div>
              <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Company:</b> {selectedReport.company}</div>
              <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Supervisor:</b> {selectedReport.supervisor}</div>
              <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Courses:</b> {selectedReport.courses.join(', ')}</div>
              <div style={{ color: '#234B73', fontSize: 16, marginBottom: 16 }}><b>Body:</b> {selectedReport.body}</div>
              <div style={{ color: '#234B73', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Evaluation</div>
              {selectedReport.evaluation ? (
                <div style={{ color: '#234B73', fontSize: 16, marginBottom: 16 }}>
                  <div><b>Environment:</b> {selectedReport.evaluation.environment}/5</div>
                  <div><b>Learning:</b> {selectedReport.evaluation.learning}/5</div>
                  <div><b>Mentorship:</b> {selectedReport.evaluation.mentorship}/5</div>
                  <div><b>Work-Life Balance:</b> {selectedReport.evaluation.worklife}/5</div>
                  <div><b>Comments:</b> {selectedReport.evaluation.text}</div>
                  <div><b>Recommend:</b> {selectedReport.evaluation.recommend ? 'Yes' : 'No'}</div>
                  <div><b>Company Rating:</b> {selectedReport.evaluation.companyRating}</div>
                </div>
              ) : (
                <div style={{ color: '#8C8C8C', fontSize: 16, marginBottom: 16 }}>No evaluation submitted.</div>
              )}
              {(selectedReport.status === 'Flagged' || selectedReport.status === 'Rejected') && (
                <div style={{ marginTop: 18, background: '#FEE2E2', borderRadius: 12, padding: 18, color: '#991B1B', fontWeight: 500, boxShadow: '0 1px 8px rgba(255,0,0,0.04)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 6, color: '#991B1B' }}>Clarification</div>
                  {!clarificationSubmitted ? (
                    <>
                      <textarea
                        value={clarification}
                        onChange={e => setClarification(e.target.value)}
                        rows={3}
                        style={{ width: '100%', borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, resize: 'vertical', background: '#fff', color: '#234B73' }}
                        placeholder="Write your clarification here..."
                      />
                      <button
                        style={{ marginTop: 10, background: '#35708E', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #35708E22' }}
                        onClick={() => handleClarificationSubmit(selectedReport.id)}
                      >
                        Submit Clarification
                      </button>
                    </>
                  ) : (
                    <div style={{ marginTop: 10, color: '#35708E', fontWeight: 700 }}>Your clarification has been submitted.</div>
                  )}
                </div>
              )}
              <button
                style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 18 }}
                onClick={() => setShowReportModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SCADInternshipReports; 