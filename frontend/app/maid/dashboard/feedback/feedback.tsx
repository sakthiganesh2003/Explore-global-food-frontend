import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SidebarMaid from '@/app/component/dashboard/SidebarMaid';

// Define TypeScript interfaces for feedback data
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

// Component to display feedback for a specific userId
const FeedbackPage: React.FC = () => {
  const router = useRouter();
  const { userId } = router.query; // Get userId from dynamic route
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch feedback data when userId changes
  useEffect(() => {
    if (!userId) return;

    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3000/api/feedback/feedback/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        const data: ApiResponse = await response.json();
        if (data.success) {
          setFeedbacks(data.data);
        } else {
          setError('No feedback found');
        }
              } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Server error');
          }
        }finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [userId]);

  // Render stars for rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
        <SidebarMaid/>
      <Head>
        <title>User Feedback</title>
        <meta name="description" content="View user feedback" />
      </Head>

      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">User Feedback</h1>
          <p className="mt-2">Feedback for User ID: {userId}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && feedbacks.length === 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
            <p>No feedback found for this user.</p>
          </div>
        )}

        {!loading && !error && feedbacks.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="text-lg">{renderStars(feedback.rating)}</div>
                  <span className="ml-2 text-gray-600">({feedback.rating}/5)</span>
                </div>
                <p className="text-gray-700 mb-4">{feedback.comment}</p>
                <p className="text-sm text-gray-500">
                  Posted on: {new Date(feedback.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">Booking ID: {feedback.bookingId}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FeedbackPage;