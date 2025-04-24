'use client';

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SidebarMaid from '@/app/component/dashboard/SidebarMaid';

// Interfaces for type safety
interface Maid {
  _id: string;
  fullName: string;
  specialties: string[];
  rating: number;
  experience: number;
  image?: string;
  hourlyRate?: number;
}

interface Booking {
  _id: string;
  userId: string;
  maid: Maid;
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

// Hardcoded booking data (replace with API call in production)
const booking: Booking = {
  _id: '6808c7d764a373a1e1e6d4f2',
  userId: '67f64b04a36d593ba17ed4a8',
  maid: {
    _id: '67f7ace2eb7e2f4ac5d84183',
    fullName: 'Priya Sharma',
    specialties: ['Indian Cuisine', 'Meal Prep', 'Vegetarian Cooking'],
    rating: 4.8,
    experience: 5,
    image: '/maid-profile.jpg',
    hourlyRate: 200,
  },
  cuisine: {
    id: 'indian',
    name: 'Indian',
    price: 0,
  },
  members: [
    {
      dietaryPreference: 'vegetarian',
      allergies: 'jljl',
      specialRequests: 'uiiuo',
      mealQuantity: 1,
      _id: '6808c7d764a373a1e1e6d4f3',
    },
  ],
  time: {
    date: '2025-04-23',
    time: ['5:00 PM'],
    address: 'kiioipoiop',
    phoneNumber: '9889898989',
    _id: '6808c7d764a373a1e1e6d4f4',
  },
  confirmedFoods: [
    {
      id: 'food-curry',
      name: 'Curry',
      price: 180,
      quantity: 1,
      _id: '6808c7d764a373a1e1e6d4f5',
    },
  ],
  totalAmount: 180,
  status: 'confirmed',
  createdAt: '2025-04-23T10:58:31.901Z',
};

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
  const [isLoading, setIsLoading] = useState(false);

  // Handle booking actions (accept/reject)
  const handleAction = (action: 'accepted' | 'rejected') => {
    setIsLoading(true);
    // Simulate API call (replace with actual API in production)
    setTimeout(() => {
      toast.success(`Booking ${action} successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsLoading(false);
    }, 1000);
  };

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
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
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
            {booking.status === 'confirmed' && (
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