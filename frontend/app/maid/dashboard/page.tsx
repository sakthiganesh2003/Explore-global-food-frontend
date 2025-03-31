"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SidebarMaid from "@/app/component/dashboard/SidebarMaid";

interface Maid {
  _id: string;
  name: string;
  cuisine: string[];
  rating: number;
  experience: number;
  image: string;
  isActive: boolean;
  description: string;
}

export default function MaidDashboard() {
  const [maid, setMaid] = useState<Maid>({
    _id: "",
    name: "",
    cuisine: [],
    rating: 0,
    experience: 0,
    image: "",
    isActive: false,
    description: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Maid>>({});
  const [loading, setLoading] = useState(true);

  // Fetch maid profile data
  useEffect(() => {
    const fetchMaidProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/maid/profile/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setMaid({
          ...data,
          isActive: false, // Default status
          description: data.description || "Professional chef" // Default description
        });
      } catch (error) {
        toast.error("Failed to load profile");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaidProfile();
  }, []);

  // Toggle active status
  const toggleActiveStatus = async () => {
    const newStatus = !maid.isActive;
    try {
      // Update in backend
      const response = await fetch(`http://localhost:5000/api/maid/profile/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update in state
      setMaid(prev => ({ ...prev, isActive: newStatus }));
      toast.success(`You are now ${newStatus ? 'active' : 'inactive'}`);
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Status update error:", error);
    }
  };

  // Start editing
  const startEditing = () => {
    setEditData({
      name: maid.name,
      description: maid.description,
      cuisine: [...maid.cuisine]
    });
    setIsEditing(true);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Handle cuisine change
  const handleCuisineChange = (index: number, value: string) => {
    const newCuisine = [...editData.cuisine || []];
    newCuisine[index] = value;
    setEditData(prev => ({ ...prev, cuisine: newCuisine }));
  };

  // Add new cuisine
  const addCuisine = () => {
    setEditData(prev => ({
      ...prev,
      cuisine: [...(prev.cuisine || []), ""]
    }));
  };

  // Remove cuisine
  const removeCuisine = (index: number) => {
    const newCuisine = [...editData.cuisine || []];
    newCuisine.splice(index, 1);
    setEditData(prev => ({ ...prev, cuisine: newCuisine }));
  };

  // Save changes
  const saveChanges = async () => {
    try {
      // Update in backend
      const response = await fetch(`http://localhost:5000/api/maid/profile/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update in state
      setMaid(prev => ({
        ...prev,
        ...editData,
        cuisine: editData.cuisine || prev.cuisine
      }));
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SidebarMaid />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarMaid />
      
      <div className="flex-1 p-6 text-gray-800">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mr-6">
                <img 
                  src={maid.image || "/chef1.jpg"} 
                  alt={maid.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-avatar.jpg";
                  }}
                />
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name || ""}
                    onChange={handleInputChange}
                    className="text-2xl font-bold border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{maid.name}</h1>
                )}
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">★ {maid.rating}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span>{maid.experience} years experience</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleActiveStatus}
                className={`px-4 py-2 rounded-full font-medium ${
                  maid.isActive
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                } transition-colors`}
              >
                {maid.isActive ? 'Active' : 'Inactive'}
              </button>
              
              {isEditing ? (
                <>
                  <button
                    onClick={saveChanges}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={startEditing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-4">
            {isEditing ? (
              <textarea
                name="description"
                value={editData.description || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                rows={3}
              />
            ) : (
              <p className="text-gray-700">{maid.description}</p>
            )}
          </div>
        </div>

        {/* Cuisine Specialties */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Cuisine Specialties</h2>
          {isEditing ? (
            <div className="space-y-2">
              {(editData.cuisine || []).map((cuisine, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => handleCuisineChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => removeCuisine(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={addCuisine}
                className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                + Add Cuisine
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {maid.cuisine.map((cuisine, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {cuisine}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className={`mt-6 p-4 rounded-lg text-center text-sm font-medium ${
          maid.isActive 
            ? 'bg-green-50 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {maid.isActive 
            ? 'You are currently available for bookings'
            : 'You are not currently accepting bookings'}
        </div>
      </div>
    </div>
  );
}