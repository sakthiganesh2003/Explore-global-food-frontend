"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface Recipe {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  status: string;
}

interface StatusCounts {
  [key: string]: number;
}

interface ChefPostsData {
  chefId: string;
  totalRecipes: number;
  recipes: Recipe[];
  statusCounts: StatusCounts;
}

const ChefPostsPage: React.FC = () => {
  const params = useParams();
  const chefId = params.chefId as string;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chefData, setChefData] = useState<ChefPostsData>({
    chefId: '',
    totalRecipes: 0,
    recipes: [],
    statusCounts: {}
  });
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const fetchChefPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ success: boolean; data: ChefPostsData }>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chefposts/chef/status/${chefId}`
        );
        setChefData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchChefPosts();
  }, [chefId]);

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);
  };

  const filteredRecipes = activeTab === 'all' 
    ? chefData.recipes 
    : chefData.recipes.filter(recipe => recipe.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error loading chef posts: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Chef's Recipes</h1>
      
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            All ({chefData.totalRecipes})
          </button>
          {Object.entries(chefData.statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => handleTabChange(status)}
              className={`px-4 py-2 ${activeTab === status ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            >
              {`${status.charAt(0).toUpperCase() + status.slice(1)} (${count})`}
            </button>
          ))}
        </div>
      </div>

      {chefData.totalRecipes === 0 ? (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold">No recipes found</h2>
          <p className="text-gray-500 mt-2">
            This chef hasn't posted any recipes yet.
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add New Recipe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div key={recipe._id} className="flex flex-col border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src={recipe.image || '/placeholder-recipe.jpg'}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4">
                  {recipe.description || 'No description available'}
                </p>
                <span className={`mt-auto px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recipe.status)}`}>
                  {recipe.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChefPostsPage;