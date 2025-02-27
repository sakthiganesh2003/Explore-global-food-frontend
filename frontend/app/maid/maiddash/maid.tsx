"use client";

import { useState, ChangeEvent } from "react";

const ChefDashboard = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
  const updateStep = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const handleSubmit = (status: string) => {
    alert(`Recipe ${status} successfully!`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Chef Dashboard</h2>
      
      {/* Recipe Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Recipe Title"
        className="w-full p-2 border rounded mb-3"
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Recipe Description"
        className="w-full p-2 border rounded mb-3"
      />

      {/* Image Upload */}
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-3" />
      {preview && <img src={preview} alt="Preview" className="w-full h-40 object-cover mb-3" />}

      {/* Ingredients */}
      <h3 className="font-semibold">Ingredients</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => updateIngredient(index, e.target.value)}
            placeholder="Ingredient"
            className="flex-grow p-2 border rounded"
          />
          <button onClick={() => removeIngredient(index)} className="text-red-500">✕</button>
        </div>
      ))}
      <button onClick={addIngredient} className="text-blue-500">+ Add Ingredient</button>

      {/* Steps */}
      <h3 className="font-semibold mt-4">Steps</h3>
      {steps.map((step, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <textarea
            value={step}
            onChange={(e) => updateStep(index, e.target.value)}
            placeholder={`Step ${index + 1}`}
            className="flex-grow p-2 border rounded"
          />
          <button onClick={() => removeStep(index)} className="text-red-500">✕</button>
        </div>
      ))}
      <button onClick={addStep} className="text-blue-500">+ Add Step</button>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button onClick={() => handleSubmit("saved as draft")} className="bg-gray-500 text-white px-4 py-2 rounded">Save as Draft</button>
        <button onClick={() => handleSubmit("published")} className="bg-blue-500 text-white px-4 py-2 rounded">Publish</button>
      </div>
    </div>
  );
};

export default ChefDashboard;
