import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface Maid {
  _id: string;
  name: string;
  cuisine: string[];
  rating: number;
  experience: number;
  image: string;
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
        
        if (isMounted) {
          setMaids(data.map((maid: any) => ({
            ...maid,
            image: formatImageUrl(maid.image)
          })));
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

  const formatImageUrl = (url: string) => {
    if (!url) return "/chef-placeholder.jpg";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return `/${url}`;
  };

  const getFilteredMaids = () => {
    if (!filter) return maids;
    return maids.filter(maid =>
      maid.cuisine.some(cuisine =>
        cuisine.toLowerCase().includes(filter.toLowerCase())
      )
    );
  };

  const handleMaidSelect = (maid: Maid) => {
    setSelectedMaid(maid);
    setShowDetails(true);
    toast.success(`${maid.name} selected`, {
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
          // Simulate API call
          setTimeout(() => {
            onNext(selectedMaid);
            resolve(true);
          }, 1000);
        }),
        {
          loading: `Booking ${selectedMaid.name}...`,
          success: (
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <div>
                <p className="font-bold">Booking confirmed!</p>
                <p className="text-sm">{selectedMaid.name} will contact you shortly</p>
              </div>
            </div>
          ),
          error: `Failed to book ${selectedMaid.name}`,
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
    return <div className="text-center py-8">Loading maids...</div>;
  }

  return (
    <div className="text-center text-gray-500 p-4">
      <h2 className="text-xl font-semibold mb-4">Choose Your Maid</h2>
      
      {showDetails && selectedMaid ? (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto">
                <Image
                  src={selectedMaid.image}
                  alt={selectedMaid.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/chef-placeholder.jpg";
                  }}
                />
              </div>
            </div>
            <div className="flex-grow text-left">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold">{selectedMaid.name}</h3>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex items-center gap-2 my-2">
                <span className="flex items-center">
                  ⭐ {selectedMaid.rating}
                </span>
                <span>•</span>
                <span>{selectedMaid.experience} years experience</span>
                {selectedMaid.hourlyRate && (
                  <>
                    <span>•</span>
                    <span>${selectedMaid.hourlyRate}/hr</span>
                  </>
                )}
              </div>
              
              <div className="my-4">
                <h4 className="font-semibold mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMaid.cuisine.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              
              {selectedMaid.bio && (
                <div className="my-4">
                  <h4 className="font-semibold mb-2">About:</h4>
                  <p className="text-gray-600">{selectedMaid.bio}</p>
                </div>
              )}
              
              {selectedMaid.services && (
                <div className="my-4">
                  <h4 className="font-semibold mb-2">Services:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {selectedMaid.services.map((service, i) => (
                      <li key={i}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to List
                </button>
                <button
                  onClick={handleBookMaid}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book {selectedMaid.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Filter by cuisine..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 mb-4 border rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredMaids.map((maid) => (
              <div
                key={maid._id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMaid?._id === maid._id 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:shadow-md"
                }`}
                onClick={() => handleMaidSelect(maid)}
              >
                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-3">
                  <Image
                    src={maid.image}
                    alt={maid.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/chef-placeholder.jpg";
                    }}
                  />
                </div>
                <h3 className="font-bold">{maid.name}</h3>
                <div className="flex flex-wrap justify-center gap-1 my-2">
                  {maid.cuisine.map((c, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
                <p className="text-sm">⭐ {maid.rating} | {maid.experience} yrs</p>
              </div>
            ))}
          </div>

          {selectedMaid && !showDetails && (
            <button
              onClick={() => setShowDetails(true)}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View {selectedMaid.name}'s Details
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default MaidChoose;