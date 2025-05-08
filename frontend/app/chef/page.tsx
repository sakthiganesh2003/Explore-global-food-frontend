"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import RecipePage1 from "../component/RecipePage";
import ChefReview from "../component/ChefReview";
import Navbar from "../component/navbar";

// Define TypeScript interfaces
interface Recipe {
  id: string;
  title: string;
  chef: string;
  rating: number;
  category: string;
  cuisine: string;
  image: string;
  description: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    _id: string;
    recipe_name: string;
    category_type: string;
    cuisine_type: string;
    instructions: string;
    media: {
      url: string;
    };
  }[];
}

export default function ReceipeUser() {
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chefposts`);
        const result: ApiResponse = await response.json();
        if (result.success) {
          // Map API data to match frontend structure
          const mappedRecipes: Recipe[] = result.data.map((item) => ({
            id: item._id,
            title: item.recipe_name,
            chef: "Unknown Chef", // API doesn't provide chef name, using placeholder
            rating: 4.5, // API doesn't provide rating, using default
            category: item.category_type,
            cuisine: item.cuisine_type,
            image: item.media.url, // Using image instead of video
            description: item.instructions,
          }));
          setRecipes(mappedRecipes);
        } else {
          setError("Failed to fetch recipes");
        }
      } catch (err) {
        setError("Error fetching recipes");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // Filter recipes based on search and dropdowns
  const filteredRecipes = recipes.filter((recipe) => {
    return (
      recipe.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "All" || recipe.category === selectedCategory) &&
      (selectedCuisine === "All" || recipe.cuisine === selectedCuisine)
    );
  });

  // Get unique categories and cuisines for dropdowns
  const categories = ["All", ...new Set(recipes.map((recipe) => recipe.category))];
  const cuisines = ["All", ...new Set(recipes.map((recipe) => recipe.cuisine))];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mt-12 text-gray-800 font-sans">
          Explore Chef Recipes
        </h1>

        {/* Search Section */}
        <div className="flex justify-center mb-8 mt-6">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <select
            value={selectedCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedCuisine}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCuisine(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          >
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Loading and Error States */}
        {loading && <p className="text-center text-gray-600">Loading recipes...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Recipe Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 animate-fade-in"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      By {recipe.chef} | ⭐ {recipe.rating}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {recipe.category} | {recipe.cuisine}
                    </p>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                      {recipe.description}
                    </p>
                    <Link href={`/recipe/${recipe.id}`}>
                      <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition w-full">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                No recipes found.
              </p>
            )}
          </div>
        )}

        {/* Chef Reviews */}
        <div className="mt-12">
          <ChefReview />
        </div>

        {/* Signature Recipes */}
        <div className="mt-16">
          <h1 className="text-center text-gray-800 text-3xl font-sans font-bold mb-8">
            Signature Recipes
          </h1>
          <RecipePage1 />
        </div>
      </div>
    </div>
  );
}