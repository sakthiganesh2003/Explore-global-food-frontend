"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SidebarMaid from "@/app/component/dashboard/SidebarMaid";
import { jwtDecode } from "jwt-decode";

interface Maid {
  id: string;
  fullName: string;
  specialties: string[];
  rating: number;
  experience: string;
  image: string;
  isActive: boolean;
  description: string;
}

interface DecodedToken {
  id: string;
  role?: string;
}

export default function MaidDashboard() {
  const [maid, setMaid] = useState<Maid>({
    id: "",
    fullName: "",
    specialties: [],
    rating: 0,
    experience: "",
    image: "/chef1.jpg",
    isActive: false,
    description: "Professional chef"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Maid>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      console.log(decoded)
      if (!decoded.id) {
        toast.error("Invalid token format");
        return null;
      }
      console.log(decoded)
      return decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      toast.error("Session expired. Please login again");
      localStorage.removeItem('token');
      window.location.href = "/login";
      return null;
    }
  };

  // Fetch maid profile data
  // Fetch maid profile data - Updated version
  const fetchMaidProfile = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`http://localhost:5000/api/maid/${userId}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      // Handle 404 specifically
      if (response.status === 404) {
        setError("Profile not found. Please complete your profile setup.");
        setLoading(false);
        return;
      }
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch profile");
      }
  
      const result = await response.json();
      
      if (!result?.success) {
        throw new Error(result?.message || "Invalid profile data");
      }
  
      setMaid({
        id: result.data.id,
        fullName: result.data.fullName || "New Maid",
        specialties: result.data.specialties || [],
        rating: result.data.rating || 0,
        experience: result.data.experience || "",
        image: result.data.image || "/chef1.jpg",
        isActive: result.data.isActive || false,
        description: result.data.description || "Professional chef"
      });
  
    } catch (error) {
      console.error("Fetch error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

// Add this useEffect to call the function
useEffect(() => {
  fetchMaidProfile();
}, []);

  // Toggle active status
  const toggleActiveStatus = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    const newStatus = !maid.isActive;
    try {
      const response = await fetch(`http://localhost:5000/api/maid/${userId}/status`, {
        method: "GET",
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
      fullName: maid.fullName,
      description: maid.description,
      specialties: [...maid.specialties],
      experience: maid.experience
    });
    setIsEditing(true);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Handle specialty change
  const handleSpecialtyChange = (index: number, value: string) => {
    const newSpecialties = [...editData.specialties || []];
    newSpecialties[index] = value;
    setEditData(prev => ({ ...prev, specialties: newSpecialties }));
  };

  // Add new specialty
  const addSpecialty = () => {
    setEditData(prev => ({
      ...prev,
      specialties: [...(prev.specialties || []), ""]
    }));
  };

  // Remove specialty
  const removeSpecialty = (index: number) => {
    const newSpecialties = [...editData.specialties || []];
    newSpecialties.splice(index, 1);
    setEditData(prev => ({ ...prev, specialties: newSpecialties }));
  };

  // Save changes
  const saveChanges = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      // Validate data
      if (!editData.fullName?.trim()) {
        toast.error("Name is required");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/maid/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fullName: editData.fullName,
          specialties: editData.specialties?.filter(s => s.trim() !== ""),
          experience: editData.experience,
          description: editData.description
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setMaid(prev => ({
        ...prev,
        fullName: updatedData.data.fullName || prev.fullName,
        description: updatedData.data.description || prev.description,
        specialties: updatedData.data.specialties || prev.specialties,
        experience: updatedData.data.experience || prev.experience
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SidebarMaid />
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
          {error.includes("complete your profile") && (
            <button
              onClick={() => window.location.href = "/maid/profile-setup"}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Complete Profile Setup
            </button>
          )}
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
                  alt={maid.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/chef1.jpg";
                  }}
                />
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={editData.fullName || ""}
                    onChange={handleInputChange}
                    className="text-2xl font-bold border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Your name"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{maid.fullName}</h1>
                )}
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">★ {maid.rating.toFixed(1)}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span>{maid.experience}</span>
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
              {(editData.specialties || []).map((specialty, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => handleSpecialtyChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                    placeholder="Add cuisine specialty"
                  />
                  <button
                    onClick={() => removeSpecialty(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                    aria-label="Remove specialty"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={addSpecialty}
                className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                + Add Specialty
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {maid.specialties.length > 0 ? (
                maid.specialties.map((specialty, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {specialty}
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