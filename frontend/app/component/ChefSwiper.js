"use client";

import { useState } from "react";
import Image from "next/image";

const chefs = [
  {
    id: 1,
    name: "Shef Kimberly",
    location: "New York",
    rating: 4.4,
    category: "Vegan Food",
    image: "/chef4.jpg",
  },
  {
    id: 2,
    name: "Shef John",
    location: "Los Angeles",
    rating: 4.7,
    category: "Italian Cuisine",
    image: "/chef1.jpg",
  },
  {
    id: 3,
    name: "Shef Maria",
    location: "San Francisco",
    rating: 4.6,
    category: "Mexican Food",
    image: "/chef2.jpg",
  },
];

const ChefSwiper= () =>  {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row items-center gap-8">
      {/* Left Section */}
      <div className="md:w-1/2 text-left">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          BRINGING THE HUMANITY BACK TO MEALTIME
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          We work with the best cooks in town who believe that cooking is a form
          of care and connection to the world around us.
        </p>
        
        </div>
      
      {/* Right Section (Carousel) */}
      <div className="md:w-1/2 relative">
        <div className="flex overflow-hidden gap-4">
          {chefs.map((chef, index) => (
            <div
              key={chef.id}
              className={`rounded-xl shadow-lg bg-white p-4 transition-all duration-500 ease-in-out ${
                index === currentIndex ? "block" : "hidden"
              }`}
            >``
              <div className="relative">
                <Image
                  src={chef.image}
                  alt={chef.name}
                  width={400}
                  height={300}
                  className="rounded-xl object-cover"
                />
                <span className="absolute top-2 left-2 bg-pink-200 text-pink-700 px-3 py-1 text-xs rounded-md">
                  📍 {chef.location}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{chef.name}</h3>
              <p className="text-gray-600">⭐ {chef.rating} | {chef.category}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          {chefs.map((_, index) => (
            <button
              key={index}
              className={`w-6 h-6 rounded-full text-sm font-semibold border border-gray-500 flex items-center justify-center ${
                currentIndex === index ? "bg-red-500 text-white" : "bg-white"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ChefSwiper