'use client';

import { useState } from "react";

interface FoodItem {
  name: string;
  price: number;
}

interface Cuisine {
  name: string;
  details: FoodItem[];
  image: string;
}

const cuisines: Cuisine[] = [
  { 
    name: "Italian", 
    image: "/italian.jpg",
    details: [
      { name: "Pasta", price: 250 },
      { name: "Pizza", price: 300 },
      { name: "Risotto", price: 280 }
    ]
  },
  { 
    name: "Chinese", 
    image: "/chinese.jpg",
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
  maidId?: string;
  maidSpecialties?: string[];
  onSelect: (cuisine: { id: string; name: string }) => void;
  onSelectConfirmedFoods: (foods: { id: string; name: string; price: number; quantity: number }[]) => void;
}

export default function SelectCuisine({ 
  maidSpecialties = [], 
  onSelect, 
  onSelectConfirmedFoods 
}: SelectCuisineProps) {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Record<string, {name: string, price: number, quantity: number}>>({});

  // Filter cuisines based on maid's specialties if provided
  const availableCuisines = maidSpecialties.length > 0 
    ? cuisines.filter(cuisine => maidSpecialties.includes(cuisine.name))
    : cuisines;

  const handleCuisineToggle = (cuisineName: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisineName) 
        ? prev.filter(c => c !== cuisineName) 
        : [...prev, cuisineName]
    );
    
    // When selecting a cuisine, also call the onSelect prop
    if (!selectedCuisines.includes(cuisineName)) {
      onSelect({ id: cuisineName.toLowerCase(), name: cuisineName });
    }
  };

  const handleFoodToggle = (food: FoodItem) => {
    setSelectedFoods(prev => {
      if (prev[food.name]) {
        const newState = {...prev};
        delete newState[food.name];
        return newState;
      } else {
        return {
          ...prev,
          [food.name]: {
            ...food,
            quantity: 1
          }
        };
      }
    });
  };

  const handleQuantityChange = (foodName: string, quantity: number) => {
    setSelectedFoods(prev => ({
      ...prev,
      [foodName]: {
        ...prev[foodName],
        quantity: Math.max(1, quantity)
      }
    }));
  };

  const handleConfirm = () => {
    const confirmedFoods = Object.values(selectedFoods).map(food => ({
      id: `food-${food.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: food.name,
      price: food.price,
      quantity: food.quantity
    }));
    
    onSelectConfirmedFoods(confirmedFoods);
  };

  const totalPrice = Object.values(selectedFoods).reduce(
    (sum, food) => sum + (food.price * food.quantity), 
    0
  );

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Select Your Preferred Cuisines</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-gray-800">
        {availableCuisines.map(({ name, image }) => (
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
            {selectedCuisines.flatMap(cuisineName =>
              availableCuisines.find(c => c.name === cuisineName)?.details.map(food => (
                <div 
                  key={food.name}
                  className={`p-3 border rounded-lg transition-all ${
                    selectedFoods[food.name]
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{food.name}</span>
                    <span className="text-green-600">₹{food.price}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => handleFoodToggle(food)}
                      className={`px-3 py-1 text-sm rounded ${
                        selectedFoods[food.name]
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      {selectedFoods[food.name] ? 'Remove' : 'Add'}
                    </button>
                    
                    {selectedFoods[food.name] && (
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleQuantityChange(food.name, selectedFoods[food.name].quantity - 1)}
                          className="px-2 py-1 bg-gray-200 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 bg-gray-100">
                          {selectedFoods[food.name].quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(food.name, selectedFoods[food.name].quantity + 1)}
                          className="px-2 py-1 bg-gray-200 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="font-medium">Total Selected:</span>
                <span className="ml-2">
                  {Object.values(selectedFoods).reduce((sum, food) => sum + food.quantity, 0)} items
                </span>
              </div>
              <div className="text-lg font-semibold">
                Total: <span className="text-green-600">₹{totalPrice}</span>
              </div>
            </div>
            
            <button
              onClick={handleConfirm}
              disabled={Object.keys(selectedFoods).length === 0}
              className={`w-full py-3 rounded-lg font-medium transition ${
                Object.keys(selectedFoods).length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {Object.keys(selectedFoods).length > 0 
                ? `Confirm Order (₹${totalPrice})` 
                : "Select at least one item"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}