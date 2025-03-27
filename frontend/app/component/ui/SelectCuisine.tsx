import { useState } from "react";

interface Cuisine {
  name: string;
  details: {
    name: string;
    price: number;
  }[];
  image: string;
}

const cuisines: Cuisine[] = [
  { 
    name: "Italian", 
    image: "/itallian.jpg",
    details: [
      { name: "Pasta", price: 250 },
      { name: "Pizza", price: 300 },
      { name: "Risotto", price: 280 }
    ]
  },
  { 
    name: "Chinese", 
    image: "/japan.jpg",
    details: [
      { name: "Dim Sum", price: 180 },
      { name: "Noodles", price: 200 },
      { name: "Peking Duck", price: 450 }
    ]
  },
  { 
    name: "Mexican", 
    image: "/mexican.jpg",
    details: [
      { name: "Tacos", price: 150 },
      { name: "Burritos", price: 220 },
      { name: "Enchiladas", price: 240 }
    ]
  },
  { 
    name: "Indian", 
    image: "/indian.jpg",
    details: [
      { name: "Curry", price: 180 },
      { name: "Biryani", price: 220 },
      { name: "Naan", price: 50 }
    ]
  },
];

interface SelectCuisineProps {
  maidId?: string; // Receiving maidId as a prop
  onSelectConfirmedFoods: (foods: { name: string; price: number }[]) => void;
}

export default function SelectCuisine({ onSelectConfirmedFoods }: SelectCuisineProps) {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<{name: string, price: number}[]>([]);

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };
  

  const handleFoodToggle = (food: {name: string, price: number}) => {
    setSelectedFoods(prev =>
      prev.some(f => f.name === food.name) 
        ? prev.filter(f => f.name !== food.name)
        : [...prev, food]
    );
  };

  const handleConfirm = () => {
    if (selectedFoods.length > 0) {
      onSelectConfirmedFoods(selectedFoods);
    }
  };

  const totalPrice = selectedFoods.reduce((sum, food) => sum + food.price, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800 " >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Select Your Preferred Cuisines</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-gray-800">
        {cuisines.map(({ name, image }) => (
          <div
            key={name}
            onClick={() => handleCuisineToggle(name)}
            className={`cursor-pointer border rounded-lg overflow-hidden transition-all ${
              selectedCuisines.includes(name) 
                ? "border-blue-500 ring-2 ring-blue-200" 
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <img 
              src={image} 
              alt={name} 
              className="w-full h-32 object-cover"
            />
            <div className="p-3 bg-white">
              <span className="font-medium">{name}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedCuisines.length > 0 && (
        <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-xl font-semibold">Select Food Items</h3>
            <p className="text-sm text-gray-500">Choose from the selected cuisines</p>
          </div>
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCuisines.flatMap(cuisine =>
              cuisines.find(c => c.name === cuisine)?.details.map(food => (
                <div 
                  key={food.name}
                  onClick={() => handleFoodToggle(food)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedFoods.some(f => f.name === food.name)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{food.name}</span>
                    <span className="text-green-600">₹{food.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="font-medium">Total Selected:</span>
                <span className="ml-2">{selectedFoods.length} items</span>
              </div>
              <div className="text-lg font-semibold">
                Total: <span className="text-green-600">₹{totalPrice}</span>
              </div>
            </div>
            
            <button
              onClick={handleConfirm}
              disabled={selectedFoods.length === 0}
              className={`w-full py-3 rounded-lg font-medium transition ${
                selectedFoods.length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedFoods.length > 0 
                ? `Confirm Order (₹${totalPrice})` 
                : "Select at least one item"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}