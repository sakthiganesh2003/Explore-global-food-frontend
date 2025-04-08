import { useState } from 'react';

interface MemberType {
  _id?: string;
  dietaryPreference: string;
  allergies: string;
  specialRequests: string;
  mealQuantity: number;
}

interface MembersProps {
  members: MemberType[];
  setMembers: React.Dispatch<React.SetStateAction<MemberType[]>>;
}

const Members = ({ members, setMembers }: MembersProps) => {
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [allergies, setAllergies] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [mealQuantity, setMealQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dietaryPreference) return;

    const newMember: MemberType = {
      _id: Date.now().toString(), // Temporary unique ID for local use
      dietaryPreference,
      allergies,
      specialRequests,
      mealQuantity,
    };

    // Update state with the new member locally
    setMembers([...members, newMember]);

    // Set success message
    setSuccessMessage('Member added successfully!');

    // Clear fields after adding
    setDietaryPreference('');
    setAllergies('');
    setSpecialRequests('');
    setMealQuantity(1);

    // Clear the success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-800">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Members</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Dietary Preferences</label>
          <select
            value={dietaryPreference}
            onChange={(e) => setDietaryPreference(e.target.value)}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select preference</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten-Free</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Allergies</label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="E.g., Nuts, Dairy, Shellfish"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Special Requests</label>
          <input
            type="text"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="E.g., No spicy food"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meal Quantity</label>
          <input
            type="number"
            value={mealQuantity}
            onChange={(e) => setMealQuantity(Number(e.target.value))}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="1"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
        >
          Add Member
        </button>
      </form>

      {/* Display added members */}
      {members.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Added Members</h3>
          <ul className="space-y-2">
            {members.map((member, index) => (
              <li key={member._id || index} className="p-2 bg-gray-50 rounded-md">
                <p>
                  <strong>Dietary:</strong> {member.dietaryPreference}
                </p>
                <p>
                  <strong>Allergies:</strong> {member.allergies || 'None'}
                </p>
                <p>
                  <strong>Special Requests:</strong> {member.specialRequests || 'None'}
                </p>
                <p>
                  <strong>Quantity:</strong> {member.mealQuantity}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display success message */}
      {successMessage && (
        <p className="mt-4 text-green-600 text-center">{successMessage}</p>
      )}
    </div>
  );
};

export default Members;