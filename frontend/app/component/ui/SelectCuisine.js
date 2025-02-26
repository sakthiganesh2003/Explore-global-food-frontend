"use client";
import { useState } from "react";

const cuisineDetails = {
  Italian: {
    Morning: [
      { name: "Frittata", image: "/maid/rice.jpg" },
      { name: "Cornetto", image: "/maid/dosi.jpg" },
      { name: "Cappuccino", image: "/maid/dal.jpg" },
    ],
    Evening: [
      { name: "Bruschetta", image: "/images/bruschetta.jpg" },
      { name: "Minestrone Soup", image: "/images/minestrone.jpg" },
      { name: "Lasagna", image: "/images/lasagna.jpg" },
    ],
    Night: [
      { name: "Pizza Margherita", image: "/images/pizza.jpg" },
      { name: "Risotto", image: "/images/risotto.jpg" },
      { name: "Tiramisu", image: "/images/tiramisu.jpg" },
    ],
  },
  Indian: {
    Morning: [
      { name: "Idli", image: "/images/idli.jpg" },
      { name: "Paratha", image: "/images/paratha.jpg" },
      { name: "Masala Chai", image: "/images/chai.jpg" },
    ],
    Evening: [
      { name: "Pakora", image: "/images/pakora.jpg" },
      { name: "Samosa", image: "/images/samosa.jpg" },
      { name: "Pav Bhaji", image: "/images/pavbhaji.jpg" },
    ],
    Night: [
      { name: "Butter Chicken", image: "/images/butterchicken.jpg" },
      { name: "Paneer Tikka", image: "/images/paneertikka.jpg" },
      { name: "Dal Makhani", image: "/images/dalmakhani.jpg" },
    ],
  },
};

const mealTimes = ["Morning", "Evening", "Night"];

const SelectCuisine = ({ onSelect = () => {} }) => {
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedMealTime, setSelectedMealTime] = useState("");
  const [selectedDish, setSelectedDish] = useState(null);

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine);
    setSelectedMealTime("");
    setSelectedDish(null);
  };

  const handleMealTimeSelect = (time) => {
    setSelectedMealTime(time);
    setSelectedDish(null);
  };

  const handleDishSelect = (dish) => {
    setSelectedDish(dish);
    onSelect({ cuisine: selectedCuisine, mealTime: selectedMealTime, dish });
  };

  return (
    <div className="text-center text-gray-800 p-6 bg-gray-100 rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Select a Cuisine</h2>

      {/* Cuisine Selection */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {Object.keys(cuisineDetails).map((cuisine) => (
          <button
            key={cuisine}
            className={`p-3 border rounded-lg transition-all duration-300 ${
              selectedCuisine === cuisine ? "bg-blue-500 text-white font-bold" : "bg-gray-100 hover:bg-gray-300"
            }`}
            onClick={() => handleCuisineSelect(cuisine)}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {/* Meal Time Selection */}
      {selectedCuisine && (
        <>
          <h2 className="text-xl font-semibold mb-2">Select Meal Time</h2>
          <div className="flex justify-center gap-4 mb-4">
            {mealTimes.map((time) => (
              <button
                key={time}
                className={`p-2 border rounded-lg transition-all duration-300 ${
                  selectedMealTime === time ? "bg-green-500 text-white font-bold" : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleMealTimeSelect(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Dish Selection */}
      {selectedCuisine && selectedMealTime && (
        <>
          <h2 className="text-xl font-semibold mb-2">Select Dish</h2>
          <div className="grid grid-cols-2 gap-4">
            {cuisineDetails[selectedCuisine][selectedMealTime].map((dish) => (
              <button
                key={dish.name}
                className={`p-2 border rounded-lg transition-all duration-300 flex flex-col items-center ${
                  selectedDish?.name === dish.name ? "bg-red-500 text-white font-bold" : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleDishSelect(dish)}
              >
                <img src={dish.image} alt={dish.name} className="w-20 h-20 rounded-lg mb-2" />
                {dish.name}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Summary */}
      {selectedCuisine && selectedMealTime && selectedDish && (
        <div className="mt-6 p-4 bg-white border rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Your Selection:</h3>
          <p>
            <strong>Cuisine:</strong> {selectedCuisine}
          </p>
          <p>
            <strong>Meal Time:</strong> {selectedMealTime}
          </p>
          <p>
            <strong>Dish:</strong> {selectedDish.name}
          </p>
          <img src={selectedDish.image} alt={selectedDish.name} className="w-32 h-32 mx-auto mt-2 rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default SelectCuisine;
