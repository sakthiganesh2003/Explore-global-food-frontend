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
  onSelect?: (maid: Maid | undefined) => void;
}

const maids: Maid[] = [
  { id: 1, name: "Sophia Lee", cuisine: "Italian, French", rating: 4.8, experience: "5 years", image: "/chef1.jpg" },
  { id: 2, name: "Amara Patel", cuisine: "Indian, Thai", rating: 4.7, experience: "3 years", image: "/chef1" },
  { id: 3, name: "Daniel Carter", cuisine: "American, BBQ", rating: 4.9, experience: "7 years", image: "/chef1" },
  { id: 4, name: "Lena Hoffman", cuisine: "German, Mediterranean", rating: 4.6, experience: "4 years", image: "/chef4.jpg" },
  { id: 5, name: "Lena Hoffman", cuisine: "German, Mediterranean", rating: 4.6, experience: "4 years", image: "/chef4.jpg" },
  { id: 6, name: "Lena Hoffman", cuisine: "German, Mediterranean", rating: 4.6, experience: "4 years", image: "/chef4.jpg" },
  
];

const MaidChoose: React.FC<MaidChooseProps> = ({ onSelect = () => {} }) => {
  const [selectedMaid, setSelectedMaid] = useState<number | null>(null);
  const [filter, setFilter] = useState("");

  const handleConfirmSelection = (): void => {
    if (selectedMaid !== null) {
      const chosenMaid = maids.find((maid) => maid.id === selectedMaid);
      console.log("Confirmed Maid:", chosenMaid);
      onSelect(chosenMaid);
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
              selectedMaid === maid.id ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
            onClick={() => setSelectedMaid(maid.id)}
          >
            <Image
              src={maid.image}
              alt={maid.name}
              width={24}
              height={24}
              className="w-24 h-24 mx-auto rounded-full object-cover"
            ></Image>
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