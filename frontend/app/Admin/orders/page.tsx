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
  userId: User;
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
  const bookingsPerPage = 6;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book`);
        const data = await response.json();
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
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
      case 'Cancelled':
        filtered = filtered.filter(b => b.status.toLowerCase() === 'cancelled');
        break;
      default:
        // 'all' - no date or status filter
        break;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.userId.email.toLowerCase().includes(term) ||
        booking.cuisine.name.toLowerCase().includes(term) ||
        booking.time.address.toLowerCase().includes(term) ||
        booking.time.phoneNumber.includes(term)
      );
    }

    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page when filters change
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

  // Pagination logic
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
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex gap-2 flex-wrap">
                  {['all', 'today', 'upcoming', 'past', 'pending', 'confirmed', 'Cancelled'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeFilter === filter
                          ? 'bg-blue-600 text-white'
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
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </header>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <i className="fas fa-calendar-times text-gray-300 text-5xl mb-4"></i>
                <p className="text-lg text-gray-600">No bookings found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{booking.cuisine.name} Cuisine</h3>
                          <p className="text-sm text-gray-500">{booking.userId.email}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(booking.time.date)}`}
                        >
                          {formatDate(booking.time.date)}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p>
                          <i className="fas fa-clock mr-2"></i>
                          {booking.time.time.join(', ')}
                        </p>
                        <p>
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          {booking.time.address}
                        </p>
                        <p>
                          <i className="fas fa-phone mr-2"></i>
                          {booking.time.phoneNumber}
                        </p>
                      </div>
                      <div className="border-t border-gray-100 pt-4 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                          <span className="text-base font-bold text-gray-900">₹{booking.totalAmount}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => openBookingDetails(booking)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
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
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Next Page
                  </button>
                </div>
              </>
            )}

            {isModalOpen && selectedBooking && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                    <button
                      onClick={closeModal}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label="Close modal"
                    >
                      <i className="fas fa-times text-gray-600 text-lg"></i>
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Email:</span> {selectedBooking.userId.email}
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
                            <p className="font-medium text-gray-900">₹{food.price * food.quantity}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                        <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                        <span className="text-base font-bold text-gray-900">
                          ₹{selectedBooking.totalAmount}
                        </span>
                      </div>
                    </div>
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