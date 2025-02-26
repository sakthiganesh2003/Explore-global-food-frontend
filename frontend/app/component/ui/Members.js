import React, { useState } from 'react';

const Members = () => {
  const [members, setMembers] = useState([
    { name: '', age: '', gender: '', dietary: '', allergies: '', specialRequest: '', quantity: 1 }
  ]);

  const handleAddMember = () => {
    setMembers([...members, { name: '', age: '', gender: '', dietary: '', allergies: '', specialRequest: '', quantity: 1 }]);
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const handleChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg text-gray-800">
      <h3 className="text-2xl font-semibold mb-4 text-center">Enter Member Details</h3>
      <p className="text-center text-gray-600 mb-6">Provide information about the members who will be served.</p>

      {members.map((member, index) => (
        <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Member {index + 1}</h4>
            {members.length > 1 && (
              <button
                onClick={() => handleRemoveMember(index)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name"
              />
            </div>

           

            {/* Dietary Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Dietary Preferences</label>
              <select
                value={member.dietary}
                onChange={(e) => handleChange(index, 'dietary', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select preference</option>
                <option value="Vegan">Vegan</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="No Preference">No Preference</option>
              </select>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Allergies</label>
              <input
                type="text"
                value={member.allergies}
                onChange={(e) => handleChange(index, 'allergies', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E.g., Nuts, Dairy, Shellfish"
              />
            </div>

            {/* Special Request */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Special Requests</label>
              <input
                type="text"
                value={member.specialRequest}
                onChange={(e) => handleChange(index, 'specialRequest', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E.g., No spicy food"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Meal Quantity</label>
              <input
                type="number"
                value={member.quantity}
                onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <button
          onClick={handleAddMember}
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          + Add Member
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-700 font-semibold">Total Members: {members.length}</p>
      </div>
    </div>
  );
};

export default Members;
