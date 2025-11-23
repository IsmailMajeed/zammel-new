"use client";

import React, { useState, useEffect } from "react";
import { FaEye, FaDownload, FaSearch, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useGetOrdersQuery } from "@/redux/api/Orders";
import useDebounce from "@/hooks/useDebounce";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import useRefetchOnWindowFocus from "@/hooks/useRefetchOnWindowFocus";

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
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(search, 500);

  // Build query params for API
  const queryParams = {
    page,
    limit,
    ...(statusFilter !== "all" && { orderStatus: statusFilter }),
    ...(paymentFilter !== "all" && { paymentStatus: paymentFilter }),
  };

  const {
    data: ordersData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetOrdersQuery(queryParams);

  useRefetchOnWindowFocus(refetch);

  const [isExporting, setIsExporting] = useState(false);

  const orders = ordersData?.data?.orders || [];
  const pagination = ordersData?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: limit,
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, paymentFilter, debouncedSearch]);

  // Filter orders by search (client-side for orderNumber and customer info)
  const filteredOrders = orders.filter((order) => {
    if (!debouncedSearch) return true;

    const searchLower = debouncedSearch.toLowerCase();
    const orderNumber = order.orderNumber?.toLowerCase() || "";
    const customerName = order.user?.name?.toLowerCase() || "";
    const customerEmail = order.user?.email?.toLowerCase() || "";

    return (
      orderNumber.includes(searchLower) ||
      customerName.includes(searchLower) ||
      customerEmail.includes(searchLower)
    );
  });

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const convertToCSV = (orders) => {
    if (!orders || orders.length === 0) {
      return '';
    }

    // CSV Headers
    const headers = [
      'Order Number',
      'Order Date',
      'Customer Name',
      'Customer Email',
      'Order Status',
      'Payment Status',
      'Payment Method',
      'Items Count',
      'Subtotal (PKR)',
      'Shipping (PKR)',
      'Tax (PKR)',
      'Discount (PKR)',
      'Total (PKR)',
      'Shipping Full Name',
      'Shipping Email',
      'Shipping Phone',
      'Shipping Address',
      'City',
      'Postal Code'
    ];

    // CSV Rows
    const rows = orders.map(order => {
      const shippingAddress = order.shippingAddress || {};
      const items = order.items || [];
      const itemsList = items.map(item =>
        `${item.productName || 'N/A'} (${item.quantity || 0}x)`
      ).join('; ');

      const fullName = shippingAddress.firstName && shippingAddress.lastName
        ? `${shippingAddress.firstName} ${shippingAddress.lastName}`
        : (shippingAddress.firstName || shippingAddress.lastName || 'N/A');

      return [
        order.orderNumber || order._id || 'N/A',
        order.createdAt ? new Date(order.createdAt).toLocaleString('en-PK') : 'N/A',
        order.user?.name || 'Guest User',
        order.user?.email || 'No email',
        order.orderStatus || 'N/A',
        order.paymentStatus || 'N/A',
        order.paymentMethod || 'N/A',
        items.length,
        (order.subtotal || 0).toLocaleString('en-PK'),
        (order.shipping || 0).toLocaleString('en-PK'),
        (order.tax || 0).toLocaleString('en-PK'),
        (order.discount || 0).toLocaleString('en-PK'),
        (order.total || 0).toLocaleString('en-PK'),
        fullName,
        shippingAddress.email || 'N/A',
        shippingAddress.phone || 'N/A',
        shippingAddress.address || 'N/A',
        shippingAddress.city || 'N/A',
        shippingAddress.postalCode || 'N/A'
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        // Escape commas and quotes in cell values
        const cellValue = String(cell).replace(/"/g, '""');
        return `"${cellValue}"`;
      }).join(','))
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const fetchOrdersForExport = async (startDate, endDate) => {
    try {
      const params = new URLSearchParams({
        limit: '10000', // Large limit to get all orders
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json();

      if (data.success && data.data?.orders) {
        return data.data.orders;
      }
      return [];
    } catch (error) {
      console.error('Error fetching orders for export:', error);
      return [];
    }
  };

  const handleExportOrders = async () => {
    try {
      const { value: formValues } = await Swal.fire({
        title: 'Export Orders',
        html: `
          <div style="text-align: left; padding: 10px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Start Date:</label>
            <input 
              id="swal-start-date" 
              type="date" 
              class="swal2-input" 
              placeholder="Select start date"
            />
            <label style="display: block; margin: 15px 0 5px 0; font-weight: bold;">End Date:</label>
            <input 
              id="swal-end-date" 
              type="date" 
              class="swal2-input" 
              placeholder="Select end date"
            />
            <p style="margin-top: 15px; font-size: 12px; color: #666;">
              Leave dates empty to export all orders
            </p>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Export CSV',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        preConfirm: () => {
          const startDate = document.getElementById('swal-start-date').value;
          const endDate = document.getElementById('swal-end-date').value;

          if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            Swal.showValidationMessage('Start date must be before end date');
            return false;
          }

          return {
            startDate: startDate || null,
            endDate: endDate || null
          };
        }
      });

      if (!formValues) {
        return; // User cancelled
      }

      setIsExporting(true);

      Swal.fire({
        title: 'Exporting...',
        text: 'Please wait while we prepare your export file',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const orders = await fetchOrdersForExport(formValues.startDate, formValues.endDate);

      if (orders.length === 0) {
        Swal.fire({
          title: 'No Orders Found',
          text: 'No orders found for the selected date range',
          icon: 'info',
          confirmButtonColor: '#10b981',
        });
        setIsExporting(false);
        return;
      }

      const csvContent = convertToCSV(orders);
      const dateStr = formValues.startDate && formValues.endDate
        ? `${formValues.startDate}_to_${formValues.endDate}`
        : 'all_orders';
      const filename = `orders_export_${dateStr}_${new Date().toISOString().split('T')[0]}.csv`;

      downloadCSV(csvContent, filename);

      Swal.fire({
        title: 'Exported!',
        text: `${orders.length} order(s) exported successfully`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      setIsExporting(false);
    } catch (error) {
      console.error('Export error:', error);
      Swal.fire({
        title: 'Export Failed',
        text: error?.message || 'Failed to export orders. Please try again.',
        icon: 'error',
        confirmButtonColor: '#10b981',
      });
      setIsExporting(false);
    }
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
          <Button
            onClick={handleExportOrders}
            disabled={isLoading || isExporting}
            className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <FaSpinner className="animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FaDownload />
                Export Orders
              </>
            )}
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
          <option value="delivered">Delivered</option>
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
          {pagination.totalItems} orders found
          {isFetching && (
            <FaSpinner className="inline-block ml-2 animate-spin" />
          )}
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
              <TableHead>Order Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <AnimatePresence>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <FaSpinner className="animate-spin mx-auto text-2xl text-primary" />
                    <p className="mt-2 text-sm text-mutedForeground">Loading orders...</p>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-mutedForeground">No orders found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order._id || order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="font-mono text-sm font-medium">
                        {order.orderNumber || order._id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {order.user?.name || "Guest User"}
                        </p>
                        <p className="text-sm text-cardForeground/60">
                          {order.user?.email || "No email"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">
                      ₨{(order.total || 0).toLocaleString('en-PK')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.orderStatus)}
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
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push(`/admin/orders/${order._id}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <FaEye />
                        <span>View Details</span>
                      </motion.button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </AnimatePresence>
        </Table>
      </motion.div>

      {/* Pagination */}
      {!isLoading && filteredOrders.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </motion.div>
  );
}
