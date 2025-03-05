"use client";
import React, { useState } from "react";
import Sidebar from "@/app/component/dashboard/Sidebar";
import dynamic from "next/dynamic"; // Import dynamic to disable SSR
import { Pencil, Trash2 } from "lucide-react";

// Dynamically import react-data-table-component to prevent SSR issues
const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

const ChefDashboard = () => {
  const [payments] = useState([
    { id: 1, invoiceId: "INV001", chefName: "Gordon Ramsay", amount: "$100", status: "Paid", date: "2025-02-20" },
    { id: 2, invoiceId: "INV002", chefName: "Nobu Matsuhisa", amount: "$150", status: "Pending", date: "2025-02-18" },
    { id: 3, invoiceId: "INV003", chefName: "Rick Bayless", amount: "$120", status: "Paid", date: "2025-02-17" },
    { id: 4, invoiceId: "INV004", chefName: "Dominique Ansel", amount: "$80", status: "Failed", date: "2025-02-15" },
  ]);

  const columns = [
    { name: "Invoice ID", selector: (row: any) => row.invoiceId, sortable: true },
    { name: "Chef Name", selector: (row: any) => row.chefName, sortable: true },
    { name: "Amount", selector: (row: any) => row.amount, sortable: true },
    { name: "Payment Status", selector: (row: any) => row.status, sortable: true },
    { name: "Date", selector: (row: any) => row.date, sortable: true },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex space-x-3">
          <button className="text-blue-500 hover:text-blue-700 flex items-center">
            <Pencil className="w-1 h-4 mr-1" /> Edit
          </button>
          <button className="text-red-500 hover:text-red-700 flex items-center">
            <Trash2 className="w-1 h-4 mr-1" /> Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Dashboard</h2>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <DataTable
            columns={columns}
            data={payments}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;
