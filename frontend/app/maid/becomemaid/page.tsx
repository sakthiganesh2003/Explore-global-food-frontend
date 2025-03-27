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

  const cuisines = [
    'Indian', 'Italian', 'Chinese', 'Mexican', 
    'Thai', 'Japanese', 'Mediterranean', 'Other'
  ];

  const days = [
    'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type (JPEG/PNG)
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        alert('Please upload a JPEG or PNG image');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
      }

      setFormData(prev => ({ ...prev, aadhaarPhoto: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCheckboxChange = (type: 'specialties' | 'availability', value: string) => {
    setFormData(prev => {
      const currentValues = [...prev[type]];
      if (currentValues.includes(value)) {
        return { ...prev, [type]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [type]: [...currentValues, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.aadhaarPhoto) {
      alert('Please upload your Aadhaar card photo');
      return;
    }

    if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
      alert('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setIsUploading(true);

    try {
      // First upload the Aadhaar photo
      const formDataToSend = new FormData();
      formDataToSend.append('aadhaarPhoto', formData.aadhaarPhoto);
      formDataToSend.append('aadhaarNumber', formData.aadhaarNumber);
      
      // Append other form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'aadhaarPhoto' && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => formDataToSend.append(key, item));
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      const response = await fetch('/api/maids', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        router.push('/dashboard');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a Maid</h1>
          <p className="mt-2 text-gray-600">
            Fill out this form to join our team of professional cooking maids
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
              />
            </div>

            <div>
              <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700">
                Aadhaar Number
              </label>
              <input
                type="text"
                id="aadhaarNumber"
                name="aadhaarNumber"
                pattern="\d{12}"
                maxLength={12}
                required
                value={formData.aadhaarNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                placeholder="12-digit Aadhaar number"
              />
            </div>
          </div>

          {/* Aadhaar Card Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aadhaar Card Photo (Front Side)
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Choose File
              </button>
              <span className="ml-3 text-sm text-gray-500">
                {formData.aadhaarPhoto ? formData.aadhaarPhoto.name : 'No file chosen'}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Upload a clear photo of your Aadhaar card (JPEG/PNG, max 2MB)
            </p>
            
            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img 
                  src={previewUrl} 
                  alt="Aadhaar preview" 
                  className="h-40 border rounded-md object-contain"
                />
              </div>
            )}
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Years of Professional Cooking Experience
            </label>
            <select
              id="experience"
              name="experience"
              required
              value={formData.experience}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            >
              <option value="">Select experience level</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>

          {/* Cuisine Specialties */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Specialties (Select all that apply)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {cuisines.map(cuisine => (
                <div key={cuisine} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`specialty-${cuisine}`}
                    checked={formData.specialties.includes(cuisine)}
                    onChange={() => handleCheckboxChange('specialties', cuisine)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability (Select available days)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {days.map(day => (
                <div key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`available-${day}`}
                    checked={formData.availability.includes(day)}
                    onChange={() => handleCheckboxChange('availability', day)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor={`available-${day}`} className="ml-2 text-sm text-gray-700">
                    {day}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              About You (Experience, Cooking Style, etc.)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              required
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeMaidForm;