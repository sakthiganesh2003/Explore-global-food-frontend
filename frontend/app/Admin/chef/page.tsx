"use client";
import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Sidebar from '@/app/component/dashboard/Sidebar';

interface Certification {
  url: string;
}

interface Chef {
  _id: string;
  name: string;
  experienceYears: number;
  specialty: string;
  certification: Certification | null;
  agreeToTerms: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: Chef[];
}

const ChefsPage: NextPage = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/chefs', {
            headers: { 'Accept': 'application/json' },
          });
        if (process.env.NODE_ENV === 'development') {
          console.log('Response status:', response.status);
          console.log('Content-Type:', response.headers.get('content-type'));
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response from server');
        }

        const data: ApiResponse = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setChefs(data.data);
        } else {
          setError('Invalid data format from server');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching chefs data');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeleteId(id);
  
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/chefs/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setChefs(chefs.filter(chef => chef._id !== id));
      } else {
        const errorData = await response.json();
        console.error('Failed to delete chef:', errorData.error);
        setError(errorData.error || 'Failed to delete chef');
      }
    } catch (error) {
      console.error('Error deleting chef:', error);
      setError('Error deleting chef');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-gray-600">
     <Sidebar/>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Chef Management
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Manage all registered chefs in your system
            </p>
          </div>

          {chefs.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No chefs found</h3>
              <p className="mt-1 text-gray-500">No chefs have registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {chefs.map((chef) => (
                <div
                  key={chef._id}
                  className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {chef.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {chef.experienceYears} {chef.experienceYears === 1 ? 'year' : 'years'} exp
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Specialty:</span> {chef.specialty}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Registered:</span>{' '}
                        {new Date(chef.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex justify-between items-center">
                      {chef.certification ? (
                        <a
                          href={chef.certification.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-green-600 hover:text-green-800"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          View Certification
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">No certification</span>
                      )}
                      <button
                        onClick={() => handleDelete(chef._id)}
                        disabled={isDeleting && deleteId === chef._id}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${
                          isDeleting && deleteId === chef._id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                      >
                        {isDeleting && deleteId === chef._id ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefsPage;