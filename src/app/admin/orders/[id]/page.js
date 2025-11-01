"use client";

import React from "react";
import { FaArrowLeft, FaEdit, FaPrint, FaDownload, FaCheck, FaTimes, FaTruck, FaBox, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetOrderByIdQuery, useUpdateOrderMutation } from "@/redux/api/Orders";
import Swal from "sweetalert2";
import Image from "next/image";

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
  const orderId = params?.id;

  const {
    data: orderData,
    isLoading,
    error,
    refetch,
  } = useGetOrderByIdQuery(orderId, { skip: !orderId });

  const [updateOrder, { isLoading: isUpdatingOrder }] = useUpdateOrderMutation();

  const order = orderData?.data?.order || null;

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

  const handleStatusUpdate = async (newStatus) => {
    if (!order) return;

    try {
      const result = await Swal.fire({
        title: "Update Order Status?",
        text: `Are you sure you want to change the order status to "${newStatus}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Updating...",
          text: "Please wait",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await updateOrder({
          id: orderId,
          orderStatus: newStatus,
        }).unwrap();

        Swal.fire({
          title: "Updated!",
          text: "Order status has been updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        refetch();
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to update order status",
        icon: "error",
      });
    }
  };

  const handlePaymentStatusUpdate = async (newPaymentStatus) => {
    if (!order) return;

    try {
      const result = await Swal.fire({
        title: "Update Payment Status?",
        text: `Are you sure you want to change the payment status to "${newPaymentStatus}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Updating...",
          text: "Please wait",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await updateOrder({
          id: orderId,
          paymentStatus: newPaymentStatus,
        }).unwrap();

        Swal.fire({
          title: "Updated!",
          text: "Payment status has been updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        refetch();
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to update payment status",
        icon: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto text-4xl text-primary mb-4" />
          <p className="text-mutedForeground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaTimes className="mx-auto text-4xl text-red-500 mb-4" />
          <p className="text-red-500">Failed to load order details</p>
          <p className="text-sm text-mutedForeground mt-2">
            {error?.data?.message || "Order not found"}
          </p>
          <Link href="/admin/orders/list">
            <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
              Back to Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

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
            <p className="text-sm text-cardForeground/60">
              Order Number: {order.orderNumber || order._id}
            </p>
          </div>
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
              {getStatusBadge(order.orderStatus)}
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
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Update Order Status
                </label>
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={isUpdatingOrder}
                  className="flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Update Payment Status
                </label>
                <select
                  value={order.paymentStatus}
                  onChange={(e) => handlePaymentStatusUpdate(e.target.value)}
                  disabled={isUpdatingOrder}
                  className="flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
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
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => {
                  const itemImage = item.images?.[0] || item.images || null;
                  const itemPrice = item.price || 0;
                  const itemQuantity = item.quantity || 0;
                  const itemTotal = itemPrice * itemQuantity;

                  return (
                    <motion.div
                      key={item._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {itemImage ? (
                          <Image
                            src={itemImage}
                            alt={item.productName || "Product"}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <FaBox className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productName || "Product"}</h3>
                        {item.variant && (
                          <div className="text-sm text-cardForeground/60 mt-1">
                            {item.variant.color && (
                              <span>Color: {item.variant.color}</span>
                            )}
                            {item.variant.size && (
                              <span className="ml-2">Size: {item.variant.size}</span>
                            )}
                          </div>
                        )}
                        {item.variant?.sku && (
                          <p className="text-sm text-cardForeground/60">SKU: {item.variant.sku}</p>
                        )}
                        <p className="text-sm text-cardForeground/60">Quantity: {itemQuantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₨{itemPrice.toLocaleString('en-PK')}</p>
                        <p className="text-sm text-cardForeground/60">each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₨{itemTotal.toLocaleString('en-PK')}</p>
                        <p className="text-sm text-cardForeground/60">total</p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-mutedForeground text-center py-4">No items in this order</p>
              )}
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
                <span className="text-sm text-cardForeground/60">Payment Method:</span>
                <p className="font-medium capitalize">{order.paymentMethod || "N/A"}</p>
              </div>
              {order.shippingAddress && (
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-cardForeground/60">Full Name:</span>
                    <p className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-cardForeground/60">Email:</span>
                    <p className="font-medium">{order.shippingAddress.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-cardForeground/60">Phone:</span>
                    <p className="font-medium">{order.shippingAddress.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-cardForeground/60">Shipping Address:</span>
                    <p className="font-medium mt-1">
                      {order.shippingAddress.address}
                      {order.shippingAddress.city && `, ${order.shippingAddress.city}`}
                      {order.shippingAddress.postalCode && ` - ${order.shippingAddress.postalCode}`}
                    </p>
                  </div>
                </div>
              )}
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
                <p className="font-medium">
                  {order.user?.name || (order.shippingAddress?.firstName && order.shippingAddress?.lastName
                    ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                    : "Guest User")}
                </p>
              </div>
              <div>
                <span className="text-sm text-cardForeground/60">Email:</span>
                <p className="font-medium">
                  {order.user?.email || order.shippingAddress?.email || "No email"}
                </p>
              </div>
              {(order.shippingAddress?.phone || order.user?.phone) && (
                <div>
                  <span className="text-sm text-cardForeground/60">Phone:</span>
                  <p className="font-medium">
                    {order.shippingAddress?.phone || order.user?.phone}
                  </p>
                </div>
              )}
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
                <p className="font-medium capitalize">{order.paymentMethod || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-cardForeground/60">Status:</span>
                <div className="mt-1">{getPaymentStatusBadge(order.paymentStatus)}</div>
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
                <span className="font-medium">₨{(order.subtotal || 0).toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-cardForeground/60">Shipping:</span>
                <span className="font-medium">₨{(order.shipping || 0).toLocaleString('en-PK')}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-cardForeground/60">Tax:</span>
                  <span className="font-medium">₨{(order.tax || 0).toLocaleString('en-PK')}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="text-sm">Discount:</span>
                  <span className="font-medium">-₨{(order.discount || 0).toLocaleString('en-PK')}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">₨{(order.total || 0).toLocaleString('en-PK')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

