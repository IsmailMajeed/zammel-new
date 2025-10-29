'use client'

import React from "react";
import { FaShoppingCart, FaBox, FaUsers, FaDollarSign, FaChartLine, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
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
              <h3 className="text-2xl font-bold mt-1">₨24,567</h3>
            </div>
            <FaDollarSign className="text-3xl text-primary" />
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm">↑ 18%</span>
            <span className="text-sm text-cardForeground/60 ml-1">vs last month</span>
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
              <h3 className="text-2xl font-bold mt-1">1,234</h3>
            </div>
            <FaShoppingCart className="text-3xl text-primary" />
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm">↑ 12%</span>
            <span className="text-sm text-cardForeground/60 ml-1">vs last month</span>
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
              <h3 className="text-2xl font-bold mt-1">456</h3>
            </div>
            <FaBox className="text-3xl text-primary" />
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm">↑ 8%</span>
            <span className="text-sm text-cardForeground/60 ml-1">vs last month</span>
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
              <h3 className="text-2xl font-bold mt-1">2,890</h3>
            </div>
            <FaUsers className="text-3xl text-primary" />
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm">↑ 15%</span>
            <span className="text-sm text-cardForeground/60 ml-1">vs last month</span>
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
          <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <FaChartLine className="text-6xl text-primary/20 mx-auto mb-4" />
              <p className="text-cardForeground/60">Chart will be implemented here</p>
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
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FaBox className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Wireless Headphones</p>
                  <p className="text-sm text-cardForeground/60">Electronics</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">₨299</p>
                <p className="text-sm text-green-600">156 sold</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FaBox className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Smart Watch</p>
                  <p className="text-sm text-cardForeground/60">Electronics</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">₨199</p>
                <p className="text-sm text-green-600">98 sold</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FaBox className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Laptop Stand</p>
                  <p className="text-sm text-cardForeground/60">Accessories</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">₨49</p>
                <p className="text-sm text-green-600">87 sold</p>
              </div>
            </div>
          </div>
        </motion.div>
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
          <Link href="/admin/orders" className="text-primary hover:text-primaryHover text-sm font-medium">
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
              <tr className="border-b border-cardForeground/10">
                <td className="py-3 px-4 font-mono text-sm">#ORD-001</td>
                <td className="py-3 px-4">Ahmed Khan</td>
                <td className="py-3 px-4">3 items</td>
                <td className="py-3 px-4">₨299.00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending</span></td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEye />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-cardForeground/10">
                <td className="py-3 px-4 font-mono text-sm">#ORD-002</td>
                <td className="py-3 px-4">Sara Ali</td>
                <td className="py-3 px-4">1 item</td>
                <td className="py-3 px-4">₨199.00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Completed</span></td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEye />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-cardForeground/10">
                <td className="py-3 px-4 font-mono text-sm">#ORD-003</td>
                <td className="py-3 px-4">Mohammad Usman</td>
                <td className="py-3 px-4">2 items</td>
                <td className="py-3 px-4">₨148.00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Shipped</span></td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEye />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
