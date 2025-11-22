"use client";

import React, { useState } from "react";
import { FaSave, FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateProductMutation } from "@/redux/api/Products";
import { useGetCategoriesQuery } from "@/redux/api/Categories";
import { useSupabaseUpload } from "@/hooks/useSupabaseUpload";

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

export default function AddProductPage() {
  const router = useRouter();
  const { upload, deleteImage, loading: isUploading } = useSupabaseUpload();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    status: "active",
    featured: false,
    tags: "",
  });

  const [variants, setVariants] = useState([
    {
      color: "",
      colorCode: "",
      size: "",
      price: "",
      quantity: "",
      sku: "",
      images: [],
      discount: 0,
      discountedPrice: "",
    },
  ]);

  const { data: categoriesData } = useGetCategoriesQuery({ status: "active", limit: 1000 });
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const categories = categoriesData?.data?.categories || categoriesData?.data || [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;

    // Auto-calculate discounted price when discount changes
    if (field === "discount") {
      const discountValue = parseFloat(value) || 0;
      const priceValue = parseFloat(newVariants[index].price) || 0;
      if (priceValue > 0) {
        const calculatedDiscountedPrice = priceValue * (1 - discountValue / 100);
        newVariants[index].discountedPrice = Math.round(calculatedDiscountedPrice).toString();
      }
    }

    // Auto-calculate discount when discounted price changes
    if (field === "discountedPrice") {
      const discountedPriceValue = parseFloat(value) || 0;
      const priceValue = parseFloat(newVariants[index].price) || 0;
      if (priceValue > 0 && discountedPriceValue >= 0) {
        const calculatedDiscount = ((priceValue - discountedPriceValue) / priceValue) * 100;
        newVariants[index].discount = Math.max(0, Math.min(100, calculatedDiscount)).toFixed(2);
      }
    }

    // Auto-calculate discounted price when price changes (if discount exists)
    if (field === "price") {
      const priceValue = parseFloat(value) || 0;
      const discountValue = parseFloat(newVariants[index].discount) || 0;
      if (priceValue > 0 && discountValue > 0) {
        const calculatedDiscountedPrice = priceValue * (1 - discountValue / 100);
        newVariants[index].discountedPrice = Math.round(calculatedDiscountedPrice).toString();
      } else if (priceValue > 0) {
        newVariants[index].discountedPrice = Math.round(priceValue).toString();
      }
    }

    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        colorCode: "",
        size: "",
        price: "",
        quantity: "",
        sku: "",
        images: [],
        discount: 0,
        discountedPrice: "",
      },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = async (index, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      // Upload images to Supabase
      const uploadedUrls = await upload(files);
      if (uploadedUrls.length > 0) {
        handleVariantChange(index, "images", [...variants[index].images, ...uploadedUrls]);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleRemoveVariantImage = async (variantIndex, imageIndex, imageUrl) => {
    // Remove from local state
    const newImages = variants[variantIndex].images.filter((_, i) => i !== imageIndex);
    handleVariantChange(variantIndex, "images", newImages);

    // Delete from Supabase if it's a Supabase URL
    if (imageUrl && imageUrl.includes('supabase')) {
      await deleteImage(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate variants
    for (const variant of variants) {
      if (!variant.color || !variant.size || !variant.price || !variant.quantity || !variant.sku) {
        return;
      }
    }

    try {
      // Parse tags from comma-separated string
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        featured: formData.featured,
        tags: tagsArray,
        variants: variants.map((v) => ({
          color: v.color,
          colorCode: v.colorCode || undefined,
          size: v.size,
          price: parseFloat(v.price),
          quantity: parseInt(v.quantity),
          sku: v.sku,
          images: v.images || [],
          discount: parseFloat(v.discount) || 0,
        })),
      };

      await createProduct(productData).unwrap();
      router.push("/admin/products/list");
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
          Add New Product
        </motion.h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <h2 className="text-lg font-semibold mb-4">Product Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            </div>

            <div>
              <label className="block text-sm font-medium text-cardForeground mb-2">
                Tags
              </label>
              <Input
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas (e.g., new, sale, popular)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <option value="">Select category</option>
                  {categories?.length > 0 && categories?.map((category) => (
                    <option key={category?._id} value={category?._id}>
                      {category?.name}
                    </option>
                  ))}
                  {categories?.length === 0 && (
                    <option value="">No categories found</option>
                  )}
                </select>
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

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4"
                />
                <label className="text-sm font-medium text-cardForeground">
                  Featured Product
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Variants Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cardBackground p-6 rounded-lg shadow"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Product Variants</h2>
            <Button
              type="button"
              onClick={addVariant}
              className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 flex items-center gap-2"
            >
              <FaPlus /> Add Variant
            </Button>
          </div>

          {variants.map((variant, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 relative">
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              )}

              <h3 className="font-medium mb-3">Variant {index + 1}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Color *
                  </label>
                  <Input
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                    placeholder="e.g. Red, Blue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Color Code (Hex)
                  </label>
                  <Input
                    type="color"
                    value={variant.colorCode}
                    onChange={(e) => handleVariantChange(index, "colorCode", e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Size *
                  </label>
                  <Input
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                    placeholder="e.g. S, M, L, XL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Price *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Quantity *
                  </label>
                  <Input
                    type="number"
                    value={variant.quantity}
                    onChange={(e) => handleVariantChange(index, "quantity", e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    SKU *
                  </label>
                  <Input
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                    placeholder="Product SKU"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Discount (%)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={variant.discount}
                    onChange={(e) => handleVariantChange(index, "discount", e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cardForeground mb-2">
                    Price After Discount
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={variant.discountedPrice}
                    onChange={(e) => handleVariantChange(index, "discountedPrice", e.target.value)}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-calculated from discount
                  </p>
                </div>
              </div>

              {/* Images for this variant */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-cardForeground mb-2">
                  Images for {variant.color || "this variant"}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    className="hidden"
                    id={`image-upload-${index}`}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor={`image-upload-${index}`}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primaryHover cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isUploading ? 'Uploading...' : 'Choose Images'}
                  </label>

                  {variant.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {variant.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img
                            src={image}
                            alt={`Variant ${index + 1} Image ${imgIndex + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantImage(index, imgIndex, image)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Submit Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white hover:bg-primaryHover px-6 py-3 flex items-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              <FaSave />
            )}
            {isLoading ? "Saving..." : "Save Product"}
          </Button>
          <Link href="/admin/products/list">
            <Button
              type="button"
              className="bg-gray-500 text-white hover:bg-gray-600 px-6 py-3"
            >
              Cancel
            </Button>
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
}
