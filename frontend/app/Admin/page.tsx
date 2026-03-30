'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Statistic, Spin, theme, Divider } from 'antd';
import { UserOutlined, SolutionOutlined, CheckCircleOutlined, TeamOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Sidebar from '@/app/component/dashboard/Sidebar';

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

  // Format currency in Indian Rupees
  const formatRupees = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('₹', '₹ ');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>

      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="border-0 shadow-sm rounded-lg h-full hover:shadow-md transition-shadow">
            <Statistic
              title="Total Users"
              value={stats?.users.total || 0}
              prefix={<UserOutlined className="text-blue-600" />}
              valueStyle={{ color: token.colorPrimary }}
              className="text-lg"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="border-0 shadow-sm rounded-lg h-full hover:shadow-md transition-shadow">
            <Statistic
              title="Total Bookings"
              value={stats?.bookings.total || 0}
              prefix={<SolutionOutlined className="text-purple-600" />}
              valueStyle={{ color: token.colorPrimary }}
              className="text-lg"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="border-0 shadow-sm rounded-lg h-full hover:shadow-md transition-shadow">
            <Statistic
              title="Total Revenue"
              value={earnings?.totalAmount ? formatRupees(earnings.totalAmount) : '₹ 0'}
              valueStyle={{ color: '#10b981', fontWeight: 600 }}
              className="text-lg"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="border-0 shadow-sm rounded-lg h-full hover:shadow-md transition-shadow">
            <Statistic
              title="Completed Bookings"
              value={stats?.bookings.collected || 0}
              valueStyle={{ color: '#10b981' }}
              prefix={<CheckCircleOutlined />}
              className="text-lg"
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* User Statistics */}
      <Card title="User Statistics" className="border-0 shadow-sm rounded-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
              <Statistic 
                title="Chefs" 
                value={stats?.users.chefs || 0} 
                prefix={<TeamOutlined className="text-orange-500" />}
                valueStyle={{ color: token.colorPrimary }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
              <Statistic 
                title="Cooks" 
                value={stats?.users.maids || 0} 
                prefix={<TeamOutlined className="text-green-500" />}
                valueStyle={{ color: token.colorPrimary }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
              <Statistic 
                title="Customers" 
                value={stats?.users.users || 0} 
                prefix={<UserOutlined className="text-blue-500" />}
                valueStyle={{ color: token.colorPrimary }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* Booking Statistics */}
      <Card title="Booking Statistics" className="border-0 shadow-sm rounded-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
              <Statistic
                title="Confirmed Bookings"
                value={stats?.bookings.confirmed || 0}
                valueStyle={{ color: '#3b82f6' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
              <Statistic
                title="Cancelled Bookings"
                value={stats?.bookings.cancelled || 0}
                valueStyle={{ color: '#ef4444' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
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
        </Row>
      </Card>

      <Divider />

      {/* Financial Metrics */}
      <Card title="Financial Metrics" className="border-0 shadow-sm rounded-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
              <Statistic
                title="Avg. Revenue per Booking"
                value={stats && earnings && stats.bookings.total > 0 ? formatRupees(earnings.totalAmount / stats.bookings.total) : '₹ 0'}
                valueStyle={{ color: '#10b981', fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Card className="border-0 shadow-none bg-gray-50 rounded-lg">
              <Statistic
                title="Total Potential Revenue (100% completion)"
                value={stats && earnings && stats.bookings.total > 0 ? 
                  formatRupees((earnings.totalAmount / stats.bookings.collected) * stats.bookings.total) : '₹ 0'}
                valueStyle={{ color: '#8b5cf6', fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const Maiddash: React.FC = () => (
  <div className="flex min-h-screen bg-white">
    <Sidebar />
    <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 pt-20 lg:pt-6">
      <StatsDashboard />
    </main>
  </div>
);

export default Maiddash;