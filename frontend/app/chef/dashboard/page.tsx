"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Sidebarchef from '@/app/component/dashboard/Sidebarchef';

interface FormData {
  recipe_name: string;
  category_type: string;
  instructions: string;
  date_time: string;
  cuisine_type: string;
  file: File | null;
  previewImage: string | null;
  ingredients: string;
  prep_time: string;
  cook_time: string;
  servings: string;
}

export default function RecipeForm() {
  const [formData, setFormData] = useState<FormData>({
    recipe_name: '',
    category_type: '',
    instructions: '',
    date_time: '',
    cuisine_type: '',
    file: null,
    previewImage: null,
    ingredients: '',
    prep_time: '',
    cook_time: '',
    servings: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          file,
          previewImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitSuccess(true);
    setIsSubmitting(false);
  };

  // Animation variants
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
    <div className="flex min-h-screen bg-amber-50">
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
                <p className="text-center text-amber-100 mt-2 italic">"A recipe has no soul. You, as the cook, must bring soul to the recipe."</p>
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
                  Recipe submitted successfully! It's now cooking in our database!
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
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Prep Time</label>
                  <input
                    type="text"
                    name="prep_time"
                    value={formData.prep_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                    placeholder="e.g. 30 mins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Cook Time</label>
                  <input
                    type="text"
                    name="cook_time"
                    value={formData.cook_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                    placeholder="e.g. 1 hour"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Servings</label>
                  <input
                    type="text"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                    placeholder="e.g. 4 people"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Date Created</label>
                  <input
                    type="datetime-local"
                    name="date_time"
                    value={formData.date_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Ingredients*</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50 font-mono"
                  placeholder="List each ingredient on a new line:
- 2 cups flour
- 1 tsp salt
- 3 eggs..."
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Instructions*</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-amber-50"
                  placeholder="Detailed step-by-step instructions..."
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Recipe Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-amber-400 rounded-xl hover:border-amber-500 transition-all duration-300 bg-amber-50">
                  <div className="space-y-1 text-center">
                    {formData.previewImage ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative"
                      >
                        <img
                          src={formData.previewImage}
                          alt="Preview"
                          className="mx-auto h-48 w-auto object-cover rounded-lg shadow-md border-2 border-white"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, previewImage: null, file: null }))}
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
                            <span>Upload Image</span>
                            <input
                              id="file-upload"
                              name="file"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="sr-only"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
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