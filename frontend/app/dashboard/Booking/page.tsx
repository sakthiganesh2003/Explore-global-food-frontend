"use client";
import React, { useState } from "react";
import Sidebar from "@/app/component/dashboard/Sidebar";
import dynamic from "next/dynamic";
import { book }  from "@/app/data/data";

// Dynamically import DataTable to prevent SSR issues
const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });
interface Booking {
  id: string;
  user: string;
  food: string;
  date: string;
  paymentId: string;
  status: string;
}
const BookingDashboard = () => {
  const [bookings] = useState<Booking[]>(book); // Ensure book is an array

  const columns = [
    { name: "Booking ID", selector: (row : any) => row.id, sortable: true },
    { name: "User", selector: (row : any) => row.user, sortable: true },
    { name: "Food Selection", selector: (row : any) => row.food, sortable: true },
    { name: "Date", selector: (row : any) => row.date, sortable: true },
    { name: "Payment ID", selector: (row : any) => row.paymentId, sortable: true },
    {
      name: "Status",
      cell: (row : any) => (
        <span className={`px-3 py-1 rounded-full text-white text-sm ${row.status === "Completed" ? "bg-green-500" : row.status === "Pending" ? "bg-yellow-500" : row.status === "Cancelled" ? "bg-red-500" : "bg-blue-500"}`}>
          {row.status}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="flex h-screen  bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Maid Cook Booking Dashboard</h2>

        {/* Table Container */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <DataTable
            columns={columns}
            data={bookings}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
};

export default BookingDashboard;
