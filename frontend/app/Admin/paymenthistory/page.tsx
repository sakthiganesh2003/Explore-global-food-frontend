'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '@/app/component/dashboard/Sidebar';

// TypeScript interfaces
interface PaymentDetails {
  gateway: string;
  orderId: string;
  paymentId: string;
  method: string;
  bank: string | null;
  wallet: string | null;
  status: string;
  capturedAt: string;
}

interface ModeOfPayment {
  _id: string;
  modeOfPayment: string;
  displayName: string;
  bookingId: string;
  details: PaymentDetails;
  isActive: boolean;
  processingFee: number;
  createdAt: string;
  updatedAt: string;
  order: number;
  __v: number;
}

interface CustomerResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id: string | null;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string;
  card_id: string | null;
  bank: string | null;
  wallet: string | null;
  vpa: string;
  email: string;
  contact: string;
  notes: {
    type: string;
    booking: string;
  };
  fee: number;
  tax: number;
  error_code: string | null;
  error_description: string | null;
  error_source: string | null;
  error_step: string | null;
  error_reason: string | null;
  acquirer_data: {
    rrn: string;
    upi_transaction_id: string;
  };
  created_at: number;
  upi: {
    vpa: string;
  };
}

interface Payment {
  _id: string;
  modeOfPaymentId: ModeOfPayment;
  bookingId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentType: string;
  installmentNumber: number;
  isPartial: boolean;
  customerResponse?: CustomerResponse;
  payId: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

interface DecodedToken {
  id: string;
  exp?: number;
  [key: string]: unknown; // Allow additional properties
}

// API utility function
const fetchPaymentHistory = async (
  token: string,
  page: number = 1,
  limit: number = 10,
  sort: string = 'date-desc'
): Promise<ApiResponse> => {
  const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/allhistory`);
  apiUrl.searchParams.append('page', page.toString());
  apiUrl.searchParams.append('limit', limit.toString());
  apiUrl.searchParams.append('sort', sort);

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch payment history');
  }

  const data = await response.json();
  console.log('API Response:', data);
  data.payments.forEach((payment: Payment, index: number) => {
    if (!payment.customerResponse) {
      console.warn(`Payment at index ${index} has no customerResponse:`, payment);
    }
  });

  return data;
};

// Payment Table Component
const PaymentTable: React.FC<{ payments: Payment[] }> = ({ payments }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Currency</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment, index) => (
              <tr key={payment._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.payId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.bookingId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(payment.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.currency}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.paymentStatus === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {payment.customerResponse?.method || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(payment.completedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Page Component
const PaymentHistoryPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [sort, setSort] = useState<string>('date-desc');
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [pendingPayments, setPendingPayments] = useState<{ count: number; amount: number }>({ count: 0, amount: 0 });
  const [failedPayments, setFailedPayments] = useState<{ count: number; amount: number }>({ count: 0, amount: 0 });
  const router = useRouter();

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          router.push('/login');
          return;
        }

        let decoded: DecodedToken;
        try {
          decoded = jwtDecode(token);
          const now = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp < now) {
            setError('Token expired. Please log in again.');
            localStorage.removeItem('token');
            router.push('/login');
            return;
          }
        } catch {
          setError('Invalid authentication token. Please log in again.');
          setTimeout(() => {
            router.push('/login');
          }, 0);
          return;
        }

        const data = await fetchPaymentHistory(token, page, limit, sort);
        if (data.success) {
          setPayments(data.payments);
          setTotal(data.pagination.total);

          // Calculate metrics
          const completed = data.payments
            .filter((p) => p.paymentStatus === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
          
          const pending = data.payments.filter((p) => p.paymentStatus === 'pending');
          const failed = data.payments.filter((p) => p.paymentStatus === 'failed');

          setTotalPayment(completed);
          setPendingPayments({
            count: pending.length,
            amount: pending.reduce((sum, p) => sum + p.amount, 0),
          });
          setFailedPayments({
            count: failed.length,
            amount: failed.reduce((sum, p) => sum + p.amount, 0),
          });
        } else {
          setError(data.message || 'Failed to load payment history');
        }
      } catch (error: unknown) {
        const err = error as Error;
        setError(err.message || 'An error occurred while fetching payment history');
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [router, page, limit, sort]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < Math.ceil(total / limit)) {
      setPage(page + 1);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1); // Reset to first page on sort change
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-20 lg:p-8 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
            <div className="flex items-center space-x-4">
              <select
                value={sort}
                onChange={handleSortChange}
                className="px-4 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">Sort by Date (Newest)</option>
                <option value="date-asc">Sort by Date (Oldest)</option>
                <option value="status-completed">Sort by Status (Completed)</option>
                <option value="status-failed">Sort by Status (Failed)</option>
              </select>
            </div>
          </div>

          {/* Summary Section */}
          {!loading && !error && payments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600">Total Payments</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {(totalPayment).toFixed(2)} {payments[0]?.currency || 'INR'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600">Pending Payments</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingPayments.count} ({pendingPayments.amount.toFixed(2)} {payments[0]?.currency || 'INR'})
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600">Failed Payments</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {failedPayments.count} ({failedPayments.amount.toFixed(2)} {payments[0]?.currency || 'INR'})
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
              {error}
            </div>
          )}

          {!loading && !error && payments.length === 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-6">
              No payments found.
            </div>
          )}

          {!loading && !error && payments.length > 0 && (
            <>
              <PaymentTable payments={payments} />
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} payments
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      page === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={page >= Math.ceil(total / limit)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      page >= Math.ceil(total / limit)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;