"use client";

import React, { useState, useEffect } from "react";
import { FaChartLine, FaDollarSign, FaShoppingCart, FaUsers, FaBox, FaDownload, FaFilter, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Button = ({ className, children, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-buttonForeground ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function SalesAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for analytics
  const salesData = {
    totalRevenue: 1250000,
    totalOrders: 1250,
    averageOrderValue: 1000,
    conversionRate: 3.2,
    revenueGrowth: 15.5,
    ordersGrowth: 12.3,
    aovGrowth: 8.7,
    conversionGrowth: -2.1
  };

  const monthlyData = [
    { month: "Jan", revenue: 85000, orders: 95, customers: 78 },
    { month: "Feb", revenue: 92000, orders: 108, customers: 89 },
    { month: "Mar", revenue: 110000, orders: 125, customers: 102 },
    { month: "Apr", revenue: 98000, orders: 112, customers: 95 },
    { month: "May", revenue: 135000, orders: 145, customers: 118 },
    { month: "Jun", revenue: 142000, orders: 158, customers: 125 },
    { month: "Jul", revenue: 128000, orders: 142, customers: 115 },
    { month: "Aug", revenue: 155000, orders: 168, customers: 135 },
    { month: "Sep", revenue: 148000, orders: 162, customers: 128 },
    { month: "Oct", revenue: 165000, orders: 175, customers: 142 },
    { month: "Nov", revenue: 172000, orders: 185, customers: 148 },
    { month: "Dec", revenue: 189000, orders: 198, customers: 158 }
  ];

  const topProducts = [
    { name: "Wireless Headphones", sales: 156, revenue: 468000, growth: 12.5 },
    { name: "Smart Watch", sales: 98, revenue: 196000, growth: 8.3 },
    { name: "Laptop Stand", sales: 87, revenue: 43500, growth: 15.2 },
    { name: "Mechanical Keyboard", sales: 76, revenue: 114000, growth: 6.8 },
    { name: "Gaming Mouse", sales: 65, revenue: 52000, growth: 9.1 }
  ];

  const topCities = [
    { city: "Karachi", orders: 425, revenue: 425000, percentage: 34 },
    { city: "Lahore", orders: 312, revenue: 312000, percentage: 25 },
    { city: "Islamabad", orders: 198, revenue: 198000, percentage: 16 },
    { city: "Faisalabad", orders: 156, revenue: 156000, percentage: 12 },
    { city: "Rawalpindi", orders: 98, revenue: 98000, percentage: 8 },
    { city: "Others", orders: 61, revenue: 61000, percentage: 5 }
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Ahmed Khan", amount: 29999, status: "completed", date: "2024-01-15" },
    { id: "ORD-002", customer: "Sara Ali", amount: 19999, status: "shipped", date: "2024-01-14" },
    { id: "ORD-003", customer: "Mohammad Usman", amount: 14999, status: "processing", date: "2024-01-13" },
    { id: "ORD-004", customer: "Fatima Sheikh", amount: 7999, status: "pending", date: "2024-01-12" },
    { id: "ORD-005", customer: "Ali Hassan", amount: 22998, status: "completed", date: "2024-01-11" }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
      shipped: { bg: "bg-blue-100", text: "text-blue-800", label: "Shipped" },
      processing: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Processing" },
      pending: { bg: "bg-orange-100", text: "text-orange-800", label: "Pending" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold"
        >
          Sales Analytics
        </motion.h1>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="flex h-10 w-48 rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 flex items-center gap-2">
            <FaDownload />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cardForeground/60">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(salesData.totalRevenue)}</h3>
              <div className="mt-2 flex items-center">
                <span className="text-green-500 text-sm">↑ {salesData.revenueGrowth}%</span>
                <span className="text-sm text-cardForeground/60 ml-1">vs last period</span>
              </div>
            </div>
            <FaDollarSign className="text-3xl text-primary" />
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
              <h3 className="text-2xl font-bold mt-1">{salesData.totalOrders.toLocaleString()}</h3>
              <div className="mt-2 flex items-center">
                <span className="text-green-500 text-sm">↑ {salesData.ordersGrowth}%</span>
                <span className="text-sm text-cardForeground/60 ml-1">vs last period</span>
              </div>
            </div>
            <FaShoppingCart className="text-3xl text-primary" />
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
              <p className="text-sm text-cardForeground/60">Average Order Value</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(salesData.averageOrderValue)}</h3>
              <div className="mt-2 flex items-center">
                <span className="text-green-500 text-sm">↑ {salesData.aovGrowth}%</span>
                <span className="text-sm text-cardForeground/60 ml-1">vs last period</span>
              </div>
            </div>
            <FaChartLine className="text-3xl text-primary" />
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
              <p className="text-sm text-cardForeground/60">Conversion Rate</p>
              <h3 className="text-2xl font-bold mt-1">{salesData.conversionRate}%</h3>
              <div className="mt-2 flex items-center">
                <span className="text-red-500 text-sm">↓ {Math.abs(salesData.conversionGrowth)}%</span>
                <span className="text-sm text-cardForeground/60 ml-1">vs last period</span>
              </div>
            </div>
            <FaUsers className="text-3xl text-primary" />
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-4">Monthly Revenue Trend</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <FaChartLine className="text-6xl text-primary/20 mx-auto mb-4" />
              <p className="text-cardForeground/60">Chart visualization will be implemented here</p>
              <p className="text-sm text-cardForeground/40 mt-2">
                Peak: {formatCurrency(Math.max(...monthlyData.map(m => m.revenue)))} in {monthlyData.find(m => m.revenue === Math.max(...monthlyData.map(m => m.revenue)))?.month}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-cardForeground/60">{product.sales} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(product.revenue)}</p>
                  <p className={`text-sm ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.growth > 0 ? '↑' : '↓'} {Math.abs(product.growth)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-4">Sales by City</h2>
          <div className="space-y-3">
            {topCities.map((city, index) => (
              <motion.div
                key={city.city}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{city.city}</span>
                  <span className="text-sm text-cardForeground/60">{city.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${city.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-cardForeground/60">
                  <span>{city.orders} orders</span>
                  <span>{formatCurrency(city.revenue)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-cardForeground/60">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(order.amount)}</p>
                  <div className="mt-1">{getStatusBadge(order.status)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}