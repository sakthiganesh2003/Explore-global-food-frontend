"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Sidebar from "@/app/component/dashboard/Sidebar";

interface Maid {
  _id: string;
  fullName: string;
  specialties: string[];
  rating: number;
  experience: string;
  image: string;
  userId?: string;
  active?: boolean;
}

const MaidsManagementPage = () => {
  const [maids, setMaids] = useState<Maid[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [editingMaid, setEditingMaid] = useState<Maid | null>(null);
  const [addingMaid, setAddingMaid] = useState(false);
  const [newMaid, setNewMaid] = useState({
    fullName: "",
    specialties: [] as string[],
    rating: 0,
    experience: "0-1 years",
    image: "",
    userId: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const maidsPerPage = 10;

  useEffect(() => {
    fetchMaids();
  }, []);

  const normalizeExperience = (exp: string | number): string => {
    const years = typeof exp === "string" ? parseInt(exp, 10) : exp;
    if (isNaN(years)) return "0-1 years";
    if (years <= 1) return "0-1 years";
    if (years <= 3) return "1-3 years";
    if (years <= 5) return "3-5 years";
    return "5+ years";
  };

  const formatImageUrl = (url?: string) => {
    if (!url) return "/default-maid.jpg";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return `/${url}`;
  };

  const normalizeMaid = (maid: any): Maid => ({
    _id: maid._id,
    fullName: maid.name || maid.fullName || "Unknown",
    specialties: [
      ...(maid.cuisine || []),
      ...(maid.specialties || []),
    ].filter(Boolean).length > 0
      ? [...(maid.cuisine || []), ...(maid.specialties || [])].filter(Boolean)
      : ["General"],
    rating: maid.rating || 0,
    experience: normalizeExperience(maid.experience || "0"),
    image: formatImageUrl(maid.image),
    userId: maid.userId,
    active: maid.active !== false,
  });

  const fetchMaids = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/maids/maids`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const normalizedMaids = data.map((maid: any) => normalizeMaid(maid));
      setMaids(normalizedMaids);
    } catch (error: any) {
      toast.error(error.message || "Failed to load maids");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMaidStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/maids/maids/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      const response = await res.json();
      const updatedMaid = normalizeMaid(response.maid);

      setMaids(maids.map((maid) => (maid._id === id ? updatedMaid : maid)));

      toast.success(
        `Maid ${currentStatus ? "deactivated" : "activated"}`,
        { position: "top-right" }
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update status", { position: "top-right" });
      console.error(error);
    }
  };

  const deleteMaid = async (id: string) => {
    if (!confirm("Are you sure you want to delete this maid?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/maids/maids/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete maid");
      }

      setMaids(maids.filter((maid) => maid._id !== id));
      toast.success("Maid deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete maid");
      console.error(error);
    }
  };

  const addMaid = async () => {
    if (!newMaid.fullName.trim()) {
      toast.error("Name is required");
      return;
    }
    if (newMaid.specialties.length === 0) {
      toast.error("At least one specialty is required");
      return;
    }
    if (!newMaid.userId) {
      toast.error("User ID is required");
      return;
    }
    if (newMaid.rating < 0 || newMaid.rating > 5) {
      toast.error("Rating must be between 0 and 5");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/maids/maids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMaid.fullName,
          cuisine: newMaid.specialties,
          rating: newMaid.rating,
          experience: newMaid.experience.replace(/[^0-9]/g, "") || "0",
          image: newMaid.image,
          userId: newMaid.userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add maid");
      }

      const addedMaid = await res.json();
      const normalizedMaid = normalizeMaid(addedMaid.maid);

      setMaids([...maids, normalizedMaid]);
      toast.success("Maid added successfully");
      setAddingMaid(false);
      setNewMaid({
        fullName: "",
        specialties: [],
        rating: 0,
        experience: "0-1 years",
        image: "",
        userId: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to add maid");
      console.error(error);
    }
  };

  // Filter maids based on search input
  const filteredMaids = maids.filter(
    (maid) =>
      maid.fullName.toLowerCase().includes(filter.toLowerCase()) ||
      maid.specialties.some((s) => s.toLowerCase().includes(filter.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastMaid = currentPage * maidsPerPage;
  const indexOfFirstMaid = indexOfLastMaid - maidsPerPage;
  const currentMaids = filteredMaids.slice(indexOfFirstMaid, indexOfLastMaid);
  const totalPages = Math.ceil(filteredMaids.length / maidsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-gray-600">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Maids Management</h1>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search maids..."
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={() => setAddingMaid(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Maid
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentMaids.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No maids found
                      </td>
                    </tr>
                  ) : (
                    currentMaids.map((maid) => (
                      <tr key={maid._id} className={!maid.active ? "bg-gray-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                            <Image
                              src={maid.image}
                              alt={maid.fullName}
                              width={40}
                              height={40}
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/default-maid.jpg";
                              }}
                              placeholder="blur"
                              blurDataURL="/placeholder.png"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{maid.fullName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {maid.specialties.slice(0, 3).map((specialty, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                              >
                                {specialty}
                              </span>
                            ))}
                            {maid.specialties.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{maid.specialties.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={
                                  i < Math.floor(maid.rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              >
                                ★
                              </span>
                            ))}
                            <span className="ml-1 text-sm text-gray-500">({maid.rating})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {maid.experience}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleMaidStatus(maid._id, maid.active ?? true)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              maid.active
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            {maid.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingMaid(maid)}
                              className="text-blue-600 hover:text-blue-900"
                              aria-label={`Edit ${maid.fullName}`}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteMaid(maid._id)}
                              className="text-red-600 hover:text-red-900"
                              aria-label={`Delete ${maid.fullName}`}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredMaids.length > maidsPerPage && (
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstMaid + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastMaid, filteredMaids.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredMaids.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 border rounded-md ${
                          currentPage === number
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {editingMaid && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Edit Maid</h2>
                  <button
                    onClick={() => setEditingMaid(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingMaid.fullName}
                      onChange={(e) =>
                        setEditingMaid({ ...editingMaid, fullName: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialties (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingMaid.specialties.join(", ")}
                      onChange={(e) =>
                        setEditingMaid({
                          ...editingMaid,
                          specialties: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Cleaning, Cooking, Childcare"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <select
                      value={editingMaid.experience}
                      onChange={(e) =>
                        setEditingMaid({ ...editingMaid, experience: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      onClick={() => setEditingMaid(null)}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (!editingMaid.fullName.trim()) {
                          toast.error("Name is required");
                          return;
                        }
                        if (editingMaid.specialties.length === 0) {
                          toast.error("At least one specialty is required");
                          return;
                        }

                        try {
                          const res = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/maids/maids/${editingMaid._id}`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                name: editingMaid.fullName,
                                cuisine: editingMaid.specialties,
                                experience: editingMaid.experience.replace(/[^0-9]/g, "") || "0",
                              }),
                            }
                          );

                          if (!res.ok) {
                            const errorData = await res.json();
                            throw new Error(errorData.message || "Failed to update maid");
                          }

                          const response = await res.json();
                          const updatedMaid = normalizeMaid(response.maid);

                          setMaids((prev) =>
                            prev.map((m) => (m._id === editingMaid._id ? updatedMaid : m))
                          );

                          toast.success("Maid updated successfully");
                          setEditingMaid(null);
                        } catch (error: any) {
                          toast.error(error.message || "Failed to update maid");
                          console.error(error);
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {addingMaid && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Add Maid</h2>
                  <button
                    onClick={() => setAddingMaid(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newMaid.fullName}
                      onChange={(e) =>
                        setNewMaid({ ...newMaid, fullName: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialties (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newMaid.specialties.join(", ")}
                      onChange={(e) =>
                        setNewMaid({
                          ...newMaid,
                          specialties: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Cleaning, Cooking, Childcare"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <select
                      value={newMaid.experience}
                      onChange={(e) =>
                        setNewMaid({ ...newMaid, experience: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <input
                      type="number"
                      value={newMaid.rating}
                      onChange={(e) =>
                        setNewMaid({ ...newMaid, rating: Number(e.target.value) })
                      }
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={newMaid.image}
                      onChange={(e) =>
                        setNewMaid({ ...newMaid, image: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., /images/maid.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={newMaid.userId}
                      onChange={(e) =>
                        setNewMaid({ ...newMaid, userId: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter user ID"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      onClick={() => setAddingMaid(false)}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addMaid}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Maid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaidsManagementPage;