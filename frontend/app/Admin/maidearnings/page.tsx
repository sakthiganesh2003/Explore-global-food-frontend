'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/app/component/dashboard/Sidebar';

interface Earning {
  maidId: string;
  maidName: string;
  totalEarnings: number;
  totalBookings: number;
}

interface ApiResponse {
  success: boolean;
  count: number;
  earnings: Earning[];
}

export default function MaidEarningsPage() {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch earnings
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/book/maid/earings/`);
        if (response.data.success) {
          setEarnings(response.data.earnings);
        } else {
          setError('Failed to fetch earnings data');
        }
      } catch {
        setError('An error occurred while fetching earnings data');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 ml-0">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Cook Earnings Dashboard</h1>
            <p className="text-gray-600 mt-1 md:mt-2">Overview of all Cook earnings and bookings</p>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && earnings.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="mt-2 text-lg font-medium text-gray-900">No earnings data</h3>
              <p className="mt-1 text-sm text-gray-500">There are currently no Cook earnings records available.</p>
            </div>
          )}

          {!loading && !error && earnings.length > 0 && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Cook Earnings Summary
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  A comprehensive list of all Cook earnings and booking statistics.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cook</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {earnings.map((earning) => (
                      <tr key={earning.maidId} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {earning.maidName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4 text-sm font-medium text-gray-900">
                              {earning.maidName}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-green-600">
                          ₹{earning.totalEarnings.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {earning.totalBookings}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 text-sm text-gray-600 text-right">
                Showing 1 to {earnings.length} of {earnings.length} results
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
