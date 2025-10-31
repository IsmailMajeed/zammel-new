"use client";

import React, { useState, useEffect } from "react";
import { FaTags, FaEdit, FaTrash, FaPlus, FaSearch, FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCategoriesQuery, useDeleteCategoryMutation, useUpdateCategoryMutation, useCreateCategoryMutation } from "@/redux/api/Categories";
import { FaTimes } from "react-icons/fa";
import { useSupabaseUpload } from "@/hooks/useSupabaseUpload";
import Swal from "sweetalert2";
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
      className={`py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-buttonForeground ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const TextArea = ({ className, ...props }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background placeholder:text-mutedForeground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  // RTK Query hooks
  const { data, isLoading, isError, error, refetch } = useGetCategoriesQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    search: debouncedSearch || undefined,
    page,
    limit: 10,
  });

  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  // Supabase upload hook
  const { upload, deleteImage, loading: isUploading } = useSupabaseUpload();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    parent: "",
    status: "active",
    order: 0,
  });

  const categories = data?.data?.categories || [];
  const pagination = data?.data?.pagination || {};

  // Reset to page 1 when debounced search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async (category) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${category.name}"? This action cannot be undone!`,
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
          text: 'Please wait while we delete the category',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Delete category first
        await deleteCategory(category._id).unwrap();

        // Delete image from Supabase if it exists (only after successful category deletion)
        if (category.image) {
          await deleteImage(category.image);
        }

        refetch();

        // Show success message
        Swal.fire({
          title: 'Deleted!',
          text: 'Category has been deleted successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        // Show error message
        Swal.fire({
          title: 'Error!',
          text: err?.data?.message || 'Failed to delete category. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      const newStatus = category.status === "active" ? "inactive" : "active";
      await updateCategory({ id: category._id, status: newStatus }).unwrap();
      refetch();
    } catch (err) {
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      parent: "",
      status: "active",
      order: 0,
    });
    setImagePreview(null);
    setSelectedImage(null);
  };

  const openAddModal = () => {
    resetForm();
    setEditingCategory(null);
    setShowAddModal(true);
  };

  const openEditModal = (category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      parent: category.parent?._id || "",
      status: category.status,
      order: category.order || 0,
    });
    setImagePreview(category.image || null);
    setSelectedImage(null);
    setEditingCategory(category);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For number inputs, ensure we store as number
      const finalValue = name === "order" && value !== "" ? parseInt(value, 10) || 0 : value;

      setFormData((prev) => ({
        ...prev,
        [name]: finalValue,
      }));
    }
  };

  const handleRemoveImage = () => {
    // If editing and has existing image, we'll keep it but clear the new selection
    if (editingCategory && formData.image) {
      // User wants to remove existing image
      setFormData((prev) => ({
        ...prev,
        image: "",
      }));
    }
    setImagePreview(null);
    setSelectedImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.image;

      // Upload new image if selected
      if (selectedImage) {
        const uploadedUrls = await upload(selectedImage);
        if (uploadedUrls.length > 0) {
          imageUrl = uploadedUrls[0];

          // Delete old image if editing and had a previous image
          if (editingCategory && editingCategory.image && editingCategory.image !== imageUrl) {
            await deleteImage(editingCategory.image);
          }
        } else {
          return;
        }
      } else if (editingCategory && !formData.image && editingCategory.image) {
        // Image was removed - delete from Supabase
        await deleteImage(editingCategory.image);
      }

      const submitData = {
        name: formData.name,
        description: formData.description || undefined,
        image: imageUrl || undefined,
        status: formData.status,
        parent: formData.parent || null,
        order: typeof formData.order === 'number' ? formData.order : (formData.order ? parseInt(formData.order, 10) || 0 : 0),
      };

      if (editingCategory) {
        // Update existing category
        await updateCategory({
          id: editingCategory._id,
          ...submitData,
        }).unwrap();
      } else {
        // Create new category
        await createCategory(submitData).unwrap();
      }
      closeModal();
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
          Product Categories
        </motion.h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            className="bg-primary text-white hover:bg-primaryHover px-4 py-2 flex items-center gap-2"
            onClick={openAddModal}
          >
            <FaPlus />
            Add Category
          </Button>
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
          {pagination.totalItems || 0} categories found
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-red-500">
                    {error?.data?.message || "Failed to load categories"}
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category, index) => (
                  <motion.tr
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FaTags className="text-gray-400" />
                          </div>
                        )}
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
                      {category.parent ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {category.parent?.name || 'Unknown'}
                        </span>
                      ) : (
                        <span className="text-sm text-cardForeground/60">Main Category</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="font-bold text-lg">{category.productsCount || 0}</p>
                        <p className="text-xs text-cardForeground/60">products</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleStatus(category)}
                        disabled={isUpdating}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${category.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } disabled:opacity-50`}
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
                          onClick={() => openEditModal(category)}
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(category)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                          title="Delete Category"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
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

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed -top-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <TextArea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image
                  </label>
                  {imagePreview ? (
                    <div className="relative mb-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : null}
                  <Input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="cursor-pointer"
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Upload an image for this category (optional)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Category
                  </label>
                  <select
                    name="parent"
                    value={formData.parent}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
                  >
                    <option value="">No Parent (Main Category)</option>
                    {categories
                      .filter(cat => !editingCategory || cat._id !== editingCategory._id) // Don't allow self as parent
                      .filter(cat => !cat.parent) // Only show main categories as parent options
                      .map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <Input
                      name="order"
                      type="number"
                      value={formData.order}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="flex-1 bg-primary text-white hover:bg-primaryHover"
                  >
                    {isCreating || isUpdating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      editingCategory ? "Update Category" : "Create Category"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
