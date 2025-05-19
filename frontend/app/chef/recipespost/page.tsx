"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { NextPage } from "next";
import RecipePage1 from "../../component/RecipePage";
import ChefReview from "../../component/ChefReview";
import Navbar from "../../component/navbar";
import Footer from "@/app/component/Footer";

interface Recipe {
  id: string;
  title: string;
  chef: string;
  rating: number;
  category: string;
  cuisine: string;
  media: {
    url: string;
    type: "image" | "video";
  } | null;
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
    media?: {
      url: string;
      media_type: string;
    };
  }[];
}

const RecipeUser: NextPage = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not defined");
        }

        const response = await fetch(`${apiUrl}/api/chefposts`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = (await response.json()) as ApiResponse;
        if (result.success) {
          const mappedRecipes: Recipe[] = result.data.map((item) => ({
            id: item._id,
            title: item.recipe_name,
            chef: "Unknown Chef",
            rating: 4.5,
            category: item.category_type,
            cuisine: item.cuisine_type,
            media: item.media
              ? {
                  url: item.media.url ?? "/placeholder.jpg",
                  type: item.media.media_type === "video" ? "video" : "image",
                }
              : null,
            description: item.instructions,
          }));
          setRecipes(mappedRecipes);
        } else {
          setError("Failed to fetch recipes");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching recipes");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    return (
      recipe.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "All" || recipe.category === selectedCategory) &&
      (selectedCuisine === "All" || recipe.cuisine === selectedCuisine)
    );
  });

  const categories = ["All", ...new Set(recipes.map((recipe) => recipe.category))];
  const cuisines = ["All", ...new Set(recipes.map((recipe) => recipe.cuisine))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-800 to-emerald-600 py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
            Culinary Creations
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Discover handcrafted recipes from talented chefs worldwide
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-gray-700"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="relative flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none w-full p-4 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-gray-700"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative flex-1">
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="appearance-none w-full p-4 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-gray-700"
                >
                  {cuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="mb-16">
          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative h-60 overflow-hidden">
                      {recipe.media ? (
                        recipe.media.type === "image" ? (
                          <img
                            src={recipe.media.url}
                            alt={recipe.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        ) : (
                          <video
                          src={recipe.media.url}
                          controls
                          className="w-full h-full object-cover"
                        />
                        )
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full mr-2">
                              {recipe.category}
                            </span>
                            <span className="inline-block px-3 py-1 bg-white/90 text-gray-800 text-xs font-semibold rounded-full">
                              {recipe.cuisine}
                            </span>
                          </div>
                          <div className="flex items-center text-white">
                            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm">{recipe.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{recipe.title}</h2>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                      <Link href={`/chef/recipespost/${recipe.id}`}>
                        <button className="w-full py-3 px-6 bg-emerald-800 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center">
                          View Recipe
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No recipes found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chef Reviews */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-serif">
            Chef Testimonials
          </h2>
          <ChefReview />
        </div>

        {/* Signature Recipes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-serif">
            Signature Creations
          </h2>
          <RecipePage1 />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecipeUser;