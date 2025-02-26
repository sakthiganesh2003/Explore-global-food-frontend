import { useState } from 'react';

const maids = [
  {
    id: 1,
    name: "Sophia Lee",
    cuisine: "Italian, French",
    rating: 4.8,
    experience: "5 years",
    image: "/chef2.jpg",
  },
  {
    id: 2,
    name: "Amara Patel",
    cuisine: "Indian, Thai",
    rating: 4.7,
    experience: "3 years",
    image: "/chef1.jpg",
  },
  {
    id: 3,
    name: "Daniel Carter",
    cuisine: "American, BBQ",
    rating: 4.9,
    experience: "7 years",
    image: "/chef3.jpg",
  },
];

const MaidChoose = ({ onSelect = () => {} }) => {
  const [selectedMaid, setSelectedMaid] = useState(null);

  const handleConfirmSelection = () => {
    if (selectedMaid !== null) {
      const chosenMaid = maids.find((maid) => maid.id === selectedMaid);
      console.log("Confirmed Maid:", chosenMaid);
      onSelect(chosenMaid); // Pass the selected maid back to the parent component
    }
  };

  return (
    <div className="text-center text-gray-500">
      <h2 className="text-xl font-semibold mb-4">Choose Your Maid</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {maids.map((maid) => (
          <div
            key={maid.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedMaid === maid.id ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
            onClick={() => setSelectedMaid(maid.id)}
          >
            <img src={maid.image} alt={maid.name} className="w-24 h-24 mx-auto rounded-full object-cover" />
            <h3 className="mt-2 text-lg font-bold">{maid.name}</h3>
            <p className="text-sm text-gray-600">{maid.cuisine}</p>
            <p className="text-sm text-gray-600">⭐ {maid.rating} | {maid.experience}</p>
          </div>
        ))}
      </div>

      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        disabled={!selectedMaid}
        onClick={handleConfirmSelection}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default MaidChoose;
