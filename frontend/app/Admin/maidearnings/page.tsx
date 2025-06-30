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

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
      } catch (err) {
        setError('An error occurred while fetching earnings data');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  // Initiate payment for maid
  const initiatePayment = async (maidId: string, maidName: string, totalEarnings: number) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/initiate`);
      const { order } = response.data;

      const options = {
        key: 'rzp_test_2HTK1FzohCF9N2', // Replace with env variable in production
        order_id: order.id,
        amount: order.amount,
        currency: 'INR',
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            const verifyResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify`, {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              maidId,
            });
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            console.log('Verify Payment Result:', verifyResponse.data);
          } catch (err) {
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: maidName || 'Customer',
          email: 'customer@example.com',
          contact: '1234567890',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Error initiating payment:', err.response?.data || err.message);
      setError('Failed to initiate payment');
    }
  };

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
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && earnings.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No earnings data</h3>
              <p className="mt-1 text-sm text-gray-500">There are currently no Cook earnings records available.</p>
            </div>
          )}

          {!loading && !error && earnings.length > 0 && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg flex flex-col justify-center">
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
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cook
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Earnings
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bookings
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {earnings.map((earning, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {earning.maidName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{earning.maidName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-semibold text-green-600">
                            ₹{earning.totalEarnings.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {earning.totalBookings}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => initiatePayment(earning.maidId, earning.maidName, earning.totalEarnings)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            disabled={earning.totalEarnings === 0}
                          >
                            Pay Now
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{earnings.length}</span> of{' '}
                      <span className="font-medium">{earnings.length}</span> results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}