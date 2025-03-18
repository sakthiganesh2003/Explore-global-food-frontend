import { useState } from "react";
import Image from "next/image"; 

interface Maid {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  experience: string;
  image: string;
}

interface MaidChooseProps {
  onNext: (maid: Maid) => void; // Ensure onNext gets the selected maid
}

const maids: Maid[] = [
  { id: 1, name: "Sophia Lee", cuisine: "Italian, French", rating: 4.8, experience: "5 years", image: "/chef3.jpg" },
  { id: 2, name: "Amara Patel", cuisine: "Indian, Thai", rating: 4.7, experience: "3 years", image: "/chef3.jpg" },
  { id: 3, name: "Daniel Carter", cuisine: "American, BBQ", rating: 4.9, experience: "7 years", image: "/chef1.jpg" },
  { id: 4, name: "Lena Hoffman", cuisine: "German, Mediterranean", rating: 4.6, experience: "4 years", image: "/chef4.jpg" },
];

const MaidChoose: React.FC<MaidChooseProps> = ({ onNext }) => {
  const [selectedMaid, setSelectedMaid] = useState<Maid | null>(null);
  const [filter, setFilter] = useState("");

  const handleConfirmSelection = (): void => {
    if (selectedMaid) {
      console.log("Confirmed Maid:", selectedMaid);
      onNext(selectedMaid); // Send maid data and move to next step
    }
  };

  const filteredMaids = maids.filter((maid) =>
    maid.cuisine.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="text-center text-gray-500">
      <h2 className="text-xl font-semibold mb-4">Choose Your Maid</h2>
      
      <input
        type="text"
        placeholder="Filter by cuisine..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 mb-4 border rounded w-full sm:w-1/2"
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {filteredMaids.map((maid) => (
          <div
            key={maid.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedMaid?.id === maid.id ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
            onClick={() => setSelectedMaid(maid)}
          >
            <Image
              src={maid.image}
              alt={maid.name}
              width={80}
              height={80}
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />
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
