import { useState } from "react";

const cuisines = [
  { name: "Italian", details: ["Pasta", "Pizza", "Risotto"], image: "/italian.jpg" },
  { name: "Chinese", details: ["Dim Sum", "Noodles", "Peking Duck"], image: "/chinese.jpg" },
  { name: "Mexican", details: ["Tacos", "Burritos", "Enchiladas"], image: "/mexican.jpg" },
  { name: "Indian", details: ["Curry", "Biryani", "Naan"], image: "/indian.jpg" },
];

interface SelectCuisineProps {
  onSelectConfirmedFoods: (foods: string[]) => void;
}

export default function SelectCuisine({ onSelectConfirmedFoods }: SelectCuisineProps) {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };

  const handleFoodToggle = (food: string) => {
    setSelectedFoods(prev =>
      prev.includes(food) ? prev.filter(f => f !== food) : [...prev, food]
    );
  };

  const handleConfirm = () => {
    onSelectConfirmedFoods(selectedFoods); // ✅ Send selected foods to global state
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Select Your Preferred Cuisines</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-800">
        {cuisines.map(({ name, image }) => (
          <div
            key={name}
            onClick={() => handleCuisineToggle(name)}
            className={`cursor-pointer border rounded-lg p-4 text-center transition-all ${
              selectedCuisines.includes(name) ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
          >
            <img src={image} alt={name} className="w-full h-40 object-cover rounded-md mb-2" />
            <span className="font-medium">{name}</span>
          </div>
        ))}
      </div>

      {selectedCuisines.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100 text-gray-800">
          <h3 className="text-xl font-semibold mb-2">Select Foods</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {selectedCuisines.flatMap(cuisine =>
              cuisines.find(c => c.name === cuisine)?.details.map(food => (
                <label key={food} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedFoods.includes(food)}
                    onChange={() => handleFoodToggle(food)}
                    className="w-4 h-4"
                  />
                  <span>{food}</span>
                </label>
              ))
            )}
          </div>

          <button
            onClick={handleConfirm}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            disabled={selectedFoods.length === 0}
          >
            Confirm Selection
          </button>
        </div>
      )}
    </div>
  );
}
