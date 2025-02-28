"use client";
import React, { useState } from "react";
import Sidebar from "@/app/component/dashboard/Sidebar";
import dynamic from "next/dynamic";

// Dynamically import DataTable to prevent SSR issues
const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

const BookingDashboard = () => {
  const [bookings] = useState([
    { id: "B001", user: "John Doe", food: "Pasta", date: "2025-03-01", paymentId: "P001", status: "Confirmed" },
    { id: "B002", user: "Sarah Smith", food: "Sushi", date: "2025-03-02", paymentId: "P002", status: "Pending" },
    { id: "B003", user: "David Lee", food: "Tacos", date: "2025-03-03", paymentId: "P003", status: "Completed" },
    { id: "B004", user: "Emma Wilson", food: "Burger", date: "2025-03-04", paymentId: "P004", status: "Cancelled" },
  ]);

  const columns = [
    { name: "Booking ID", selector: (row) => row.id, sortable: true },
    { name: "User", selector: (row) => row.user, sortable: true },
    { name: "Food Selection", selector: (row) => row.food, sortable: true },
    { name: "Date", selector: (row) => row.date, sortable: true },
    { name: "Payment ID", selector: (row) => row.paymentId, sortable: true },
    {
      name: "Status",
      cell: (row) => (
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
