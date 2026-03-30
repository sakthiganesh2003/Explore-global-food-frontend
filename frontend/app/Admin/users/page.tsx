'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '@/app/component/dashboard/Sidebar';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalChefs, setTotalChefs] = useState(0);
  const [totalMaids, setTotalMaids] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/getalluser`);
        const userData = response.data as User[];
        setUsers(userData);
        
        // Calculate totals
        setTotalUsers(userData.length);
        setTotalChefs(userData.filter(user => user.role === 'chef').length);
        setTotalMaids(userData.filter(user => user.role === 'maid').length);
        
        setLoading(false);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to fetch users');
        setLoading(false);
        toast.error(error.message || 'Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/deleteuser/${userId}`);
      const deletedUser = users.find(user => user._id === userId);
      setUsers(users.filter(user => user._id !== userId));
      
      // Update totals after deletion
      setTotalUsers(totalUsers - 1);
      if (deletedUser?.role === 'chef') {
        setTotalChefs(totalChefs - 1);
      } else if (deletedUser?.role === 'maid') {
        setTotalMaids(totalMaids - 1);
      }
      
      toast.success('User deleted successfully!');
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to delete user');
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/updateuserstatus/${userId}`, {
        isActive: !currentStatus
      });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      ));
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to update user status');
      toast.error(error.message || 'Failed to update user status');
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg text-gray-900">Total Users</h3>
          <p className="text-2xl font-bold text-gray-700">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg text-gray-900">Total Chefs</h3>
          <p className="text-2xl font-bold text-gray-700">{totalChefs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg text-gray-900">Total Maids</h3>
          <p className="text-2xl font-bold text-gray-700">{totalMaids}</p>
        </div>
      </div>
      
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentUsers.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} this user?`)) {
                      handleToggleStatus(user._id, user.isActive);
                    }
                  }}
                  className={`mr-2 font-bold py-1 px-3 rounded text-xs ${
                    user.isActive 
                      ? 'bg-yellow-500 hover:bg-yellow-700 text-white' 
                      : 'bg-green-500 hover:bg-green-700 text-white'
                  }`}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this user?')) {
                      handleDelete(user._id);
                    }
                  }}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const UserPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center py-10 pt-20 lg:pt-10">
        <h1 className="text-3xl text-center font-bold text-gray-800 mb-6 px-4">User Management</h1>
        <div className="w-full max-w-7xl bg-white shadow-md rounded-lg p-4 md:p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <UserTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;