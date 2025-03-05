"use client";
import { useState } from "react";
import Link from "next/link";
import RecipePage1 from "../component/RecipePage";
import Navbar from "../component/navbar";
import Image from "next/image";

const recipes = [
  { id: 1, title: "Spaghetti Carbonara", category: "Pasta", cuisine: "Italian", image: "/indian.jpg", description: "A classic Italian pasta dish with eggs, cheese, pancetta, and pepper." },
  { id: 2, title: "Avocado Toast", category: "Breakfast", cuisine: "American", image: "/amarican.jpg", description: "A healthy and delicious toast topped with mashed avocado and seasonings." },
  { id: 3, title: "Chicken Biryani", category: "Rice", cuisine: "Indian", image: "/Thai.jpg", description: "A fragrant and flavorful rice dish made with spices, rice, and chicken." },
  { id: 4, title: "Sushi Rolls", category: "Seafood", cuisine: "Japanese", image: "/japan.jpg", description: "Traditional Japanese dish made with vinegared rice and various fillings." },
];

export default function ReceipeUser() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  const filteredRecipes = recipes.filter((recipe) => {
    return (
      recipe.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "All" || recipe.category === selectedCategory) &&
      (selectedCuisine === "All" || recipe.cuisine === selectedCuisine)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mt-12 text-gray-600">Recipes</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 text-black border border-gray-300 rounded-md mb-4"
        />

        {/* Filters */}
        <div className="flex space-x-4 mb-4 text-gray-600">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All</option>
            <option value="Pasta">Pasta</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Rice">Rice</option>
            <option value="Seafood">Seafood</option>
          </select>

          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All</option>
            <option value="Italian">Italian</option>
            <option value="American">American</option>
            <option value="Indian">Indian</option>
            <option value="Japanese">Japanese</option>
          </select>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 p-5">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer">
              <div className="relative w-full h-48">
                <Image src={recipe.image} alt={recipe.title} fill className="object-cover rounded-lg" />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{recipe.title}</h2>
                <p className="text-gray-600">{recipe.category} | {recipe.cuisine}</p>
                <Link href={`/recipe/${recipe.id}`}>
                  <button className="mt-2 px-4 py-2 bg-[#059669] text-white rounded-md hover:bg-[#115e59]">View Details</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="">
        <h1 className="text-center text-size text-gray-800 text-3xl font-serif font-bold mt-10">Traditional recipe</h1>
        <RecipePage1 />
      </div>
    </div>
  );
}
