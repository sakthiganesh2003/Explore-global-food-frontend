"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
        if (!apiUrl) throw new Error("API URL not defined");

        const response = await fetch(`${apiUrl}/api/chefposts`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const result = (await response.json()) as ApiResponse;

        if (result.success) {
          const mapped: Recipe[] = result.data.map((item) => ({
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

          setRecipes(mapped);
        } else {
          setError("Failed to fetch recipes");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "All" || recipe.category === selectedCategory) &&
      (selectedCuisine === "All" || recipe.cuisine === selectedCuisine)
  );

  const categories = ["All", ...new Set(recipes.map((r) => r.category))];
  const cuisines = ["All", ...new Set(recipes.map((r) => r.cuisine))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-emerald-800 to-emerald-600 py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
            Culinary Creations
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Discover handcrafted recipes from talented chefs worldwide
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-4 border border-gray-200 rounded-xl"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="p-4 border border-gray-200 rounded-xl"
            >
              {cuisines.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-60">
                    {recipe.media ? (
                      recipe.media.type === "image" ? (
                        <Image
                          src={recipe.media.url}
                          alt={recipe.title}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
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
                        <span>No media</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 w-full bg-black/50 p-2 text-white text-sm">
                      <span className="bg-emerald-500 px-2 py-1 rounded mr-2">{recipe.category}</span>
                      <span className="bg-white/90 text-gray-800 px-2 py-1 rounded">{recipe.cuisine}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{recipe.title}</h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                    <Link href={`/chef/recipespost/${recipe.id}`}>
                      <button className="w-full py-3 px-6 bg-emerald-800 hover:bg-emerald-600 text-white font-medium rounded-lg transition">
                        View Recipe
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full">No matching recipes found.</p>
            )}
          </div>
        )}

        {/* Chef Reviews */}
        <div className="mt-20 mb-16">
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
