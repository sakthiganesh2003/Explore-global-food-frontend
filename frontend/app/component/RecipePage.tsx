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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Recipe Explorer</h1>
          <button
            className="md:hidden p-2 rounded-md bg-green-500 text-white hover:bg-green-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside
          className={`w-full md:w-64 bg-white rounded-lg shadow-md p-6 md:block ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Filters</h2>
          
          {/* Search Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Search Recipes</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category}
                  className={`p-2 rounded-md cursor-pointer text-sm ${
                    selectedCategory === category
                      ? "bg-green-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
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

          {/* Cuisines */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Cuisines</h3>
            <ul className="space-y-2">
              {cuisines.map((cuisine) => (
                <li
                  key={cuisine}
                  className={`p-2 rounded-md cursor-pointer text-sm ${
                    selectedCuisine === cuisine
                      ? "bg-green-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedCuisine(cuisine);
                    setSidebarOpen(false);
                  }}
                >
                  {cuisine}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Recipe Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">{recipe.title}</h2>
                  <p className="text-sm text-gray-600">{recipe.description}</p>
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>{recipe.category}</span>
                    <span>{recipe.cuisine}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Total time: {recipe.time}</p>
                  <Link href={`/recipe/${recipe.id}`}>
                    <button className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredRecipes.length === 0 && (
            <p className="text-center text-gray-600 mt-8">
              No recipes found. Try adjusting the filters or search term.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}