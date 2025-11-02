'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/Cart';
import { addToWishlist, removeFromWishlist } from '@/redux/slices/Wishlist';
import { toast } from 'sonner';
import { BRAND } from '@/utils/brandConstants';
import { getVariantByColorAndSize } from '@/utils/productTransformers';

export default function ProductCard({ product }) {
  const {
    id,
    title,
    price,
    compareAtPrice,
    discountPercentage,
    image,
    images,
    sizes = ['M', 'L', 'XL'],
    colors = [],
    badge = 'sale',
    _fullData
  } = product;

  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const { items: cartItems } = useSelector(state => state.cart);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Initialize color and size
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
  }, [colors, selectedColor]);

  // Get available sizes for selected color
  const availableSizesForColor = useMemo(() => {
    if (!_fullData || !selectedColor) return sizes;
    const colorVariants = _fullData.variants?.filter(v =>
      v.color?.toLowerCase() === selectedColor?.toLowerCase()
    ) || [];
    const availableSizes = [...new Set(colorVariants.map(v => v.size).filter(Boolean))];
    return availableSizes.length > 0 ? availableSizes : sizes;
  }, [_fullData, selectedColor, sizes]);

  // Initialize size when color is selected and auto-adjust when color changes
  useEffect(() => {
    if (selectedColor && _fullData) {
      if (!selectedSize || !availableSizesForColor.includes(selectedSize)) {
        if (availableSizesForColor.length > 0) {
          setSelectedSize(availableSizesForColor[0]);
        }
      }
    }
  }, [selectedColor, availableSizesForColor, _fullData, selectedSize]);

  const isInWishlist = wishlistItems.some(item => item.id === id);

  // Get current variant for stock check and images
  const currentVariant = useMemo(() => {
    if (!_fullData) return null;
    return getVariantByColorAndSize(_fullData, selectedColor, selectedSize);
  }, [_fullData, selectedColor, selectedSize]);

  // Get current variant's first image
  const currentImage = useMemo(() => {
    if (currentVariant?.images?.length > 0) {
      return currentVariant.images[0];
    }
    return image;
  }, [currentVariant, image]);

  // Get next variant's image for hover
  const hoverImage = useMemo(() => {
    if (!_fullData?.variants || _fullData.variants.length === 0) {
      // Fallback to current variant's second image or same image
      const currentImages = currentVariant?.images || images || [];
      return currentImages[1] || currentImages[0] || currentImage;
    }

    // Find current variant index in the variants array
    const currentIndex = _fullData.variants.findIndex(v =>
      v.color?.toLowerCase() === currentVariant?.color?.toLowerCase() &&
      v.size === currentVariant?.size
    );

    // Get next variant (circular - if last, go to first)
    const nextIndex = currentIndex >= 0
      ? (currentIndex + 1) % _fullData.variants.length
      : 0;

    const nextVariant = _fullData.variants[nextIndex];
    const nextVariantImages = nextVariant?.images || [];

    // Return next variant's first image, or fallback to current variant's second image
    if (nextVariantImages.length > 0) {
      return nextVariantImages[0];
    }

    // Fallback to current variant's second image or first image
    const currentImages = currentVariant?.images || [];
    return currentImages[1] || currentImages[0] || currentImage;
  }, [_fullData, currentVariant, images, currentImage]);

  const stockQuantity = currentVariant?.quantity || 0;
  const isOutOfStock = stockQuantity <= 0;

  // Check how many items are already in cart for this variant
  const cartItemId = `${id}-${selectedColor}-${selectedSize}`;
  const cartQuantity = cartItems.find(item => item.id === cartItemId)?.quantity || 0;
  const availableStock = stockQuantity - cartQuantity;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(Math.round(price));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('Out of Stock', { description: 'This product is currently out of stock' });
      return;
    }

    if (availableStock <= 0) {
      toast.error('Stock Limit Reached', {
        description: `Only ${stockQuantity} item(s) available. Please reduce quantity or select a different size/color.`
      });
      return;
    }

    dispatch(addToCart({
      id: cartItemId,
      productId: id,
      name: title,
      price,
      images: [image],
      brand: BRAND.name,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      maxQuantity: stockQuantity,
      variant: currentVariant
    }));
    toast.success('Added to cart', { description: `${title} (${selectedSize})` });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
      toast('Removed from wishlist', { description: title });
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist', { description: title });
    }
  };

  return (
    <div className="product-card group animate-fade-in">
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <div className="relative aspect-square">
          <Image
            src={currentImage}
            alt={title}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Hover Image - Next Variant */}
          {hoverImage && hoverImage !== currentImage && (
            <Image
              src={hoverImage}
              alt={`${title} - Alternative view`}
              fill
              className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Product Badge */}
          <div className="absolute top-3 left-3 z-10">
            {badge === 'sale' && (
              <span className="badge-sale">
                -{discountPercentage}%
              </span>
            )}
            {badge === 'new' && (
              <span className="badge-new">NEW</span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full transition-colors ${isInWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <Link href={`/products/${id}`}>
            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-500 transition-colors mb-2">
              {title}
            </h3>
          </Link>

          {/* Colors */}
          {colors && colors.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1.5">
                {colors.map((color, index) => {
                  // Find any variant with this color to get colorCode
                  const colorVariant = _fullData?.variants?.find(v =>
                    v.color?.toLowerCase() === color?.toLowerCase()
                  );

                  // Check if this color has any available stock
                  const colorVariants = _fullData?.variants?.filter(v =>
                    v.color?.toLowerCase() === color?.toLowerCase()
                  ) || [];
                  const hasAvailableStock = colorVariants.some(v => (v.quantity || 0) > 0);
                  const colorCode = colorVariant?.colorCode;

                  return (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedColor(color);
                      }}
                      disabled={!hasAvailableStock}
                      className={`relative flex items-center space-x-1 px-2 py-1 rounded border transition-all ${selectedColor === color
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-300 hover:border-gray-400'
                        } ${!hasAvailableStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      title={!hasAvailableStock ? 'Out of stock' : `Select ${color}`}
                    >
                      {/* Color Swatch */}
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{
                          backgroundColor: colorCode || 'transparent',
                          backgroundImage: !colorCode ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                          backgroundSize: '4px 4px',
                          backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
                        }}
                      />
                      {/* Color Name - only show if space allows or few colors */}
                      {colors.length <= 3 && (
                        <span className="text-xs font-medium text-gray-700">{color}</span>
                      )}
                      {selectedColor === color && (
                        <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          {selectedColor && (
            <div className="flex space-x-1 mb-3">
              {availableSizesForColor.map((size) => {
                const variant = _fullData ? getVariantByColorAndSize(_fullData, selectedColor, size) : null;
                const variantStock = variant?.quantity || 0;
                const isAvailable = variantStock > 0;

                return (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedSize(size);
                    }}
                    disabled={!isAvailable}
                    className={`text-xs px-2 py-1 rounded transition-colors ${selectedSize === size
                      ? 'bg-gray-900 text-white border border-gray-900'
                      : 'text-gray-600 border border-gray-300 hover:border-gray-400'
                      } ${!isAvailable ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
                    title={!isAvailable ? 'Out of stock' : `${variantStock} available`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            {compareAtPrice && compareAtPrice > price ? (
              <>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(price)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(price)}
              </span>
            )}
          </div>

          {/* Stock Info */}
          {stockQuantity > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {availableStock} {availableStock === 1 ? 'item' : 'items'} available
            </p>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || availableStock <= 0}
            className={`w-full mt-3 btn-primary text-sm py-2 ${isOutOfStock || availableStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isOutOfStock ? 'Out of Stock' : availableStock <= 0 ? 'Stock Limit Reached' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
