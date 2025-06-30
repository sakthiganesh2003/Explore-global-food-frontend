"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface Maid {
  _id: string;
  fullName: string;
  name?: string; // Legacy field
  cuisine?: (string | null)[];
  specialties: string[];
  rating: number;
  experience: string;
  image?: string;
  status: "active" | "inactive"; // Assumed field
}

const MaidAdmin: React.FC = () => {
  const [maids, setMaids] = useState<Maid[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const maidsPerPage = 12; // 3 columns * 4 rows

  useEffect(() => {
    const fetchMaids = async () => {
      try {
        const res = await fetch("{{url}}/api/maids/maids");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log("API response:", data);

        const normalizedMaids = data.map((maid: any) => ({
          ...maid,
          fullName: maid.fullName || maid.name || "Unknown", // Handle legacy 'name' field
          specialties: [
            ...(maid.cuisine || []).filter((c: string | null) => c !== null),
            ...(maid.specialties || []).filter((s: string | null) => s !== null),
          ].filter(Boolean).length > 0
            ? [...(maid.cuisine || []).filter((c: string | null) => c !== null), ...(maid.specialties || [])]
            : ["General Housekeeping"],
          image: formatImageUrl(maid.image),
          experience: maid.experience || "0",
          status: maid.status || "active", // Mock status if not provided by API
        }));

        setMaids(normalizedMaids);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load maids. Please try again later.", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMaids();
  }, []);

  const formatImageUrl = (url?: string) => {
    if (!url) return "/chef-placeholder.jpg";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return `/${url}`;
  };

  const handleToggleStatus = async (maidId: string, currentStatus: "active" | "inactive") => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`{{url}}/api/maids/${maidId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const updatedMaid = await res.json();

      setMaids((prevMaids) =>
        prevMaids.map((maid) =>
          maid._id === maidId ? { ...maid, status: updatedMaid.data.status } : maid
        )
      );
      toast.success(`Maid set to ${newStatus}`, {
        position: "top-center",
        style: { background: "#4BB543", color: "#fff" },
      });
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleDeleteMaid = async (maidId: string, maidName: string) => {
    if (!confirm(`Are you sure you want to delete ${maidName}?`)) return;

    try {
      const res = await fetch(`{{url}}/api/maids/${maidId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setMaids((prevMaids) => prevMaids.filter((maid) => maid._id !== maidId));
      toast.success(`${maidName} deleted successfully`, {
        position: "top-center",
        style: { background: "#ff4d4f", color: "#fff" },
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete maid. Please try again.", {
        position: "top-center",
      });
    }
  };

  const totalPages = Math.ceil(maids.length / maidsPerPage);
  const paginatedMaids = maids.slice(
    (currentPage - 1) * maidsPerPage,
    currentPage * maidsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading maids...</span>
      </div>
    );
  }

  return (
    <div className="text-gray-500 p-4 max-w-5xl mx-auto min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Manage Maids</h2>

      {maids.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-lg mb-2 text-gray-600">No maids found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedMaids.map((maid) => (
              <div
                key={maid._id}
                className="bg-white p-5 rounded-lg shadow-md flex flex-col border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 relative rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src={maid.image || "/chef-placeholder.jpg"}
                      alt={`Photo of ${maid.fullName}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/chef-placeholder.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{maid.fullName}</h3>
                    <div className="flex items-center text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < Math.floor(maid.rating) ? "★" : "☆"}</span>
                      ))}
                      <span className="text-gray-500 ml-1 text-sm">({maid.rating})</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Experience:</span> {maid.experience}
                  </p>
                  {maid.specialties && maid.specialties.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm mb-1 text-gray-700">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {maid.specialties.slice(0, 3).map((specialty, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
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
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={
                        maid.status === "active" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {maid.status.charAt(0).toUpperCase() + maid.status.slice(1)}
                    </span>
                  </p>
                </div>

                <div className="mt-auto pt-4 flex justify-between">
                  <button
                    onClick={() => handleToggleStatus(maid._id, maid.status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      maid.status === "active"
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {maid.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDeleteMaid(maid._id, maid.fullName)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MaidAdmin;