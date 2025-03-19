import { useState } from 'react';

const Members = ({ members, setMembers }) => {
  const [name, setName] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [allergies, setAllergies] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [mealQuantity, setMealQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dietaryPreference) return;

    const newMember = { name, dietaryPreference, allergies, specialRequests, mealQuantity };
    setMembers([...members, newMember]);

    // Clear fields after adding
    setName('');
    setDietaryPreference('');
    setAllergies('');
    setSpecialRequests('');
    setMealQuantity(1);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-800">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Members</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

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
      <div className="mt-6">
        <h3 className="text-md font-semibold text-gray-700">Members List</h3>
        {members.length > 0 ? (
          <ul className="list-disc pl-5 mt-2">
            {members.map((member, index) => (
              <li key={index} className="text-gray-800">
                {member.name} - {member.dietaryPreference} (Meals: {member.mealQuantity})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm mt-2">No members added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Members;
