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
} from "react-icons/fi";
import SidebarMaid from "@/app/component/dashboard/SidebarMaid";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Assuming these interfaces remain the same as provided
interface Order {
  _id: string;
  cuisine: { id: string; name: string; price: number };
  userId: { _id: string; email: string };
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
  id?: string; // Added to match decodedToken.id usage
  [key: string]: any;
}

export default function OrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
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

  const filteredOrders = orders.filter((order) => {
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    const dateMatch =
      dateFilter === "all" ||
      (dateFilter === "today" && isToday(order.time.date)) ||
      (dateFilter === "tomorrow" && isTomorrow(order.time.date));
    return statusMatch && dateMatch;
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
      if (action === "confirm") {
        // Confirm order (update status to 'confirmed')
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/book/status/${orderId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: "confirmed" }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to confirm order");
        }

        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: "confirmed" } : order
          )
        );

        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: "confirmed" });
        }

        toast.success("Order accepted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (action === "reject") {
        // Reject order (create refund request)
        if (!amount) {
          throw new Error("Amount is required for refund");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/refunds`, {
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create refund request");
        }

        // Assume refund creation implies order cancellation
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: "cancelled" } : order
          )
        );

        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: "cancelled" });
        }

        toast.success("Refund request created successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
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
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 text-gray-700">
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
      <div className="flex min-h-screen bg-gray-100 text-gray-700">
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
    <div className="flex min-h-screen bg-gray-100 text-gray-700 font-sans">
      <SidebarMaid />
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <div className="flex items-center space-x-4">
                {decodedToken && (
                  <div className="text-sm text-gray-600">
                    Logged in as: {decodedToken.email}
                  </div>
                )}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredOrders.length} {filteredOrders.length === 1 ? "Order" : "Orders"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {paginatedOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                  <div className="text-gray-400 text-4xl mb-4">🍽️</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h3>
                  <p className="text-gray-500">There are currently no orders matching your criteria.</p>
                </div>
              ) : (
                <>
                  {paginatedOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedOrder?._id === order._id ? "ring-2 ring-indigo-500" : ""
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {order.cuisine.name} Cuisine
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Order #{order._id.slice(-6).toUpperCase()}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                            {formatDate(order.time.date)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="flex-shrink-0 mr-1.5 text-lg">₹</span>
                            {order.totalAmount.toFixed(2)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FiUser className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                            {order.members.reduce((sum, member) => sum + member.mealQuantity, 0)}{" "}
                            meals
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                            {formatTime(order.time.time[0])}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors ${
                        currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <FiChevronLeft className="mr-2" />
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors ${
                        currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Next
                      <FiChevronRight className="ml-2" />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              {selectedOrder ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-6"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                        <p className="text-sm text-gray-500 mt-1">
                          #{selectedOrder._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>

                    <div className="mt-6 space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Cuisine Information</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <span className="font-medium">{selectedOrder.cuisine.name}</span>
                            <span>₹{selectedOrder.cuisine.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">{selectedOrder.userId.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium">{selectedOrder.time.phoneNumber}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Address:</span>
                            <p className="font-medium mt-1">{selectedOrder.time.address}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Time</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FiCalendar className="text-gray-500" />
                            <span className="font-medium">{formatDate(selectedOrder.time.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <FiClock className="text-gray-500" />
                            <div className="space-x-2">
                              {selectedOrder.time.time.map((timeSlot, index) => (
                                <span key={index} className="font-medium">
                                  {formatTime(timeSlot)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                          {selectedOrder.confirmedFoods.map((food) => (
                            <div key={food._id} className="flex justify-between">
                              <div>
                                <span className="font-medium">{food.name}</span>
                                <span className="text-gray-500 text-sm ml-2">x{food.quantity}</span>
                              </div>
                              <span>₹{(food.price * food.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
                            <span>Total</span>
                            <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Members</h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                          {selectedOrder.members.map((member, index) => (
                            <div key={member._id}>
                              <div className="font-medium">Member {index + 1}</div>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Preference:</span>
                                  <div className="font-medium capitalize">
                                    {member.dietaryPreference.toLowerCase()}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Allergies:</span>
                                  <div className="font-medium">{member.allergies || "None"}</div>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-gray-600">Requests:</span>
                                  <div className="font-medium">{member.specialRequests || "None"}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Quantity:</span>
                                  <div className="font-medium">{member.mealQuantity}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedOrder.status === "pending" && (
                        <div className="flex space-x-3 pt-2">
                          <button
                            onClick={() => handleOrderAction(selectedOrder._id, "confirm")}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full flex items-center justify-center"
                          >
                            <FiCheck className="mr-2" />
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleOrderAction(selectedOrder._id, "reject", selectedOrder.totalAmount)
                            }
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full flex items-center justify-center"
                          >
                            <FiX className="mr-2" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                  <div className="text-gray-400 text-4xl mb-4">👈</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Select an order</h3>
                  <p className="text-gray-500">Choose an order from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}