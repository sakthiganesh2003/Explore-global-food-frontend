"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Sidebar from '@/app/component/dashboard/Sidebar';

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

  useEffect(() => {
    fetchMaids();
  }, []);

  const fetchMaids = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/maids/maids`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      // Normalize the data structure
      const normalizedMaids = data.map((maid: any) => ({
        _id: maid._id,
        fullName: maid.fullName || maid.name || "Unknown",
        specialties: maid.specialties || maid.cuisine?.filter(Boolean) || ["General"],
        rating: maid.rating || 0,
        experience: maid.experience || "0",
        image: formatImageUrl(maid.image),
        userId: maid.userId,
        active: maid.active !== false, // Default to true if not specified
      }));

      setMaids(normalizedMaids);
    } catch (error) {
      toast.error("Failed to load maids");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatImageUrl = (url?: string) => {
    if (!url) return "/default-maid.jpg";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return `/${url}`;
  };

  const toggleMaidStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/maids/maids/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setMaids(maids.map((maid) =>
        maid._id === id ? { ...maid, active: !currentStatus } : maid
      ));

      toast.success(`Maid ${currentStatus ? "deactivated" : "activated"}`);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const deleteMaid = async (id: string) => {
    if (!confirm("Are you sure you want to delete this maid?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/maids/maids/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete maid");

      setMaids(maids.filter((maid) => maid._id !== id));
      toast.success("Maid deleted successfully");
    } catch (error) {
      toast.error("Failed to delete maid");
      console.error(error);
    }
  };

  const filteredMaids = maids.filter(
    (maid) =>
      maid.fullName.toLowerCase().includes(filter.toLowerCase()) ||
      maid.specialties.some((s) => s.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-gray-600">
      < Sidebar />
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Maids Management</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search maids..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
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
              {filteredMaids.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No maids found
                  </td>
                </tr>
              ) : (
                filteredMaids.map((maid) => (
                  <tr key={maid._id} className={!maid.active ? "bg-gray-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
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
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteMaid(maid._id)}
                          className="text-red-600 hover:text-red-900"
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
      </div>

      {/* Edit Modal */}
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
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialties
                </label>
                <input
                  type="text"
                  value={editingMaid.specialties.join(", ")}
                  onChange={(e) =>
                    setEditingMaid({
                      ...editingMaid,
                      specialties: e.target.value.split(", ").filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setEditingMaid(null)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/maids/maids/${editingMaid._id}`,
                        {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            fullName: editingMaid.fullName,
                            specialties: editingMaid.specialties,
                          }),
                        }
                      );

                      if (!res.ok) throw new Error("Failed to update maid");

                      setMaids((prev) =>
                        prev.map((m) =>
                          m._id === editingMaid._id ? editingMaid : m
                        )
                      );

                      toast.success("Maid updated successfully");
                      setEditingMaid(null);
                    } catch (error) {
                      toast.error("Failed to update maid");
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
      
    </div>
  </div>  
  );
};

export default MaidsManagementPage;