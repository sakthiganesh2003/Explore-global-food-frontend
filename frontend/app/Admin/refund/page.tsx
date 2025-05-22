"use client";
import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiDollarSign, FiX, FiFilter, FiArrowLeft, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '@/app/component/dashboard/Sidebar';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Booking {
  _id: string;
  userId: User;
  status: string;
  createdAt: string;
}

interface Refund {
  _id: string;
  bookingId: Booking;
  amount: number;
  proof: string | null;
  adminComment: string | null;
  status: 'pending' | 'refunded';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const RefundsPage = () => {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [filteredRefunds, setFilteredRefunds] = useState<Refund[]>([]);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentPhoto, setPaymentPhoto] = useState<File | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const refundsPerPage = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/refunds');
      if (!response.ok) {
        throw new Error('Failed to fetch refunds');
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setRefunds(data.data);
        setFilteredRefunds(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching refunds:', error);
      toast.error('Failed to load refunds');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    filterRefunds();
  }, [activeFilter, searchTerm, refunds]);

  const filterRefunds = () => {
    let filtered = [...refunds];

    switch (activeFilter) {
      case 'pending':
        filtered = filtered.filter(r => r.status === 'pending');
        break;
      case 'refunded':
        filtered = filtered.filter(r => r.status === 'refunded');
        break;
      default:
        break;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(refund => 
        (refund.bookingId?._id?.toLowerCase()?.includes(term) || false) ||
        (refund.bookingId?.userId?.email?.toLowerCase()?.includes(term) || false)
      );
    }

    setFilteredRefunds(filtered);
    setCurrentPage(1);
  };

  // Calculate summary statistics
  const summary = {
    totalRefunds: refunds.length,
    totalRefundAmount: refunds.reduce((sum, refund) => sum + refund.amount, 0),
    pendingRefunds: refunds.filter(r => r.status === 'pending').length,
    pendingAmount: refunds.filter(r => r.status === 'pending').reduce((sum, refund) => sum + refund.amount, 0),
    refundedRefunds: refunds.filter(r => r.status === 'refunded').length,
    refundedAmount: refunds.filter(r => r.status === 'refunded').reduce((sum, refund) => sum + refund.amount, 0),
  };

  const handleUpdateRefundProof = async (refundId: string) => {
    if (!paymentPhoto) {
      toast.error('Please upload a proof image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('proof', paymentPhoto);
      if (adminComment) {
        formData.append('adminComment', adminComment);
      }

      const response = await fetch(`http://localhost:5000/api/refunds/proof/${refundId}`, {
        method: 'PATCH',
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Refund proof updated successfully');
        fetchRefunds();
        setIsModalOpen(false);
        setPaymentPhoto(null);
        setAdminComment('');
      } else {
        throw new Error(data.error || 'Failed to update refund proof');
      }
    } catch (error) {
      console.error('Error updating refund proof:', error);
      toast.error(error.message || 'Failed to update refund proof');
    }
  };

  const openRefundDetails = (refund: Refund) => {
    setSelectedRefund(refund);
    setPaymentPhoto(null);
    setAdminComment('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRefund(null);
    setPaymentPhoto(null);
    setAdminComment('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentPhoto(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Kolkata',
    }).format(date);
  };

  const capitalizeStatus = (status: string | undefined) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const indexOfLastRefund = currentPage * refundsPerPage;
  const indexOfFirstRefund = indexOfLastRefund - refundsPerPage;
  const currentRefunds = filteredRefunds.slice(indexOfFirstRefund, indexOfLastRefund);
  const totalPages = Math.ceil(filteredRefunds.length / refundsPerPage);

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
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Refunds Management</h1>
            <p className="text-gray-600 mt-2">Manage refund requests</p>
            {/* Summary Section */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">Total Refunds</h3>
                <p className="text-2xl font-bold text-indigo-600">{summary.totalRefunds}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">Total Refund Amount</h3>
                <p className="text-2xl font-bold text-indigo-600">₹{summary.totalRefundAmount.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">Pending Refunds</h3>
                <p className="text-2xl font-bold text-yellow-600">{summary.pendingRefunds}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">Pending Amount</h3>
                <p className="text-2xl font-bold text-yellow-600">₹{summary.pendingAmount.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">Refunded Refunds</h3>
                <p className="text-2xl font-bold text-green-600">{summary.refundedRefunds}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">Refunded Amount</h3>
                <p className="text-2xl font-bold text-green-600">₹{summary.refundedAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search refunds by booking ID or email..."
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
                  <option value="all">All Refunds</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiDollarSign className="text-gray-400 text-3xl animate-spin" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">Loading refunds...</h3>
            </div>
          ) : filteredRefunds.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiDollarSign className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No refunds found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try a different search term' : 'There are no refunds matching your current filters'}
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentRefunds.map((refund) => (
                        <tr key={refund._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            #{refund._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {refund.bookingId?._id ? `#${refund.bookingId._id.slice(-6).toUpperCase()}` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {refund.bookingId?.userId?.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{refund.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              refund.status === 'refunded' ? 'bg-green-100 text-green-800' :
                              refund.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {capitalizeStatus(refund.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(refund.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => openRefundDetails(refund)}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                              Manage Refund
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

          {isModalOpen && selectedRefund && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      <FiArrowLeft className="text-xl" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">
                      Refund Details
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      <FiX className="text-xl" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FiDollarSign className="mr-2 text-indigo-500" />
                        Refund Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Refund ID</p>
                          <p className="font-medium">#{selectedRefund._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Booking ID</p>
                          <p className="font-medium">{selectedRefund.bookingId?._id ? `#${selectedRefund.bookingId._id.slice(-6).toUpperCase()}` : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Customer Email</p>
                          <p className="font-medium">{selectedRefund.bookingId?.userId?.email || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Customer Name</p>
                          <p className="font-medium">{selectedRefund.bookingId?.userId?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-medium">₹{selectedRefund.amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className={`font-medium capitalize ${
                            selectedRefund.status === 'refunded' ? 'text-green-600' :
                            'text-yellow-600'
                          }`}>
                            {capitalizeStatus(selectedRefund.status)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Created At</p>
                          <p className="font-medium">{formatDate(selectedRefund.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Updated At</p>
                          <p className="font-medium">{formatDate(selectedRefund.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center">
                        <FiDollarSign className="mr-2 text-indigo-500" />
                        Refund Proof
                      </h3>
                      <div className="space-y-4">
                        {selectedRefund.proof ? (
                          <div>
                            <p className="text-sm text-gray-500">Current Proof</p>
                            <a 
                              href={selectedRefund.proof} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline text-sm"
                            >
                              View Refund Proof
                            </a>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No proof uploaded</p>
                        )}
                        {selectedRefund.adminComment ? (
                          <div>
                            <p className="text-sm text-gray-500">Admin Comment</p>
                            <p className="font-medium">{selectedRefund.adminComment}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No admin comment</p>
                        )}
                        {selectedRefund.status === 'pending' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Proof (Screenshot/Photo)</label>
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/jpeg,image/png,image/gif"
                                className="hidden"
                              />
                              <button
                                onClick={triggerFileInput}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center"
                              >
                                <FiUpload className="mr-2" />
                                {paymentPhoto ? paymentPhoto.name : 'Upload Proof'}
                              </button>
                              {paymentPhoto && (
                                <div className="mt-2 text-sm text-green-600 flex items-center">
                                  <span>File selected: {paymentPhoto.name}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Comment</label>
                              <textarea
                                value={adminComment}
                                onChange={(e) => setAdminComment(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={4}
                                placeholder="Enter admin comment..."
                              />
                            </div>
                            <button
                              onClick={() => handleUpdateRefundProof(selectedRefund._id)}
                              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                              Update Refund Proof
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={closeModal}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Close
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

export default RefundsPage;