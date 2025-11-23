'use client'

import React, { useEffect } from "react";
import { FaShoppingCart, FaBox, FaUsers, FaDollarSign, FaChartLine, FaEye, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { useGetDashboardStatsQuery } from "@/redux/api/Dashboard";
import { useRouter } from "next/navigation";
import useRefetchOnWindowFocus from "@/hooks/useRefetchOnWindowFocus";
import AdminNotifications from "@/components/AdminNotifications";

export default function Home() {
  const router = useRouter();
  const { data: dashboardData, isLoading, error, refetch } = useGetDashboardStatsQuery();

  useRefetchOnWindowFocus(refetch);

  useEffect(() => {
    refetch();
  }, []);

  const stats = dashboardData?.data?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: []
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      processing: { bg: "bg-blue-100", text: "text-blue-800", label: "Processing" },
      shipped: { bg: "bg-purple-100", text: "text-purple-800", label: "Shipped" },
      delivered: { bg: "bg-green-100", text: "text-green-800", label: "Delivered" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto text-4xl text-primary mb-4" />
          <p className="text-mutedForeground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500">Failed to load dashboard</p>
          <p className="text-sm text-mutedForeground mt-2">
            {error?.data?.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cardForeground/60">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">{formatPrice(stats.totalRevenue || 0)}</h3>
            </div>
            <FaDollarSign className="text-3xl text-primary" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-cardForeground/60">Paid Orders</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cardForeground/60">Total Orders</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalOrders || 0}</h3>
            </div>
            <FaShoppingCart className="text-3xl text-primary" />
          </div>
          <div className="mt-4">
            <span className="text-orange-500 text-sm">{stats.pendingOrders || 0} Pending</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cardForeground/60">Total Products</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalProducts || 0}</h3>
            </div>
            <FaBox className="text-3xl text-primary" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-cardForeground/60">Active Products</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cardForeground/60">Total Customers</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalCustomers || 0}</h3>
            </div>
            <FaUsers className="text-3xl text-primary" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-cardForeground/60">Registered Users</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-cardBackground p-6 rounded-lg shadow"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link href="/admin/orders/list" className="text-primary hover:text-primaryHover text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-cardForeground/10">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Products</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-cardForeground/10">
                    <td className="py-3 px-4 font-mono text-sm">{order.orderNumber}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-cardForeground/60">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{order.itemsCount} item{order.itemsCount !== 1 ? 's' : ''}</td>
                    <td className="py-3 px-4 font-bold">{formatPrice(order.total || 0)}</td>
                    <td className="py-3 px-4">{getStatusBadge(order.orderStatus)}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => router.push(`/admin/orders/${order._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-cardForeground/60">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Admin Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-cardBackground p-6 rounded-lg shadow"
      >
        <AdminNotifications />
      </motion.div>
    </div>
  );
}
