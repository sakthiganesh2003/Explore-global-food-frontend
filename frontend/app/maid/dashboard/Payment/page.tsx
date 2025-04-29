'use client';

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SidebarMaid from '@/app/component/dashboard/SidebarMaid';
import { useRouter } from 'next/navigation';

// Interfaces for type safety
interface Maid {
  _id: string;
  fullName?: string;
  specialties?: string[];
  rating?: number;
  experience?: number;
  image?: string;
  hourlyRate?: number;
}

interface Booking {
  _id: string;
  userId: {
    _id: string;
    email: string;
  };
  maidId: {
    _id: string;
  };
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

// Utility function to decode JWT (client-side)
const decodeJWT = (token: string): { maidId?: string; sub?: string; id?: string } | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    console.log('Decoded JWT payload:', decoded);
    return decoded;
  } catch (err) {
    console.error('Error decoding JWT:', err);
    return null;
  }
};

const MaidBookingActionPage: React.FC = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch booking data using maid ID from decoded JWT
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // Retrieve token from localStorage
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token || 'No token found');

        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        // Decode JWT to get maid ID
        const decoded = decodeJWT(token);
        if (!decoded) {
          throw new Error('Invalid token format.');
        }

        // Try multiple possible field names for maid ID
        const maidId = decoded.maidId || decoded.sub || decoded.id;
        if (!maidId) {
          throw new Error('Maid ID not found in token payload.');
        }
        console.log('Maid ID:', maidId);

        // Fetch bookings for the maid
        const response = await fetch(`http://localhost:5000/api/book/${maidId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          throw new Error(`Failed to fetch bookings: ${response.status} ${response.statusText}`);
        }

        const data: Booking[] = await response.json();
        console.log('API response:', data);

        if (data.length === 0) {
          throw new Error('No bookings found for this maid.');
        }

        setBooking(data[0]); // Use the first booking
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching booking:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch booking details.';
        setError(errorMessage);
        setIsLoading(false);

        // Show toast for specific errors
        if (errorMessage.includes('token') || errorMessage.includes('Maid ID')) {
          toast.error('Authentication failed. Redirecting to login...', {
            position: 'top-right',
            autoClose: 3000,
          });
          setTimeout(() => router.push('/login'), 3000); // Adjust login route
        } else if (errorMessage.includes('404') || errorMessage.includes('No bookings found')) {
          toast.error('No bookings found for this maid.', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      }
    };

    fetchBooking();
  }, [router]);

  // Handle booking actions (accept/reject)
  const handleAction = async (action: 'accepted' | 'rejected') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch(`http://localhost:5000/api/book/${booking?._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update booking status: ${response.statusText}`);
      }

      toast.success(`Booking ${action} successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
      setBooking((prev) => (prev ? { ...prev, status: action } : prev));
    } catch (err) {
      console.error('Error updating booking status:', err);
      toast.error('Failed to update booking status.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 justify-center items-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen bg-gray-50 justify-center items-center">
        <p className="text-red-600">{error || 'No booking data available.'}</p>
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
                  booking.status === 'confirmed' || booking.status === 'accepted'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
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
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
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