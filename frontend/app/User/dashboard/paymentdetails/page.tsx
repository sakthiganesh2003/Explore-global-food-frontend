'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Sidebaruser from '@/app/component/dashboard/Sidebaruser';

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
  customerResponse?: CustomerResponse; // Made optional to handle undefined cases
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
  email?: string;
  name?: string;
  [key: string]: any;
}

const fetchPaymentHistory = async (id: string, token: string): Promise<ApiResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/success/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch payment history');
  }

  return response.json();
};

const PaymentTable: React.FC<{ payments: Payment[] }> = ({ payments }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="truncate max-w-xs">{payment.payId}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {(payment.amount).toLocaleString('en-IN', {
                  style: 'currency',
                  currency: payment.currency || 'INR',
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                {payment.customerResponse?.method || 'N/A'}
                {payment.customerResponse?.vpa && (
                  <div className="text-xs text-gray-500">VPA: {payment.customerResponse.vpa}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                  {payment.paymentStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(payment.completedAt)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <button
                  className="text-blue-600 hover:text-blue-900"
                  onClick={() => {
                    console.log('View details for', payment._id);
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PaymentHistoryPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<DecodedToken | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }

        const decoded: DecodedToken = jwtDecode(token);
        setUserInfo(decoded);

        if (!decoded.id) {
          throw new Error('Invalid user information in token');
        }

        const data = await fetchPaymentHistory(decoded.id, token);
        if (data.success) {
          setPayments(data.payments);
        } else {
          throw new Error(data.message || 'Failed to load payment history');
        }
      } catch (err: any) {
        setError(err.message);
        if (err.message.includes('Authentication') || err.message.includes('Invalid')) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebaruser />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
            {userInfo && (
              <p className="text-gray-600 mt-2">
                {userInfo.name || userInfo.email ? `Welcome back, ${userInfo.name || userInfo.email}` : ''}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500">You haven't made any payments yet.</p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{payments.length}</span> payments
                </div>
                <div>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    defaultValue="all"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              
              <PaymentTable payments={payments} />
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Page 1 of 1
                </div>
                <div className="flex space-x-2">
                  <button
                    disabled
                    className="px-3 py-1 rounded border bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    disabled
                    className="px-3 py-1 rounded border bg-gray-100 text-gray-400 cursor-not-allowed"
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