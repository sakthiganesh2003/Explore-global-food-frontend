"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const recipes = [
  { 
    id: 1, 
    title: "Spaghetti Carbonara", 
    category: "Pasta", 
    cuisine: "Italian", 
    image: "/indian.jpg", 
    description: [
      "A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
      "Originated in Rome and traditionally made with guanciale."
    ], 
    steps: [
      "Boil pasta in salted water until al dente",
      "Cook pancetta until crispy",
      "Whisk eggs and grated Pecorino Romano cheese",
      "Combine everything while pasta is hot to create creamy sauce"
    ] 
  },
  { 
    id: 2, 
    title: "Avocado Toast", 
    category: "Breakfast", 
    cuisine: "American", 
    image: "/Thai.jpg", 
    description: [
      "A healthy and delicious toast topped with mashed avocado and seasonings.",
      "Popular brunch item with many variations."
    ], 
    steps: [
      "Toast bread until golden and crisp",
      "Mash ripe avocado with lime juice and salt",
      "Spread avocado mixture on toast",
      "Add toppings like cherry tomatoes, feta, or poached eggs"
    ] 
  },
  { 
    id: 3, 
    title: "Chicken Biryani", 
    category: "Rice", 
    cuisine: "Indian", 
    image: "", 
    description: [
      "A fragrant and flavorful rice dish made with spices, rice, and chicken.",
      "Layered dish cooked using the dum method for maximum flavor."
    ], 
    steps: [
      "Marinate chicken in yogurt and spices for 2 hours",
      "Parboil basmati rice with whole spices",
      "Prepare fried onions and biryani masala",
      "Layer rice and chicken, seal pot, and cook on low heat"
    ] 
  },
  { 
    id: 4, 
    title: "Sushi Rolls", 
    category: "Seafood", 
    cuisine: "Japanese", 
    image: "", 
    description: [
      "Traditional Japanese dish made with vinegared rice and various fillings.",
      "Includes nori seaweed, fresh fish, and vegetables."
    ], 
    steps: [
      "Cook sushi rice and season with vinegar mixture",
      "Prepare fillings (fish, cucumber, avocado)",
      "Spread rice on nori sheet, add fillings, and roll tightly",
      "Slice into pieces and serve with soy sauce and wasabi"
    ] 
  },
];

export default function RecipeDetail() {
  const { id } = useParams();
  const router = useRouter();
  const recipe = recipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Recipe Not Found</h2>
          <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-blue-500 hover:text-blue-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Recipe Image */}
          {recipe.image ? (
            <div className="relative h-64 sm:h-80 w-full">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          ) : (
            <div className="h-64 sm:h-80 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-lg">No Image Available</span>
            </div>
          )}

          {/* Recipe Content */}
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{recipe.title}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {recipe.category}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {recipe.cuisine}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">About This Dish</h2>
              <ul className="space-y-2 text-gray-600">
                {recipe.description.map((desc, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Cooking Steps</h2>
              <ol className="space-y-3">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition duration-200"
              >
                Back to Recipes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}