"use client";
import React, { useState } from "react";
import Sidebar from "@/app/component/dashboard/Sidebar";
import dynamic from "next/dynamic";
import { CheckCircle, XCircle, Menu } from "lucide-react";

const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

const MaidDashboard = () => {
  const [maidBookings, setMaidBookings] = useState([
    { id: 1, bookingId: "B101", maidId: "M001", maidName: "Alice", status: "Pending", date: "2025-02-28" },
    { id: 2, bookingId: "B102", maidId: "M002", maidName: "Sophia", status: "Accepted", date: "2025-02-27" },
    { id: 3, bookingId: "B103", maidId: "M003", maidName: "Emma", status: "Rejected", date: "2025-02-26" },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAccept = (id: number) => {
    setMaidBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: "Accepted" } : booking
      )
    );
  };

  const handleReject = (id : number) => {
    setMaidBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: "Rejected" } : booking
      )
    );
  };

  const columns = [
    { name: "Booking ID", selector: (row : any) => row.bookingId, sortable: true },
    { name: "Maid ID", selector: (row : any) => row.maidId, sortable: true },
    { name: "Maid Name", selector: (row : any) => row.maidName, sortable: true },
    { name: "Status", selector: (row : any) => row.status, sortable: true },
    { name: "Date", selector: (row : any) => row.date, sortable: true },
    {
      name: "Actions",
      cell: (row : any) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAccept(row.id)}
            disabled={row.status === "Accepted"}
            className={`text-green-500 hover:text-green-700 flex items-center px-2 py-1 text-sm ${
              row.status === "Accepted" && "opacity-50 cursor-not-allowed"
            }`}
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Accept
          </button>
          <button
            onClick={() => handleReject(row.id)}
            disabled={row.status === "Rejected"}
            className={`text-red-500 hover:text-red-700 flex items-center px-2 py-1 text-sm ${
              row.status === "Rejected" && "opacity-50 cursor-not-allowed"
            }`}
          >
            <XCircle className="w-4 h-4 mr-1" /> Reject
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-3 bg-gray-200 fixed top-4 left-4 rounded-full z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-white shadow-lg md:w-64`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto p-4 md:p-6 overflow-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Maid Accept Dashboard</h2>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg p-2 md:p-4 overflow-x-auto">
          <DataTable
            columns={columns}
            data={maidBookings}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
};

export default MaidDashboard;