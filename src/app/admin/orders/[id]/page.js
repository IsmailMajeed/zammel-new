"use client";

import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaEdit, FaPrint, FaDownload, FaCheck, FaTimes, FaTruck, FaBox } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState({
    id: orderId,
    customer: {
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      phone: "+92 300 1234567",
      address: "123 Main Street, Block A, DHA Phase 5, Karachi, Pakistan"
    },
    items: [
      {
        id: 1,
        name: "Wireless Headphones",
        sku: "WH-001",
        price: 29999,
        quantity: 1,
        image: "/api/placeholder/80/80",
        total: 29999
      },
      {
        id: 2,
        name: "Smart Watch",
        sku: "SW-002",
        price: 19999,
        quantity: 2,
        image: "/api/placeholder/80/80",
        total: 39998
      }
    ],
    shipping: {
      method: "Standard Delivery",
      cost: 500,
      trackingNumber: "TRK123456789",
      estimatedDelivery: "2024-01-20"
    },
    payment: {
      method: "Credit Card",
      status: "paid",
      transactionId: "TXN123456789",
      paidAt: "2024-01-15T10:35:00Z"
    },
    totals: {
      subtotal: 69997,
      shipping: 500,
      tax: 3500,
      total: 73997
    },
    status: "processing",
    notes: "Customer requested express delivery",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z"
  });

  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending", icon: FaTimes },
      processing: { bg: "bg-blue-100", text: "text-blue-800", label: "Processing", icon: FaBox },
      shipped: { bg: "bg-purple-100", text: "text-purple-800", label: "Shipped", icon: FaTruck },
      completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed", icon: FaCheck },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled", icon: FaTimes }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = (newStatus) => {
    setOrder(prev => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date().toISOString()
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders/list">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </motion.button>
          </Link>
          <div>
            <motion.h1
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-2xl font-bold"
            >
              Order Details
            </motion.h1>
            <p className="text-sm text-cardForeground/60">Order ID: {order.id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 flex items-center gap-2">
            <FaPrint />
            Print
          </Button>
          <Button className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 flex items-center gap-2">
            <FaDownload />
            Export
          </Button>
          <Button className="bg-primary text-white hover:bg-primaryHover px-4 py-2 flex items-center gap-2">
            <FaEdit />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-cardBackground p-6 rounded-lg shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Order Status</h2>
              {getStatusBadge(order.status)}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-cardForeground/60">Order Date:</span>
                <span className="text-sm font-medium">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-cardForeground/60">Last Updated:</span>
                <span className="text-sm font-medium">{formatDate(order.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-cardForeground/60">Payment Status:</span>
                {getPaymentStatusBadge(order.payment.status)}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-cardForeground mb-2">
                Update Status
              </label>
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-cardBackground p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaBox className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-cardForeground/60">SKU: {item.sku}</p>
                    <p className="text-sm text-cardForeground/60">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₨{item.price.toLocaleString()}</p>
                    <p className="text-sm text-cardForeground/60">each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₨{item.total.toLocaleString()}</p>
                    <p className="text-sm text-cardForeground/60">total</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-cardBackground p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-cardForeground/60">Method:</span>
                <p className="font-medium">{order.shipping.method}</p>
              </div>
              <div>
                <span className="text-sm text-cardForeground/60">Tracking Number:</span>
                <p className="font-mono text-sm">{order.shipping.trackingNumber}</p>
              </div>
              <div>
                <span className="text-sm text-cardForeground/60">Estimated Delivery:</span>
                <p className="font-medium">{order.shipping.estimatedDelivery}</p>
              </div>
              <div>
                <span className="text-sm text-cardForeground/60">Shipping Address:</span>
                <p className="font-medium">{order.customer.address}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-cardBackground p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-cardForeground/60">Name:</span>
                <p className="font-medium">{order.customer.name}</p>
              </div>
              <div>
                <span className="text-sm text-cardForeground/60">Email:</span>
                <p className="font-medium">{order.customer.email}</p>
              </div>
              <div>
                <span className="text-sm text-cardForeground/60">Phone:</span>
                <p className="font-medium">{order.customer.phone}</p>
              </div>
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-cardBackground p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-cardForeground/60">Method:</span>
                <p className="font-medium">{order.payment.method}</p>
              </div>
              <div>
                <span className="text-sm text-cardForeground/60">Status:</span>
                <div className="mt-1">{getPaymentStatusBadge(order.payment.status)}</div>
              </div>
              <div>
                <span className="text-sm text-cardForeground/60">Transaction ID:</span>
                <p className="font-mono text-sm">{order.payment.transactionId}</p>
              </div>
              <div>
                <span className="text-sm text-cardForeground/60">Paid At:</span>
                <p className="font-medium">{formatDate(order.payment.paidAt)}</p>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-cardBackground p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-cardForeground/60">Subtotal:</span>
                <span className="font-medium">₨{order.totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-cardForeground/60">Shipping:</span>
                <span className="font-medium">₨{order.totals.shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-cardForeground/60">Tax:</span>
                <span className="font-medium">₨{order.totals.tax.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">₨{order.totals.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Notes */}
          {order.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-cardBackground p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-semibold mb-4">Order Notes</h2>
              <p className="text-sm text-cardForeground/80">{order.notes}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
