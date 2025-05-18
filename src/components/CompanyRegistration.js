import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomStepper = ({ active, steps, onStepClick }) => {
  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        position: 'relative',
        marginBottom: '20px'
      }}>
        {/* Progress bar */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '0',
          right: '0',
          height: '2px',
          backgroundColor: '#E5E7EB',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '0',
          height: '2px',
          backgroundColor: '#234B73',
          zIndex: 1,
          transition: 'width 0.3s ease',
          width: `${(active / (steps.length - 1)) * 100}%`
        }} />

        {/* Steps */}
        {steps.map((step, index) => (
          <div
            key={index}
            onClick={() => onStepClick(index)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
              cursor: index <= active ? 'pointer' : 'default'
            }}
          >
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: index <= active ? '#234B73' : '#E5E7EB',
              color: index <= active ? '#FFFFFF' : '#8C8C8C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              {index + 1}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: index <= active ? '#234B73' : '#8C8C8C',
              textAlign: 'center'
            }}>
              {step.label}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#8C8C8C',
              textAlign: 'center',
              marginTop: '4px'
            }}>
              {step.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase
    if (/[a-z]/.test(password)) strength += 1; // Lowercase
    if (/[0-9]/.test(password)) strength += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special characters
    
    return Math.min(strength, 5); // Max strength is 5
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0: return { text: 'Very Weak', color: '#DC2626' };
      case 1: return { text: 'Weak', color: '#EF4444' };
      case 2: return { text: 'Fair', color: '#F59E0B' };
      case 3: return { text: 'Good', color: '#10B981' };
      case 4: return { text: 'Strong', color: '#059669' };
      case 5: return { text: 'Very Strong', color: '#047857' };
      default: return { text: '', color: '#DC2626' };
    }
  };

  const strength = calculateStrength(password);
  const { text, color } = getStrengthText(strength);

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ 
        display: 'flex', 
        gap: '4px',
        marginBottom: '4px'
      }}>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: '4px',
              backgroundColor: index < strength ? color : '#E5E7EB',
              borderRadius: '2px',
              transition: 'background-color 0.3s ease'
            }}
          />
        ))}
      </div>
      {password && (
        <p style={{ 
          fontSize: '12px', 
          color: color,
          margin: 0,
          transition: 'color 0.3s ease'
        }}>
          Password Strength: {text}
        </p>
      )}
    </div>
  );
};

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    industry: '',
    customIndustry: '',
    location: '',
    companySize: '',
    companyOverview: '',
    logo: null,
    documents: [],
  });
  const [error, setError] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [documentPreviews, setDocumentPreviews] = useState([]);

  const companySizeOptions = [
    { value: 'small', label: 'Small (50 employees or less)' },
    { value: 'medium', label: 'Medium (51-100 employees)' },
    { value: 'large', label: 'Large (101-500 employees)' },
    { value: 'corporate', label: 'Corporate (more than 500 employees)' }
  ];

  const steps = [
    {
      label: 'Company Details',
      description: 'Basic information'
    },
    {
      label: 'Documents',
      description: 'Upload verification'
    },
    {
      label: 'Confirmation',
      description: 'Wait for approval'
    }
  ];

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Retail',
    'Media & Entertainment',
    'Real Estate',
    'Transportation',
    'Energy',
    'Agriculture',
    'Construction',
    'Hospitality',
    'Telecommunications',
    'Other'
  ];

  // Add a list of already registered emails for demonstration
  const registeredEmails = [
    'hr@company.com',
    'syn@gmail.com',
    // Add more as needed
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Logo file size should be less than 5MB');
        return;
      }
      setFormData(prevState => ({
        ...prevState,
        logo: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prevState => ({
      ...prevState,
      documents: [...prevState.documents, ...files]
    }));

    // Create previews for new documents
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentPreviews(prev => [...prev, { name: file.name, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const validateStep1 = () => {
    console.log('Validating step 1:', {
      companyName: formData.companyName,
      email: formData.email,
      industry: formData.industry,
      companySize: formData.companySize,
      logo: formData.logo,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    });

    if (!formData.companyName || !formData.email || !formData.industry || !formData.companySize || !formData.logo || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      console.log('Validation failed: Missing required fields');
      return false;
    }

    // Validate password
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      console.log('Validation failed: Password too short');
      return false;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      console.log('Validation failed: Passwords do not match');
      return false;
    }

    // Check if email is already registered
    if (registeredEmails.includes(formData.email.toLowerCase())) {
      setError(<span><span style={{ color: '#F08F36', fontWeight: 500 }}>Already registered?</span> <a href="/login" style={{ color: '#234B73', textDecoration: 'underline', fontWeight: 500 }}>Login Instead</a></span>);
      return false;
    }

    console.log('Validation passed');
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (formData.documents.length === 0) {
      setError('Please upload at least one document');
      return false;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (active === 0 && !validateStep1()) return;
    if (active === 1 && !validateStep2()) return;
    setActive((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Check if email is already registered
    if (registeredEmails.includes(formData.email.toLowerCase())) {
      setError(<span><span style={{ color: '#F08F36', fontWeight: 500 }}>Already registered?</span> <a href="/login" style={{ color: '#234B73', textDecoration: 'underline', fontWeight: 500 }}>Login Instead</a></span>);
      return;
    }
    
    // Use customIndustry if "Other" is selected
    const finalIndustry = formData.industry === 'Other' ? formData.customIndustry : formData.industry;
    
    try {
      // ... rest of the submit logic ...
      const companyData = {
        ...formData,
        industry: finalIndustry
      };
      // ... rest of the code ...
    } catch (error) {
      setError(error.message);
    }
  };

  const renderStepContent = () => {
    switch (active) {
      case 0:
        return (
          <div>
            

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#234B73'
              }}>
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px',
                  border: '1px solid #C0CEDB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                placeholder="Enter company name"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#234B73'
              }}>
                Official Company Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px',
                  border: '1px solid #C0CEDB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                placeholder="Enter official company email"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#234B73'
              }}>
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px',
                  border: '1px solid #C0CEDB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                placeholder="Create a password (min. 8 characters)"
              />
              <PasswordStrengthIndicator password={formData.password} />
              <p style={{ 
                fontSize: '12px', 
                color: '#8C8C8C',
                marginTop: '4px'
              }}>
                Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#234B73'
              }}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px',
                  border: '1px solid #C0CEDB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                placeholder="Confirm your password"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#234B73'
              }}>
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    industry: e.target.value,
                    customIndustry: e.target.value === 'Other' ? prev.customIndustry : ''
                  }));
                }}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px',
                  border: '1px solid #C0CEDB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select Industry</option>
                {industries.map((industry, index) => (
                  <option key={index} value={industry}>{industry}</option>
                ))}
              </select>
              {formData.industry === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify your industry"
                  value={formData.customIndustry}
                  onChange={(e) => setFormData(prev => ({ ...prev, customIndustry: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px',
                    border: '1px solid #C0CEDB',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    marginTop: '10px'
                  }}
                  required
                />
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#234B73'
              }}>
                Company Size *
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px',
                  border: '1px solid #C0CEDB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select company size</option>
                {companySizeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#234B73'
              }}>
                Company Logo *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <label htmlFor="company-logo-upload" style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  background: '#234B73',
                  color: '#fff',
                  borderRadius: '24px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  boxShadow: '0 2px 8px rgba(35,75,115,0.08)',
                  border: 'none',
                  transition: 'background 0.2s',
                }}
                  >Choose File</label>
                <input
                  id="company-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: 'none' }}
                />
                {logoPreview && (
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '4px solid #234B73',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#F9FAFB',
                      boxShadow: '0 2px 8px rgba(35,75,115,0.08)'
                    }}>
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            {error && (
              <div style={{ 
                backgroundColor: '#FEE2E2', 
                color: '#DC2626', 
                padding: '10px 15px', 
                borderRadius: '4px', 
                marginBottom: '15px',
                fontSize: '14px' 
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#234B73'
              }}>
                Upload Company Documents *
              </label>
              <div style={{
                border: '2px dashed #C0CEDB',
                borderRadius: '4px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleDocumentChange}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <div>
                  <div style={{ 
                    fontSize: '40px', 
                    color: '#C0CEDB',
                    marginBottom: '10px'
                  }}>
                    +
                  </div>
                  <p style={{ color: '#8C8C8C', fontSize: '14px' }}>
                    Click to upload company documents
                  </p>
                  <p style={{ color: '#8C8C8C', fontSize: '12px', marginTop: '5px' }}>
                    Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                  </p>
                </div>
              </div>
            </div>

            {documentPreviews.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '500',
                  color: '#234B73',
                  marginBottom: '10px'
                }}>
                  Uploaded Documents
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '15px'
                }}>
                  {documentPreviews.map((doc, index) => (
                    <div key={index} style={{
                      border: '1px solid #C0CEDB',
                      borderRadius: '4px',
                      padding: '10px',
                      textAlign: 'center'
                    }}>
                      <img 
                        src={doc.preview} 
                        alt={doc.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '150px',
                          marginBottom: '5px'
                        }}
                      />
                      <p style={{ 
                        fontSize: '12px',
                        color: '#8C8C8C',
                        wordBreak: 'break-all'
                      }}>
                        {doc.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ 
              fontSize: '40px', 
              color: '#22C55E',
              marginBottom: '20px'
            }}>
              ✓
            </div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '500',
              color: '#22C55E',
              marginBottom: '10px'
            }}>
              Registration Successful!
            </h3>
            <p style={{ 
              color: '#8C8C8C', 
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              Your company has been registered successfully. Please wait for SCAD's email approval.
            </p>
            <button 
              onClick={() => navigate('/login')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#234B73',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1a3a5a'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#234B73'}
            >
              Go to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            textAlign: 'center', 
            color: '#234B73', 
            marginBottom: '5px',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            SCAD Company Registration
          </h2>
          <p style={{ 
            color: '#8C8C8C', 
            fontSize: '14px', 
            textAlign: 'center', 
            marginBottom: '30px' 
          }}>
            Register your company on the SCAD system
          </p>

          <CustomStepper 
            active={active} 
            steps={steps} 
            onStepClick={(index) => {
              if (index <= active) {
                setActive(index);
              }
            }} 
          />

          {renderStepContent()}

          {active < 2 && (
            <>
              {error && (
                <div style={{ 
                  backgroundColor: '#FEE2E2', 
                  color: '#DC2626', 
                  padding: '10px 15px', 
                  borderRadius: '4px', 
                  marginBottom: '15px',
                  fontSize: '14px',
                  textAlign: 'center',
                  marginTop: '10px'
                }}>
                  {error}
                </div>
              )}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '10px',
                marginTop: '30px'
              }}>
                {active > 0 && (
                  <button 
                    onClick={prevStep}
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#234B73',
                      border: '1px solid #C0CEDB',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Back
                  </button>
                )}
                <button 
                  onClick={nextStep}
                  style={{
                    backgroundColor: '#234B73',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {active === 1 ? 'Submit Registration' : 'Next step'}
                </button>
              </div>
            </>
          )}

          {active === 2 && (
            <div style={{ 
              borderTop: '1px solid #EEE', 
              paddingTop: '15px', 
              textAlign: 'center',
              marginTop: '20px'
            }}>
              <p style={{ color: '#8C8C8C', fontSize: '14px' }}>
                Already have an account?{' '}
                <a 
                  href="/login" 
                  style={{ 
                    color: '#F08F36', 
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#d97b22'}
                  onMouseOut={(e) => e.target.style.color = '#F08F36'}
                >
                  Sign in
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
