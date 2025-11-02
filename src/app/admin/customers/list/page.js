"use client";

import React, { useState, useEffect } from "react";
import { FaUsers, FaEye, FaEdit, FaFilter, FaDownload, FaSearch, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useGetCustomersQuery } from "@/redux/api/Customers";
import useDebounce from "@/hooks/useDebounce";
import Pagination from "@/components/Pagination";
import useRefetchOnWindowFocus from "@/hooks/useRefetchOnWindowFocus";
import Swal from "sweetalert2";
import { accessKey } from "@/utils/constants";

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

export default function CustomersListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const limit = 10;

  const debouncedSearch = useDebounce(search, 500);

  // Build query params for API
  const queryParams = {
    page,
    limit,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(cityFilter !== "all" && { city: cityFilter }),
  };

  const {
    data: customersData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetCustomersQuery(queryParams);

  useRefetchOnWindowFocus(refetch);

  const customers = customersData?.data?.customers || [];
  const pagination = customersData?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: limit,
  };
  const stats = customersData?.data?.stats || {
    totalCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    avgOrderValue: 0
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, cityFilter, debouncedSearch]);

  // Get unique cities from customers for filter dropdown
  const getCities = () => {
    const cities = [...new Set(customers.map(customer => customer.city).filter(Boolean))];
    return cities.sort();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
      inactive: { bg: "bg-red-100", text: "text-red-800", label: "Inactive" },
      suspended: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Suspended" }
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStatusToggle = async (customerId) => {
    // TODO: Implement status toggle API call if needed
    // For now, just refetch the data
    refetch();
  };

  const convertToCSV = (customers) => {
    if (!customers || customers.length === 0) {
      return '';
    }

    // CSV Headers
    const headers = [
      'Customer ID',
      'Name',
      'Email',
      'Phone',
      'City',
      'Country',
      'Status',
      'Total Orders',
      'Total Spent (PKR)',
      'Last Order Date',
      'Join Date'
    ];

    // CSV Rows
    const rows = customers.map(customer => {
      return [
        customer.id || 'N/A',
        customer.name || 'N/A',
        customer.email || 'N/A',
        customer.phone || 'N/A',
        customer.city || 'N/A',
        customer.country || 'N/A',
        customer.status || 'N/A',
        customer.totalOrders || 0,
        (customer.totalSpent || 0).toLocaleString('en-PK'),
        customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString('en-PK') : 'No orders',
        customer.joinDate ? new Date(customer.joinDate).toLocaleDateString('en-PK') : 'N/A'
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

  const fetchCustomersForExport = async (startDate, endDate) => {
    try {
      const params = new URLSearchParams({
        limit: '10000', // Large limit to get all customers
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const token = typeof window !== 'undefined' ? localStorage.getItem(accessKey) : null;
      const response = await fetch(`/api/customers?${params.toString()}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const data = await response.json();

      if (data.success && data.data?.customers) {
        return data.data.customers;
      }
      return [];
    } catch (error) {
      console.error('Error fetching customers for export:', error);
      return [];
    }
  };

  const handleExportCustomers = async () => {
    try {
      const { value: formValues } = await Swal.fire({
        title: 'Export Customers',
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
              Leave dates empty to export all customers
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

      const customersToExport = await fetchCustomersForExport(formValues.startDate, formValues.endDate);

      if (customersToExport.length === 0) {
        Swal.fire({
          title: 'No Customers Found',
          text: 'No customers found for the selected date range',
          icon: 'info',
          confirmButtonColor: '#10b981',
        });
        setIsExporting(false);
        return;
      }

      const csvContent = convertToCSV(customersToExport);
      const dateStr = formValues.startDate && formValues.endDate
        ? `${formValues.startDate}_to_${formValues.endDate}`
        : 'all_customers';
      const filename = `customers_export_${dateStr}_${new Date().toISOString().split('T')[0]}.csv`;

      downloadCSV(csvContent, filename);

      Swal.fire({
        title: 'Exported!',
        text: `${customersToExport.length} customer(s) exported successfully`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      setIsExporting(false);
    } catch (error) {
      console.error('Export error:', error);
      Swal.fire({
        title: 'Export Failed',
        text: error?.message || 'Failed to export customers. Please try again.',
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
          Customers Management
        </motion.h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex gap-2"
        >
          <Button
            className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 flex items-center gap-2 disabled:opacity-50"
            onClick={handleExportCustomers}
            disabled={isExporting || isLoading}
          >
            {isExporting ? (
              <>
                <FaSpinner className="animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FaDownload />
                Export
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cardForeground/60">Total Customers</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalCustomers}</h3>
            </div>
            <FaUsers className="text-3xl text-primary" />
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
              <p className="text-sm text-cardForeground/60">Active Customers</p>
              <h3 className="text-2xl font-bold mt-1">{stats.activeCustomers}</h3>
            </div>
            <FaUsers className="text-3xl text-green-500" />
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
              <p className="text-sm text-cardForeground/60">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">₨{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <FaUsers className="text-3xl text-blue-500" />
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
              <p className="text-sm text-cardForeground/60">Avg Order Value</p>
              <h3 className="text-2xl font-bold mt-1">₨{stats.avgOrderValue.toLocaleString()}</h3>
            </div>
            <FaUsers className="text-3xl text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-4 flex-wrap"
      >
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search customers..."
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="flex h-10 w-48 rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
        >
          <option value="all">All Cities</option>
          {getCities().map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <div className="text-sm text-cardForeground/60">
          {pagination.totalItems} customers found
        </div>
      </motion.div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="border rounded-lg overflow-hidden shadow bg-white"
      >
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-2xl text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-red-500">
            <p>Error loading customers. Please try again.</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <p>No customers found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <AnimatePresence>
              <TableBody>
                {customers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaUsers className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-cardForeground/60">Joined {formatDate(customer.joinDate)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <FaEnvelope className="text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <FaPhone className="text-gray-400" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.city && (
                        <div className="flex items-center gap-2 text-sm">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span>{customer.city}{customer.country ? `, ${customer.country}` : ''}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="font-bold text-lg">{customer.totalOrders}</p>
                        <p className="text-xs text-cardForeground/60">orders</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">₨{customer.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {customer.lastOrder ? formatDate(customer.lastOrder) : 'No orders'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleStatusToggle(customer.id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${customer.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                      >
                        {customer.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
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
                          title="Edit Customer"
                        >
                          <FaEdit />
                        </motion.button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </AnimatePresence>
          </Table>
        )}
      </motion.div>

      {/* Pagination */}
      {!isLoading && !error && customers.length > 0 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </motion.div>
  );
}