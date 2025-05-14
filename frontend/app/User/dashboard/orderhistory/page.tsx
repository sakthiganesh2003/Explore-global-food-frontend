"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Sidebaruser from '@/app/component/dashboard/Sidebaruser';
import {jwtDecode} from 'jwt-decode';
import { FiArrowRight } from 'react-icons/fi';

type Booking = {
  _id: string;
  cuisine: {
    id: string;
    name: string;
    price: number;
  };
  userId: {
    _id: string;
    email: string;
  };
  maidId?: {
    _id: string;
  };
  maid?: string;
  members: Array<{
    dietaryPreference: string;
    allergies: string;
    specialRequests: string;
    mealQuantity: number;
    _id: string;
  }>;
  time: {
    date: string;
    time: string[];
    address: string;
    phoneNumber: string;
    _id: string;
  };
  confirmedFoods: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    _id: string;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
};

interface DecodedToken {
  userId: string;
  id?: string;
  [key: string]: any;
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 3;
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const decoded: DecodedToken = jwtDecode(token);
        const userId = decoded.id || decoded.userId;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string) => {
    return timeString.replace('-', ' to ');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusStyle = (status: string, currentStatus: string) => {
    if (status.toLowerCase() === currentStatus.toLowerCase()) {
      return getStatusColor(status);
    }
    return 'bg-gray-200 text-gray-500';
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebaruser />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebaruser />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading bookings</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebaruser />
      
      <main className="flex-1 p-6">
        <Head>
          <title>Booking History | MyApp</title>
          <meta name="description" content="Your booking history" />
        </Head>

        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
            {bookings.length > 0 && (
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">
                No bookings found
              </h3>
              <p className="mt-1 text-gray-500">
                You haven't made any bookings yet.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/book')}
                  className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {currentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-semibold text-gray-900">
                              {booking.cuisine.name} Cuisine
                            </h2>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-gray-600">
                            Booked on {formatDate(booking.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{booking.totalAmount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.confirmedFoods.length} items
                          </p>
                        </div>
                      </div>

                      {/* Progress Indicator */}
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Booking Status</h3>
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle('Pending', booking.status)}`}
                            >
                              Pending
                            </span>
                            <FiArrowRight className="text-gray-400" />
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle('Confirmed', booking.status)}`}
                            >
                              Confirmed
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle('Cancelled', booking.status)}`}
                            >
                              Cancelled
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Booking Details
                          </h3>
                          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">Date:</span>{' '}
                              {formatDate(booking.time.date)}
                            </p>
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">Time:</span>{' '}
                              {booking.time.time.map(formatTime).join(', ')}
                            </p>
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">Address:</span>{' '}
                              {booking.time.address}
                            </p>
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">Phone:</span>{' '}
                              {booking.time.phoneNumber}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Members ({booking.members.length})
                          </h3>
                          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                            {booking.members.map((member, index) => (
                              <div key={member._id} className="text-sm">
                                <p className="text-gray-900">
                                  <span className="font-medium">
                                    Member {index + 1}:
                                  </span>{' '}
                                  {member.dietaryPreference}
                                </p>
                                <p className="text-gray-600">
                                  Allergies: {member.allergies || 'None'}
                                </p>
                                <p className="text-gray-600">
                                  Requests: {member.specialRequests || 'None'}
                                </p>
                                <p className="text-gray-600">
                                  Meals: {member.mealQuantity}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Ordered Items
                          </h3>
                          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                            {booking.confirmedFoods.map((food) => (
                              <div
                                key={food._id}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-900">
                                  {food.name} × {food.quantity}
                                </span>
                                <span className="text-gray-600">
                                  ₹{(food.price * food.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {bookings.length > bookingsPerPage && (
                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-full text-white ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  >
                    Previous
                  </button>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === number ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-full text-white ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}