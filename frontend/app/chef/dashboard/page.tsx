import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Sidebar from '@/app/component/dashboard/Sidebarchef';

interface User {
  name: string;
  bio: string;
  email: string;
  location: string;
  avatarUrl: string;
}

const Profile: NextPage = () => {
  const user: User = {
    name: 'John Doe',
    bio: 'Software developer passionate about building scalable web applications.',
    email: 'john.doe@example.com',
    location: 'San Francisco, CA',
    avatarUrl: 'https://via.placeholder.com/150',
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Sidebar />
    <Head>
  <title>{user.name}&#39;s Profile</title>
 
  <link rel="icon" href="/favicon.ico" />
</Head>


      <main className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
        <div className="p-8">
          <div className="flex flex-col items-center">
            <Image
              src={user.avatarUrl}
              alt={`${user.name}'s avatar`}
              width={150}
              height={150}
              className="rounded-full border-4 border-gray-200"
            />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="mt-2 text-gray-600 text-center">{user.bio}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">Details</h2>
            <div className="mt-4 space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Location:</span> {user.location}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;