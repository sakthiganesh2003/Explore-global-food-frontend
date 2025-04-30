'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

interface Booking {
  _id: string;
  userId: string;
  maid: {
    _id: string;
    name: string;
    experience: number;
    specialty: string;
  };
  cuisine: string[];
  members: number;
  time: string;
  confirmedFoods: string[];
  totalAmount: number;
  createdAt: string;
  status: string;
}

const BookingDetailsPage = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        console .log('Fetching booking details...');
        const response = await axios.get(`http://localhost:5000/api/book/${deccodeToken}`,);
        setBooking(response.data.booking);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    } else {
      setError('No booking ID provided');
      setLoading(false);
    }
  }, [bookingId]);

  const getStatusBadge = (status: string | undefined) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };

    return status && statusClasses[status.toLowerCase()]
      ? statusClasses[status.toLowerCase()]
      : 'bg-gray-100 text-gray-800';
  };

  if (loading) return <p className="text-center mt-10">Loading booking details...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!booking) return <p className="text-center text-gray-500 mt-10">No booking found.</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Booking Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Booking ID:</p>
          <p className="text-gray-700">{booking._id}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">User ID:</p>
          <p className="text-gray-700">{booking.userId}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Maid:</p>
          <p className="text-gray-700">
            {booking.maid?.name || 'N/A'} (Specialty: {booking.maid?.specialty || 'N/A'})
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Cuisine:</p>
          <p className="text-gray-700">{booking.cuisine.join(', ')}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Members:</p>
          <p className="text-gray-700">{booking.members}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Time:</p>
          <p className="text-gray-700">{booking.time}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Confirmed Foods:</p>
          <p className="text-gray-700">{booking.confirmedFoods.join(', ')}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Total Amount:</p>
          <p className="text-gray-700">₹{booking.totalAmount}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Created At:</p>
          <p className="text-gray-700">{new Date(booking.createdAt).toLocaleString()}</p>
        </div>
        {booking.status && (
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Status:</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(booking.status)}`}>
              {booking.status.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsPage;
