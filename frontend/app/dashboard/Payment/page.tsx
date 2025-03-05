"use client";
import React, { useState } from 'react';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

// Define the type for a booking
type Booking = {
  id: string;
  name: string;
  date: string;
  status: string;
};

// Create a React Query client
const queryClient = new QueryClient();

// Fetch bookings from the API
const fetchBookings = async (): Promise<Booking[]> => {
  const { data } = await axios.get<Booking[]>('/api/bookings');
  return data;
};

// Add a new booking
const addBooking = async (newBooking: Omit<Booking, 'id'>): Promise<Booking> => {
  const { data } = await axios.post<Booking>('/api/bookings', newBooking);
  return data;
};

// Booking List Component
const BookingList: React.FC = () => {
  const { data, error, isLoading } = useQuery<Booking[], Error>(['bookings'], fetchBookings);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {data?.map((booking) => (
          <li key={booking.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-900">{booking.name}</div>
              <div className="text-sm text-gray-500">{booking.date}</div>
              <div className="text-sm text-gray-500">{booking.status}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Add Booking Form Component
const AddBookingForm: React.FC = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Pending');

  const mutation = useMutation<Booking, Error, Omit<Booking, 'id'>>({
    mutationFn: addBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      setName('');
      setDate('');
      setStatus('Pending');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, date, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Add Booking
      </button>
    </form>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Dashboard</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Add New Booking</h2>
            <AddBookingForm />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Bookings List</h2>
            <BookingList />
          </div>
        </div>
      </main>
    </div>
  );
};

// Wrap the Dashboard with QueryClientProvider
const Home: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
};

export default Home;