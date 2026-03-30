"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Sidebarchef from '@/app/component/dashboard/Sidebarchef';

interface FormData {
  recipe_name: string;
  category_type: string;
  instructions: string;
  cuisine_type: string;
  file: File | null;
  previewImage: string | null;
  fileType: string;
  ingredients: string[];
  prep_time: string;
  cook_time: string;
  servings: string;
}

export default function RecipeForm() {
  const [formData, setFormData] = useState<FormData>({
    recipe_name: '',
    category_type: '',
    instructions: '',
    cuisine_type: '',
    file: null,
    previewImage: null,
    fileType: '',
    ingredients: [''],
    prep_time: '',
    cook_time: '',
    servings: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage('File size exceeds 50MB limit');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          file,
          previewImage: reader.result as string,
          fileType: file.type
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSubmitSuccess(false);

    try {
      const prepTimeNum = Number(formData.prep_time);
      const cookTimeNum = Number(formData.cook_time);
      const servingsNum = Number(formData.servings);

      if (isNaN(prepTimeNum) || prepTimeNum < 0) {
        throw new Error('Prep time must be a positive number');
      }
      if (isNaN(cookTimeNum) || cookTimeNum < 0) {
        throw new Error('Cook time must be a positive number');
      }
      if (isNaN(servingsNum) || servingsNum < 1) {
        throw new Error('Servings must be a positive number');
      }

      const ingredientsArray = formData.ingredients
        .map(item => item.trim())
        .filter(item => item !== '');
      if (ingredientsArray.length === 0) {
        throw new Error('At least one ingredient is required');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('recipe_name', formData.recipe_name);
      formDataToSend.append('category_type', formData.category_type);
      formDataToSend.append('instructions', formData.instructions);
      formDataToSend.append('cuisine_type', formData.cuisine_type);
      formDataToSend.append('prep_time', prepTimeNum.toString());
      formDataToSend.append('cook_time', cookTimeNum.toString());
      formDataToSend.append('servings', servingsNum.toString());
      formDataToSend.append('ingredients', JSON.stringify(ingredientsArray));

      if (formData.file) {
        formDataToSend.append('image', formData.file);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Please log in to submit a recipe');
        return;
      }

      const API_URL = "https://explorer-global-food-backend.vercel.app";
      const response = await fetch(`${API_URL}/api/chefposts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit recipe');
      }

      setSubmitSuccess(true);
      setFormData({
        recipe_name: '',
        category_type: '',
        instructions: '',
        cuisine_type: '',
        file: null,
        previewImage: null,
        fileType: '',
        ingredients: [''],
        prep_time: '',
        cook_time: '',
        servings: ''
      });
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error: unknown) {
      const err = error as Error;
      setErrorMessage(err.message || 'An error occurred while submitting the recipe');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-amber-50 text-gray-800">
      <Sidebarchef />
      <motion.div 
        className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/recipe-bg.jpg')" }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-amber-200"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-opacity-20 bg-white"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-center font-serif">Share Your Signature Recipe</h2>
                <p className="text-center text-amber-100 mt-2 italic">&quot;A recipe has no soul. You, as the cook, must bring soul to the recipe.&quot;</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
              {submitSuccess && (
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="p-4 bg-green-100 text-green-800 rounded-lg flex items-center border-l-4 border-green-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Recipe submitted successfully! It&apos;s now cooking in our database!
                </motion.div>
              )}

              {errorMessage && (
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="p-4 bg-red-100 text-red-800 rounded-lg flex items-center border-l-4 border-red-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errorMessage}
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Recipe Name*</label>
                  <input
                    type="text"
                    name="recipe_name"
                    value={formData.recipe_name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                    placeholder="e.g. Grandma's Apple Pie"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Category*</label>
                  <select
                    name="category_type"
                    value={formData.category_type}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                  >
                    <option value="">Select...</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Cuisine*</label>
                  <select
                    name="cuisine_type"
                    value={formData.cuisine_type}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                  >
                    <option value="">Select...</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Indian">Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="French">French</option>
                    <option value="American">American</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Prep Time (minutes)*</label>
                  <input
                    type="number"
                    name="prep_time"
                    value={formData.prep_time}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                    placeholder="e.g. 30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Cook Time (minutes)*</label>
                  <input
                    type="number"
                    name="cook_time"
                    value={formData.cook_time}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                    placeholder="e.g. 60"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Servings*</label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                    placeholder="e.g. 4"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Ingredients*</label>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                      placeholder="e.g. 2 cups flour"
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        disabled={isSubmitting}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIngredient}
                  disabled={isSubmitting}
                  className="text-amber-600 hover:text-amber-700"
                >
                  + Add Ingredient
                </button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Instructions*</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={6}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                  placeholder="Detailed step-by-step instructions..."
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Recipe Media</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-amber-400 rounded-xl hover:border-amber-500 transition-all duration-300 bg-amber-50">
                  <div className="space-y-1 text-center">
                    {formData.previewImage ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative"
                      >
                        {formData.fileType.startsWith('video/') ? (
                          <video
                            src={formData.previewImage}
                            controls
                            className="mx-auto h-48 w-auto object-cover rounded-lg shadow-md border-2 border-white"
                          />
                        ) : (
                          <Image
                            src={formData.previewImage}
                            alt="Preview"
                            width={192}
                            height={192}
                            className="mx-auto h-48 w-auto object-cover rounded-lg shadow-md border-2 border-white"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, previewImage: null, file: null, fileType: '' }))}
                          disabled={isSubmitting}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </motion.div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-amber-500"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500 px-3 py-1 border border-amber-300"
                          >
                            <span>Upload an image or video</span>
                            <input
                              id="file-upload"
                              name="file"
                              type="file"
                              accept="image/jpeg,image/png,image/webp,video/mp4"
                              onChange={handleFileChange}
                              disabled={isSubmitting}
                              className="sr-only"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP, MP4 up to 50MB</p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-4 px-6 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 ${
                    isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cooking Up Your Submission...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Publish Recipe
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
