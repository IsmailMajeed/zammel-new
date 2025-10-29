"use client";

import React, { useState, useEffect } from "react";
import { FaTags, FaEdit, FaTrash, FaPlus, FaSearch, FaEye, FaBox } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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

export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Electronics",
      slug: "electronics",
      description: "Electronic devices and gadgets",
      productCount: 45,
      status: "active",
      parentId: null,
      image: "/api/placeholder/60/60",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Clothing",
      slug: "clothing",
      description: "Fashion and apparel",
      productCount: 32,
      status: "active",
      parentId: null,
      image: "/api/placeholder/60/60",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-14T14:20:00Z"
    },
    {
      id: 3,
      name: "Accessories",
      slug: "accessories",
      description: "Fashion and tech accessories",
      productCount: 28,
      status: "active",
      parentId: null,
      image: "/api/placeholder/60/60",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-13T16:45:00Z"
    },
    {
      id: 4,
      name: "Home & Garden",
      slug: "home-garden",
      description: "Home improvement and garden supplies",
      productCount: 19,
      status: "active",
      parentId: null,
      image: "/api/placeholder/60/60",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-12T12:10:00Z"
    },
    {
      id: 5,
      name: "Sports",
      slug: "sports",
      description: "Sports equipment and gear",
      productCount: 15,
      status: "active",
      parentId: null,
      image: "/api/placeholder/60/60",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-11T09:25:00Z"
    },
    {
      id: 6,
      name: "Books",
      slug: "books",
      description: "Books and educational materials",
      productCount: 8,
      status: "inactive",
      parentId: null,
      image: "/api/placeholder/60/60",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-10T15:30:00Z"
    },
    {
      id: 7,
      name: "Smartphones",
      slug: "smartphones",
      description: "Mobile phones and accessories",
      productCount: 12,
      status: "active",
      parentId: 1,
      image: "/api/placeholder/60/60",
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 8,
      name: "Laptops",
      slug: "laptops",
      description: "Laptop computers and accessories",
      productCount: 8,
      status: "active",
      parentId: 1,
      image: "/api/placeholder/60/60",
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-14T14:20:00Z"
    }
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase()) ||
      category.slug.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || category.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
      inactive: { bg: "bg-red-100", text: "text-red-800", label: "Inactive" }
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

  const handleDelete = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter(category => category.id !== categoryId));
    }
  };

  const handleToggleStatus = (categoryId) => {
    setCategories(categories.map(category =>
      category.id === categoryId
        ? { ...category, status: category.status === "active" ? "inactive" : "active" }
        : category
    ));
  };

  const getParentCategory = (parentId) => {
    if (!parentId) return null;
    return categories.find(cat => cat.id === parentId);
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
          Product Categories
        </motion.h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            className="bg-primary text-white hover:bg-primaryHover px-4 py-2 flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus />
            Add Category
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
              <p className="text-sm text-cardForeground/60">Total Categories</p>
              <h3 className="text-2xl font-bold mt-1">{categories.length}</h3>
            </div>
            <FaTags className="text-3xl text-primary" />
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
              <p className="text-sm text-cardForeground/60">Active Categories</p>
              <h3 className="text-2xl font-bold mt-1">{categories.filter(c => c.status === 'active').length}</h3>
            </div>
            <FaTags className="text-3xl text-green-500" />
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
              <h3 className="text-2xl font-bold mt-1">{categories.reduce((sum, c) => sum + c.productCount, 0)}</h3>
            </div>
            <FaBox className="text-3xl text-blue-500" />
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
              <p className="text-sm text-cardForeground/60">Main Categories</p>
              <h3 className="text-2xl font-bold mt-1">{categories.filter(c => !c.parentId).length}</h3>
            </div>
            <FaTags className="text-3xl text-purple-500" />
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
            placeholder="Search categories..."
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
        </select>

        <div className="text-sm text-cardForeground/60">
          {filteredCategories.length} categories found
        </div>
      </motion.div>

      {/* Categories Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="border rounded-lg overflow-hidden shadow bg-white"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <AnimatePresence>
            <TableBody>
              {filteredCategories.map((category, index) => (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FaTags className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-cardForeground/60">/{category.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-cardForeground/80 max-w-xs truncate">
                      {category.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    {category.parentId ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {getParentCategory(category.parentId)?.name || 'Unknown'}
                      </span>
                    ) : (
                      <span className="text-sm text-cardForeground/60">Main Category</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-bold text-lg">{category.productCount}</p>
                      <p className="text-xs text-cardForeground/60">products</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(category.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${category.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                    >
                      {category.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(category.createdAt)}
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
                        title="Edit Category"
                        onClick={() => setEditingCategory(category)}
                      >
                        <FaEdit />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Category"
                      >
                        <FaTrash />
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
