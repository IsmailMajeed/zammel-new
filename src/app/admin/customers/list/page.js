"use client";

import React, { useState, useEffect } from "react";
import { FaUsers, FaEye, FaEdit, FaFilter, FaDownload, FaSearch, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
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

export default function CustomersListPage() {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      phone: "+92 300 1234567",
      address: "123 Main Street, Block A, DHA Phase 5, Karachi, Pakistan",
      city: "Karachi",
      country: "Pakistan",
      status: "active",
      totalOrders: 12,
      totalSpent: 125000,
      lastOrder: "2024-01-15T10:30:00Z",
      joinDate: "2023-06-15T08:00:00Z",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      name: "Sara Ali",
      email: "sara@example.com",
      phone: "+92 301 2345678",
      address: "456 Park Avenue, Gulberg, Lahore, Pakistan",
      city: "Lahore",
      country: "Pakistan",
      status: "active",
      totalOrders: 8,
      totalSpent: 85000,
      lastOrder: "2024-01-14T14:20:00Z",
      joinDate: "2023-08-22T10:30:00Z",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 3,
      name: "Mohammad Usman",
      email: "usman@example.com",
      phone: "+92 302 3456789",
      address: "789 Garden Road, F-8, Islamabad, Pakistan",
      city: "Islamabad",
      country: "Pakistan",
      status: "active",
      totalOrders: 15,
      totalSpent: 180000,
      lastOrder: "2024-01-13T16:45:00Z",
      joinDate: "2023-05-10T12:15:00Z",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 4,
      name: "Fatima Sheikh",
      email: "fatima@example.com",
      phone: "+92 303 4567890",
      address: "321 Oak Street, Model Town, Faisalabad, Pakistan",
      city: "Faisalabad",
      country: "Pakistan",
      status: "inactive",
      totalOrders: 3,
      totalSpent: 25000,
      lastOrder: "2023-12-20T09:15:00Z",
      joinDate: "2023-11-05T14:20:00Z",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 5,
      name: "Ali Hassan",
      email: "ali@example.com",
      phone: "+92 304 5678901",
      address: "654 Pine Street, Satellite Town, Rawalpindi, Pakistan",
      city: "Rawalpindi",
      country: "Pakistan",
      status: "active",
      totalOrders: 6,
      totalSpent: 75000,
      lastOrder: "2024-01-11T09:25:00Z",
      joinDate: "2023-09-18T16:45:00Z",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 6,
      name: "Ayesha Malik",
      email: "ayesha@example.com",
      phone: "+92 305 6789012",
      address: "987 Elm Avenue, Clifton, Karachi, Pakistan",
      city: "Karachi",
      country: "Pakistan",
      status: "active",
      totalOrders: 20,
      totalSpent: 250000,
      lastOrder: "2024-01-16T11:30:00Z",
      joinDate: "2023-03-12T09:00:00Z",
      avatar: "/api/placeholder/40/40"
    }
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search);

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    const matchesCity = cityFilter === "all" || customer.city === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

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
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCities = () => {
    const cities = [...new Set(customers.map(customer => customer.city))];
    return cities.sort();
  };

  const handleStatusToggle = (customerId) => {
    setCustomers(customers.map(customer =>
      customer.id === customerId
        ? { ...customer, status: customer.status === 'active' ? 'inactive' : 'active' }
        : customer
    ));
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
          <Button className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 flex items-center gap-2">
            <FaDownload />
            Export
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
              <h3 className="text-2xl font-bold mt-1">{customers.length}</h3>
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
              <h3 className="text-2xl font-bold mt-1">{customers.filter(c => c.status === 'active').length}</h3>
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
              <h3 className="text-2xl font-bold mt-1">₨{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}</h3>
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
              <h3 className="text-2xl font-bold mt-1">₨{Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)).toLocaleString()}</h3>
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
          {filteredCustomers.length} customers found
        </div>
      </motion.div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="border rounded-lg overflow-hidden shadow bg-white"
      >
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
              {filteredCustomers.map((customer, index) => (
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
                      <div className="flex items-center gap-2 text-sm">
                        <FaPhone className="text-gray-400" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span>{customer.city}, {customer.country}</span>
                    </div>
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
      </motion.div>

      {isLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </motion.div>
  );
}