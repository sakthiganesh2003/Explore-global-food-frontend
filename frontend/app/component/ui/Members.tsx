import { useState, useEffect } from 'react';

interface Member {
  _id?: string; // Optional since the backend returns it
  dietaryPreference: string;
  allergies: string;
  specialRequests: string;
  mealQuantity: number;
}

interface MembersProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

const Members = ({ members, setMembers }: MembersProps) => {
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [allergies, setAllergies] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [mealQuantity, setMealQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch members on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/members', {
          headers: {
            'Content-Type': 'application/json',
            // Optionally add Authorization header here if needed.
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await res.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dietaryPreference) return;

    const newMember: Member = {
      dietaryPreference,
      allergies,
      specialRequests,
      mealQuantity,
    };

    try {
      const res = await fetch('http://localhost:5000/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optionally add Authorization header here if needed.
        },
        body: JSON.stringify(newMember),
      });

      if (!res.ok) {
        throw new Error('Failed to add member');
      }
      const savedMember = await res.json();

      // Update state with the newly added member from the backend
      setMembers([...members, savedMember]);

      // Set success message
      setSuccessMessage('Member added successfully!');

      // Clear fields after adding
      setDietaryPreference('');
      setAllergies('');
      setSpecialRequests('');
      setMealQuantity(1);

      // Clear the success message after 3 seconds (optional)
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-800">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Members</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dietary Preferences
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Allergies
          </label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="E.g., Nuts, Dairy, Shellfish"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Special Requests
          </label>
          <input
            type="text"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="E.g., No spicy food"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Meal Quantity
          </label>
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

      {/* Display success message */}
      {successMessage && (
        <p className="mt-4 text-green-600 text-center">{successMessage}</p>
      )}
    </div>
  );
};

export default Members;
