import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import { useAuth } from '../App';
import FacultyNavbar from './FacultyNavbar';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import html2canvas from 'html2canvas';

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

const FacultyDashboard = () => {
  const [reports] = useState(dummyReports);
  const chartSectionRef = useRef();
  const { user } = useAuth();

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

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <FacultyNavbar />
      <div style={{ padding: '32px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Welcome, {user?.fullName || 'Faculty Member'}!</h1>
          <div style={{ color: '#35708E', fontSize: 20, fontWeight: 500, marginBottom: 32 }}>
            View internship statistics and analytics. Use the charts below to analyze report data.
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
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard; 