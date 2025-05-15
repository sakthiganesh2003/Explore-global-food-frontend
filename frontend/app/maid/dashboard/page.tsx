"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SidebarMaid from "@/app/component/dashboard/SidebarMaid";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

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
    description: "Professional chef",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Maid> & { image?: string | File }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getUserIdFromToken = (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to access this page");
        router.push("/login");
        return null;
      }
      const decoded: DecodedToken = jwtDecode(token);
      if (!decoded.id) {
        toast.error("Invalid token format");
        return null;
      }
      return decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      toast.error("Session expired. Please login again");
      localStorage.removeItem('token');
      router.push("/login");
      return null;
    }
  };

  const fetchMaidProfile = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }
  
      console.log('Sending request with token:', token);
      const response = await fetch(`http://localhost:5000/api/maid/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
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
        description: result.data.description || "Professional chef",
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

  useEffect(() => {
    fetchMaidProfile();
  }, []);

  const activateProfile = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      const response = await fetch('http://localhost:3000/api/maid-dashboard/toggle-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ isActive: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to activate profile");
      }

      setMaid(prev => ({ ...prev, isActive: true }));
      toast.success("Profile activated");
    } catch (error) {
      toast.error("Failed to activate profile");
      console.error("Activation error:", error);
    }
  };

  const startEditing = () => {
    setEditData({
      fullName: maid.fullName,
      description: maid.description,
      specialties: [...maid.specialties],
      experience: maid.experience,
      rating: maid.rating,
      image: maid.image,
    });
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setEditData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSpecialtyChange = (index: number, value: string) => {
    const newSpecialties = [...(editData.specialties || [])];
    newSpecialties[index] = value;
    setEditData(prev => ({ ...prev, specialties: newSpecialties }));
  };

  const addSpecialty = () => {
    setEditData(prev => ({
      ...prev,
      specialties: [...(prev.specialties || []), ""],
    }));
  };

  const removeSpecialty = (index: number) => {
    const newSpecialties = [...(editData.specialties || [])];
    newSpecialties.splice(index, 1);
    setEditData(prev => ({ ...prev, specialties: newSpecialties }));
  };

  const saveChanges = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      if (!editData.fullName?.trim()) {
        toast.error("Name is required");
        return;
      }
      if (!editData.experience) {
        toast.error("Experience is required");
        return;
      }
      if (!editData.rating) {
        toast.error("Rating is required");
        return;
      }
      if (!editData.specialties?.length) {
        toast.error("At least one specialty is required");
        return;
      }

      const formData = new FormData();
      formData.append('fullName', editData.fullName || '');
      formData.append('specialties', editData.specialties?.filter(s => s.trim()).join(','));
      formData.append('rating', editData.rating?.toString() || '0');
      formData.append('experience', editData.experience || '');
      formData.append('description', editData.description || '');
      if (editData.image && typeof editData.image !== "string") {
        formData.append('image', editData.image);
      }

      const response = await fetch('http://localhost:3000/api/maid-dashboard/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedData = await response.json();
      setMaid(prev => ({
        ...prev,
        fullName: updatedData.data.fullName || prev.fullName,
        description: updatedData.data.description || prev.description,
        specialties: updatedData.data.specialties || prev.specialties,
        experience: updatedData.data.experience || prev.experience,
        rating: updatedData.data.rating || prev.rating,
        image: updatedData.data.image || prev.image,
      }));
      setIsEditing(false);
      toast.success("Profile updated successfully");
      fetchMaidProfile();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    }
  };

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
            onClick={() => fetchMaidProfile()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
          {error.includes("complete your profile") && (
            <button
              onClick={() => router.push("/maid/profile-setup")}
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
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
                  <>
                    <input
                      type="text"
                      name="fullName"
                      value={editData.fullName || ""}
                      onChange={handleInputChange}
                      className="text-2xl font-bold border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      placeholder="Your name"
                    />
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="mt-2"
                    />
                  </>
                ) : (
                  <h1 className="text-2xl font-bold">{maid.fullName}</h1>
                )}
                <div className="flex items-center mt-2 gap-2">
                  <span className="flex items-center text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1">{maid.rating.toFixed(1)}</span>
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>{maid.experience}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${maid.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className="text-sm font-medium">
                  {maid.isActive ? 'Available for bookings' : 'Not accepting bookings'}
                </span>
              </div>
              <div className="flex gap-2">
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
                  <>
                    {!maid.isActive && (
                      <button
                        onClick={activateProfile}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={startEditing}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6">
            {isEditing ? (
              <textarea
                name="description"
                value={editData.description || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                rows={4}
                placeholder="Tell clients about your skills and experience"
              />
            ) : (
              <p className="text-gray-700">
                {maid.description || "No description provided"}
              </p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Cuisine Specialties</h2>
            {isEditing && (
              <button
                onClick={addSpecialty}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Specialty
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-3">
              {(editData.specialties || []).map((specialty, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => handleSpecialtyChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="Add cuisine specialty"
                  />
                  <button
                    onClick={() => removeSpecialty(index)}
                    className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                    aria-label="Remove specialty"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012  activateProfile0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Experience</h2>
          {isEditing ? (
            <select
              name="experience"
              value={editData.experience || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <option value="">Select Experience</option>
              <option value="0-1 years">0-1 years</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          ) : (
            <p className="text-gray-700">{maid.experience || "No experience specified"}</p>
          )}
        </div>
        <div className={`p-4 rounded-lg ${maid.isActive ? 'bg-green-50' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${maid.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'}`}>
              {maid.isActive ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="font-medium">{maid.isActive ? 'You are available for bookings' : 'You are not accepting bookings'}</h3>
              <p className="text-sm text-gray-600">
                {maid.isActive 
                  ? 'Clients can see your profile and book your services'
                  : 'Your profile will not be shown to clients'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}