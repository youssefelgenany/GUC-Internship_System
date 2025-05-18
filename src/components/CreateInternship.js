import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CompanyNavbar from './CompanyNavbar';

const CreateInternship = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingInternship = location.state?.internship;

  // Initialize form with empty fields
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    duration: '',
    isPaid: false,
    salary: '',
    skills: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    startDate: '',
    endDate: '',
    applicationDeadline: '',
    applicationLink: '',
    status: 'open',
    applicants: [],
    currentInterns: [],
  });

  const [errors, setErrors] = useState({});

  // Refs for contentEditable fields to set initial content
  const titleRef = useRef(null);
  const departmentRef = useRef(null);
  const locationRef = useRef(null);
  const applicationLinkRef = useRef(null);
  const durationRef = useRef(null);
  const salaryRef = useRef(null);
  const skillsRef = useRef(null);
  const descriptionRef = useRef(null);
  const requirementsRef = useRef(null);
  const responsibilitiesRef = useRef(null);

  useEffect(() => {
    if (editingInternship) {
      // Format dates to YYYY-MM-DD for input type="date"
      const formattedInternship = {
        ...editingInternship,
        startDate: editingInternship.startDate ? new Date(editingInternship.startDate).toISOString().split('T')[0] : '',
        endDate: editingInternship.endDate ? new Date(editingInternship.endDate).toISOString().split('T')[0] : '',
        applicationDeadline: editingInternship.applicationDeadline
          ? new Date(editingInternship.applicationDeadline).toISOString().split('T')[0]
          : '',
      };

      setFormData(formattedInternship);

      // Set contentEditable fields
      if (titleRef.current) titleRef.current.textContent = formattedInternship.title || '';
      if (departmentRef.current) departmentRef.current.textContent = formattedInternship.department || '';
      if (locationRef.current) locationRef.current.textContent = formattedInternship.location || '';
      if (applicationLinkRef.current) applicationLinkRef.current.textContent = formattedInternship.applicationLink || '';
      if (durationRef.current) durationRef.current.textContent = formattedInternship.duration || '';
      if (salaryRef.current) salaryRef.current.textContent = formattedInternship.salary || '';
      if (skillsRef.current) skillsRef.current.textContent = formattedInternship.skills || '';
      if (descriptionRef.current) descriptionRef.current.textContent = formattedInternship.description || '';
      if (requirementsRef.current) requirementsRef.current.textContent = formattedInternship.requirements || '';
      if (responsibilitiesRef.current) responsibilitiesRef.current.textContent = formattedInternship.responsibilities || '';
    }
  }, [editingInternship]);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date('2025-05-15');
    today.setHours(0, 0, 0, 0);

    const startDate = formData.startDate ? new Date(formData.startDate) : null;
    const endDate = formData.endDate ? new Date(formData.endDate) : null;
    const applicationDeadline = formData.applicationDeadline ? new Date(formData.applicationDeadline) : null;

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (formData.isPaid && !formData.salary) newErrors.salary = 'Salary is required for paid internships';
    if (!formData.skills.trim()) newErrors.skills = 'Required skills are required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
    if (!formData.responsibilities.trim()) newErrors.responsibilities = 'Responsibilities are required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    else if (startDate && isNaN(startDate)) newErrors.startDate = 'Start date is invalid';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    else if (endDate && isNaN(endDate)) newErrors.endDate = 'End date is invalid';
    if (!formData.applicationDeadline) newErrors.applicationDeadline = 'Application deadline is required';
    else if (applicationDeadline && isNaN(applicationDeadline)) newErrors.applicationDeadline = 'Application deadline is invalid';
    if (!formData.applicationLink.trim()) newErrors.applicationLink = 'Application link is required';

    setErrors(newErrors);
    console.log('Validation Errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContentChange = (name, content) => {
    setFormData((prev) => ({
      ...prev,
      [name]: content,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    // Use existing ID if editing, otherwise generate a new one
    const internshipToSubmit = {
      ...formData,
      id: editingInternship ? editingInternship.id : Date.now(),
    };

    console.log('Internship submitted:', internshipToSubmit);
    navigate('/company-internships', { state: { newInternship: internshipToSubmit } });
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
                {editingInternship ? 'Edit Internship Position' : 'Create New Internship Position'}
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-[#234B73]">Basic Information</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position Title *</label>
                    <div
                      ref={titleRef}
                      contentEditable
                      onInput={(e) => handleContentChange('title', e.currentTarget.textContent)}
                      className={`mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2 ${errors.title ? 'text-red-600' : ''}`}
                      data-placeholder="Software Engineering Intern"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department *</label>
                    <div
                      ref={departmentRef}
                      contentEditable
                      onInput={(e) => handleContentChange('department', e.currentTarget.textContent)}
                      className={`mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2 ${errors.department ? 'text-red-600' : ''}`}
                      data-placeholder="Engineering"
                    />
                    {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location *</label>
                    <div
                      ref={locationRef}
                      contentEditable
                      onInput={(e) => handleContentChange('location', e.currentTarget.textContent)}
                      className={`mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2 ${errors.location ? 'text-red-600' : ''}`}
                      data-placeholder="Cairo, Egypt"
                    />
                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Link *</label>
                    <div
                      ref={applicationLinkRef}
                      contentEditable
                      onInput={(e) => handleContentChange('applicationLink', e.currentTarget.textContent)}
                      className={`mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2 ${errors.applicationLink ? 'text-red-600' : ''}`}
                      data-placeholder="https://company.com/apply"
                    />
                    {errors.applicationLink && <p className="mt-1 text-sm text-red-600">{errors.applicationLink}</p>}
                  </div>
                </div>

                {/* Duration and Compensation */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-[#234B73]">Duration and Compensation</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration (in months) *</label>
                    <div
                      ref={durationRef}
                      contentEditable
                      onInput={(e) => handleContentChange('duration', e.currentTarget.textContent)}
                      className={`mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2 ${errors.duration ? 'text-red-600' : ''}`}
                      data-placeholder="3 months"
                    />
                    {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPaid"
                      checked={formData.isPaid}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#234B73] focus:ring-[#234B73] border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">This is a paid internship</label>
                  </div>

                  {formData.isPaid && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Monthly Salary (EGP) *</label>
                      <div
                        ref={salaryRef}
                        contentEditable
                        onInput={(e) => handleContentChange('salary', e.currentTarget.textContent)}
                        className={`mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2 ${errors.salary ? 'text-red-600' : ''}`}
                        data-placeholder="e.g.5000"
                      />
                      {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
                    </div>
                  )}
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-[#234B73]">Important Dates</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={(e) => handleContentChange('startDate', e.target.value)}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] placeholder-gray-400 ${errors.startDate ? 'border-red-500' : ''}`}
                        placeholder="2025-06-01"
                      />
                      {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date *</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={(e) => handleContentChange('endDate', e.target.value)}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] placeholder-gray-400 ${errors.endDate ? 'border-red-500' : ''}`}
                        placeholder="2025-09-01"
                      />
                      {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Application Deadline *</label>
                      <input
                        type="date"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={(e) => handleContentChange('applicationDeadline', e.target.value)}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] placeholder-gray-400 ${errors.applicationDeadline ? 'border-red-500' : ''}`}
                        placeholder="2025-05-20"
                      />
                      {errors.applicationDeadline && <p className="mt-1 text-sm text-red-600">{errors.applicationDeadline}</p>}
                    </div>
                  </div>
                </div>

                {/* Requirements and Description */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-[#234B73]">Requirements and Description</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Required Skills *</label>
                    <div
                      ref={skillsRef}
                      contentEditable
                      onInput={(e) => handleContentChange('skills', e.currentTarget.textContent)}
                      className={`mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2 ${errors.skills ? 'text-red-600' : ''}`}
                      data-placeholder="JavaScript, React, Communication"
                    />
                    {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job Description *</label>
                    <div
                      ref={descriptionRef}
                      contentEditable
                      onInput={(e) => handleContentChange('description', e.currentTarget.textContent)}
                      className={`mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2 ${errors.description ? 'text-red-600' : ''}`}
                      data-placeholder="Develop web applications using modern JavaScript frameworks like React."
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Requirements *</label>
                    <div
                      ref={requirementsRef}
                      contentEditable
                      onInput={(e) => handleContentChange('requirements', e.currentTarget.textContent)}
                      className={`mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2 ${errors.requirements ? 'text-red-600' : ''}`}
                      data-placeholder="GPA above 3.0, 3rd or 4th year student"
                    />
                    {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Responsibilities *</label>
                    <div
                      ref={responsibilitiesRef}
                      contentEditable
                      onInput={(e) => handleContentChange('responsibilities', e.currentTarget.textContent)}
                      className={`mt-1 block w-full text-gray-900 content-editable focus:outline-none focus:ring-2 focus:ring-[#234B73] p-2 ${errors.responsibilities ? 'text-red-600' : ''}`}
                      data-placeholder="Develop features, write tests, participate in code reviews"
                    />
                    {errors.responsibilities && <p className="mt-1 text-sm text-red-600">{errors.responsibilities}</p>}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/company-internships')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#234B73]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#234B73] hover:bg-[#1a3a5a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#234B73]"
                  >
                    {editingInternship ? 'Update Internship' : 'Create Internship'}
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

export default CreateInternship;