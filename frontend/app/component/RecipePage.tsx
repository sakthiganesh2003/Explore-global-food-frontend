"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const categories = ["All", "Village Food", "Home made Food", "Snacks", "Seafood"];
const cuisines = ["All", "Italian", "American", "Indian", "Japanese"];

const recipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    category: "Village Food",
    cuisine: "Italian",
    image: "/itallian.jpg",
    description: "Classic Italian pasta with eggs, cheese, pancetta, and pepper.",
    time: "30 Mins",
  },
  {
    id: 2,
    title: "Avocado Toast",
    category: "Home made Food",
    cuisine: "American",
    image: "/amarican.jpg",
    description: "Toast topped with mashed avocado and seasonings.",
    time: "10 Mins",
  },
  {
    id: 3,
    title: "Chicken Biryani",
    category: "Snacks",
    cuisine: "Indian",
    image: "/indian.jpg",
    description: "A fragrant rice dish made with spices and chicken.",
    time: "45 Mins",
  },
  {
    id: 4,
    title: "Sushi Rolls",
    category: "Seafood",
    cuisine: "Japanese",
    image: "/japan.jpg",
    description: "Japanese rolls made with vinegared rice and fillings.",
    time: "25 Mins",
  },
];

export default function RecipePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredRecipes = recipes.filter((recipe) => {
    return (
      recipe.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "All" || recipe.category === selectedCategory) &&
      (selectedCuisine === "All" || recipe.cuisine === selectedCuisine)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row px-10 ">
      {/* Sidebar Toggle Button for Mobile */}
      <button 
        className="p-4 bg-green-500 text-white md:hidden" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "Close Menu" : "Open Menu"}
      </button>
      
      {/* Sidebar */}
      <div 
        className={`w-full md:w-1/6 p-6 bg-white shadow-md md:block ${sidebarOpen ? "block" : "hidden"}`}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-500">Categories</h2>
        <ul>
          {categories.map((category, index) => (
            <li
              key={index}
              className={`p-3 cursor-pointer ${
                selectedCategory === category ? "bg-green-500 text-white rounded-md" : "text-gray-800"
              }`}
              onClick={() => {
                setSelectedCategory(category);
                setSidebarOpen(false);
              }}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-5/6 p-6">
        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative w-full h-48 sm:h-56">
                <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{recipe.title}</h2>
                <p className="text-gray-600 text-sm sm:text-base">{recipe.category} | {recipe.cuisine}</p>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">Total time: {recipe.time}</p>
                <Link href={`/recipe/${recipe.id}`}>
                  <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition w-full text-sm sm:text-base">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredRecipes.length === 0 && (
          <p className="text-center text-gray-600 mt-6">No recipes found. Try adjusting the filters.</p>
        )}
      </div>
    </div>
  );
}
