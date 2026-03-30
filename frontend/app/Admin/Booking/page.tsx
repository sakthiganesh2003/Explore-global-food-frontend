'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '@/app/component/dashboard/Sidebar';
import Image from 'next/image';

interface MaidApplication {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  specialties: string[];
  bio: string;
  aadhaarPhoto?: string;
  aadhaarNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolderName: string;
  };
  availability?: string[];
}

const AdminDashboard = () => {
  const [applications, setApplications] = useState<MaidApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<MaidApplication | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL || "https://explorer-global-food-backend.vercel.app"}/api/formMaids?page=${currentPage}${
        filter === 'all' ? '' : `&status=${filter}`
      }`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to fetch applications');

      const { data, totalPages: pages } = await response.json();
      setApplications(data);
      setTotalPages(pages);
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setIsProcessing(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://explorer-global-food-backend.vercel.app"}/api/formMaids/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const { data } = await response.json();
      toast.success(`Application ${status}`);

      setApplications(prev =>
        prev.map(app => (app._id === id ? { ...app, status: data.status } : app))
      );
      setSelectedApp(null);
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Failed to update application');
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://explorer-global-food-backend.vercel.app"}/api/formMaids/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Deletion failed');
      }

      toast.success('Application deleted');
      setApplications(prev => prev.filter(app => app._id !== id));
      setSelectedApp(null);
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Failed to delete application');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredApplications =
    filter === 'all' ? applications : applications.filter(app => app.status === filter);

  return (
    <div className="flex min-h-screen bg-white text-gray-600">
      <Sidebar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-20 lg:pt-6 text-gray-800 w-full overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Cook Applications</h1>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg ${
                  filter === f
                    ? f === 'all'
                      ? 'bg-indigo-600 text-white'
                      : f === 'pending'
                      ? 'bg-yellow-500 text-white'
                      : f === 'approved'
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 border'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No applications found</div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Phone</th>
                      <th className="py-3 px-6 text-left">Experience</th>
                      <th className="py-3 px-6 text-left">Specialties</th>
                      <th className="py-3 px-6 text-left">Status</th>
                      <th className="py-3 px-6 text-left">Applied</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {filteredApplications.map(app => (
                      <tr
                        key={app._id}
                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedApp(app)}
                      >
                        <td className="py-3 px-6">{app.fullName}</td>
                        <td className="py-3 px-6">{app.email}</td>
                        <td className="py-3 px-6">{app.phone}</td>
                        <td className="py-3 px-6">{app.experience}</td>
                        <td className="py-3 px-6">{app.specialties.join(', ')}</td>
                        <td className="py-3 px-6">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              app.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page ? 'bg-indigo-600 text-white' : 'bg-white border'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Modal */}
          {selectedApp && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold">
                      {selectedApp.fullName}&apos;s Application
                    </h2>
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                      disabled={isProcessing}
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                      <div className="space-y-2">
                        <p><strong>Email:</strong> {selectedApp.email}</p>
                        <p><strong>Phone:</strong> {selectedApp.phone}</p>
                        <p><strong>Experience:</strong> {selectedApp.experience}</p>
                        <p><strong>Aadhaar:</strong> {selectedApp.aadhaarNumber}</p>
                        {selectedApp.availability && (
                          <p><strong>Availability:</strong> {selectedApp.availability.join(', ')}</p>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold mt-6 mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.specialties.map(skill => (
                          <span key={skill} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {selectedApp.bankDetails && (
                        <>
                          <h3 className="text-lg font-semibold mt-6 mb-2">Bank Details</h3>
                          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                            <p><strong>Account Holder:</strong> {selectedApp.bankDetails.accountHolderName}</p>
                            <p><strong>Account Number:</strong> {selectedApp.bankDetails.accountNumber}</p>
                            <p><strong>Bank Name:</strong> {selectedApp.bankDetails.bankName}</p>
                            <p><strong>IFSC Code:</strong> {selectedApp.bankDetails.ifscCode}</p>
                          </div>
                        </>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Bio</h3>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedApp.bio}</p>

                      <h3 className="text-lg font-semibold mt-6 mb-2">Aadhaar Photo</h3>
                      <Image
                        src={selectedApp.aadhaarPhoto || 'https://via.placeholder.com/300x200?text=Aadhaar+Photo'}
                        alt="Aadhaar"
                        width={300}
                        height={200}
                        className="w-full h-auto border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-4">
                    {selectedApp.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(selectedApp._id, 'approved')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(selectedApp._id, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Reject'}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteApplication(selectedApp._id)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
