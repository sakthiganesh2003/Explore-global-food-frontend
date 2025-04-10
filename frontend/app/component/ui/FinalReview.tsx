import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Correct ES module import

interface MaidType {
  userId: string;
  fullName: string;
  specialties: string[];
  rating: number;
  experience: string | number;
  image?: string;
  hourlyRate?: number;
  cuisine?: string[];
}

interface MemberType {
  _id?: string;
  dietaryPreference: string;
  allergies: string;
  specialRequests: string;
  mealQuantity: number;
}

interface TimeType {
  date: string;
  time: string[];
  address: string;
  phoneNumber: string;
}

interface FoodType {
  id: string;
  name: string;
  quantity: number;
  price?: number;
}

interface CuisineType {
  id: string;
  name: string;
  type?: string;
  description?: string;
  price?: number;
  availableFoods?: FoodType[];
}

interface FormDataType {
  maid: MaidType | null;
  cuisine: CuisineType | null;
  members: MemberType[];
  time: TimeType | null;
  confirmedFoods: FoodType[];
}

interface FinalReviewProps {
  formData: FormDataType;
  onConfirm: () => void;
  updateMembers?: (members: MemberType[]) => void; // Callback to update members
}

interface DecodedToken {
  id: string; // Adjust based on your token's payload structure
  [key: string]: any;
}

const FinalReview: React.FC<FinalReviewProps> = ({ formData, onConfirm, updateMembers }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const renderRatingStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}>
          {i < Math.floor(rating) ? '★' : '☆'}
        </span>
      ));
  };

  const calculateTotal = () => {
    let total = 0;

    if (formData.maid?.hourlyRate && formData.time?.time.length) {
      const hours = formData.time.time.length;
      total += formData.maid.hourlyRate * hours;
    }

    if (formData.cuisine?.price) {
      total += formData.cuisine.price;
    }

    formData.confirmedFoods.forEach((food) => {
      if (food.price) {
        total += food.price * food.quantity;
      }
    });

    return total.toFixed(2);
  };

  // Handle removing a member
  const handleRemoveMember = (indexToRemove: number) => {
    if (updateMembers) {
      const updatedMembers = formData.members.filter((_, index) => index !== indexToRemove);
      updateMembers(updatedMembers);
    }
  };

  // Handle booking confirmation with API call
  const handleConfirmBooking = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Decode the token to get the user ID
    const token = localStorage.getItem('token');
    let userId = '';

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        userId = decoded.id; // Adjust based on your token's payload structure
      } catch (err) {
        setError('Invalid or expired token. Please log in again.');
        setLoading(false);
        return;
      }
    } else {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }

    // Prepare the payload to match the backend schema
    const payload = {
      userId,
      maid: formData.maid?.userId || '',
      cuisine: {
        id: formData.cuisine?.id || '',
        name: formData.cuisine?.name || '',
        price: formData.cuisine?.price || 0,
      },
      members: formData.members.map((member) => ({
        dietaryPreference: member.dietaryPreference,
        allergies: member.allergies,
        specialRequests: member.specialRequests,
        mealQuantity: member.mealQuantity,
      })),
      time: formData.time || { date: '', time: [], address: '', phoneNumber: '' },
      confirmedFoods: formData.confirmedFoods.map((food) => ({
        id: food.id,
        name: food.name,
        price: food.price || 0,
        quantity: food.quantity,
      })),
      totalAmount: parseFloat(calculateTotal()),
    };
console.log('Payload:', payload); // Debugging line to check the payload structure
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in headers if required
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Booking response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create booking');
      }

      setSuccess(true);
      onConfirm(); // Call the parent callback to proceed
      router.push('./'); // Redirect to bookings page (adjust as needed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Booking Summary</h2>

      {/* Maid Information */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Maid Details</h3>
        {formData.maid ? (
          <div className="flex items-start">
            <div className="w-20 h-20 mr-4 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <img
                src={formData.maid.image || '/chef-placeholder.jpg'}
                alt={formData.maid.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/chef-placeholder.jpg';
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-800">{formData.maid.fullName}</p>
                {formData.maid.hourlyRate && formData.time?.time.length && (
                  <p className="text-gray-800 font-medium">
                    ${(formData.maid.hourlyRate * formData.time.time.length).toFixed(2)}
                    <span className="text-gray-600 text-sm ml-1">
                      ({formData.time.time.length} hrs × ${formData.maid.hourlyRate}/hr)
                    </span>
                  </p>
                )}
              </div>
              <div className="flex items-center mt-1">
                <span className="flex">{renderRatingStars(formData.maid.rating)}</span>
                <span className="text-gray-600 ml-2 text-sm">({formData.maid.rating.toFixed(1)})</span>
              </div>
              <p className="text-gray-600 mt-1">
                Experience: {formData.maid.experience}{' '}
                {typeof formData.maid.experience === 'number' ? 'years' : ''}
              </p>
              {formData.maid.specialties?.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-600">Specialties:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.maid.specialties.map((specialty, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No maid selected</p>
        )}
      </div>

      {/* Cuisine Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Cuisine Details</h3>
          {formData.cuisine ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-gray-800">{formData.cuisine.name}</p>
                {formData.cuisine.price && (
                  <p className="text-gray-800 font-medium">${formData.cuisine.price.toFixed(2)}</p>
                )}
              </div>
              {formData.cuisine.type && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Type:</span> {formData.cuisine.type}
                </p>
              )}
              {formData.cuisine.description && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Description:</span> {formData.cuisine.description}
                </p>
              )}
              {formData.maid?.cuisine?.includes(formData.cuisine.name) && (
                <p className="text-xs text-green-600 mt-2">
                  ★ This maid specializes in {formData.cuisine.name} cuisine
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No cuisine selected</p>
          )}
        </div>

        {/* Time Slot */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Time</h3>
          {formData.time ? (
            <div>
              <p className="text-gray-800">
                <span className="font-medium">Date:</span>{' '}
                {new Date(formData.time.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-gray-800 mt-1">
                <span className="font-medium">Time:</span> {formData.time.time.join(', ')}
              </p>
              <p className="text-gray-800 mt-1">
                <span className="font-medium">Address:</span> {formData.time.address}
              </p>
              <p className="text-gray-800 mt-1">
                <span className="font-medium">Phone Number:</span> {formData.time.phoneNumber}
              </p>
            </div>
          ) : (
            <p className="text-gray-600">Not selected</p>
          )}
        </div>
      </div>

      {/* Members */}
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Members</h3>
        {formData.members.length > 0 ? (
          <ul className="space-y-3">
            {formData.members.map((member, index) => (
              <li key={index} className="border-b pb-3 last:border-b-0 flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">
                    {member.dietaryPreference}{' '}
                    <span className="text-gray-500 text-sm">(Qty: {member.mealQuantity})</span>
                  </p>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    {member.dietaryPreference && (
                      <p>
                        <span className="font-medium">Dietary:</span> {member.dietaryPreference}
                      </p>
                    )}
                    {member.allergies && (
                      <p>
                        <span className="font-medium">Allergies:</span> {member.allergies}
                      </p>
                    )}
                    {member.specialRequests && (
                      <p>
                        <span className="font-medium">Special Request:</span> {member.specialRequests}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMember(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No members added</p>
        )}
      </div>

      {/* Confirmed Foods */}
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Confirmed Foods</h3>
        {formData.confirmedFoods.length > 0 ? (
          <div>
            <ul className="space-y-3">
              {formData.confirmedFoods.map((food) => (
                <li key={food.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="text-gray-800">{food.name}</span>
                    <span className="text-gray-500 text-sm ml-2">(Qty: {food.quantity})</span>
                  </div>
                  {food.price && (
                    <span className="text-gray-800 font-medium">
                      ${(food.price * food.quantity).toFixed(2)}
                      {food.quantity > 1 && (
                        <span className="text-gray-500 text-sm ml-1">(${food.price.toFixed(2)} each)</span>
                      )}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-2 border-t">
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No foods selected</p>
        )}
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          <p>Booking created successfully!</p>
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t flex justify-between items-center">
        <div className="text-lg font-bold text-gray-800">
          Grand Total: <span className="text-blue-600">${calculateTotal()}</span>
        </div>
        <button
          onClick={handleConfirmBooking}
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
};

export default FinalReview;