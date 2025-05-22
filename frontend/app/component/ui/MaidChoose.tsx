"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface Maid {
  _id: string;
  userId: string;
  fullName: string;
  specialties: string[];
  rating: number;
  experience: string | number;
  image?: string;
  bio?: string;
  active: boolean;
  location?: {
    cityName: string;
    pincode: string;
  };
  distance?: number;
}

const MaidChoose: React.FC<{ onNext: (maid: Maid) => void }> = ({ onNext }) => {
  const [selectedMaid, setSelectedMaid] = useState<Maid | null>(null);
  const [filter, setFilter] = useState('');
  const [pincodeFilter, setPincodeFilter] = useState('');
  const [maids, setMaids] = useState<Maid[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const maidsPerPage = 12;

  useEffect(() => {
    const fetchMaids = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        const res = await fetch('http://localhost:5000/api/maids/maids', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch maids');

        const data = await res.json();
        const processedMaids = data.map((maid: any) => ({
          _id: maid._id,
          userId: maid.userId,
          fullName: maid.fullName || 'Professional Maid',
          specialties: maid.specialties?.filter((s: string) => s) || [],
          rating: Number(maid.rating) || 0,
          experience: maid.experience || 'Not specified',
          image: maid.image || '/maid-default.jpg',
          bio: maid.bio || 'Experienced professional',
          active: maid.active !== false,
          location: maid.location,
          distance: maid.distance,
        }));

        setMaids(processedMaids);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchMaids();
  }, []);

  const formatImageUrl = (url?: string) => {
    if (!url) return '/maid-default.jpg';
    return url.startsWith('http') ? url : `/${url}`;
  };

  const getFilteredMaids = () => {
    return maids
      .filter((maid) => maid.active)
      .filter((maid) => {
        const matchesSpecialty =
          !filter ||
          maid.specialties.some((s) => s.toLowerCase().includes(filter.toLowerCase()));

        const matchesPincode =
          !pincodeFilter || maid.location?.pincode?.includes(pincodeFilter);

        return matchesSpecialty && matchesPincode;
      })
      .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
  };

  const handleMaidSelect = (maid: Maid) => {
    setSelectedMaid(maid);
    setShowDetails(true);
    toast.success(`Viewing ${maid.fullName}'s profile`);
  };

  const handleBookMaid = () => {
    if (selectedMaid) {
      toast.promise(Promise.resolve(onNext(selectedMaid)), {
        loading: 'Processing booking...',
        success: 'Booking confirmed!',
        error: 'Failed to complete booking',
      });
    }
  };

  const filteredMaids = getFilteredMaids();
  const totalPages = Math.ceil(filteredMaids.length / maidsPerPage);
  const paginatedMaids = filteredMaids.slice(
    (currentPage - 1) * maidsPerPage,
    currentPage * maidsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Find Your Perfect Cook
        </h1>

        {/* Search Filters */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specialty
              </label>
              <input
                type="text"
                placeholder="Indian, itali etc."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pincode
              </label>
              <input
                type="text"
                placeholder="Enter pincode"
                value={pincodeFilter}
                onChange={(e) => setPincodeFilter(e.target.value)}
                maxLength={6}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilter('');
                  setPincodeFilter('');
                  setCurrentPage(1);
                }}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count and Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <p className="text-gray-600 font-medium">
            Showing {filteredMaids.length} available maids
          </p>
          {totalPages > 1 && (
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Maids Grid */}
        {filteredMaids.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No maids found matching your criteria
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or check back later
            </p>
            <button
              onClick={() => {
                setFilter('');
                setPincodeFilter('');
                setCurrentPage(1);
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Show All Maids
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedMaids.map((maid) => (
              <div
                key={maid._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleMaidSelect(maid)}
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={formatImageUrl(maid.image)}
                    alt={maid.fullName}
                    fill
                    className="object-cover rounded-t-2xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/maid-default.jpg';
                    }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">{maid.fullName}</h3>
                    <div className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                      <span>★</span>
                      <span className="ml-1 font-medium">{maid.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{maid.experience} experience</span>
                  </div>

                  {maid.location && (
                    <div className="mt-2 flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>
                        {maid.location.cityName}, {maid.location.pincode}
                        {maid.distance && ` • ${maid.distance} km`}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {maid.specialties.slice(0, 3).map((specialty, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                    {maid.specialties.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
                        +{maid.specialties.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Maid Details Modal */}
        {showDetails && selectedMaid && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative h-72 w-full">
                <Image
                  src={formatImageUrl(selectedMaid.image)}
                  alt={selectedMaid.fullName}
                  fill
                  className="object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">{selectedMaid.fullName}</h2>
                    <div className="flex items-center mt-2">
                      <div className="flex text-yellow-400 text-lg">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < Math.floor(selectedMaid.rating) ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600 font-medium">{selectedMaid.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleBookMaid}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
                  >
                    Book Now
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <svg
                          className="w-6 h-6 text-gray-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{selectedMaid.experience} experience</span>
                      </div>

                      {selectedMaid.location && (
                        <div className="flex items-start">
                          <svg
                            className="w-6 h-6 text-gray-500 mr-3 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <div>
                            <p className="font-medium">{selectedMaid.location.cityName}</p>
                            <p className="text-sm text-gray-600">Pincode: {selectedMaid.location.pincode}</p>
                            {selectedMaid.distance && (
                              <p className="text-sm text-indigo-600">
                                Approx. {selectedMaid.distance} km from you
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Specialties</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedMaid.specialties.map((specialty, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedMaid.bio || 'Professional maid with extensive experience in household services.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaidChoose;