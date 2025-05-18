import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ApplicantsView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const internship = location.state?.internship;

  // Empty applicants data structure - will be populated when students apply
  const emptyApplicantsData = {
    columns: [
      { id: 'name', label: 'Name' },
      { id: 'email', label: 'Email' },
      { id: 'phone', label: 'Phone Number' },
      { id: 'university', label: 'University' },
      { id: 'major', label: 'Major' },
      { id: 'graduationYear', label: 'Graduation Year' },
      { id: 'gpa', label: 'GPA' },
      { id: 'preferredPosition', label: 'Preferred Position' },
      { id: 'cvLink', label: 'CV Link' },
      { id: 'languages', label: 'Languages' },
      { id: 'availability', label: 'Availability' },
      { id: 'startDate', label: 'Preferred Start Date' }
    ],
    rows: [] // Empty array - will be populated with student applications
  };

  if (!internship) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-3xl p-6 shadow-xl text-center">
          <p className="text-gray-600 text-lg">No internship selected.</p>
          <button
            onClick={() => navigate('/scad-internships')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Internships
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Applicants for {internship.title}</h1>
          <button
            onClick={() => navigate('/scad-internships')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Back to Internships
          </button>
        </div>
        <p className="text-white/80 text-lg mt-2">View and manage applicants for this internship position</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {emptyApplicantsData.columns.map((column) => (
                    <th
                      key={column.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {emptyApplicantsData.rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={emptyApplicantsData.columns.length}
                      className="px-6 py-4 text-center text-gray-500 border border-gray-200"
                    >
                      No applicants yet. This table will be populated when students apply to this internship.
                    </td>
                  </tr>
                ) : (
                  emptyApplicantsData.rows.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {emptyApplicantsData.columns.map((column) => (
                        <td 
                          key={column.id} 
                          className="px-6 py-4 whitespace-nowrap border border-gray-200"
                        >
                          {column.id === 'cvLink' ? (
                            <a
                              href={row[column.id]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View CV
                            </a>
                          ) : (
                            <div className="text-sm text-gray-900">
                              {Array.isArray(row[column.id])
                                ? row[column.id].join(', ')
                                : row[column.id]}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsView; 