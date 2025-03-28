"use client";

import Sidebar from "../component/dashboard/Sidebar"; // Double-check this path

const Maiddash = () => {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Maid Dashboard</h1>
        {/* Your main content goes here */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p>Welcome to your dashboard!</p>
        </div>
      </main>
    </div>
  );
};

export default Maiddash;