"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Sidebaruser from '@/app/component/dashboard/Sidebaruser';
import { jwtDecode } from 'jwt-decode';

// Define types for the data structures
type Feedback = {
  rating: number;
  comment: string;
  createdAt: string;
};

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
  feedback?: Feedback;
};

interface DecodedToken {
  userId?: string;
  id?: string;
  [key: string]: any;
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for feedback submission
  const bookingsPerPage = 5;
  const router = useRouter();

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const decoded: DecodedToken = jwtDecode(token);
        const userId = decoded.id || decoded.userId;
        if (!userId) {
          throw new Error('Invalid token: User ID not found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data: Booking[] = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Submit feedback to the API
  const submitFeedback = async (bookingId: string) => {
    if (feedbackRating === 0) {
      setFeedbackError('Please select a rating');
      return;
    }
    if (!feedbackComment.trim()) {
      setFeedbackError('Please provide a comment');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.id || decoded.userId;
      if (!userId) {
        throw new Error('Invalid token: User ID not found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId, // Include userId as per API request
          bookingId,
          rating: feedbackRating,
          comment: feedbackComment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to submit feedback (Status: ${response.status})`);
      }

      const updatedBooking = await response.json();
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, feedback: updatedBooking.feedback } : booking
        )
      );
      setFeedbackSuccess('Feedback submitted successfully');
      setFeedbackRating(0);
      setFeedbackComment('');
      setFeedbackError(null);
      setTimeout(() => setFeedbackSuccess(null), 3000);
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time for display
  const formatTime = (timeString: string): string => {
    return timeString.replace('-', ' to ');
  };

  // Get status color for UI
  const getStatusColor = (status: string): string => {
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

  // Handle pagination
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Open booking details modal
  const openDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setFeedbackRating(0);
    setFeedbackComment('');
    setFeedbackError(null);
    setFeedbackSuccess(null);
  };

  // Close booking details modal
  const closeDetails = () => {
    setSelectedBooking(null);
    setFeedbackRating(0);
    setFeedbackComment('');
    setFeedbackError(null);
    setFeedbackSuccess(null);
  };

  // Loading state
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

  // Error state
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
              <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuisine
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.cuisine.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(booking.time.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {booking.time.time.map(formatTime).join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ₹{booking.totalAmount.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {booking.confirmedFoods.length} items
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => openDetails(booking)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal for Booking Details */}
              {selectedBooking && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Booking Details - {selectedBooking.cuisine.name}
                        </h2>
                        <button
                          onClick={closeDetails}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Booking Details Table */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Booking Details</h3>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Field
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Date</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {formatDate(selectedBooking.time.date)}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Time</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {selectedBooking.time.time.map(formatTime).join(', ')}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Address</td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {selectedBooking.time.address}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Phone</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {selectedBooking.time.phoneNumber}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Booked on</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {formatDate(selectedBooking.createdAt)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Members Table */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                          Members ({selectedBooking.members.length})
                        </h3>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Member
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Dietary Preference
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Allergies
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Special Requests
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Meals
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedBooking.members.map((member, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    Member {index + 1}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {member.dietaryPreference}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {member.allergies || 'None'}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {member.specialRequests || 'None'}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {member.mealQuantity}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Ordered Items Table */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Ordered Items</h3>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Item
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Quantity
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedBooking.confirmedFoods.map((food) => (
                                <tr key={food._id}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {food.name}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {food.quantity}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    ₹{food.price.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    ₹{(food.price * food.quantity).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td
                                  colSpan={3}
                                  className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                                >
                                  Total
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                  ₹{selectedBooking.totalAmount.toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Feedback Section */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Feedback</h3>
                        {selectedBooking.feedback ? (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="text-sm font-medium text-gray-900">Rating:</div>
                              <div className="flex ml-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`h-5 w-5 ${
                                      star <= selectedBooking.feedback!.rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.538 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.783.57-1.838-.197-1.538-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.236 9.397c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.97z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-gray-900">
                              <span className="font-medium">Comment:</span> {selectedBooking.feedback.comment}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              Submitted on {formatDate(selectedBooking.feedback.createdAt)}
                            </div>
                          </div>
                        ) : selectedBooking.status.toLowerCase() === 'confirmed' ? (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rating
                              </label>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setFeedbackRating(star)}
                                    className={`h-6 w-6 ${
                                      star <= feedbackRating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    disabled={isSubmitting}
                                  >
                                    <svg
                                      className="h-full w-full"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.538 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.783.57-1.838-.197-1.538-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.236 9.397c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.97z" />
                                    </svg>
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="mb-4">
                              <label
                                htmlFor="feedbackComment"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Comment
                              </label>
                              <textarea
                                id="feedbackComment"
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={4}
                                placeholder="Share your feedback..."
                                disabled={isSubmitting}
                              ></textarea>
                            </div>
                            {feedbackError && (
                              <div className="text-red-500 text-sm mb-2">{feedbackError}</div>
                            )}
                            {feedbackSuccess && (
                              <div className="text-green-500 text-sm mb-2">{feedbackSuccess}</div>
                            )}
                            <button
                              onClick={() => submitFeedback(selectedBooking._id)}
                              disabled={isSubmitting}
                              className={`px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            Feedback can only be submitted for confirmed bookings.
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={closeDetails}
                          className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {bookings.length > bookingsPerPage && (
                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-full text-white ${
                      currentPage === 1
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    Previous
                  </button>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentPage === number
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-full text-white ${
                      currentPage === totalPages
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
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