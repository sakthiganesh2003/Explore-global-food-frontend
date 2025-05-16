'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Statistic, Spin, theme } from 'antd';
import { UserOutlined, SolutionOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Sidebar from '@/app/component/dashboard/Sidebar';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Type definitions
interface UserStats {
  total: number;
  chefs: number;
  maids: number;
  users: number;
}

interface BookingStats {
  total: number;
  confirmed: number;
  cancelled: number;
  collected: number;
}

interface EarningsData {
  totalAmount: number;
}

// Chart color scheme
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const StatsDashboard: React.FC = () => {
  const { token } = theme.useToken();
  const [stats, setStats] = useState<{ users: UserStats; bookings: BookingStats } | null>(null);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const [statsRes, earningsRes] = await Promise.all([
          axios.get<{ users: UserStats; bookings: BookingStats }>(`${apiUrl}/api/book/all/status`),
          axios.get<EarningsData>(`${apiUrl}/api/book/admin/earings`)
        ]);
        setStats(statsRes.data);
        setEarnings(earningsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare data for charts
  const userRoleData = stats
    ? [
        { name: 'Chefs', value: stats.users.chefs },
        { name: 'Maids', value: stats.users.maids },
        { name: 'Users', value: stats.users.users },
      ]
    : [];

  const bookingStatusData = stats
    ? [
        { name: 'Confirmed', value: stats.bookings.confirmed },
        { name: 'Cancelled', value: stats.bookings.cancelled },
        { name: 'Completed', value: stats.bookings.collected },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Spin size="large" />
      </div>
    );
  }

  // Format currency in Indian Rupees
  const formatRupees = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('₹', '₹ ');

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Dashboard Overview</h2>

      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="border-0 shadow-sm rounded-lg h-full">
            <Statistic
              title="Total Users"
              value={stats?.users.total || 0}
              prefix={<UserOutlined className="text-indigo-600" />}
              valueStyle={{ color: '#1e293b' }}
              className="text-lg"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="border-0 shadow-sm rounded-lg h-full">
            <Statistic
              title="Total Bookings"
              value={stats?.bookings.total || 0}
              prefix={<SolutionOutlined className="text-indigo-600" />}
              valueStyle={{ color: '#1e293b' }}
              className="text-lg"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="border-0 shadow-sm rounded-lg h-full">
            <Statistic
              title="Total Revenue"
              value={earnings?.totalAmount ? formatRupees(earnings.totalAmount) : '₹ 0'}
              valueStyle={{ color: '#10b981', fontWeight: 600 }}
              className="text-lg"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="border-0 shadow-sm rounded-lg h-full">
            <Statistic
              title="Completed"
              value={stats?.bookings.collected || 0}
              valueStyle={{ color: '#10b981' }}
              prefix={<CheckCircleOutlined />}
              className="text-lg"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={12}>
          <Card title="User Distribution" className="border-0 shadow-sm rounded-lg">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} users`, 'Count']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Booking Status" className="border-0 shadow-sm rounded-lg">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                  />
                  <Bar dataKey="value" name="Bookings" radius={[4, 4, 0, 0]}>
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Detailed Statistics */}
      <Card title="Detailed Statistics" className="border-0 shadow-sm rounded-lg mt-6">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">User Breakdown</h3>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
                    <Statistic title="Chefs" value={stats?.users.chefs || 0} valueStyle={{ color: '#1e293b' }} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
                    <Statistic title="Maids" value={stats?.users.maids || 0} valueStyle={{ color: '#1e293b' }} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
                    <Statistic title="Customers" value={stats?.users.users || 0} valueStyle={{ color: '#1e293b' }} />
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Booking Metrics</h3>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
                    <Statistic
                      title="Avg. Revenue per Booking"
                      value={stats && earnings && stats.bookings.total > 0 ? formatRupees(earnings.totalAmount / stats.bookings.total) : '₹ 0'}
                      valueStyle={{ color: '#10b981' }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
                    <Statistic
                      title="Completion Rate"
                      value={stats && stats.bookings.total > 0 ? (stats.bookings.collected / stats.bookings.total) * 100 : 0}
                      precision={1}
                      suffix="%"
                      valueStyle={{ color: '#10b981' }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
                    <Statistic
                      title="Cancellation Rate"
                      value={stats && stats.bookings.total > 0 ? (stats.bookings.cancelled / stats.bookings.total) * 100 : 0}
                      precision={1}
                      suffix="%"
                      valueStyle={{ color: '#ef4444' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const Maiddash: React.FC = () => (
  <div className="flex min-h-screen bg-white">
    <Sidebar />
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <StatsDashboard />
    </main>
  </div>
);

export default Maiddash;