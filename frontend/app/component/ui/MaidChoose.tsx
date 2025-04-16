import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface Maid {
  _id: string;
  fullName: string;
  cuisine?: string[];
  specialties: string[];
  rating: number;
  experience: string | number;
  image?: string;
  bio?: string;
  hourlyRate?: number;
  services?: string[];
  languages?: string[];
  active: boolean;
}

const MaidChoose: React.FC<{ onNext: (maid: Maid) => void }> = ({ onNext }) => {
  const [selectedMaid, setSelectedMaid] = useState<Maid | null>(null);
  const [filter, setFilter] = useState("");
  const [maids, setMaids] = useState<Maid[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const maidsPerPage = 16; // 4 columns * 4 rows

  useEffect(() => {
    console.log("Fetching maids data");

    let isMounted = true;

    const fetchMaids = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/maids/maids`); // Use env variable
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        console.log("API response:", data);

        if (isMounted) {
          const normalizedMaids = data.map((maid: any) => {
            const specialties = [
              ...(maid.cuisine || []).filter((c: string | null) => c !== null),
              ...(maid.specialties || []).filter((s: string | null) => s !== null),
            ].filter(Boolean);

            return {
              _id: maid._id,
              fullName: maid.name || maid.fullName || "Unknown",
              specialties: specialties.length > 0 ? specialties : ["General Housekeeping"],
              rating: maid.rating || 0,
              experience:
                typeof maid.experience === "string" && !isNaN(parseInt(maid.experience))
                  ? parseInt(maid.experience)
                  : maid.experience || "0",
              image: formatImageUrl(maid.image),
              bio: maid.bio,
              hourlyRate: maid.hourlyRate,
              services: maid.services,
              languages: maid.languages,
              active: maid.active !== false,
            };
          });

          setMaids(normalizedMaids);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load maids. Please try again later.", {
          position: "top-center",
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMaids();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatImageUrl = (url?: string) => {
    if (!url) return "/chef-placeholder.jpg";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return `/${url}`;
  };

  const getFilteredMaids = () => {
    const activeMaids = maids.filter((maid) => maid.active === true);
    if (!filter) return activeMaids;
    return activeMaids.filter((maid) =>
      maid.specialties?.some(
        (specialty) => specialty && specialty.toLowerCase().includes(filter.toLowerCase())
      )
    );
  };

  const handleMaidSelect = (maid: Maid) => {
    setSelectedMaid(maid);
    setShowDetails(true);
    toast.success(`${maid.fullName} selected`, {
      icon: "👩‍🍳",
      position: "top-center",
      duration: 1500,
      style: {
        background: "#4BB543",
        color: "#fff",
      },
    });
  };

  const handleBookMaid = () => {
    if (selectedMaid) {
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            onNext(selectedMaid);
            resolve(true);
          }, 1000);
        }),
        {
          loading: `Booking ${selectedMaid.fullName}...`,
          success: (
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <div>
                <p className="font-bold">{selectedMaid.fullName} successfully selected!</p>
                <p className="text-sm">Proceeding to the next step...</p>
              </div>
            </div>
          ),
          error: `Failed to book ${selectedMaid.fullName}`,
        },
        {
          position: "bottom-right",
          duration: 4000,
          style: {
            minWidth: "300px",
          },
        }
      );
      setShowDetails(false);
    }
  };

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

  const filteredMaids = getFilteredMaids();
  const totalPages = Math.ceil(filteredMaids.length / maidsPerPage);
  const paginatedMaids = filteredMaids.slice(
    (currentPage - 1) * maidsPerPage,
    currentPage * maidsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading maids...</span>
      </div>
    );
  }

  return (
    <div className="text-gray-500 p-4 max-w-6xl mx-auto min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Choose Your Maid</h2>

      {showDetails && selectedMaid ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{selectedMaid.fullName}</h3>
                <p className="text-gray-600">
                  ⭐ {selectedMaid.rating} | {selectedMaid.experience}{" "}
                  {typeof selectedMaid.experience === "number" ? "years" : ""} experience
                </p>
                {selectedMaid.hourlyRate && (
                  <p className="text-gray-600 mt-1 font-medium">
                    ${selectedMaid.hourlyRate}/hour
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 w-32 h-32 mx-auto relative rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
              <Image
                src={selectedMaid.image || "/chef-placeholder.jpg"}
                alt={`Photo of ${selectedMaid.fullName}`}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/chef-placeholder.jpg";
                }}
              />
            </div>

            <div className="mt-6 space-y-6">
              {selectedMaid.specialties && selectedMaid.specialties.length > 0 && (
                <div>
                  <p className="font-semibold mb-2 text-gray-700">Specializes in:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMaid.specialties.map((specialty, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm shadow-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedMaid.languages && selectedMaid.languages.length > 0 && (
                <div>
                  <p className="font-semibold mb-2 text-gray-700">Languages:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMaid.languages.map((language, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm shadow-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedMaid.bio && (
                <div>
                  <p className="font-semibold mb-2 text-gray-700">About:</p>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedMaid.bio}</p>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleBookMaid}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
              >
                Select {selectedMaid.fullName}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Filter by specialties (Cooking, Cleaning, Childcare...)"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
            />
          </div>

          {filteredMaids.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-lg mb-2 text-gray-600">
                {filter
                  ? "No active maids found matching your criteria"
                  : "No active maids available at the moment"}
              </p>
              <button
                onClick={() => setFilter("")}
                className="mt-2 text-blue-600 hover:underline font-medium"
              >
                Clear filters and show all maids
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedMaids.map((maid) => (
                  <div
                    key={maid._id}
                    className="bg-white p-5 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col border border-gray-100"
                    onClick={() => handleMaidSelect(maid)}
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
                        <span className="font-semibold">Experience:</span> {maid.experience}{" "}
                        {typeof maid.experience === "number" ? "years" : ""}
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
                    </div>

                    {maid.hourlyRate && (
                      <div className="mt-auto pt-4">
                        <p className="text-right font-bold text-lg text-gray-800">
                          ${maid.hourlyRate}
                          <span className="text-sm font-normal">/hour</span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
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
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MaidChoose;