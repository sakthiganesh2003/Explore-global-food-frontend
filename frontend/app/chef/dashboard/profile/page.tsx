"use client";
import { useState } from 'react';
import Head from 'next/head';
import Sidebaruser from '@/app/component/dashboard/Sidebarchef';

type UserProfile = {
  name: string;
  email: string;
  image: string;
  phone: string;
  address: {
    city: string;
    country: string;
  };
  birthDate: string;
  gender: string;
  bio: string;
  joinedDate: string;
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    phone: '+1 (555) 123-4567',
    address: {
      city: 'New York',
      country: 'United States',
    },
    birthDate: '1990-05-15',
    gender: 'Male',
    bio: 'Passionate about building great user experiences and solving complex problems with code.',
    joinedDate: '2020-03-10',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUser(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserProfile],
          [child]: value
        }
      }));
    } else {
      setUser(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Updated user:', user);
  };

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
                <img
                  className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                  src={user.image}
                  alt={`${user.name}'s profile`}
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h1 className="text-2xl font-semibold text-gray-800">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleInputChange}
                      className="w-full p-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    user.name
                  )}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      className="w-full p-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    user.email
                  )}
                </p>
                <p className="text-gray-600">
                  {isEditing ? (
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <a href={user.image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Profile Image
                    </a>
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Save Changes
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
                        value={user.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-2 text-gray-900">{user.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="birthDate"
                        value={user.birthDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-2 text-gray-900">
                        {new Date(user.birthDate).toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Gender</label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={user.gender}
                        onChange={(e) => setUser({...user, gender: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="p-2 text-gray-900">{user.gender}</p>
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
                      <p className="p-2 text-gray-900">{user.address.city}</p>
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
                      <p className="p-2 text-gray-900">{user.address.country}</p>
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
                  <p className="p-2 text-gray-600 whitespace-pre-line">
                    {user.bio || "No bio provided"}
                  </p>
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
                      day: 'numeric'
                    })}
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