"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import SidebarMaid from '@/app/component/dashboard/SidebarMaid';

interface Feedback {
  _id: string;
  bookingId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Feedback[];
}

export default function FeedbackPage() {
  const userId = "67f64b04a36d593ba17ed4a8";
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/feedback/${userId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();

        if (data.success) {
          setFeedbackData(data.data);
        } else {
          setError('Failed to fetch feedback data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching feedback');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [userId]);

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarMaid />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarMaid />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
            {error}
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = feedbackData.length > 0 
    ? feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length
    : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarMaid />
      <div className="flex-1 p-6">
        <Head>
          <title>User Feedback</title>
          <meta name="description" content="View user feedback" />
        </Head>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Customer Feedback</h1>
            <p className="text-gray-600">Detailed feedback from customers</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">Total Feedback</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">{feedbackData.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
              <div className="flex items-center mt-1">
                <p className="text-2xl font-bold text-gray-800 mr-2">
                  {averageRating.toFixed(1)}
                </p>
                {renderRatingStars(Math.round(averageRating))}
              </div>
            </div>
          </div>

          {/* Feedback Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feedbackData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No feedback found yet.
                      </td>
                    </tr>
                  ) : (
                    feedbackData.map((feedback) => (
                      <tr key={feedback._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{feedback.bookingId.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderRatingStars(feedback.rating)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                          <div className="line-clamp-2">
                            {feedback.comment || "No comment provided"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(feedback.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}