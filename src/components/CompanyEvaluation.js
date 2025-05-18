import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CompanyNavbar from './CompanyNavbar';

const initialEvaluation = {
  internName: '',
  internshipRole: '',
  studentId: '',
  internshipId: '',
  technical: { rating: 0, comment: '' },
  communication: { rating: 0, comment: '' },
  problemSolving: { rating: 0, comment: '' },
  teamwork: { rating: 0, comment: '' },
  initiative: { rating: 0, comment: '' },
  overall: { rating: 0, comment: '' },
  recommendation: '',
  companyId: 'GUC_TECH_001',
  dateOfEvaluation: '',
  overallRating: 0,
};

const CompanyEvaluation = () => {
  const { internshipId, studentId } = useParams();
  const navigate = useNavigate();
  const allEvaluationsKey = `all_evaluations_GUC_TECH_001`;

  const [evaluation, setEvaluation] = useState(initialEvaluation);
  const [error, setError] = useState('');
  const [isViewMode, setIsViewMode] = useState(!!internshipId && !!studentId);

  // Refs for contentEditable fields
  const internshipIdRef = useRef(null);
  const studentIdRef = useRef(null);
  const internNameRef = useRef(null);
  const internshipRoleRef = useRef(null);

  useEffect(() => {
    console.log(`CompanyEvaluation: Loading for internshipId=${internshipId}, studentId=${studentId}`);
    try {
      if (internshipId && studentId) {
        const allEvaluations = JSON.parse(localStorage.getItem(allEvaluationsKey) || '[]');
        const existingEvaluation = allEvaluations.find(
          (ev) => ev.internshipId === internshipId && ev.studentId === studentId && ev.companyId === 'GUC_TECH_001'
        );
        if (existingEvaluation) {
          const formattedEvaluation = {
            ...existingEvaluation,
            dateOfEvaluation: existingEvaluation.dateOfEvaluation
              ? new Date(existingEvaluation.dateOfEvaluation).toISOString().split('T')[0]
              : '',
          };
          setEvaluation(formattedEvaluation);
          setIsViewMode(true);

          // Prefill contentEditable fields
          if (internshipIdRef.current) internshipIdRef.current.textContent = formattedEvaluation.internshipId || '';
          if (studentIdRef.current) studentIdRef.current.textContent = formattedEvaluation.studentId || '';
          if (internNameRef.current) internNameRef.current.textContent = formattedEvaluation.internName || '';
          if (internshipRoleRef.current) internshipRoleRef.current.textContent = formattedEvaluation.internshipRole || '';

          console.log('Loaded evaluation:', formattedEvaluation);
        } else {
          setError('Evaluation not found.');
          console.log('No evaluation found for given internshipId and studentId');
        }
      } else {
        // Set default date for new evaluation
        setEvaluation((prev) => ({
          ...prev,
          dateOfEvaluation: new Date().toISOString().split('T')[0],
        }));
        console.log('No internshipId or studentId, using initial data for new evaluation');
      }
    } catch (err) {
      console.error('Error loading evaluation:', err);
      setError('Failed to load evaluation.');
    }
  }, [internshipId, studentId, allEvaluationsKey]);

  const handleChange = (section, field, value) => {
    setEvaluation((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleRecommendationChange = (value) => {
    setEvaluation((prev) => ({ ...prev, recommendation: value }));
  };

  const handleContentChange = (name, content) => {
    setEvaluation((prev) => ({
      ...prev,
      [name]: content,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvaluation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('CompanyEvaluation: Submitting form');
    try {
      // Validate required fields
      if (
        !evaluation.studentId ||
        !evaluation.internName ||
        !evaluation.internshipRole ||
        !evaluation.internshipId ||
        !evaluation.recommendation ||
        !evaluation.dateOfEvaluation
      ) {
        setError('Please fill in all required fields, including Internship ID and Date of Evaluation.');
        return;
      }
      if (
        !evaluation.technical.rating ||
        !evaluation.communication.rating ||
        !evaluation.problemSolving.rating ||
        !evaluation.teamwork.rating ||
        !evaluation.initiative.rating ||
        !evaluation.overall.rating
      ) {
        setError('Please provide ratings for all sections.');
        return;
      }

      // Calculate overall rating
      const ratings = [
        evaluation.technical.rating,
        evaluation.communication.rating,
        evaluation.problemSolving.rating,
        evaluation.teamwork.rating,
        evaluation.initiative.rating,
        evaluation.overall.rating,
      ].filter((r) => r > 0);
      const overallRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : 0;

      // Prepare full evaluation
      const fullEvaluation = {
        ...evaluation,
        overallRating: parseFloat(overallRating),
        companyId: 'GUC_TECH_001',
        internshipId: evaluation.internshipId,
      };

      // Update localStorage
      const allEvaluations = JSON.parse(localStorage.getItem(allEvaluationsKey) || '[]');
      const existingIndex = allEvaluations.findIndex(
        (ev) => ev.internshipId === evaluation.internshipId && ev.studentId === evaluation.studentId && ev.companyId === 'GUC_TECH_001'
      );
      if (existingIndex >= 0) {
        allEvaluations[existingIndex] = fullEvaluation;
      } else {
        allEvaluations.push(fullEvaluation);
      }
      localStorage.setItem(allEvaluationsKey, JSON.stringify(allEvaluations));
      console.log(isViewMode ? 'Updated evaluation:' : 'Saved new evaluation:', fullEvaluation);

      // Redirect to EvaluationsList
      navigate('/evaluations-list');
      console.log('Redirecting to /evaluations-list');
    } catch (err) {
      console.error('Error submitting evaluation:', err);
      setError('Failed to submit evaluation.');
    }
  };

  return (
    <>
      <CompanyNavbar />
      <style>
        {`
          .content-editable:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af; /* Light grey */
            pointer-events: none;
          }
          .content-editable:focus:before {
            content: none; /* Hide placeholder on focus */
          }
        `}
      </style>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-[#234B73] mb-6">
                {isViewMode ? 'Edit Evaluation' : 'Create Intern Evaluation'}
              </h1>
              {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Intern Information */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-[#234B73]">Intern Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#234B73]">Internship ID *</label>
                      <div
                        ref={internshipIdRef}
                        contentEditable={!isViewMode}
                        onInput={(e) => handleContentChange('internshipId', e.currentTarget.textContent)}
                        className={`mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2 ${
                          isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        data-placeholder="INT_2025_001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#234B73]">Student ID *</label>
                      <div
                        ref={studentIdRef}
                        contentEditable={!isViewMode}
                        onInput={(e) => handleContentChange('studentId', e.currentTarget.textContent)}
                        className={`mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2 ${
                          isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        data-placeholder="12345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#234B73]">Intern Name *</label>
                      <div
                        ref={internNameRef}
                        contentEditable
                        onInput={(e) => handleContentChange('internName', e.currentTarget.textContent)}
                        className="mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2"
                        data-placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#234B73]">Internship Role *</label>
                      <div
                        ref={internshipRoleRef}
                        contentEditable
                        onInput={(e) => handleContentChange('internshipRole', e.currentTarget.textContent)}
                        className="mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2"
                        data-placeholder="Software Engineering Intern"
                      />
                    </div>
                  </div>
                </div>

                {/* Evaluation Criteria */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-[#234B73]">Evaluation Criteria</h2>
                  {[
                    { section: 'technical', placeholder: 'Highly skilled in coding and debugging' },
                    { section: 'communication', placeholder: 'Communicates ideas clearly and effectively' },
                    { section: 'problemSolving', placeholder: 'Creatively solves complex problems' },
                    { section: 'teamwork', placeholder: 'Collaborates well with team members' },
                    { section: 'initiative', placeholder: 'Proactively takes on new tasks' },
                    { section: 'overall', placeholder: 'Outstanding overall performance' },
                  ].map(({ section, placeholder }) => (
                    <div key={section} className="space-y-2">
                      <div className="flex items-center gap-4">
                        <label className="block text-sm font-medium text-[#234B73]">
                          {section.charAt(0).toUpperCase() + section.slice(1)} Skills *
                        </label>
                        <select
                          value={evaluation[section].rating || ''}
                          onChange={(e) => handleChange(section, 'rating', parseInt(e.target.value) || 0)}
                          className="p-1 text-sm border rounded-md focus:ring-[#234B73] focus:border-[#234B73] w-24"
                          required
                        >
                          <option value="">Select</option>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#234B73]">Comment</label>
                        <textarea
                          value={evaluation[section].comment || ''}
                          onChange={(e) => handleChange(section, 'comment', e.target.value)}
                          placeholder={placeholder}
                          className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:ring-[#234B73] focus:border-[#234B73] placeholder-gray-400"
                          rows="3"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-[#234B73]">Recommendation</h2>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="recommendation"
                        value="Yes"
                        checked={evaluation.recommendation === 'Yes'}
                        onChange={() => handleRecommendationChange('Yes')}
                        className="h-4 w-4 text-[#234B73] focus:ring-[#234B73] border-gray-300"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="recommendation"
                        value="No"
                        checked={evaluation.recommendation === 'No'}
                        onChange={() => handleRecommendationChange('No')}
                        className="h-4 w-4 text-[#234B73] focus:ring-[#234B73] border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Date of Evaluation */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-[#234B73]">Evaluation Date</h2>
                  <div className="flex items-center gap-4">
                    <label className="block text-sm font-medium text-[#234B73]">Date of Evaluation *</label>
                    <input
                      type="date"
                      name="dateOfEvaluation"
                      value={evaluation.dateOfEvaluation}
                      onChange={handleInputChange}
                      className="mt-1 w-48 p-2 rounded-md border-gray-300 shadow-sm focus:ring-[#234B73] focus:border-[#234B73] placeholder-gray-400"
                      placeholder="2025-05-16"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/intern-evaluations')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#234B73]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#234B73] hover:bg-[#1a3a5a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#234B73]"
                  >
                    {isViewMode ? 'Update Evaluation' : 'Create Evaluation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyEvaluation;