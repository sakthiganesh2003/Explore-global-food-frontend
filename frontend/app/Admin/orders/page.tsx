"use client";
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Sidebar from '@/app/component/dashboard/Sidebar';

interface Member {
  dietaryPreference: string;
  allergies: string;
  specialRequests: string;
  mealQuantity: number;
  _id: string;
}

interface Time {
  date: string;
  time: string[];
  address: string;
  phoneNumber: string;
  _id: string;
}

interface Food {
  id: string;
  name: string;
  price: number;
  quantity: number;
  _id: string;
}

interface Cuisine {
  id: string;
  name: string;
  price: number;
}

interface User {
  _id: string;
  email: string;
}

interface Booking {
  _id: string;
  userId?: User | null; // Made userId optional to handle null/undefined cases
  maidId?: { _id: string };
  maid?: string;
  cuisine: Cuisine;
  members: Member[];
  time: Time;
  confirmedFoods: Food[];
  totalAmount: number;
  status: string;
  createdAt: string;
  __v: number;
}

const BookingsPage: NextPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null); // Added error state for better UX
  const bookingsPerPage = 6;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book`);
        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }
        const data = await response.json();
        // Validate data structure
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format: Expected an array of bookings');
        }
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings. Please try again later.');
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = [...bookings];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeFilter) {
      case 'today':
        filtered = filtered.filter(b => new Date(b.time.date).toDateString() === today.toDateString());
        break;
      case 'upcoming':
        filtered = filtered.filter(b => new Date(b.time.date) > today);
        break;
      case 'past':
        filtered = filtered.filter(b => new Date(b.time.date) < today);
        break;
      case 'pending':
        filtered = filtered.filter(b => b.status.toLowerCase() === 'pending');
        break;
      case 'confirmed':
        filtered = filtered.filter(b => b.status.toLowerCase() === 'confirmed');
        break;
      case 'cancelled':
        filtered = filtered.filter(b => b.status.toLowerCase() === 'cancelled');
        break;
      default:
        break;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        (booking.userId?.email?.toLowerCase()?.includes(term) || false) ||
        booking.cuisine.name.toLowerCase().includes(term) ||
        booking.time.address.toLowerCase().includes(term) ||
        booking.time.phoneNumber.includes(term)
      );
    }

    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [activeFilter, searchTerm, bookings]);

  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (dateString: string) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) return 'bg-gray-100 text-gray-600';
    if (bookingDate.toDateString() === today.toDateString()) return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
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

  // Calculate summary metrics
  const totalOrders = bookings.length;
  const totalConfirmed = bookings.filter(b => b.status.toLowerCase() === 'confirmed').length;
  const totalPending = bookings.filter(b => b.status.toLowerCase() === 'pending').length;
  const totalCancelled = bookings.filter(b => b.status.toLowerCase() === 'cancelled').length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0).toFixed(2);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <>
      <Head>
        <title>Bookings Management</title>
        <meta name="description" content="Manage your bookings" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>
      <div className="flex min-h-screen bg-gray-50 font-sans">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Bookings Management</h1>
              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
                  {error}
                </div>
              )}
              {/* Summary Cards */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                  <i className="fas fa-list text-indigo-600 text-2xl mb-2"></i>
                  <h3 className="text-lg font-semibold text-gray-900">Total Orders</h3>
                  <p className="text-2xl font-bold text-gray-700">{totalOrders}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                  <i className="fas fa-check-circle text-green-600 text-2xl mb-2"></i>
                  <h3 className="text-lg font-semibold text-gray-900">Confirmed</h3>
                  <p className="text-2xl font-bold text-gray-700">{totalConfirmed}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                  <i className="fas fa-hourglass-half text-yellow-600 text-2xl mb-2"></i>
                  <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
                  <p className="text-2xl font-bold text-gray-700">{totalPending}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                  <i className="fas fa-times-circle text-red-600 text-2xl mb-2"></i>
                  <h3 className="text-lg font-semibold text-gray-900">Cancelled</h3>
                  <p className="text-2xl font-bold text-gray-700">{totalCancelled}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                  <i className="fas fa-rupee-sign text-blue-600 text-2xl mb-2"></i>
                  <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
                  <p className="text-2xl font-bold text-gray-700">₹{totalRevenue}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex gap-2 flex-wrap">
                  {['all', 'today', 'upcoming', 'past', 'pending', 'confirmed', 'cancelled'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === filter
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:w-64">
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </header>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <i className="fas fa-calendar-times text-gray-300 text-5xl mb-4"></i>
                <p className="text-lg text-gray-600">No bookings found</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuisine</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentBookings.map((booking) => (
                          <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              #{booking._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.cuisine.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.userId?.email || 'N/A'} {/* Handle missing userId */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(booking.time.date)}`}>
                                {formatDate(booking.time.date)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.time.time.join(', ')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ₹{booking.totalAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => openBookingDetails(booking)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Previous Page
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Next Page
                  </button>
                </div>
              </>
            )}

            {isModalOpen && selectedBooking && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                   

<h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                    <button
                      onClick={closeModal}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label="Close modal"
                    >
                      <i className="fas fa(times) text-gray-600 text-lg"></i>
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Email:</span> {selectedBooking.userId?.email || 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span> {selectedBooking.time.phoneNumber}
                        </p>
                        <p>
                          <span className="font-medium">Address:</span> {selectedBooking.time.address}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Details</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Date:</span> {formatDate(selectedBooking.time.date)}
                        </p>
                        <p>
                          <span className="font-medium">Time:</span> {selectedBooking.time.time.join(', ')}
                        </p>
                        <p>
                          <span className="font-medium">Cuisine:</span> {selectedBooking.cuisine.name}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span>{' '}
                          <span className="capitalize">
                            {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Members</h3>
                      <div className="space-y-4">
                        {selectedBooking.members.map((member, index) => (
                          <div key={member._id} className="border-b border-gray-100 pb-4">
                            <p className="font-medium text-gray-900">Member {index + 1}</p>
                            <div className="space-y-2 text-sm text-gray-600 mt-2">
                              <p>
                                <span className="font-medium">Dietary Preference:</span>{' '}
                                {member.dietaryPreference}
                              </p>
                              <p>
                                <span className="font-medium">Allergies:</span> {member.allergies || 'None'}
                              </p>
                              <p>
                                <span className="font-medium">Special Requests:</span>{' '}
                                {member.specialRequests || 'None'}
                              </p>
                              <p>
                                <span className="font-medium">Meal Quantity:</span> {member.mealQuantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Ordered Foods</h3>
                      <div className="space-y-3">
                        {selectedBooking.confirmedFoods.map(food => (
                          <div
                            key={food._id}
                            className="flex justify-between items-center border-b border-gray-100 pb-3"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{food.name}</p>
                              <p className="text-sm text-gray-500">Quantity: {food.quantity}</p>
                            </div>
                            <p className="font-medium text-gray-900">₹{(food.price * food.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                        <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                        <span className="text-base font-bold text-gray-900">
                          ₹{selectedBooking.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingsPage;