'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { jwtDecode } from 'jwt-decode';
import { FiEdit, FiSave, FiX, FiUser, FiTarget } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define interfaces
interface SeoProject {
  projectName: string;
  targetKeywords: string[];
  status: 'Planning' | 'Active' | 'Completed';
}

interface Profile {
  _id: string;
  userId: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  learningGoals: string;
  preferredLearningStyle: 'Visual' | 'Auditory' | 'Kinesthetic' | 'Reading/Writing';
  countryId: string;
  stateId: string;
  seoProjects: SeoProject[];
  preferredAITools: string[];
  contentOptimizationPrefs: 'Blog Posts' | 'Infographics' | 'Social Media' | 'Featured Images';
}

interface DecodedToken {
  id: string;
  name: string;
  role: string;
  phone: string | null;
  email: string;
  iat: number;
  exp: number;
}

interface Country {
  _id: string;
  name: string;
}

interface State {
  _id: string;
  name: string;
  countryId: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [formData, setFormData] = useState<Omit<Profile, '_id' | 'userId'>>({
    fullName: '',
    bio: '',
    avatarUrl: '',
    learningGoals: '',
    preferredLearningStyle: 'Visual',
    countryId: '',
    stateId: '',
    seoProjects: [{ projectName: '', targetKeywords: [], status: 'Planning' }],
    preferredAITools: [],
    contentOptimizationPrefs: 'Blog Posts',
  });
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [profileExists, setProfileExists] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [showAddStateForm, setShowAddStateForm] = useState(false);
  const [newStateName, setNewStateName] = useState('');
  const [hasShownToast, setHasShownToast] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const API_PREFIX = 'api/predefine';
console.log(`${API_URL}/${API_PREFIX}/countries`)
  // Show current date and time as a toast message only once
  useEffect(() => {
    if (!hasShownToast) {
      toast.info("Today's date and time is 01:22 PM IST on Wednesday, May 14, 2025");
      setHasShownToast(true);
    }
  }, [hasShownToast]);

  // Decode JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(decoded.id);
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Token decoding error:', err);
        toast.error('Failed to decode token. Please log in again.');
        router.push('/login/signin');
      }
    } else {
      toast.error('No token found. Please log in.');
      router.push('/login/signin');
    }
  }, [router]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const res = await fetch(`${API_URL}/${API_PREFIX}/countries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Countries endpoint not found. Please check if the backend server is running.');
          }
          throw new Error('Failed to fetch countries');
        }
        const data = await res.json();
        setCountries(data || []);
      } catch (err) {
        console.error('Countries fetch error:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        toast.error(errorMessage || 'Failed to load countries. Please try again.');
        setCountries([]);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!formData.countryId) {
        setStates([]);
        setFormData((prev) => ({ ...prev, stateId: '' }));
        return;
      }

      setIsLoadingStates(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/${API_PREFIX}/states/${formData.countryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('States endpoint not found. Please check if the backend server is running.');
          }
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch states');
        }
        const data = await res.json();
        setStates(data.states || []);
        if (formData.stateId && !data.states.some((s: State) => s._id === formData.stateId)) {
          setFormData((prev) => ({ ...prev, stateId: '' }));
        }
      } catch (err) {
        console.error('States fetch error:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        toast.error(errorMessage || 'Failed to load states. Please try again.');
        setStates([]);
      } finally {
        setIsLoadingStates(false);
      }
    };
    fetchStates();
  }, [formData.countryId]);

  // Check if profile exists
  useEffect(() => {
    if (!userId) return;

    const checkProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/user/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setProfileExists(true);
          setFormData({
            fullName: data.profile.fullName,
            bio: data.profile.bio,
            avatarUrl: data.profile.avatarUrl,
            learningGoals: data.profile.learningGoals,
            preferredLearningStyle: data.profile.preferredLearningStyle,
            countryId: data.profile.countryId,
            stateId: data.profile.stateId,
            seoProjects: data.profile.seoProjects || [{ projectName: '', targetKeywords: [], status: 'Planning' }],
            preferredAITools: data.profile.preferredAITools || [],
            contentOptimizationPrefs: data.profile.contentOptimizationPrefs || 'Blog Posts',
          });
        } else if (res.status === 404) {
          setProfileExists(false);
          setFormData((prev) => ({ ...prev, countryId: '' }));
        } else {
          throw new Error('Failed to check profile');
        }
      } catch (err) {
        console.error('Profile check error:', err);
        toast.error('Failed to check profile existence. Please try again.');
      }
    };
    checkProfile();
  }, [userId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'countryId' ? { stateId: '' } : {}),
    }));
  };

  // Handle SEO project changes
  const handleSeoProjectChange = (index: number, field: string, value: any) => {
    const updatedProjects = [...formData.seoProjects];
    if (field === 'targetKeywords') {
      updatedProjects[index][field] = value.split(',').map((kw: string) => kw.trim()).filter((kw: string) => kw);
    } else {
      updatedProjects[index][field as keyof SeoProject] = value;
    }
    setFormData({ ...formData, seoProjects: updatedProjects });
  };

  // Add a new SEO project
  const addSeoProject = () => {
    setFormData({
      ...formData,
      seoProjects: [...formData.seoProjects, { projectName: '', targetKeywords: [], status: 'Planning' }],
    });
  };

  // Remove an SEO project
  const removeSeoProject = (index: number) => {
    if (formData.seoProjects.length === 1) {
      toast.error('At least one SEO project is required.');
      return;
    }
    const updatedProjects = formData.seoProjects.filter((_, i) => i !== index);
    setFormData({ ...formData, seoProjects: updatedProjects });
  };

  // Handle avatar file selection with validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPEG, PNG, or GIF).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB.');
        return;
      }
      setAvatarFile(file);
      setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    }
  };

  // Handle adding a new state (for admin users)
  const handleAddState = async () => {
    if (!newStateName) {
      toast.error('Please enter a state name.');
      return;
    }
    if (!formData.countryId) {
      toast.error('Please select a country first.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${API_PREFIX}/states`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newStateName,
          countryId: formData.countryId,
          order: states.length + 1,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add state');
      }
      const data = await res.json();
      setStates([...states, data]);
      setFormData((prev) => ({ ...prev, stateId: data._id }));
      setNewStateName('');
      setShowAddStateForm(false);
      toast.success('State added successfully!');
    } catch (err) {
      console.error('Add state error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage || 'Failed to add state. Please try again.');
    }
  };

  // Handle AI tools checkbox
  const handleAIToolChange = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredAITools: prev.preferredAITools.includes(tool)
        ? prev.preferredAITools.filter((t) => t !== tool)
        : [...prev.preferredAITools, tool],
    }));
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Full name is required.');
      return false;
    }
    if (!formData.countryId || !formData.stateId) {
      toast.error('Please select both a country and a state.');
      return false;
    }
    if (formData.seoProjects.length === 0) {
      toast.error('At least one SEO project is required.');
      return false;
    }
    for (const project of formData.seoProjects) {
      if (!project.projectName.trim()) {
        toast.error('SEO project name is required.');
        return false;
      }
      if (project.targetKeywords.length === 0) {
        toast.error('At least one target keyword is required for each SEO project.');
        return false;
      }
    }
    if (!avatarFile && !formData.avatarUrl) {
      toast.error('An avatar image or URL is required.');
      return false;
    }
    return true;
  };

  // Handle profile creation
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error('User ID not available. Please log in.');
      return;
    }
    if (!validateForm()) return;

    const form = new FormData();
    form.append('userId', userId);
    form.append('fullName', formData.fullName);
    form.append('bio', formData.bio);
    form.append('learningGoals', formData.learningGoals);
    form.append('preferredLearningStyle', formData.preferredLearningStyle);
    form.append('countryId', formData.countryId);
    form.append('stateId', formData.stateId);
    form.append('seoProjects', JSON.stringify(formData.seoProjects));
    form.append('preferredAITools', JSON.stringify(formData.preferredAITools));
    form.append('contentOptimizationPrefs', formData.contentOptimizationPrefs);
    if (avatarFile) {
      form.append('avatar', avatarFile);
    } else {
      form.append('avatarUrl', formData.avatarUrl);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create profile');
      }
      const data = await res.json();
      setIsProfileCreated(true);
      setProfileExists(true);
      setProfile(data.profile);
      setFormData({
        fullName: data.profile.fullName,
        bio: data.profile.bio,
        avatarUrl: data.profile.avatarUrl,
        learningGoals: data.profile.learningGoals,
        preferredLearningStyle: data.profile.preferredLearningStyle,
        countryId: data.profile.countryId,
        stateId: data.profile.stateId,
        seoProjects: data.profile.seoProjects,
        preferredAITools: data.profile.preferredAITools,
        contentOptimizationPrefs: data.profile.contentOptimizationPrefs,
      });
      toast.success('Profile created successfully!');
    } catch (err) {
      console.error('Profile creation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage || 'Failed to create profile. Please try again.');
    }
  };

  // Handle profile update
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error('User ID not available. Please log in.');
      return;
    }
    if (!validateForm()) return;

    const form = new FormData();
    form.append('fullName', formData.fullName);
    form.append('bio', formData.bio);
    form.append('learningGoals', formData.learningGoals);
    form.append('preferredLearningStyle', formData.preferredLearningStyle);
    form.append('countryId', formData.countryId);
    form.append('stateId', formData.stateId);
    form.append('seoProjects', JSON.stringify(formData.seoProjects));
    form.append('preferredAITools', JSON.stringify(formData.preferredAITools));
    form.append('contentOptimizationPrefs', formData.contentOptimizationPrefs);
    if (avatarFile) {
      form.append('avatar', avatarFile);
    } else {
      form.append('avatarUrl', formData.avatarUrl);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      const data = await res.json();
      setIsEditing(false);
      setProfile(data.profile);
      setFormData({
        fullName: data.profile.fullName,
        bio: data.profile.bio,
        avatarUrl: data.profile.avatarUrl,
        learningGoals: data.profile.learningGoals,
        preferredLearningStyle: data.profile.preferredLearningStyle,
        countryId: data.profile.countryId,
        stateId: data.profile.stateId,
        seoProjects: data.profile.seoProjects,
        preferredAITools: data.profile.preferredAITools,
        contentOptimizationPrefs: data.profile.contentOptimizationPrefs,
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage || 'Failed to update profile. Please try again.');
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (profileExists === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <p>Checking profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Head>
        <title>Profile - AI Powered SEO Tools</title>
        <meta name="description" content="Manage your personal profile and SEO preferences." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center py-6 gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 overflow-hidden border-4 border-white shadow-md">
                {profile?.avatarUrl && profile.avatarUrl.startsWith('https://res.cloudinary.com') ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.fullName || 'User avatar'}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    onError={() => console.error('Failed to load avatar image')}
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-blue-600">
                    <FiUser />
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-md">
                  <label className="bg-blue-600 text-white p-1 rounded-full cursor-pointer">
                    <FiEdit size={16} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{profile?.fullName || 'Your Profile'}</h1>
                {profileExists && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                  >
                    <FiEdit size={14} /> Edit
                  </button>
                )}
              </div>
              {profile?.bio && <p className="text-gray-600 mt-1 max-w-2xl">{profile.bio}</p>}
              <div className="flex flex-wrap gap-4 mt-3">
              
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Available Countries and States Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Available Countries and States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Countries</h3>
              {countries.length > 0 ? (
                <ul className="list-disc list-inside text-gray-800">
                  {countries.map((country) => (
                    <li key={country._id}>{country.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No countries available. Please contact support.</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">States for Selected Country</h3>
              {formData.countryId ? (
                isLoadingStates ? (
                  <p className="text-gray-500">Loading states...</p>
                ) : states.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-800">
                    {states.map((state) => (
                      <li key={state._id}>{state.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    No states available for {countries.find((c) => c._id === formData.countryId)?.name || 'selected country'}.
                    {userRole === 'admin' && (
                      <button
                        onClick={() => setShowAddStateForm(true)}
                        className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                      >
                        Add a new state
                      </button>
                    )}
                  </p>
                )
              ) : (
                <p className="text-gray-500">Select a country to view available states.</p>
              )}
              {showAddStateForm && userRole === 'admin' && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Add New State</h4>
                  <input
                    type="text"
                    value={newStateName}
                    onChange={(e) => setNewStateName(e.target.value)}
                    placeholder="State Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddState}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add State
                    </button>
                    <button
                      onClick={() => setShowAddStateForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Creation Form */}
        {profileExists === false && !isProfileCreated && (
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Complete Your Profile</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar*</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleInputChange}
                    placeholder="Or paste an avatar URL"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={!!avatarFile}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Learning Goals</label>
                <textarea
                  name="learningGoals"
                  value={formData.learningGoals}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                  <select
                    name="countryId"
                    value={formData.countryId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country._id} value={country._id}>{country.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                <select
                  name="stateId"
                  value={formData.stateId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!formData.countryId || isLoadingStates}
                >
                  <option value="">
                    {isLoadingStates
                      ? 'Loading states...'
                      : formData.countryId
                      ? 'Select state'
                      : 'Select country first'}
                  </option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>{state.name}</option>
                  ))}
                </select>
                {formData.countryId && states.length === 0 && !isLoadingStates && (
                  <p className="text-sm text-red-500 mt-1">
                    No states available for this country.
                    {userRole === 'admin' ? (
                      <button
                        onClick={() => setShowAddStateForm(true)}
                        className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                      >
                        Add a new state
                      </button>
                    ) : (
                      ' Please contact support.'
                    )}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Projects*</label>
                {formData.seoProjects.map((project, index) => (
                  <div key={index} className="space-y-2 mb-4 p-4 bg-gray-50 rounded-lg relative">
                    <button
                      type="button"
                      onClick={() => removeSeoProject(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <FiX size={16} />
                    </button>
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={project.projectName}
                      onChange={(e) => handleSeoProjectChange(index, 'projectName', e.target.value)}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Target Keywords (comma-separated)"
                      value={project.targetKeywords.join(', ')}
                      onChange={(e) => handleSeoProjectChange(index, 'targetKeywords', e.target.value)}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                      value={project.status}
                      onChange={(e) => handleSeoProjectChange(index, 'status', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Planning">Planning</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSeoProject}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Add SEO Project
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred AI Tools</label>
                <div className="space-y-2">
                  {['Content Generator', 'Competitor Analyzer', 'Backlink Builder', 'Content Optimizer', 'Infographic Creator'].map((tool) => (
                    <label key={tool} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.preferredAITools.includes(tool)}
                        onChange={() => handleAIToolChange(tool)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Optimization Preferences</label>
                <select
                  name="contentOptimizationPrefs"
                  value={formData.contentOptimizationPrefs}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Blog Posts">Blog Posts</option>
                  <option value="Infographics">Backlink Builder</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Featured Images">Featured Images</option>
                </select>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoadingStates || !formData.countryId || !formData.stateId}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Profile Display */}
        {(profileExists || isProfileCreated) && profile && !isEditing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiUser className="text-blue-500" /> About
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                    <p className="mt-1 text-gray-800">{profile.bio || 'No bio added yet'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Learning Goals</h3>
                    <p className="mt-1 text-gray-800">{profile.learningGoals || 'No learning goals specified'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiTarget className="text-blue-500" /> Learning Preferences
                </h2>
                <div className="space-y-4">
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Preferred AI Tools</h3>
                    <p className="mt-1 text-gray-800">
                      {profile.preferredAITools.length > 0 ? profile.preferredAITools.join(', ') : 'None selected'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Content Optimization Preferences</h3>
                    <p className="mt-1 text-gray-800">{profile.contentOptimizationPrefs || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiTarget className="text-blue-500" /> SEO Projects
                </h2>
                <div className="space-y-4">
                  {profile.seoProjects.length > 0 ? (
                    profile.seoProjects.map((project, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium">{project.projectName}</h3>
                        <p className="text-sm text-gray-600">Keywords: {project.targetKeywords.join(', ')}</p>
                        <p className="text-sm text-gray-600">Status: {project.status}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No SEO projects added</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiUser className="text-blue-500" /> Details
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1 text-gray-800">
                      {countries.find((c) => c._id === profile.countryId)?.name || 'Unknown'},
                      {states.find((s) => s._id === profile.stateId)?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Form */}
        {(profileExists || isProfileCreated) && profile && isEditing && (
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar*</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleInputChange}
                    placeholder="Or paste an avatar URL"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={!!avatarFile}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Learning Goals</label>
                <textarea
                  name="learningGoals"
                  value={formData.learningGoals}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                  <select
                    name="countryId"
                    value={formData.countryId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country._id} value={country._id}>{country.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                <select
                  name="stateId"
                  value={formData.stateId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!formData.countryId || isLoadingStates}
                >
                  <option value="">
                    {isLoadingStates
                      ? 'Loading states...'
                      : formData.countryId
                      ? 'Select state'
                      : 'Select country first'}
                  </option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>{state.name}</option>
                  ))}
                </select>
                {formData.countryId && states.length === 0 && !isLoadingStates && (
                  <p className="text-sm text-red-500 mt-1">
                    No states available for this country.
                    {userRole === 'admin' ? (
                      <button
                        onClick={() => setShowAddStateForm(true)}
                        className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                      >
                        Add a new state
                      </button>
                    ) : (
                      ' Please contact support.'
                    )}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Projects*</label>
                {formData.seoProjects.map((project, index) => (
                  <div key={index} className="space-y-2 mb-4 p-4 bg-gray-50 rounded-lg relative">
                    <button
                      type="button"
                      onClick={() => removeSeoProject(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <FiX size={16} />
                    </button>
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={project.projectName}
                      onChange={(e) => handleSeoProjectChange(index, 'projectName', e.target.value)}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Target Keywords (comma-separated)"
                      value={project.targetKeywords.join(', ')}
                      onChange={(e) => handleSeoProjectChange(index, 'targetKeywords', e.target.value)}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                      value={project.status}
                      onChange={(e) => handleSeoProjectChange(index, 'status', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Planning">Planning</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSeoProject}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Add SEO Project
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred AI Tools</label>
                <div className="space-y-2">
                  {['Content Generator', 'Competitor Analyzer', 'Backlink Builder', 'Content Optimizer', 'Infographic Creator'].map((tool) => (
                    <label key={tool} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.preferredAITools.includes(tool)}
                        onChange={() => handleAIToolChange(tool)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Optimization Preferences</label>
                <select
                  name="contentOptimizationPrefs"
                  value={formData.contentOptimizationPrefs}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Blog Posts">Blog Posts</option>
                  <option value="Infographics">Backlink Builder</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Featured Images">Featured Images</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoadingStates || !formData.countryId || !formData.stateId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <FiSave size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}