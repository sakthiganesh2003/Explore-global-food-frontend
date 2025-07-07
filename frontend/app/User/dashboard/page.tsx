"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebaruser from '@/app/component/dashboard/Sidebaruser';
import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';

type Address = {
  city: string;
  country: string;
};

type UserProfile = {
  id: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  isVerified?: boolean;
  phone?: string | null;
  image?: string | File;
  address: Address;
  birthDate?: string;
  gender?: string;
  bio: string;
  joinedDate: string;
};

interface DecodedToken {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  isVerified?: boolean;
  phone?: string | null;
  iat: number;
  exp: number;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>({
    id: '',
    userId: '',
    name: '',
    email: '',
    role: 'user',
    isVerified: false,
    phone: null,
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    address: {
      city: '',
      country: '',
    },
    birthDate: '',
    gender: '',
    bio: '',
    joinedDate: new Date().toISOString(),
  });

  const validateInputs = (): string | null => {
    if (user.name && !user.name.trim()) return 'Name cannot be empty';
    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) return 'Invalid email format';
    if (user.phone && !/^\+?\d{10,15}$/.test(user.phone)) return 'Invalid phone number format';
    return null;
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      if (!process.env.NEXT_PUBLIC_API_URL) throw new Error('API URL is not configured');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch user profile: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      setUser({
        id: data._id || userId,
        userId: data.userId || userId,
        name: data.name || '',
        email: data.email || '',
        role: data.role || 'user',
        isVerified: data.isVerified || false,
        phone: data.phone || null,
        image: data.image || 'https://randomuser.me/api/portraits/men/1.jpg',
        address: {
          city: data.address?.city || '',
          country: data.address?.country || '',
        },
        birthDate: data.birthDate || '',
        gender: data.gender || '',
        bio: data.bio || '',
        joinedDate: data.createdAt || new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUser((prev) => ({
          ...prev,
          id: decoded.id,
          userId: decoded.id,
          name: decoded.name || '',
          email: decoded.email || '',
          role: decoded.role || 'user',
          isVerified: decoded.isVerified || false,
          phone: decoded.phone || null,
        }));

        localStorage.setItem('userId', decoded.id);
        if (decoded.name) localStorage.setItem('userName', decoded.name);
        if (decoded.email) localStorage.setItem('userEmail', decoded.email);
        if (decoded.role) localStorage.setItem('userRole', decoded.role);
        if (decoded.isVerified !== undefined) localStorage.setItem('userIsVerified', String(decoded.isVerified));

        fetchUserProfile(decoded.id);
      } catch (error) {
        console.error('Error decoding token:', error);
        setError('Failed to decode authentication token');
        setIsLoading(false);
      }
    } else {
      setError('No authentication token found');
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('Input Change:', { name, value });
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address') {
        setUser((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value,
          },
        }));
      }
    } else {
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setUser((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSave = async () => {
    try {
      const validationError = validateInputs();
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      if (!process.env.NEXT_PUBLIC_API_URL) throw new Error('API URL is not configured');

      const formData = new FormData();
      if (user.name) formData.append('name', user.name);
      if (user.email) formData.append('email', user.email);
      if (user.phone) formData.append('phone', user.phone);
      formData.append('address[city]', user.address.city);
      formData.append('address[country]', user.address.country);
      if (user.birthDate) formData.append('birthDate', user.birthDate);
      if (user.gender) formData.append('gender', user.gender);
      formData.append('bio', user.bio);
      if (user.image instanceof File) {
        formData.append('image', user.image);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/profile/user/${user.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update profile: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUser({
        id: updatedUser._id || user.id,
        userId: updatedUser.userId || user.id,
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        role: updatedUser.role || 'user',
        isVerified: updatedUser.isVerified || false,
        phone: updatedUser.phone || null,
        image: updatedUser.image || 'https://randomuser.me/api/portraits/men/1.jpg',
        address: {
          city: updatedUser.address?.city || '',
          country: updatedUser.address?.country || '',
        },
        birthDate: updatedUser.birthDate || '',
        gender: updatedUser.gender || '',
        bio: updatedUser.bio || '',
        joinedDate: updatedUser.createdAt || user.joinedDate,
      });
      setIsEditing(false);
      setError(null);

      if (updatedUser.name) localStorage.setItem('userName', updatedUser.name);
      if (updatedUser.email) localStorage.setItem('userEmail', updatedUser.email);
      if (updatedUser.isVerified !== undefined) localStorage.setItem('userIsVerified', String(updatedUser.isVerified));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-500">
        <Sidebaruser />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-500">
        <Sidebaruser />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>Error loading profile: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-500">
      <Sidebaruser />
      <main className="flex-1 p-6">
        <Head>
          <title>User Profile | MyApp</title>
          <meta name="description" content="User profile page" />
        </Head>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <Image
                  className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                  src={typeof user.image === 'string' ? user.image : user.image instanceof File ? URL.createObjectURL(user.image) : 'https://randomuser.me/api/portraits/men/1.jpg'}
                  alt={`${user.name || 'User'}'s profile`}
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </label>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h1 className="text-2xl font-semibold text-gray-800">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={user.name || ''}
                      onChange={handleInputChange}
                      className="w-full p-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      placeholder="Enter your name"
                    />
                  ) : (
                    user.name || 'No name provided'
                  )}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={user.email || ''}
                      onChange={handleInputChange}
                      className="w-full p-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  ) : (
                    user.email || 'No email provided'
                  )}
                </p>
                <p className="text-sm text-gray-500 capitalize">{user.role || 'user'}</p>
                <p className="text-sm text-gray-500">
                  {user.isVerified ? (
                    <span className="text-green-500">Verified</span>
                  ) : (
                    <span className="text-red-500">Not Verified</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {/* Personal Information */}
              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={user.phone || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="+1 (123) 456-7890"
                      />
                    ) : (
                      <p className="p-2 text-gray-900">{user.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="birthDate"
                        value={user.birthDate || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-2 text-gray-900">
                        {user.birthDate
                          ? new Date(user.birthDate).toLocaleDateString('en-US', {
                              month: '2-digit',
                              day: '2-digit',
                              year: 'numeric',
                            })
                          : 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Gender</label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={user.gender || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="p-2 text-gray-900">{user.gender || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Address Information */}
              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.city"
                        value={user.address.city}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-2 text-gray-900">{user.address.city || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Country</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.country"
                        value={user.address.country}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-2 text-gray-900">{user.address.country || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Bio */}
              <section>
                <h3 className="text-lg font-medium text-gray-700 mb-2">About Me</h3>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={user.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="p-2 text-gray-600 whitespace-pre-line">{user.bio || 'No bio provided'}</p>
                )}
              </section>

              {/* Account Info */}
              <section className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Account Information</h3>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">Member Since</label>
                  <p className="p-2 text-gray-900">
                    {new Date(user.joinedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="space-y-1 mt-4">
                  <label className="block text-sm font-medium text-gray-500">User ID</label>
                  <p className="p-2 text-gray-900 font-mono text-sm">{user.userId || user.id}</p>
                </div>
                <div className="space-y-1 mt-4">
                  <label className="block text-sm font-medium text-gray-500">Verification Status</label>
                  <p className="p-2 text-gray-900">
                    {user.isVerified ? (
                      <span className="text-green-500">Verified</span>
                    ) : (
                      <span className="text-red-500">Not Verified</span>
                    )}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}