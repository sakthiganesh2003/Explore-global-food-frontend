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
}

const MaidChoose: React.FC<{ onNext: (maid: Maid) => void }> = ({ onNext }) => {
  const [selectedMaid, setSelectedMaid] = useState<Maid | null>(null);
  const [filter, setFilter] = useState("");
  const [maids, setMaids] = useState<Maid[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.log("Fetching maids data");
    
    let isMounted = true;
    
    const fetchMaids = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/maids/maids");
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        console.log("API response:", data);
        
        if (isMounted) {
          // Normalize the data structure
          const normalizedMaids = data.map((maid: any) => {
            // Combine cuisine and specialties if both exist
            const specialties = [
              ...(maid.cuisine || []).filter((c: string | null) => c !== null),
              ...(maid.specialties || []).filter((s: string | null) => s !== null)
            ].filter(Boolean);

            return {
              ...maid,
              specialties: specialties.length > 0 ? specialties : ['General Housekeeping'],
              image: formatImageUrl(maid.image),
              // Convert experience to number if possible
              experience: typeof maid.experience === 'string' && !isNaN(parseInt(maid.experience))
                ? parseInt(maid.experience)
                : maid.experience || '0'
            };
          });
          
          setMaids(normalizedMaids);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load maids. Please try again later.", {
          position: "top-center"
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
    if (!filter) return maids;
    return maids.filter(maid =>
      maid.specialties?.some(specialty =>
        specialty && specialty.toLowerCase().includes(filter.toLowerCase())
      )
    );
  };

  const handleMaidSelect = (maid: Maid) => {
    setSelectedMaid(maid);
    setShowDetails(true);
    toast.success(`${maid.fullName} selected`, {
      icon: '👩‍🍳',
      position: 'top-center',
      duration: 1500,
      style: {
        background: '#4BB543',
        color: '#fff',
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
                <p className="font-bold">Booking confirmed!</p>
                <p className="text-sm">{selectedMaid.fullName} will contact you shortly</p>
              </div>
            </div>
          ),
          error: `Failed to book ${selectedMaid.fullName}`,
        },
        {
          position: 'bottom-right',
          duration: 4000,
          style: {
            minWidth: '300px',
          },
        }
      );
    }
  };

  const filteredMaids = getFilteredMaids();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading maids...</span>
      </div>
    );
  }

  return (
    <div className="text-gray-500 p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Maid</h2>
      
      {showDetails && selectedMaid ? (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">{selectedMaid.fullName}</h3>
              <p className="text-gray-600">
                ⭐ {selectedMaid.rating} | {selectedMaid.experience} {typeof selectedMaid.experience === 'number' ? 'years' : ''} experience
              </p>
              {selectedMaid.hourlyRate && (
                <p className="text-gray-600 mt-1">
                  ${selectedMaid.hourlyRate}/hour
                </p>
              )}
            </div>
            <button 
              onClick={() => setShowDetails(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>
          
          <div className="mt-4 w-32 h-32 mx-auto relative rounded-full overflow-hidden border-2 border-gray-200">
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
          
          <div className="mt-4">
            {selectedMaid.specialties && selectedMaid.specialties.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold mb-2">Specializes in:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMaid.specialties.map((specialty, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {selectedMaid.languages && selectedMaid.languages.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold mb-2">Languages:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMaid.languages.map((language, i) => (
                    <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {selectedMaid.bio && (
              <div className="mb-4">
                <p className="font-semibold mb-2">About:</p>
                <p className="text-gray-700">{selectedMaid.bio}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-6">
            <button 
              onClick={handleBookMaid} 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              select {selectedMaid.fullName}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Filter by specialties (Cooking, Cleaning, Childcare...)"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          
          {filteredMaids.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-lg mb-2">No maids found matching your criteria</p>
              <button 
                onClick={() => setFilter("")}
                className="mt-2 text-blue-600 hover:underline font-medium"
              >
                Clear filters and show all maids
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMaids.map((maid) => (
                <div 
                  key={maid._id} 
                  className="bg-white p-5 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg hover:transform hover:-translate-y-1 flex flex-col"
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
                      <h3 className="font-bold text-lg">{maid.fullName}</h3>
                      <div className="flex items-center text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(maid.rating) ? '★' : '☆'}
                          </span>
                        ))}
                        <span className="text-gray-500 ml-1 text-sm">
                          ({maid.rating})
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Experience:</span> {maid.experience} {typeof maid.experience === 'number' ? 'years' : ''}
                    </p>
                    
                    {maid.specialties && maid.specialties.length > 0 && (
                      <div>
                        <p className="font-semibold text-sm mb-1">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {maid.specialties.slice(0, 3).map((specialty, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
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
                      <p className="text-right font-bold text-lg">
                        ${maid.hourlyRate}<span className="text-sm font-normal">/hour</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MaidChoose;