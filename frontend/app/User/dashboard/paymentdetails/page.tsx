"use client";
import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiDollarSign, FiX, FiFilter, FiArrowLeft, FiUpload, FiFileText } from 'react-icons/fi';
import { FaRegCreditCard } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '@/app/component/dashboard/Sidebaruser';

interface User {
  _id: string;
  email: string;
}

interface Booking {
  _id: string;
}

interface Payment {
  _id: string;
  bookingId: Booking;
  userId: User;
  amount: number;
  paymentStatus?: 'paid' | 'unpaid';
  paymentProof?: string;
  createdAt: string;
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentPhoto, setPaymentPhoto] = useState<File | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('unpaid');
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`);
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await response.json();
      console.log('API Response:', data);
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    }
  };

  useEffect(() => {
    filterPayments();
  }, [activeFilter, searchTerm, payments]);

  const filterPayments = () => {
    let filtered = [...payments];

    switch (activeFilter) {
      case 'paid':
        filtered = filtered.filter(p => p.paymentStatus === 'paid');
        break;
      case 'unpaid':
        filtered = filtered.filter(p => p.paymentStatus === 'unpaid');
        break;
      default:
        break;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.userId.email.toLowerCase().includes(term) ||
        payment._id.toLowerCase().includes(term) ||
        payment.bookingId._id.toLowerCase().includes(term)
      );
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  };

  const handleUpdatePayment = async (paymentId: string) => {
    try {
      const formData = new FormData();
      formData.append('paymentId', paymentId);
      formData.append('paymentStatus', paymentStatus);
      if (paymentPhoto) {
        formData.append('paymentProof', paymentPhoto);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/update`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Payment updated successfully');
        fetchPayments();
        setIsModalOpen(false);
        setPaymentPhoto(null);
      } else {
        throw new Error('Failed to update payment');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment');
    }
  };

  const openPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setPaymentPhoto(null);
    setPaymentStatus(payment.paymentStatus || 'unpaid');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
    setPaymentPhoto(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentPhoto(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getPaymentStatusClass = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const capitalizeStatus = (status: string | undefined) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Pagination logic
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 p-6 text-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payments Management</h1>
            <p className="text-gray-600 mt-2">Manage customer payment details</p>

            {/* Filter and Search Bar */}
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <FiFilter className="text-gray-500" />
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          {filteredPayments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiDollarSign className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No payments found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try a different search term' : 'There are no payments matching your current filters'}
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentPayments.map((payment) => (
                        <tr key={payment._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            #{payment._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            #{payment.bookingId._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.userId.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{payment.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusClass(payment.paymentStatus)}`}>
                              {capitalizeStatus(payment.paymentStatus)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.paymentProof ? (
                              <a
                                href={payment.paymentProof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline flex items-center"
                              >
                                <FiFileText className="mr-1" />
                                View
                              </a>
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => openPaymentDetails(payment)}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                              Manage Payment
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Previous Page
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Next Page
                </button>
              </div>
            </>
          )}

          {/* Payment Details Modal */}
          {isModalOpen && selectedPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      <FiArrowLeft className="text-xl" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">
                      Payment Details
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      <FiX className="text-xl" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Payment Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaRegCreditCard className="mr-2 text-indigo-500" />
                        Payment Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Payment ID</p>
                          <p className="font-medium">#{selectedPayment._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Booking ID</p>
                          <p className="font-medium">#{selectedPayment.bookingId._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Customer Email</p>
                          <p className="font-medium">{selectedPayment.userId.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-medium">₹{selectedPayment.amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className={`font-medium capitalize ${getPaymentStatusClass(selectedPayment.paymentStatus)}`}>
                            {capitalizeStatus(selectedPayment.paymentStatus)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Update Payment Status */}
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center">
                        <FaRegCreditCard className="mr-2 text-indigo-500" />
                        Update Payment
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => setPaymentStatus('paid')}
                              className={`px-4 py-2 rounded-lg ${paymentStatus === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                              Paid
                            </button>
                            <button
                              onClick={() => setPaymentStatus('unpaid')}
                              className={`px-4 py-2 rounded-lg ${paymentStatus === 'unpaid' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                              Unpaid
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Proof (Screenshot/Photo)</label>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            onClick={triggerFileInput}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center"
                          >
                            <FiUpload className="mr-2" />
                            {paymentPhoto ? paymentPhoto.name : 'Upload Payment Proof'}
                          </button>
                          {paymentPhoto && (
                            <div className="mt-2 text-sm text-green-600 flex items-center">
                              <span>File selected: {paymentPhoto.name}</span>
                            </div>
                          )}
                          {selectedPayment.paymentProof && !paymentPhoto && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">Current payment proof:</p>
                              <a
                                href={selectedPayment.paymentProof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline text-sm flex items-center"
                              >
                                <FiFileText className="mr-1" />
                                View Payment Proof
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={closeModal}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdatePayment(selectedPayment._id)}
                        className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Update Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;