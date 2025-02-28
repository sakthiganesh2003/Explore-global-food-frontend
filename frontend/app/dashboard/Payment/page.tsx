"use client";
import React, { useState } from "react";
import Sidebar from "@/app/component/dashboard/Sidebar";
import dynamic from "next/dynamic";
import { TableColumn } from "react-data-table-component";

// Dynamically import DataTable to prevent SSR issues
const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

// Define TypeScript Interface for Payment Data
interface Payment {
  id: string;
  chefName: string;
  amount: number;
  date: string;
  status: string;
}

const PaymentDashboard = () => {
  // Payment Data
  const [payments] = useState<Payment[]>([
    { id: "P001", chefName: "Gordon Ramsay", amount: 500, date: "2025-02-20", status: "Completed" },
    { id: "P002", chefName: "Nobu Matsuhisa", amount: 750, date: "2025-02-18", status: "Pending" },
    { id: "P003", chefName: "Rick Bayless", amount: 600, date: "2025-02-17", status: "Completed" },
    { id: "P004", chefName: "Dominique Ansel", amount: 900, date: "2025-02-15", status: "Failed" },
  ]);

  // Table Columns
  const columns: TableColumn<Payment>[] = [
    { name: "Payment ID", selector: (row: Payment) => row.id, sortable: true },
    { name: "Chef Name", selector: (row: Payment) => row.chefName, sortable: true },
    { name: "Amount ($)", selector: (row: Payment) => `$${row.amount}`, sortable: true },
    { name: "Date", selector: (row: Payment) => row.date, sortable: true },
    {
      name: "Status",
      cell: (row: Payment) => (
        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${
            row.status === "Completed" ? "bg-green-500" :
            row.status === "Pending" ? "bg-yellow-500" : 
            "bg-red-500"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Dashboard</h2>

        {/* Table Container */}
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

export default PaymentDashboard;
