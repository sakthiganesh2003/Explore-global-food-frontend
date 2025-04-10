'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';

interface DecodedToken {
  id: string;
  role?: string;
  exp?: number;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  specialties: string[];
  bio: string;
  aadhaarPhoto: File | null;
  aadhaarNumber: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  accountHolderName: string;
}

const BecomeMaidForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    specialties: [],
    bio: '',
    aadhaarPhoto: null,
    aadhaarNumber: '',
    bankAccountNumber: '',
    bankName: '',
    ifscCode: '',
    accountHolderName: ''
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const cuisines = ['Indian', 'Italian', 'Chinese', 'Mexican', 'Thai', 'Japanese', 'Mediterranean', 'Other'];

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to access this page');
      router.push('/login');
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (!decoded.id) {
        throw new Error('Invalid token');
      }
      setIsLoggedIn(true);
    } catch (error) {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    
    if (!file.type.match('image/(jpeg|png)')) {
      toast.error('Please upload a JPEG or PNG image');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size should be less than 2MB');
      return;
    }

    setFormData(prev => ({ ...prev, aadhaarPhoto: file }));
    
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.aadhaarPhoto;
      return newErrors;
    });

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCheckboxChange = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(cuisine)
        ? prev.specialties.filter(item => item !== cuisine)
        : [...prev.specialties, cuisine]
    }));
    
    if (validationErrors.specialties) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.specialties;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.experience) errors.experience = 'Experience level is required';
    if (formData.specialties.length === 0) errors.specialties = 'Please select at least one specialty';
    if (!formData.bio.trim()) errors.bio = 'Bio is required';
    if (!formData.aadhaarPhoto) errors.aadhaarPhoto = 'Aadhaar photo is required';
    if (!formData.aadhaarNumber.trim()) errors.aadhaarNumber = 'Aadhaar number is required';
    if (!formData.accountHolderName.trim()) errors.accountHolderName = 'Account holder name is required';
    if (!formData.bankName.trim()) errors.bankName = 'Bank name is required';
    if (!formData.bankAccountNumber.trim()) errors.bankAccountNumber = 'Account number is required';
    if (!formData.ifscCode.trim()) errors.ifscCode = 'IFSC code is required';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!/^\d{10}$/.test(formData.phone)) errors.phone = 'Phone must be 10 digits';
    if (!/^\d{12}$/.test(formData.aadhaarNumber)) errors.aadhaarNumber = 'Aadhaar must be 12 digits';
    if (!/^\d{9,18}$/.test(formData.bankAccountNumber)) errors.bankAccountNumber = 'Invalid account number';
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) errors.ifscCode = 'Invalid IFSC format';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all form errors');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication required');
      router.push('/login');
      return;
    }

    setIsUploading(true);

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (!decoded.id) {
        throw new Error('Invalid token');
      }

      // Prepare FormData for multipart/form-data request
      const formDataToSend = new FormData();
      formDataToSend.append('userId', decoded.id);
      formDataToSend.append('fullName', formData.fullName.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('phone', formData.phone.trim());
      formDataToSend.append('experience', `${formData.experience} years`);
      formDataToSend.append('specialties', JSON.stringify(formData.specialties)); // Send as JSON string
      formDataToSend.append('bio', formData.bio.trim());
      if (formData.aadhaarPhoto) {
        formDataToSend.append('aadhaarPhoto', formData.aadhaarPhoto); // File upload
      }
      formDataToSend.append('aadhaarNumber', formData.aadhaarNumber.trim());
      formDataToSend.append('bankDetails[accountNumber]', formData.bankAccountNumber.trim());
      formDataToSend.append('bankDetails[bankName]', formData.bankName.trim());
      formDataToSend.append('bankDetails[ifscCode]', formData.ifscCode.trim());
      formDataToSend.append('bankDetails[accountHolderName]', formData.accountHolderName.trim());

      // Submit to backend
      const response = await fetch('http://localhost:5000/api/formMaids', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // No Content-Type header; FormData sets it automatically
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      const result = await response.json();
      toast.success('Application submitted successfully!');
      router.push('./');
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setIsUploading(false);
    }
  };

  const renderError = (fieldName: string) => {
    return validationErrors[fieldName] ? (
      <p className="mt-1 text-sm text-red-600">{validationErrors[fieldName]}</p>
    ) : null;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-white">Join Our Team</h1>
            <p className="mt-2 text-indigo-100">Become a professional cooking maid</p>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        validationErrors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {renderError('fullName')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        validationErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {renderError('email')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {renderError('phone')}
                  </div>
                </div>

                {/* Verification Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800">Verification</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        validationErrors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {renderError('aadhaarNumber')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar Photo <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className={`px-4 py-2 rounded-lg hover:bg-indigo-200 transition ${
                          validationErrors.aadhaarPhoto 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        Choose File
                      </button>
                      <span className="ml-3 text-sm text-gray-600">
                        {formData.aadhaarPhoto?.name || 'No file chosen'}
                      </span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png"
                        className="hidden"
                      />
                    </div>
                    {renderError('aadhaarPhoto')}
                    {previewUrl && (
                      <div className="mt-2">
                        <img 
                          src={previewUrl} 
                          alt="Aadhaar preview" 
                          className="h-32 border rounded-lg object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Experience Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Experience</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        validationErrors.experience ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                    {renderError('experience')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      About You <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        validationErrors.bio ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your cooking style, specialties, etc."
                    />
                    {renderError('bio')}
                  </div>
                </div>
              </div>

              {/* Specialties Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Cuisine Specialties <span className="text-red-500">*</span>
                </h2>
                {renderError('specialties')}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {cuisines.map(cuisine => (
                    <div key={cuisine} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`specialty-${cuisine}`}
                        checked={formData.specialties.includes(cuisine)}
                        onChange={() => handleCheckboxChange(cuisine)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`specialty-${cuisine}`} className="ml-2 text-sm text-gray-700">
                        {cuisine}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Bank Account Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                      validationErrors.accountHolderName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {renderError('accountHolderName')}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        validationErrors.bankName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {renderError('bankName')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        validationErrors.bankAccountNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {renderError('bankAccountNumber')}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                      validationErrors.ifscCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ABCD0123456"
                  />
                  {renderError('ifscCode')}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition"
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeMaidForm;
