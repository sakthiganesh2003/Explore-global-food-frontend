"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SidebarMaid from "@/app/component/dashboard/SidebarMaid";
import { jwtDecode } from "jwt-decode";

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

interface DecodedToken {
  id: string;  // Changed from userId to match your token creation
  role?: string;
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
    description: "Professional chef"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Maid>>({});
  const [loading, setLoading] = useState(true);

  // Get user ID from token
  const getUserIdFromToken = (): string | null => {
    if (typeof window === "undefined") return null;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to access this page");
        window.location.href = "/login";
        return null;
      }
      
      const decoded: DecodedToken = jwtDecode(token);
      if (!decoded.id) {  // Changed from userId to id
        toast.error("Invalid token format");
        return null;
      }
      return decoded.id;  // Changed from userId to id
    } catch (error) {
      console.error("Error decoding token:", error);
      toast.error("Session expired. Please login again");
      localStorage.removeItem('token');
      window.location.href = "/login";
      return null;
    }
  };

  // Fetch maid profile data
  useEffect(() => {
    const fetchMaidProfile = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5000/api/maid/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? "Profile not found" : "Failed to fetch profile");
        }
        
        const data = await response.json();
        setMaid({
          _id: data._id,
          name: data.name || "New Maid",
          cuisine: data.cuisine || [],
          rating: data.rating || 0,
          experience: data.experience || 0,
          image: data.image || "/default-maid.jpg",
          isActive: data.isActive || false,
          description: data.description || "Professional chef"
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to load profile");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaidProfile();
  }, []);

  // Toggle active status
  const toggleActiveStatus = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    const newStatus = !maid.isActive;
    try {
      const response = await fetch(`http://localhost:5000/api/maid/profile/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

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
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      // Validate data
      if (!editData.name?.trim()) {
        toast.error("Name is required");
        return;
      }
console.log(`http://localhost:5000/api/maid/profile/${userId}`)
      const response = await fetch(`http://localhost:5000/api/maid/profile/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...editData,
          cuisine: editData.cuisine?.filter(c => c.trim() !== "")
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setMaid(prev => ({
        ...prev,
        name: updatedData.name || prev.name,
        description: updatedData.description || prev.description,
        cuisine: updatedData.cuisine || prev.cuisine
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
                  src={maid.image} 
                  alt={maid.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-maid.jpg";
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
                    placeholder="Your name"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{maid.name}</h1>
                )}
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">★ {maid.rating.toFixed(1)}</span>
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={startEditing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                placeholder="Tell clients about your skills and experience"
              />
            ) : (
              <p className="text-gray-700">
                {maid.description || "No description provided"}
              </p>
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
                    placeholder="Add cuisine specialty"
                  />
                  <button
                    onClick={() => removeCuisine(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                    aria-label="Remove cuisine"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={addCuisine}
                className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                + Add Cuisine
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {maid.cuisine.length > 0 ? (
                maid.cuisine.map((cuisine, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {cuisine}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No specialties added yet</p>
              )}
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