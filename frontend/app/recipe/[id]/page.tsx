"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const recipes = [
  { id: 1, title: "Spaghetti Carbonara", category: "Pasta", cuisine: "Italian", image: "/indian.jpg", description: ["A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.","A classic Italian pasta dish with eggs, cheese, pancetta, and pepper." ], steps: ["Boil pasta", "Cook pancetta", "Mix eggs and cheese", "Combine everything"] },
  { id: 2, title: "Avocado Toast", category: "Breakfast", cuisine: "American", image: "/Thai.jpg", description: ["A healthy and delicious toast topped with mashed avocado and seasonings."], steps: ["Toast bread", "Mash avocado", "Spread on toast", "Season with salt and pepper"] },
  { id: 3, title: "Chicken Biryani", category: "Rice", cuisine: "Indian", image: "/", description: ["A fragrant and flavorful rice dish made with spices, rice, and chicken."], steps: ["Marinate chicken", "Cook rice", "Prepare masala", "Layer and cook"] },
  { id: 4, title: "Sushi Rolls", category: "Seafood", cuisine: "Japanese", image: "/", description: ["Traditional Japanese dish made with vinegared rice and various fillings."], steps: ["Cook sushi rice", "Prepare fillings", "Roll sushi", "Slice and serve"] },
];

export default function RecipeDetail() {
  const { id } = useParams(); // ✅ Using useParams() in client component
  const router = useRouter();
  const recipe = recipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return <p className="text-center text-red-500 mt-10">Recipe not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-500">{recipe.title}</h1>
          <p className="text-gray-600 ">{recipe.category} | {recipe.cuisine}</p>
         { /* <p className="mt-4 text-gray-700">{recipe.description}</p> */}

          {/* Steps Section */}
          <h2 className="text-xl font-semibold mt-6 text-gray-400">description</h2>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            {recipe.description.map((description, index) => (
              <li key={index}>{description}</li>
            ))}
          </ul>

          {/* Steps Section */}
          <h2 className="text-xl font-semibold mt-6 text-gray-400">Steps</h2>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>

          <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Go Back</button>
        </div>
      </div>
    </div>
  );
}
