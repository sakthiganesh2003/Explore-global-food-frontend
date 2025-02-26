"use client";
import { useState } from "react";
import Link from "next/link";

export default function UploadRecipe() {
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    cuisine: "",
    ingredients: "",
    instructions: "",
    image: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Recipe:", newRecipe); // Temporary: Replace with API call or global state update
    setNewRecipe({ title: "", cuisine: "", ingredients: "", instructions: "", image: "" });
    alert("Recipe submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-black">Upload Your Recipe</h2>

        <Link href="/explore">
          <button className="mb-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-white-600">
            Back to Explore
          </button>
        </Link>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Recipe Title"
            className="w-full p-2 mb-4 border rounded text-gray-600"
            value={newRecipe.title}
            onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Cuisine"
            className="w-full p-2 mb-4 border rounded text-gray-600"
            value={newRecipe.cuisine}
            onChange={(e) => setNewRecipe({ ...newRecipe, cuisine: e.target.value })}
            required
          />
          <textarea
            placeholder="Ingredients (comma separated)"
            className="w-full p-2 mb-4 border rounded text-gray-600"
            value={newRecipe.ingredients}
            onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
            required
          ></textarea>
          <textarea
            placeholder="Instructions"
            className="w-full p-2 mb-4 border rounded text-gray-600"
            value={newRecipe.instructions}
            onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
            required
          ></textarea>
          <input
            type="file"
            placeholder="Image URL"
            className="w-full p-2 mb-4 border rounded text-gray-600"
            value={newRecipe.image}
            onChange={(e) => setNewRecipe({ ...newRecipe, image: e.target.value })}
          />
          <button type="submit" className="bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-white-600">
            Submit Recipe
          </button>
        </form>
      </div>
    </div>
  );
}
