"use client";

import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaEye, FaEdit, FaFilter, FaDownload, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mutedForeground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

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

const Table = ({ children, className, ...props }) => {
  return (
    <div className="relative w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className, ...props }) => {
  return (
    <thead className={`[&_tr]:border-b ${className}`} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className, ...props }) => {
  return <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>{children}</tbody>;
};

const TableHead = ({ children, className, ...props }) => {
  return (
    <th className={`h-12 px-4 text-left align-middle font-medium text-mutedForeground [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
      {children}
    </th>
  );
};

const TableRow = ({ children, className, ...props }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: +10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: +10 }}
      transition={{ duration: 0.3 }}
      className={`border-b transition-colors hover:bg-mutedBackground/50 data-[state=selected]:bg-mutedBackground ${className}`} {...props}>
      {children}
    </motion.tr>
  );
};

const TableCell = ({ children, className, ...props }) => {
  return (
    <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
      {children}
    </td>
  );
};

export default function OrdersListPage() {
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customer: {
        name: "Ahmed Khan",
        email: "ahmed@example.com",
        phone: "+92 300 1234567"
      },
      items: [
        { name: "Wireless Headphones", quantity: 1, price: 29999 },
        { name: "Smart Watch", quantity: 2, price: 19999 }
      ],
      total: 69997,
      status: "pending",
      paymentStatus: "pending",
      shippingAddress: "123 Main St, Karachi, Pakistan",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "ORD-002",
      customer: {
        name: "Sara Ali",
        email: "sara@example.com",
        phone: "+92 301 2345678"
      },
      items: [
        { name: "Laptop Stand", quantity: 1, price: 4999 }
      ],
      total: 4999,
      status: "completed",
      paymentStatus: "paid",
      shippingAddress: "456 Park Ave, Lahore, Pakistan",
      createdAt: "2024-01-14T14:20:00Z",
      updatedAt: "2024-01-16T09:15:00Z"
    },
    {
      id: "ORD-003",
      customer: {
        name: "Mohammad Usman",
        email: "usman@example.com",
        phone: "+92 302 3456789"
      },
      items: [
        { name: "Mechanical Keyboard", quantity: 1, price: 14999 },
        { name: "Gaming Mouse", quantity: 1, price: 7999 }
      ],
      total: 22998,
      status: "shipped",
      paymentStatus: "paid",
      shippingAddress: "789 Garden Rd, Islamabad, Pakistan",
      createdAt: "2024-01-13T16:45:00Z",
      updatedAt: "2024-01-15T11:20:00Z"
    },
    {
      id: "ORD-004",
      customer: {
        name: "Fatima Sheikh",
        email: "fatima@example.com",
        phone: "+92 303 4567890"
      },
      items: [
        { name: "Wireless Headphones", quantity: 2, price: 29999 }
      ],
      total: 59998,
      status: "processing",
      paymentStatus: "paid",
      shippingAddress: "321 Oak St, Faisalabad, Pakistan",
      createdAt: "2024-01-12T12:10:00Z",
      updatedAt: "2024-01-14T08:30:00Z"
    },
    {
      id: "ORD-005",
      customer: {
        name: "Ali Hassan",
        email: "ali@example.com",
        phone: "+92 304 5678901"
      },
      items: [
        { name: "Smart Watch", quantity: 1, price: 19999 },
        { name: "Laptop Stand", quantity: 1, price: 4999 },
        { name: "Gaming Mouse", quantity: 1, price: 7999 }
      ],
      total: 32997,
      status: "cancelled",
      paymentStatus: "refunded",
      shippingAddress: "654 Pine St, Rawalpindi, Pakistan",
      createdAt: "2024-01-11T09:25:00Z",
      updatedAt: "2024-01-13T14:45:00Z"
    }
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      processing: { bg: "bg-blue-100", text: "text-blue-800", label: "Processing" },
      shipped: { bg: "bg-purple-100", text: "text-purple-800", label: "Shipped" },
      completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      paid: { bg: "bg-green-100", text: "text-green-800", label: "Paid" },
      failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
      refunded: { bg: "bg-gray-100", text: "text-gray-800", label: "Refunded" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold"
        >
          Orders Management
        </motion.h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex gap-2"
        >
          <Button className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 flex items-center gap-2">
            <FaDownload />
            Export
          </Button>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 flex-wrap"
      >
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-10 w-48 rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="flex h-10 w-48 rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
        >
          <option value="all">All Payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <div className="text-sm text-cardForeground/60">
          {filteredOrders.length} orders found
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="border rounded-lg overflow-hidden shadow bg-white"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <AnimatePresence>
            <TableBody>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="font-mono text-sm font-medium">{order.id}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-cardForeground/60">{order.customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">₨{order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(order.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Details"
                      >
                        <FaEye />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Edit Order"
                      >
                        <FaEdit />
                      </motion.button>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </AnimatePresence>
        </Table>
      </motion.div>

      {isLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </motion.div>
  );
}
