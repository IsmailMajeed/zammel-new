'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  closeWishlist,
  removeFromWishlist,
  clearWishlist
} from '@/redux/slices/Wishlist';
import { addToCart } from '@/redux/slices/Cart';
import { toast } from 'sonner';
import { BRAND } from '@/utils/brandConstants';

const Wishlist = () => {
  const [isRemoving, setIsRemoving] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector(state => state.wishlist);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRemoveItem = async (id) => {
    setIsRemoving(id);
    setTimeout(() => {
      dispatch(removeFromWishlist(id));
      setIsRemoving(null);
      toast('Removed from wishlist');
    }, 300);
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
    toast('Wishlist cleared');
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      images: [product.image],
      brand: BRAND.name
    }));
    toast.success('Added to cart', { description: product.title });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => dispatch(closeWishlist())}
          />

          {/* Wishlist Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-lg font-semibold text-gray-900">
                  Wishlist ({items.length})
                </span>
              </div>
              <button
                onClick={() => dispatch(closeWishlist())}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Wishlist Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Heart className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Save items you love for later by clicking the heart icon.
                  </p>
                  <Link
                    href="/"
                    onClick={() => dispatch(closeWishlist())}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {/* Clear Wishlist Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleClearWishlist}
                      className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear Wishlist</span>
                    </button>
                  </div>

                  {/* Wishlist Items */}
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 1, scale: 1, y: 0 }}
                        animate={{
                          opacity: isRemoving === item.id ? 0 : 1,
                          scale: isRemoving === item.id ? 0.8 : 1,
                          y: isRemoving === item.id ? -10 : 0
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-red-200"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mb-3 group-hover:scale-105 transition-transform duration-200">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 mb-3">
                          <Link href={`/products/${item.id}`}>
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-red-500 transition-colors">
                              {item.title}
                            </h4>
                          </Link>
                          <p className="text-xs text-gray-500 mb-2">
                            {BRAND.name}
                          </p>
                          {/* Size and Color info */}
                          {(item.size || item.color) && (
                            <div className="flex items-center space-x-2 mb-2">
                              {item.size && (
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  Color: {item.color}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-900">
                              {formatPrice(item.price)}
                            </p>
                            {item.compareAtPrice && item.compareAtPrice > item.price && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(item.compareAtPrice)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1 mr-2 py-2 px-3 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-1"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add to Cart</span>
                          </button>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group/remove"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4 group-hover/remove:scale-110 transition-transform" />
                          </button>
                        </div>

                        {/* Subtle Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-200 via-red-400 to-red-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <Link
                  href="/wishlist"
                  onClick={() => dispatch(closeWishlist())}
                  className="w-full py-2 px-4 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-center block"
                >
                  View Full Wishlist
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Wishlist;
