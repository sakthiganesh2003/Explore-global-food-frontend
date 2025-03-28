'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

const BecomeMaidForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    specialties: [] as string[],
    bio: '',
    availability: [] as string[],
    aadhaarPhoto: null as File | null,
    aadhaarNumber: ''
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const cuisines = ['Indian', 'Italian', 'Chinese', 'Mexican', 'Thai', 'Japanese', 'Mediterranean', 'Other'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      if (!file.type.match('image/(jpeg|png)')) {
        alert('Please upload a JPEG or PNG image');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
      }

      setFormData(prev => ({ ...prev, aadhaarPhoto: file }));

      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleCheckboxChange = (type: 'specialties' | 'availability', value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(item => item !== value) 
        : [...prev[type], value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.aadhaarPhoto) {
      alert('Please upload your Aadhaar card photo');
      return;
    }

    if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      alert('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => formDataToSend.append(key, item));
          } else if (value instanceof File) {
            formDataToSend.append(key, value);
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      const response = await fetch('http://localhost:5000/api/formMaids', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Submission failed');

      alert('Application submitted successfully!');
      router.push('/');
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(error.message || 'Failed to submit application');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-white">Join Our Team</h1>
            <p className="mt-2 text-indigo-100">Become a professional cooking maid</p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                {/* Verification */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800">Verification</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleChange}
                      required
                      pattern="\d{12}"
                      maxLength={12}
                      placeholder="12-digit number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Photo</label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
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

              {/* Experience */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Experience</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">About You</label>
                    <textarea
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="Your cooking style, specialties, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Cuisine Specialties</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {cuisines.map(cuisine => (
                    <div key={cuisine} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`specialty-${cuisine}`}
                        checked={formData.specialties.includes(cuisine)}
                        onChange={() => handleCheckboxChange('specialties', cuisine)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`specialty-${cuisine}`} className="ml-2 text-sm text-gray-700">
                        {cuisine}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Availability</h2>
                <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
                  {days.map(day => (
                    <div key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`available-${day}`}
                        checked={formData.availability.includes(day)}
                        onChange={() => handleCheckboxChange('availability', day)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`available-${day}`} className="ml-2 text-sm text-gray-700">
                        {day.substring(0, 3)}
                      </label>
                    </div>
                  ))}
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