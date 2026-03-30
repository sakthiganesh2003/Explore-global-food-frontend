'use client';

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
  totalPages?: number;
}

const ChefsPage: NextPage = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}';
        const response = await fetch(`${API_URL}/api/chefs?page=${currentPage}`, {
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
          setTotalPages(data.totalPages || 1);
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
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeleteId(id);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}';
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
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center py-10">
          <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
            Chef Management
          </h1>
          <div className="w-full max-w-7xl flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-sm font-medium text-gray-600">Loading chefs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center py-10">
          <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
            Chef Management
          </h1>
          <div className="w-full max-w-7xl flex justify-center items-center h-64">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center py-10">
        <div className="w-full max-w-7xl">
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-800 ml-5">Chef Management</h1>
            <p className="mt-2 text-lg text-gray-500 ml-5">
              Manage all registered chefs in your system
            </p>
          </div>

          {chefs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
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
            <>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Experience
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Specialty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Certification
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registered
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {chefs.map((chef) => (
                        <tr key={chef._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {chef.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {chef.experienceYears} {chef.experienceYears === 1 ? 'year' : 'years'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {chef.specialty}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {chef.certification ? (
                              <a
                                href={chef.certification.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(chef.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDelete(chef._id)}
                              disabled={isDeleting && deleteId === chef._id}
                              className={`px-3 py-1.5 rounded-md text-xs font-medium text-white ${
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        currentPage === 1
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        currentPage === totalPages
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefsPage;
