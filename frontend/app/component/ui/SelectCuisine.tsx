'use client';

import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";

interface FoodItem {
  name: string;
  price: number;
  description?: string;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
}

interface CuisineCategory {
  name: string;
  details: FoodItem[];
}

interface Cuisine {
  name: string;
  categories?: CuisineCategory[];
  details?: FoodItem[];
  image: string;
  icon?: string;
  color: string;
}

const cuisines: Cuisine[] = [
  { 
    name: "Italian", 
    image: "/itallian.jpg",
    icon: "🍝",
    color: "from-amber-500 to-amber-600",
    details: [
      { name: "Pasta Carbonara", price: 250, description: "Classic Roman pasta with eggs, cheese, pancetta, and pepper", popular: true },
      { name: "Margherita Pizza", price: 300, description: "Traditional pizza with tomato, mozzarella, and basil", vegetarian: true },
      { name: "Risotto Milanese", price: 280, description: "Creamy saffron-infused risotto", vegetarian: true }
    ]
  },
  { 
    name: "Chinese", 
    image: "/chinese.jpg",
    icon: "🥢",
    color: "from-red-500 to-red-600",
    details: [
      { name: "Dim Sum Platter", price: 180, description: "Assorted steamed dumplings and buns", popular: true },
      { name: "Sichuan Noodles", price: 200, description: "Spicy noodles with Sichuan peppercorns", spicy: true },
      { name: "Peking Duck", price: 450, description: "Crispy duck served with pancakes and hoisin sauce" }
    ]
  },
  { 
    name: "Mexican", 
    image: "/mexican.jpg",
    icon: "🌮",
    color: "from-green-500 to-green-600",
    details: [
      { name: "Street Tacos", price: 150, description: "Three corn tortillas with choice of filling", popular: true },
      { name: "Burrito Bowl", price: 220, description: "Rice, beans, meat, and toppings in a bowl" },
      { name: "Enchiladas Verdes", price: 240, description: "Corn tortillas rolled around chicken and covered with green salsa", spicy: true }
    ]
  },
  { 
    name: "Indian", 
    image: "/indian.jpg",
    icon: "🍛",
    color: "from-orange-500 to-orange-600",
    categories: [
      {
        name: "North Indian",
        details: [
          { name: "Butter Chicken", price: 280, description: "Tandoori chicken in a creamy tomato sauce", popular: true },
          { name: "Rogan Josh", price: 320, description: "Aromatic lamb curry from Kashmir", spicy: true },
          { name: "Dal Makhani", price: 180, description: "Creamy black lentils simmered overnight", vegetarian: true }
        ]
      },
      {
        name: "South Indian",
        details: [
          { name: "Masala Dosa", price: 120, description: "Crispy rice crepe filled with spiced potatoes", vegetarian: true, popular: true },
          { name: "Idli Sambar", price: 80, description: "Steamed rice cakes with lentil stew", vegetarian: true },
          { name: "Hyderabadi Biryani", price: 220, description: "Fragrant rice dish with meat and spices" }
        ]
      },

    ]
  },
];

interface SelectCuisineProps {
  maidId?: string;
  maidSpecialties?: string[];
  onSelect: (cuisine: { id: string; name: string }) => void;
  onSelectConfirmedFoods: (foods: { id: string; name: string; price: number; quantity: number }[]) => void;
}

export default function SelectCuisine({ 
  maidSpecialties = [], 
  onSelect, 
  onSelectConfirmedFoods 
}: SelectCuisineProps) {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, string[]>>({});
  const [selectedFoods, setSelectedFoods] = useState<Record<string, {name: string, price: number, quantity: number}>>({});
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const availableCuisines = maidSpecialties.length > 0 
    ? cuisines.filter(cuisine => maidSpecialties.includes(cuisine.name))
    : cuisines;

  const handleCuisineToggle = (cuisineName: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisineName) 
        ? prev.filter(c => c !== cuisineName) 
        : [...prev, cuisineName]
    );
    
    if (!selectedCuisines.includes(cuisineName)) {
      onSelect({ id: cuisineName.toLowerCase(), name: cuisineName });
      setActiveTab(cuisineName);
    } else if (activeTab === cuisineName) {
      setActiveTab(null);
    }
  };

  const handleCategoryToggle = (cuisineName: string, categoryName: string) => {
    setExpandedCategories(prev => {
      const currentCategories = prev[cuisineName] || [];
      return {
        ...prev,
        [cuisineName]: currentCategories.includes(categoryName)
          ? currentCategories.filter(c => c !== categoryName)
          : [...currentCategories, categoryName]
      };
    });
  };

  const handleFoodToggle = (food: FoodItem) => {
    setSelectedFoods(prev => {
      if (prev[food.name]) {
        const newState = {...prev};
        delete newState[food.name];
        return newState;
      } else {
        return {
          ...prev,
          [food.name]: {
            ...food,
            quantity: 1
          }
        };
      }
    });
  };

  const handleQuantityChange = (foodName: string, quantity: number) => {
    setSelectedFoods(prev => ({
      ...prev,
      [foodName]: {
        ...prev[foodName],
        quantity: Math.max(1, quantity)
      }
    }));
  };

  const handleConfirm = () => {
    const confirmedFoods = Object.values(selectedFoods).map(food => ({
      id: `food-${food.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: food.name,
      price: food.price,
      quantity: food.quantity
    }));
    
    onSelectConfirmedFoods(confirmedFoods);
    
    toast.success(
      <div className="flex items-start">
        <div className="bg-green-100 p-2 rounded-full mr-3">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-semibold">Order confirmed!</p>
          <p className="text-sm text-gray-600">
            {confirmedFoods.length} items (₹{totalPrice}) added successfully.
          </p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "!bg-white !text-gray-800 !shadow-md !rounded-lg !p-4 !border !border-gray-100",
      }
    );
  };

  const totalPrice = Object.values(selectedFoods).reduce(
    (sum, food) => sum + (food.price * food.quantity), 
    0
  );

 return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Explore Our Culinary Delights</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select from our diverse menu featuring authentic flavors from around the world
        </p>
      </div>

      {/* Cuisine Selection */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 px-2">Choose Cuisines</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {availableCuisines.map((cuisine) => (
            <button
              key={cuisine.name}
              onClick={() => handleCuisineToggle(cuisine.name)}
              className={`relative rounded-xl overflow-hidden h-40 group transition-all duration-300 ${
                selectedCuisines.includes(cuisine.name) 
                  ? "ring-4 ring-opacity-70 ring-indigo-500 transform scale-[0.98] shadow-lg" 
                  : "hover:shadow-md"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10" />
                                    <Image 
                      src={cuisine.image} 
                      alt={cuisine.name} 
                      width={300}
                      height={160}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />


              <div className="absolute bottom-0 left-0 right-0 z-20 p-4 text-left">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{cuisine.icon}</span>
                  <h3 className="text-xl font-bold text-white">{cuisine.name}</h3>
                </div>
                <div className={`h-1 w-8 mt-2 bg-gradient-to-r ${cuisine.color} rounded-full`} />
              </div>
              {selectedCuisines.includes(cuisine.name) && (
                <div className="absolute top-3 right-3 z-20 bg-indigo-600 text-white p-1 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      {selectedCuisines.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
                            {selectedCuisines.map(cuisineName => {
                  const cuisine = availableCuisines.find(c => c.name === cuisineName);
                  return (
                    <button
                      key={cuisineName}
                      onClick={() => setActiveTab(cuisineName)}
                      className={`...`}
                    >
                      {cuisine?.icon} {cuisineName}
                      {activeTab === cuisineName && (
                        <span className="..." />
                      )}
                    </button>
                  );
                })}

          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedCuisines.map(cuisineName => {
              if (activeTab !== cuisineName) return null;
              
              const cuisine = availableCuisines.find(c => c.name === cuisineName);
              if (!cuisine) return null;

              return (
                <div key={cuisineName} className="space-y-8">
                  {/* For cuisines with categories */}
                  {cuisine.categories && (
                    <div className="space-y-6">
                      {cuisine.categories.map(category => {
                        const isExpanded = expandedCategories[cuisineName]?.includes(category.name);
                        return (
                          <div key={category.name} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div 
                              className="p-5 bg-gray-50 cursor-pointer flex justify-between items-center hover:bg-gray-100 transition-colors"
                              onClick={() => handleCategoryToggle(cuisineName, category.name)}
                            >
                              <div>
                                <h4 className="text-lg font-semibold text-gray-800">{category.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  {category.details.length} items available
                                </p>
                              </div>
                              <svg 
                                className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            
                            {isExpanded && (
                              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {category.details.map(food => (
                                  <FoodCard 
                                    key={food.name}
                                    food={food}
                                    isSelected={!!selectedFoods[food.name]}
                                    quantity={selectedFoods[food.name]?.quantity || 0}
                                    onToggle={() => handleFoodToggle(food)}
                                    onQuantityChange={(qty) => handleQuantityChange(food.name, qty)}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* For cuisines without categories */}
                  {cuisine.details && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {cuisine.details.map(food => (
                        <FoodCard 
                          key={food.name}
                          food={food}
                          isSelected={!!selectedFoods[food.name]}
                          quantity={selectedFoods[food.name]?.quantity || 0}
                          onToggle={() => handleFoodToggle(food)}
                          onQuantityChange={(qty) => handleQuantityChange(food.name, qty)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          {Object.keys(selectedFoods).length > 0 && (
            <div className="border-t border-gray-200 bg-white p-5 sticky bottom-0 shadow-md">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total items</p>
                    <p className="font-semibold text-gray-800">
                      {Object.values(selectedFoods).reduce((sum, food) => sum + food.quantity, 0)} items
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">Order total</p>
                  <p className="text-2xl font-bold text-indigo-600">₹{totalPrice}</p>
                </div>
                
                <button
                  onClick={handleConfirm}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center"
                >
                  Confirm Order
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Food Card Component
function FoodCard({ 
  food, 
  isSelected, 
  quantity, 
  onToggle, 
  onQuantityChange 
}: {
  food: FoodItem;
  isSelected: boolean;
  quantity: number;
  onToggle: () => void;
  onQuantityChange: (quantity: number) => void;
}) {
  return (
    <div className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${
      isSelected ? "border-indigo-300 bg-indigo-50" : "border-gray-200 hover:border-gray-300"  
    }`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h5 className="font-bold text-gray-800 text-lg">{food.name}</h5>
            {food.popular && (
              <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full mt-1">
                Popular
              </span>
            )}
          </div>
          <span className="text-indigo-600 font-bold text-lg">₹{food.price}</span>
        </div>
        
        {food.description && (
          <p className="text-gray-600 mb-4">{food.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {food.spicy && (
            <span className="inline-flex items-center text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Spicy
            </span>
          )}
          {food.vegetarian && (
            <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Vegetarian
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <button 
            onClick={onToggle}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isSelected
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isSelected ? 'Remove' : 'Add to order'}
          </button>
          
          {isSelected && (
            <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <button 
                onClick={() => onQuantityChange(quantity - 1)}
                className="px-3 py-2 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-3 py-2 font-medium text-gray-800">
                {quantity}
              </span>
              <button 
                onClick={() => onQuantityChange(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}