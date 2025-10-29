"use client";

import React, { useState, useEffect } from "react";
import { FaBox, FaSave, FaArrowLeft, FaUpload, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mutedForeground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
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

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id;

  const [formData, setFormData] = useState({
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
    price: "29999",
    sku: "WH-001",
    category: "Electronics",
    stock: "45",
    status: "active",
    images: [
      { id: 1, url: "/api/placeholder/200/200", isMain: true },
      { id: 2, url: "/api/placeholder/200/200", isMain: false },
      { id: 3, url: "/api/placeholder/200/200", isMain: false }
    ],
    specifications: {
      brand: "TechSound",
      model: "TS-WH-2024",
      color: "Black",
      weight: "250g",
      battery: "30 hours",
      connectivity: "Bluetooth 5.0"
    },
    seo: {
      title: "Wireless Headphones - Premium Audio Experience",
      description: "Buy the best wireless headphones with noise cancellation. Premium sound quality and comfort.",
      keywords: "wireless headphones, noise cancellation, bluetooth, audio"
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Electronics",
    "Clothing",
    "Accessories",
    "Home & Garden",
    "Sports",
    "Books",
    "Toys",
    "Beauty",
    "Health",
    "Automotive"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };

  const handleSeoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [name]: value
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      isMain: false
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleRemoveImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const handleSetMainImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isMain: img.id === imageId
      }))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Updated product data:", formData);
    setIsLoading(false);

    // Redirect to products list
    window.location.href = "/admin/products/list";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Link href="/admin/products/list">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </motion.button>
        </Link>
        <motion.h1
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold"
        >
          Edit Product
        </motion.h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-cardBackground p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Product Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Description *
                  </label>
                  <TextArea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-cardForeground mb-2">
                      Price (₨) *
                    </label>
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cardForeground mb-2">
                      SKU *
                    </label>
                    <Input
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Product SKU"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-cardForeground mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-borderColor bg-inputBackground px-3 py-2 text-sm text-inputForeground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
                      required
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cardForeground mb-2">
                      Stock Quantity *
                    </label>
                    <Input
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
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
              </div>
            </motion.div>

            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-cardBackground p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-semibold mb-4">Product Images</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-cardForeground/60 mb-4">
                    Upload product images (PNG, JPG, GIF up to 10MB)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primaryHover cursor-pointer"
                  >
                    Add Images
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={`Product ${image.id}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        {image.isMain && (
                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(image.id)}
                              className="bg-white text-gray-900 p-1 rounded hover:bg-gray-100 transition-colors"
                              title="Set as main"
                            >
                              <FaBox className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(image.id)}
                              className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                              title="Remove"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-cardBackground p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-semibold mb-4">Product Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Brand
                  </label>
                  <Input
                    name="brand"
                    value={formData.specifications.brand}
                    onChange={handleSpecificationChange}
                    placeholder="Brand name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Model
                  </label>
                  <Input
                    name="model"
                    value={formData.specifications.model}
                    onChange={handleSpecificationChange}
                    placeholder="Model number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Color
                  </label>
                  <Input
                    name="color"
                    value={formData.specifications.color}
                    onChange={handleSpecificationChange}
                    placeholder="Product color"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Weight
                  </label>
                  <Input
                    name="weight"
                    value={formData.specifications.weight}
                    onChange={handleSpecificationChange}
                    placeholder="Product weight"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Battery Life
                  </label>
                  <Input
                    name="battery"
                    value={formData.specifications.battery}
                    onChange={handleSpecificationChange}
                    placeholder="Battery life"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Connectivity
                  </label>
                  <Input
                    name="connectivity"
                    value={formData.specifications.connectivity}
                    onChange={handleSpecificationChange}
                    placeholder="Connectivity type"
                  />
                </div>
              </div>
            </motion.div>

            {/* SEO Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-cardBackground p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    SEO Title
                  </label>
                  <Input
                    name="title"
                    value={formData.seo.title}
                    onChange={handleSeoChange}
                    placeholder="SEO optimized title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    SEO Description
                  </label>
                  <TextArea
                    name="description"
                    value={formData.seo.description}
                    onChange={handleSeoChange}
                    placeholder="SEO meta description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Keywords
                  </label>
                  <Input
                    name="keywords"
                    value={formData.seo.keywords}
                    onChange={handleSeoChange}
                    placeholder="Comma separated keywords"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-cardBackground p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white hover:bg-primaryHover flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <FaSave />
                  )}
                  {isLoading ? "Updating..." : "Update Product"}
                </Button>
                <Link href="/admin/products/list">
                  <Button
                    type="button"
                    className="w-full bg-gray-500 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Product Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-cardBackground p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <div className="border rounded-lg p-4">
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  {formData.images.length > 0 ? (
                    <img
                      src={formData.images.find(img => img.isMain)?.url || formData.images[0]?.url}
                      alt="Product preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FaBox className="text-4xl text-gray-400" />
                  )}
                </div>
                <h3 className="font-medium text-sm">
                  {formData.name || "Product Name"}
                </h3>
                <p className="text-xs text-cardForeground/60 mt-1">
                  {formData.category || "Category"}
                </p>
                <p className="font-bold text-lg mt-2">
                  ₨{formData.price ? Number(formData.price).toLocaleString() : "0"}
                </p>
                <p className="text-xs text-cardForeground/60 mt-1">
                  Stock: {formData.stock || "0"} units
                </p>
                <p className="text-xs text-cardForeground/60 mt-1">
                  SKU: {formData.sku || "N/A"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
