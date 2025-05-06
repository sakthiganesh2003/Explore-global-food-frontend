"use client";
import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiCalendar, FiClock, FiMapPin, FiPhone, FiUser, FiDollarSign, FiX, FiFilter, FiArrowLeft, FiUpload } from 'react-icons/fi';
import { FaUtensils, FaUserFriends, FaReceipt, FaMoneyBillWave, FaRegCreditCard } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  cuisine: Cuisine;
  members: Member[];
  time: Time;
  confirmedFoods: Food[];
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  paymentProof?: string;
  createdAt: string;
  __v: number;
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState('');
  const [paymentPhoto, setPaymentPhoto] = useState<File | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid' | 'partial'>('unpaid');
  const [partialAmount, setPartialAmount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book/reject`);
      const data = await response.json();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    }
  };

  useEffect(() => {
    filterBookings();
  }, [activeFilter, searchTerm, bookings]);

  const filterBookings = () => {
    let filtered = [...bookings];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Apply filter
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
      case 'cancelled':
        filtered = filtered.filter(b => b.status === 'cancelled');
        break;
      case 'unpaid':
        filtered = filtered.filter(b => b.paymentStatus === 'unpaid');
        break;
      default:
        break;
    }

    // Apply search
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
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      const formData = new FormData();
      formData.append('bookingId', bookingId);
      formData.append('refundAmount', refundAmount.toString());
      formData.append('refundReason', refundReason);
      if (paymentPhoto) {
        formData.append('paymentProof', paymentPhoto);
      }
      formData.append('paymentStatus', paymentStatus);
      if (paymentStatus === 'partial') {
        formData.append('partialAmount', partialAmount.toString());
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book/reject`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Booking updated successfully');
        fetchBookings();
        setIsModalOpen(false);
      } else {
        throw new Error('Failed to process booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to process booking');
    }
  };

  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setRefundAmount(booking.totalAmount);
    setRefundReason('');
    setPaymentPhoto(null);
    setPaymentStatus(booking.paymentStatus || 'unpaid');
    setPartialAmount(booking.totalAmount / 2);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentPhoto(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status: string, dateString: string) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    if (status === 'completed') return 'bg-purple-100 text-purple-800';
    if (bookingDate < today) return 'bg-gray-200 text-gray-700';
    if (bookingDate.toDateString() === today.toDateString()) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (status: string, dateString: string) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (status === 'cancelled') return 'Cancelled';
    if (status === 'completed') return 'Completed';
    if (bookingDate < today) return 'Past';
    if (bookingDate.toDateString() === today.toDateString()) return 'Today';
    return 'Upcoming';
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 text-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Bookings Management</h1>
            <p className="text-gray-600 mt-2">Manage customer bookings and payments</p>
            
            {/* Filter and Search Bar */}
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <FiFilter className="text-gray-500" />
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Bookings</option>
                  <option value="today">Today</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings Grid */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiCalendar className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No bookings found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try a different search term' : 'There are no bookings matching your current filters'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <div 
                  key={booking._id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100"
                >
                  <div className="p-6">
                    {/* Booking Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center mb-1">
                          <FaUtensils className="text-blue-500 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">{booking.cuisine.name} Cuisine</h3>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center">
                          <FiUser className="mr-1" /> {booking.userId.email}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(booking.status, booking.time.date)} mb-1`}>
                          {getStatusText(booking.status, booking.time.date)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusClass(booking.paymentStatus || 'unpaid')}`}>
                          {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'partial' ? 'Partial' : 'Unpaid'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Booking Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-700">
                        <FiCalendar className="mr-2 text-gray-400" />
                        <span>{formatDate(booking.time.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FiClock className="mr-2 text-gray-400" />
                        <span>{booking.time.time.join(', ')}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FiMapPin className="mr-2 text-gray-400" />
                        <span className="truncate">{booking.time.address}</span>
                      </div>
                    </div>
                    
                    {/* Total Amount */}
                    <div className="border-t border-gray-200 pt-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Total Amount:</span>
                        <span className="font-bold text-gray-800 flex items-center">
                          <FiDollarSign className="mr-1" /> {booking.totalAmount}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <button
                      onClick={() => openBookingDetails(booking)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      {booking.status === 'cancelled' ? 'View Details' : 'Manage Booking'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        {isModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiArrowLeft className="text-xl" />
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">
                    Booking Details
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FiUser className="mr-2 text-blue-500" />
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedBooking.userId.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedBooking.time.phoneNumber}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{selectedBooking.time.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Booking Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FiCalendar className="mr-2 text-blue-500" />
                      Booking Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{formatDate(selectedBooking.time.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{selectedBooking.time.time.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Cuisine</p>
                        <p className="font-medium">{selectedBooking.cuisine.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className={`font-medium capitalize ${
                          selectedBooking.status === 'cancelled' ? 'text-red-600' : 
                          selectedBooking.status === 'completed' ? 'text-purple-600' : 'text-green-600'
                        }`}>
                          {selectedBooking.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Members */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FaUserFriends className="mr-2 text-blue-500" />
                      Members ({selectedBooking.members.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedBooking.members.map((member, index) => (
                        <div key={member._id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                          <h4 className="font-medium text-gray-700 mb-2">Member {index + 1}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Dietary Preference</p>
                              <p className="font-medium">{member.dietaryPreference}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Allergies</p>
                              <p className="font-medium">{member.allergies || 'None'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Special Requests</p>
                              <p className="font-medium">{member.specialRequests || 'None'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Meal Quantity</p>
                              <p className="font-medium">{member.mealQuantity}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Ordered Foods */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FaReceipt className="mr-2 text-blue-500" />
                      Ordered Items
                    </h3>
                    <div className="space-y-3">
                      {selectedBooking.confirmedFoods.map(food => (
                        <div key={food._id} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0">
                          <div>
                            <p className="font-medium">{food.name}</p>
                            <p className="text-sm text-gray-500">Qty: {food.quantity} × ₹{food.price}</p>
                          </div>
                          <p className="font-medium">₹{food.price * food.quantity}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                      <span className="font-bold text-gray-800">Total Amount</span>
                      <span className="font-bold text-lg text-blue-600">₹{selectedBooking.totalAmount}</span>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                      <FaRegCreditCard className="mr-2 text-blue-500" />
                      Payment Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => setPaymentStatus('paid')}
                            className={`px-4 py-2 rounded-lg ${paymentStatus === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                          >
                            Paid
                          </button>
                          <button
                            onClick={() => setPaymentStatus('partial')}
                            className={`px-4 py-2 rounded-lg ${paymentStatus === 'partial' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                          >
                            Partial
                          </button>
                          <button
                            onClick={() => setPaymentStatus('unpaid')}
                            className={`px-4 py-2 rounded-lg ${paymentStatus === 'unpaid' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                          >
                            Unpaid
                          </button>
                        </div>
                      </div>

                      {paymentStatus === 'partial' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Partial Amount (₹)</label>
                          <input
                            type="number"
                            value={partialAmount}
                            onChange={(e) => setPartialAmount(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            max={selectedBooking.totalAmount}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Proof (Screenshot/Photo)</label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          onClick={triggerFileInput}
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                          <FiUpload className="mr-2" />
                          {paymentPhoto ? paymentPhoto.name : 'Upload Payment Proof'}
                        </button>
                        {paymentPhoto && (
                          <div className="mt-2 text-sm text-green-600 flex items-center">
                            <span>File selected: {paymentPhoto.name}</span>
                          </div>
                        )}
                        {selectedBooking.paymentProof && !paymentPhoto && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Current payment proof:</p>
                            <a 
                              href={selectedBooking.paymentProof} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View Payment Proof
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Refund Section (only for cancelled bookings) */}
                  {selectedBooking.status === 'cancelled' && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                        <FaMoneyBillWave className="mr-2 text-red-500" />
                        Refund Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount (₹)</label>
                          <input
                            type="number"
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            max={selectedBooking.totalAmount}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Refund Reason</label>
                          <textarea
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Enter reason for refund..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={() => handleRejectBooking(selectedBooking._id)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                  >
                    Update Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;