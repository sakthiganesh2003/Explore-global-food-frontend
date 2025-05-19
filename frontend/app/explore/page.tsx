"use client";
import { useState } from "react";
import Link from "next/link";
import RecipePage1 from "../component/RecipePage";
import Navbar from "../component/navbar";
import Image from "next/image";
import Footer from "../component/Footer";

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
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-emerald-800 to-emerald-600 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Discover World Recipes</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Explore culinary traditions from around the globe
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="All">All Categories</option>
                <option value="Pasta">Pasta</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Rice">Rice</option>
                <option value="Seafood">Seafood</option>
              </select>

              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="All">All Cuisines</option>
                <option value="Italian">Italian</option>
                <option value="American">American</option>
                <option value="Indian">Indian</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-full h-48">
                <Image 
                  src={recipe.image} 
                  alt={recipe.title} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <span className="inline-block px-2 py-1 bg-emerald-600 text-white text-xs font-medium rounded mr-2">
                    {recipe.category}
                  </span>
                  <span className="inline-block px-2 py-1 bg-amber-600 text-white text-xs font-medium rounded">
                    {recipe.cuisine}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{recipe.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                <Link href={`/recipe/${recipe.id}`}>
                  <button className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors">
                    View Recipe
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Traditional Recipe Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Traditional Recipes</h2>
            <div className="w-20 h-1 bg-emerald-600 mx-auto"></div>
          </div>
          <RecipePage1 />
        </div>
      </div>
      <Footer/>
    </div>
    
  );
}