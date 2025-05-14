"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';

// Define the interface for the recipe data based on the provided JSON
interface Media {
  url: string;
  public_id: string;
  media_type: string;
  width: number;
  height: number;
  format: string;
  duration?: number;
}

interface Recipe {
  media: Media;
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
  updatedAt: string;
}

const ChefDashboard = () => {
  const params = useParams();
  const id = params.id as string; // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipe data from the API
  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chefposts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }
        const result = await response.json();
        if (result.success) {
          setRecipe(result.data);
        } else {
          throw new Error('API returned an error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-600">{error || 'Recipe not found'}</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Chef Dashboard - {recipe.recipe_name}</title>
        <meta name="description" content={`View details for ${recipe.recipe_name}`} />
      </Head>
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold">{recipe.recipe_name}</h1>
            <p className="mt-2 text-lg">Cuisine: {recipe.cuisine_type} | Category: {recipe.category_type}</p>
          </div>

          {/* Media */}
          <div className="p-6">
            {recipe.media.media_type === 'video' ? (
              <video
                className="w-full h-64 object-cover rounded-lg"
                controls
                src={recipe.media.url}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={recipe.media.url}
                alt={recipe.recipe_name}
                width={recipe.media.width}
                height={recipe.media.height}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Recipe Details */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Ingredients</h2>
              <ul className="mt-4 list-disc list-inside text-gray-700">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Instructions</h2>
              <p className="mt-4 text-gray-700">{recipe.instructions}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">Prep Time</p>
                <p className="text-gray-600">{recipe.prep_time} minutes</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">Cook Time</p>
                <p className="text-gray-600">{recipe.cook_time} minutes</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">Servings</p>
                <p className="text-gray-600">{recipe.servings}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-100 border-t text-center">
            <p className="text-gray-600">
              Created on: {new Date(recipe.created_at).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              Last updated: {new Date(recipe.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChefDashboard;