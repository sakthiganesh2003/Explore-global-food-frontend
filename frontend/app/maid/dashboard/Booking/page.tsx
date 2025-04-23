
import React from 'react';
import { notFound } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interfaces based on your database schema
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

// Server-side function to fetch booking data
async function fetchBooking(id: string): Promise<Booking> {
  const response = await fetch(`http://localhost:3000/api/bookings/${id}`, {
    cache: 'no-store', // Ensure fresh data
  });
  if (!response.ok) {
    throw new Error('Failed to fetch booking');
  }
  return response.json();
}

// Client-side component for handling accept/reject actions
const ActionButtons: React.FC<{
  bookingId: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ bookingId, isLoading, setIsLoading }) => {
  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error(`Failed to ${newStatus} booking`);

      toast.success(`Booking ${newStatus} successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });

      // Redirect to maid dashboard (client-side navigation)
      setTimeout(() => window.location.href = '/maid/dashboard', 2000);
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
      <button
        type="button"
        onClick={() => handleStatusUpdate('accepted')}
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
      >
        {isLoading ? 'Processing...' : 'Accept Booking'}
      </button>
      <button
        type="button"
        onClick={() => handleStatusUpdate('rejected')}
        disabled={isLoading}
        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
      >
        {isLoading ? 'Processing...' : 'Reject Booking'}
      </button>
    </div>
  );
};

// Main Server Component
export default async function MaidBookingActionPage({ params }: { params: { id: string } }) {
  const { id } = params;
  let booking: Booking;

  // Fetch booking data server-side
  try {
    booking = await fetchBooking(id);
  } catch (error) {
    notFound(); // Redirect to 404 page if booking not found
  }

  // Mock maidId (replace with actual auth mechanism, e.g., NextAuth)
  const maidId = '67f7ace2eb7e2f4ac5d84183'; // Should come from auth context

  // Authorization check
  if (booking.maid._id !== maidId) {
    return (
      <div className="text-center py-8 text-red-600">
        Unauthorized: You cannot manage this booking.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // State for client-side interactivity (in a Client Component)
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <div className="mt-2 flex justify-center items-center">
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
            <span className="ml-3 text-sm text-gray-500">
              Booked on {formatDate(booking.createdAt)}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Booking Details */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Booking Information</h3>
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

            {/* Time */}
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

          {/* Food Items */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Food Items</h3>
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

          {/* Payment Summary */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Summary</h3>
              <span className="text-xl font-bold text-gray-900">
                ₹{booking.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          {booking.status === 'confirmed' && (
            <ActionButtons
              bookingId={booking._id}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
