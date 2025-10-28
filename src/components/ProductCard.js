'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/Cart';
import { addToWishlist, removeFromWishlist } from '@/redux/slices/Wishlist';
import { toast } from 'sonner';
import { BRAND } from '@/utils/brandConstants';

export default function ProductCard({ product }) {
  const {
    id,
    title,
    price,
    compareAtPrice,
    discountPercentage,
    image,
    hoverImage,
    sizes = ['M', 'L', 'XL'],
    badge = 'sale'
  } = product;

  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || 'M');

  const isInWishlist = wishlistItems.some(item => item.id === id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      id,
      name: title,
      price,
      images: [image],
      brand: BRAND.name,
      size: selectedSize
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
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Hover Image */}
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={title}
              fill
              className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
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

          {/* Sizes */}
          <div className="flex space-x-1 mb-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`text-xs px-2 py-1 rounded transition-colors ${selectedSize === size
                  ? 'bg-gray-900 text-white border border-gray-900'
                  : 'text-gray-600 border border-gray-300 hover:border-gray-400'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>

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

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full mt-3 btn-primary text-sm py-2"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
