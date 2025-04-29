'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SidebarMaid from '@/app/component/dashboard/SidebarMaid';
import { jwtDecode } from 'jwt-decode';

// Interfaces for type safety
interface Maid {
  _id: string;
}

interface User {
  _id: string;
  email: string;
}

interface Booking {
  _id: string;
  userId: User;
  maidId: Maid;
  cuisine: {
    id: string;
    name: string;
    price: number;
  };
  members: {
    dietaryPreference: string;
    allergies: string;
    specialRequests: string;
    mealQuantity: number;
    _id: string;
  }[];
  time: {
    date: string;
    time: string[];
    address: string;
    phoneNumber: string;
    _id: string;
  };
  confirmedFoods: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    _id: string;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface DecodedToken {
  id: string;
}

// Utility function to format date
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const MaidBookingActionPage: React.FC = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  // Function to get maidId from token
  const getMaidIdFromToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to access this page', {
          position: 'top-right',
          autoClose: 3000,
        });
        router.push('/login');
        return null;
      }
      const decoded: DecodedToken = jwtDecode(token);
      if (!decoded.id) {
        toast.error('Invalid token format', {
          position: 'top-right',
          autoClose: 3000,
        });
        return null;
      }
      return decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('Session expired. Please login again', {
        position: 'top-right',
        autoClose: 3000,
      });
      localStorage.removeItem('token');
      router.push('/login');
      return null;
    }
  };

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      const maidId = getMaidIdFromToken();
      if (!maidId || !bookingId) return;

      try {
        setIsFetching(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book/${bookingId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();

        if (!response.ok || !result) {
          throw new Error(result.message || 'Failed to fetch booking');
        }

        // Verify maidId matches the booking's maidId
        if (result.maidId._id !== maidId) {
          throw new Error('Unauthorized: You are not assigned to this booking');
        }

        setBooking(result);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error fetching booking');
        toast.error(err.message || 'Error fetching booking', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setIsFetching(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  // Handle booking actions (accept/reject)
  const handleAction = async (action: 'accepted' | 'rejected') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `Failed to ${action} booking`);
      }

      setBooking((prev) => (prev ? { ...prev, status: action } : prev));
      toast.success(`Booking ${action} successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update booking status', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state
  if (isFetching) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarMaid />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !booking) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarMaid />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-red-600">{error || 'Booking not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarMaid />
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <ToastContainer />
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
            <div className="mt-2 flex justify-center items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : booking.status === 'accepted'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                Booked on {formatDate(booking.createdAt)}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Booking Details Section */}
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Booking Information</h3>
            </div>
            <div className="px-4 py-5 sm:p-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {/* Cuisine */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Cuisine</h4>
                <p className="mt-1 text-sm text-gray-900 font-semibold">{booking.cuisine.name}</p>
                {booking.cuisine.price > 0 && (
                  <p className="mt-1 text-sm text-gray-500">₹{booking.cuisine.price.toFixed(2)}</p>
                )}
              </div>

              {/* Date & Time */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                <p className="mt-1 text-sm text-gray-900">{formatDate(booking.time.date)}</p>
                <p className="mt-1 text-sm text-gray-900">{booking.time.time.join(', ')}</p>
              </div>

              {/* Location */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Location</h4>
                <p className="mt-1 text-sm text-gray-900">{booking.time.address}</p>
                <p className="mt-1 text-sm text-gray-900">Phone: {booking.time.phoneNumber}</p>
              </div>

              {/* Members */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Members</h4>
                <div className="mt-1 space-y-2">
                  {booking.members.map((member) => (
                    <div key={member._id} className="text-sm">
                      <p className="text-gray-900 font-medium">
                        {member.dietaryPreference} (Qty: {member.mealQuantity})
                      </p>
                      {member.allergies && (
                        <p className="text-gray-600">Allergies: {member.allergies}</p>
                      )}
                      {member.specialRequests && (
                        <p className="text-gray-600">Requests: {member.specialRequests}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Food Items Section */}
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Food Items</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {booking.confirmedFoods.map((food) => (
                      <tr key={food._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {food.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {food.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{food.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{(food.price * food.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Summary Section */}
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Payment Summary</h3>
                <span className="text-xl font-bold text-gray-900">
                  ₹{booking.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons (Conditional) */}
            {booking.status === 'pending' && (
              <div className="border-t border-gray-200 px-4 py-4 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => handleAction('accepted')}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                >
                  {isLoading ? 'Processing...' : 'Accept Booking'}
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('rejected')}
                  disabled={isLoading}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
                >
                  {isLoading ? 'Processing...' : 'Reject Booking'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaidBookingActionPage;