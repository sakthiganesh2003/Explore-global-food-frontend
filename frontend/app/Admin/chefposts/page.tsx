"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Sidebar from '@/app/component/dashboard/Sidebar';

interface Media {
  url: string;
  public_id: string;
  media_type: 'image' | 'video';
  width: number;
  height: number;
  format: string;
  duration?: number;
}

interface Recipe {
  _id: string;
  recipe_name: string;
  category_type: string;
  instructions: string;
  cuisine_type: string;
  ingredients: string[];
  prep_time: string;
  cook_time: string;
  servings: string;
  date_time: string;
  created_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  media: Media;
}

interface ApiResponse {
  success: boolean;
  count: number;
  page: number;
  pages: number;
  total: number;
  data: Recipe[];
}

export default function AdminDashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/chefposts`);
        if (response.data.success) {
          setRecipes(response.data.data);
        } else {
          setError('Failed to fetch recipes');
        }
      } catch (err) {
        setError('Error fetching data: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/chefposts/${id}`);
      if (response.data.success) {
        setRecipes(recipes.filter((recipe) => recipe._id !== id));
      } else {
        setError('Failed to delete recipe');
      }
    } catch (err) {
      setError('Error deleting recipe: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-600">
      <Sidebar />
      <div className="min-h-screen bg-gray-100 flex-1">
        <Head>
          <title>Admin Dashboard - Recipes</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <nav className="bg-blue-600 p-4 text-white">
          <h1 className="text-2xl font-bold">Admin Dashboard - Recipes</h1>
        </nav>
        <div className="container mx-auto p-6">
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipe Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuisine</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingredients</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prep Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cook Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recipes.map((recipe) => (
                      <tr key={recipe._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.recipe_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.category_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.cuisine_type}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{recipe.ingredients.join(', ')}</td>
                        <td className="px-6 py-4">
                          {recipe.media.media_type === 'image' ? (
                            <img src={recipe.media.url} alt={recipe.recipe_name} className="w-16 h-16 object-cover rounded" />
                          ) : (
                            <video src={recipe.media.url} className="w-16 h-16 object-cover rounded" controls />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.prep_time} min</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.cook_time} min</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.servings}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(recipe.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDelete(recipe._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}