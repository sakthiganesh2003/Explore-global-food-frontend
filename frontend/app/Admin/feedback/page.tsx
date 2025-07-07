"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '@/app/component/dashboard/Sidebar';

interface Feedback {
  _id: string;
  rating: number;
  comment: string;
  bookingId: string;
  userId: string;
  createdAt: string;
}

interface ApiResponse {
  data: Feedback[];
  count: number;
}

const FeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/feedback/allfeedback?page=${page}&limit=${itemsPerPage}`
        );
        setFeedbackList(response.data.data || []);
        setTotalPages(Math.ceil(response.data.count / itemsPerPage));
        setTotalCount(response.data.count);
        setError(null);
      } catch (err) {
        setError('Failed to fetch feedback');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [page, itemsPerPage]);

  const renderRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span
        key={i}
        className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        {i < rating ? '★' : '☆'}
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8 justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Customer Feedback</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-medium">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" role="grid">
              <thead className="bg-gray-100">
                <tr role="row">
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Comment</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Booking ID</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User ID</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbackList.map((feedback, index) => (
                  <tr key={feedback._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"} role="row">
                    <td className="px-6 py-4 whitespace-nowrap" role="cell">
                      <div className="flex items-center">
                        {renderRatingStars(feedback.rating)}
                        <span className="ml-2 text-gray-600">({feedback.rating}/5)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4" role="cell">
                      <div className="text-sm text-gray-900 max-w-md break-words">
                        {feedback.comment}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" role="cell">
                      {feedback.bookingId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" role="cell">
                      {feedback.userId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" role="cell">
                      {formatDate(feedback.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(page * itemsPerPage, totalCount || feedbackList.length)}
              </span>{' '}
              of <span className="font-medium">{totalCount || feedbackList.length}</span> results
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                aria-label="Go to first page"
                className={`px-4 py-2 rounded-md flex items-center space-x-1 ${
                  page === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-black'
                }`}
              >
                <span>«</span>
                <span>First</span>
              </button>
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                aria-label="Go to previous page"
                className={`px-4 py-2 rounded-md flex items-center space-x-1 ${
                  page === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-black'
                }`}
              >
                <span>‹</span>
                <span>Previous</span>
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded-md ${
                        page === pageNum 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                aria-label="Go to next page"
                className={`px-4 py-2 rounded-md flex items-center space-x-1 ${
                  page === totalPages ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <span>Next</span>
                <span>›</span>
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                aria-label="Go to last page"
                className={`px-4 py-2 rounded-md flex items-center space-x-1 ${
                  page === totalPages ? 'bg-gray-5s00 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <span>Last</span>
                <span>»</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;