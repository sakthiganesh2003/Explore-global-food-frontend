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
}

const MaidChoose: React.FC<{ onNext: (maid: Maid) => void }> = ({ onNext }) => {
  const [selectedMaid, setSelectedMaid] = useState<Maid | null>(null);
  const [filter, setFilter] = useState("");
  const [maids, setMaids] = useState<Maid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching maids data - this should appear ONLY ONCE in console");
    
    let isMounted = true;
    
    const fetchMaids = async () => {
      try {
        console.log("API call initiated");
        const res = await fetch("http://localhost:5000/api/maids/maids");
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        
        if (isMounted) {
          console.log("Updating maids state with data:", data);
          setMaids(data.map((maid: any) => ({
            ...maid,
            image: formatImageUrl(maid.image)
          })));
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load maids");
      } finally {
        if (isMounted) {
          console.log("Loading complete");
          setLoading(false);
        }
      }
    };
  
    fetchMaids();
    
    return () => {
      console.log("Cleanup - component unmounting");
      isMounted = false;
    };
  }, []);

  // Helper function to format image URLs
  const formatImageUrl = (url: string) => {
    if (!url) return "/chef-placeholder.jpg";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return `/${url}`;
  };

  // Filter maids based on cuisine search
  const getFilteredMaids = () => {
    if (!filter) return maids;
    return maids.filter(maid =>
      maid.cuisine.some(cuisine =>
        cuisine.toLowerCase().includes(filter.toLowerCase())
      )
    );
  };

  const filteredMaids = getFilteredMaids();
  console.log("Filtered maids:", filteredMaids);

  if (loading) {
    return <div className="text-center py-8">Loading maids...</div>;
  }

  return (
    <div className="text-center text-gray-500 p-4">
      <h2 className="text-xl font-semibold mb-4">Choose Your Maid</h2>
      
      <input
        type="text"
        placeholder="Filter by cuisine..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 mb-4 border rounded w-full sm:w-1/2"
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
            onClick={() => {
              console.log("Selected maid:", maid.name);
              console.log("Selected maid ID:", maid._id);
              setSelectedMaid(maid);
              toast.success(`Selected ${maid.name}`);
            }}
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
                  console.warn("Failed to load image for maid:", maid.name);
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

      <button
        className={`mt-6 px-6 py-2 rounded-lg ${
          selectedMaid
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
        onClick={() => {
          if (selectedMaid) {
            console.log("Proceeding with booking:", selectedMaid.name);
            console.log("Booking maid ID:", selectedMaid._id);
            onNext(selectedMaid);
          }
        }}
        disabled={!selectedMaid}
      >
        {selectedMaid ? `Book ${selectedMaid.name}` : "Select a maid"}
      </button>
    </div>
  );
};

export default MaidChoose;