"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiUser,
  FiCheck,
  FiX,
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiSearch,
  FiDollarSign
} from "react-icons/fi";
import SidebarMaid from "@/app/component/dashboard/SidebarMaid";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Order {
  _id: string;
  cuisine: { id: string; name: string; price: number };
  userId: { _id: string; email: string; name?: string };
  maidId: { _id: string };
  members: {
    dietaryPreference: string;
    allergies: string;
    specialRequests: string;
    mealQuantity: number;
    _id: string;
  }[];
  time: { date: string; time: string[]; address: string; phoneNumber: string; _id: string };
  confirmedFoods: { id: string; name: string; price: number; quantity: number; _id: string }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface DecodedToken {
  userId: string;
  email: string;
  exp: number;
  id?: string;
  [key: string]: any;
}

export default function OrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState({
    status: "all",
    date: "all",
    search: "",
    minAmount: "",
    maxAmount: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        setDecodedToken(decoded);
        setToken(storedToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          setError("Token has expired");
          localStorage.removeItem("token");
          setToken(null);
          setDecodedToken(null);
        }
      } catch (err) {
        setError("Invalid token");
        setToken(null);
        setDecodedToken(null);
      }
    } else {
      setError("No token found in localStorage");
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!decodedToken || !token) {
        setLoading(false);
        return;
      }

      try {
        const maidId = decodedToken.id;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book/${maidId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [decodedToken, token]);

  const isToday = (dateString: string) => {
    const today = new Date();
    const orderDate = new Date(dateString);
    return orderDate.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const orderDate = new Date(dateString);
    return orderDate.toDateString() === tomorrow.toDateString();
  };

  const isThisWeek = (dateString: string) => {
    const today = new Date();
    const orderDate = new Date(dateString);
    const diffDays = Math.floor((orderDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch = 
      filters.status === "all" || 
      order.status === filters.status;
    
    const dateMatch = 
      filters.date === "all" ||
      (filters.date === "today" && isToday(order.time.date)) ||
      (filters.date === "tomorrow" && isTomorrow(order.time.date)) ||
      (filters.date === "week" && isThisWeek(order.time.date));
    
    const searchMatch = 
      !filters.search ||
      order.cuisine.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.userId.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      (order.userId.name && order.userId.name.toLowerCase().includes(filters.search.toLowerCase())) ||
      order._id.toLowerCase().includes(filters.search.toLowerCase());
    
    const minAmountMatch = 
      !filters.minAmount || 
      order.totalAmount >= Number(filters.minAmount);
    
    const maxAmountMatch = 
      !filters.maxAmount || 
      order.totalAmount <= Number(filters.maxAmount);
    
    return (
      statusMatch && 
      dateMatch && 
      searchMatch && 
      minAmountMatch && 
      maxAmountMatch
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: "all",
      date: "all",
      search: "",
      minAmount: "",
      maxAmount: ""
    });
    setCurrentPage(1);
  };

  const handleOrderAction = async (
  orderId: string,
  action: "confirm" | "reject",
  amount?: number
) => {
  if (!token) {
    setError("No valid token available");
    toast.error("No valid token available", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  try {
    // Update booking status (confirm or reject)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/book/status/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action === "confirm" ? "confirmed" : "cancelled" }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update order status");
    }

    // If rejecting, also create a refund requestlong
    if (action === "reject") {
      if (!amount) {
        throw new Error("Amount is required for refund");
      }

      const refundResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/refunds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: orderId,
          amount,
        }),
      });

      if (!refundResponse.ok) {
        const errorData = await refundResponse.json();
        throw new Error(errorData.error || "Failed to create refund request");
      }
    }

    // Update local state
    setOrders(
      orders.map((order) =>
        order._id === orderId
          ? { ...order, status: action === "confirm" ? "confirmed" : "cancelled" }
          : order
      )
    );

    if (selectedOrder?._id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: action === "confirm" ? "confirmed" : "cancelled",
      });
    }

    toast.success(
      action === "confirm"
        ? "Order accepted successfully!"
        : "Order rejected and refund request created!",
      {
        position: "top-right",
        autoClose: 3000,
      }
    );
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to process order action";
    setError(errorMessage);
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 3000,
    });
  }
};

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString: string) => {
    return timeString.replace("AM", " am").replace("PM", " pm");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-700">
        <SidebarMaid />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FiLoader className="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
            <p className="mt-4 text-lg font-semibold text-gray-800">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-700">
        <SidebarMaid />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading orders</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-700 font-sans">
      <SidebarMaid />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header and Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiFilter />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Expanded Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.2 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <select
                      name="date"
                      value={filters.date}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Dates</option>
                      <option value="today">Today</option>
                      <option value="tomorrow">Tomorrow</option>
                      <option value="week">This Week</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiDollarSign className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="minAmount"
                          value={filters.minAmount}
                          onChange={handleFilterChange}
                          placeholder="Min"
                          className="pl-8 pr-2 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiDollarSign className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="maxAmount"
                          value={filters.maxAmount}
                          onChange={handleFilterChange}
                          placeholder="Max"
                          className="pl-8 pr-2 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Reset Filters
                  </button>
                </div>
              </motion.div>
            )}

            {/* Results Count */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">
                Showing {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-2">
              {paginatedOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="text-gray-400 text-4xl mb-4">🍽️</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cuisine
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Meals
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedOrders.map((order) => (
                          <motion.tr
                            key={order._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`cursor-pointer hover:bg-gray-50 ${
                              selectedOrder?._id === order._id ? "bg-indigo-50" : ""
                            }`}
                            onClick={() => setSelectedOrder(order)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              #{order._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.cuisine.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{order.totalAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {order.members.reduce((sum, member) => sum + member.mealQuantity, 0)} meals
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatDate(order.time.date)} <br />
                              {formatTime(order.time.time[0])}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {order.status === "pending" ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOrderAction(order._id, "confirm");
                                    }}
                                    className="p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                                    title="Accept Order"
                                  >
                                    <FiCheck size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOrderAction(order._id, "reject", order.totalAmount);
                                    }}
                                    className="p-1.5 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                                    title="Reject Order"
                                  >
                                    <FiX size={16} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FiChevronLeft className="mr-2" />
                    Previous
                  </button>
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                      currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Next
                    <FiChevronRight className="ml-2" />
                  </button>
                </div>
              )}
            </div>

            {/* Order Details Panel */}
            <div className="lg:col-span-1">
              {selectedOrder ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-6"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                        <div className="flex items-center mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            #{selectedOrder._id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">₹{selectedOrder.totalAmount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(selectedOrder.time.date)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Customer Section */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                          Customer
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="bg-indigo-100 text-indigo-800 rounded-full w-10 h-10 flex items-center justify-center">
                              <FiUser size={18} />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {selectedOrder.userId.name || selectedOrder.userId.email.split('@')[0]}
                              </h4>
                              <p className="text-sm text-gray-500">{selectedOrder.userId.email}</p>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center">
                              <FiPhone className="text-gray-400 mr-2" />
                              <span>{selectedOrder.time.phoneNumber}</span>
                            </div>
                            <div className="flex items-center">
                              <FiMapPin className="text-gray-400 mr-2" />
                              <span>{selectedOrder.time.address.split(',')[0]}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary Section */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                          Order Summary
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="mb-3 pb-3 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Cuisine Type</span>
                              <span>{selectedOrder.cuisine.name}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {selectedOrder.confirmedFoods.map((food) => (
                              <div key={food._id} className="flex justify-between">
                                <div>
                                  <span className="font-medium">{food.name}</span>
                                  <span className="text-gray-500 text-sm ml-2">x{food.quantity}</span>
                                </div>
                                <span>₹{(food.price * food.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Information */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                          Delivery Information
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3 mb-3">
                            <FiCalendar className="text-gray-400" />
                            <span>{formatDate(selectedOrder.time.date)}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <FiClock className="text-gray-400" />
                            <div className="flex space-x-2">
                              {selectedOrder.time.time.map((timeSlot, index) => (
                                <span key={index}>{formatTime(timeSlot)}</span>
                              ))}
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-start space-x-3">
                              <FiMapPin className="text-gray-400 mt-1" />
                              <div>
                                <p className="text-sm">{selectedOrder.time.address}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Members Section */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                          Members ({selectedOrder.members.length})
                        </h3>
                        <div className="space-y-3">
                          {selectedOrder.members.map((member, index) => (
                            <div key={member._id} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">Member {index + 1}</h4>
                                <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                                  {member.mealQuantity} meal(s)
                                </span>
                              </div>
                              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Preference:</span>
                                  <p className="font-medium capitalize">
                                    {member.dietaryPreference.toLowerCase()}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Allergies:</span>
                                  <p className="font-medium">
                                    {member.allergies || "None"}
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-gray-500">Requests:</span>
                                  <p className="font-medium">
                                    {member.specialRequests || "None"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {selectedOrder.status === "pending" && (
                        <div className="flex space-x-3 pt-2">
                          <button
                            onClick={() => handleOrderAction(selectedOrder._id, "confirm")}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                          >
                            <FiCheck className="mr-2" />
                            Accept Order
                          </button>
                          <button
                            onClick={() =>
                              handleOrderAction(selectedOrder._id, "reject", selectedOrder.totalAmount)
                            }
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                          >
                            <FiX className="mr-2" />
                            Reject Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="text-gray-400 text-4xl mb-4">👈</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Select an order</h3>
                  <p className="text-gray-500">Choose an order from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
