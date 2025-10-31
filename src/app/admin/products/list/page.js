"use client";

import React, { useState, useEffect } from "react";
import { GoLink } from "react-icons/go";
import { FaBox, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useGetProductsQuery, useDeleteProductMutation, useUpdateProductMutation } from "@/redux/api/Products";
import Swal from "sweetalert2";
import { useSupabaseUpload } from "@/hooks/useSupabaseUpload";
import Pagination from "@/components/Pagination";
import useDebounce from "@/hooks/useDebounce";

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

export default function ProductsListPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  // RTK Query hooks
  const { data, isLoading, isError, error, refetch } = useGetProductsQuery({
    status: filter === "all" ? undefined : filter,
    search: debouncedSearch || undefined,
    page,
    limit: 10,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Supabase upload hook for deleting images
  const { deleteImage } = useSupabaseUpload();

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination || {};

  // Reset to page 1 when debounced search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filter]);

  // Helper function to get first available image from product variants
  const getFirstProductImage = (product) => {
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        if (variant.images && variant.images.length > 0) {
          return variant.images[0];
        }
      }
    }
    return null;
  };

  const handleDelete = async (product) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${product.name}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        // Show loading
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait while we delete the product',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Delete all variant images from Supabase first
        if (product.variants && product.variants.length > 0) {
          for (const variant of product.variants) {
            if (variant.images && variant.images.length > 0) {
              for (const imageUrl of variant.images) {
                if (imageUrl && imageUrl.includes('supabase')) {
                  await deleteImage(imageUrl);
                }
              }
            }
          }
        }

        // Delete product
        await deleteProduct(product._id).unwrap();

        refetch();

        // Show success message
        Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        // Show error message
        Swal.fire({
          title: 'Error!',
          text: err?.data?.message || 'Failed to delete product. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === "active" ? "inactive" : "active";
      await updateProduct({ id: product._id, status: newStatus }).unwrap();
      refetch();
    } catch (err) {
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
          Products
        </motion.h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/admin/products/add">
            <Button className="bg-primary text-white hover:bg-primaryHover px-4 py-2 flex items-center gap-2">
              <FaPlus />
              Add Product
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 flex-wrap"
      >
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex h-10 w-48 rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
        >
          <option value="all">All Products</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="text-sm text-cardForeground/60">
          {pagination.totalItems || 0} products found
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="border rounded-lg overflow-hidden shadow bg-white"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <AnimatePresence>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-red-500">
                    {error?.data?.message || "Failed to load products"}
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      {getFirstProductImage(product) ? (
                        <img
                          src={getFirstProductImage(product)}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center ${getFirstProductImage(product) ? 'hidden' : 'flex'}`}
                      >
                        <FaBox className="text-gray-400" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-cardForeground/60">
                          Added {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.variants?.[0]?.sku || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {product.category?.name || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold">
                      ₨{product.priceRange?.min?.toLocaleString() || 0}
                      {product.priceRange?.min !== product.priceRange?.max && (
                        <> - ₨{product.priceRange?.max?.toLocaleString()}</>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${product.totalStock > 10
                        ? 'bg-green-100 text-green-800'
                        : product.totalStock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {product.totalStock || 0} units
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleStatus(product)}
                        disabled={isUpdating}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${product.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } disabled:opacity-50`}
                      >
                        {product.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <FaEye />
                        </motion.button>
                        <Link href={`/admin/products/edit/${product._id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <FaEdit />
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(product)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                          title="Delete Product"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </TableCell>
                  </motion.tr>
                )))}
            </TableBody>
          </AnimatePresence>
        </Table>
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage || 1}
          totalPages={pagination.totalPages || 1}
          totalItems={pagination.totalItems || 0}
          itemsPerPage={pagination.itemsPerPage || 10}
          onPageChange={setPage}
          showJumpTo={true}
        />
      )}
    </motion.div>
  );
}
