'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Heart
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  closeCart,
  updateQuantity,
  removeFromCart,
  clearCart
} from '@/redux/slices/Cart';
import { useGetSettingsQuery } from '@/redux/api/Settings';
import { toast } from 'sonner';

const Cart = () => {
  const [isRemoving, setIsRemoving] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dispatch = useDispatch();
  const { items, total, itemCount, isOpen } = useSelector(state => state.cart);

  // Fetch settings for tax calculation
  const { data: settingsData } = useGetSettingsQuery();
  const settings = settingsData?.data?.settings;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(Math.round(price));
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = async (id) => {
    setIsRemoving(id);
    setTimeout(() => {
      dispatch(removeFromCart(id));
      setIsRemoving(null);
      toast('Removed from cart');
    }, 300);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast('Cart cleared');
  };

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Calculate tax based on settings
  const calculateTax = () => {
    if (!settings?.tax?.enabled) return 0;

    const taxSettings = settings.tax;
    if (taxSettings.type === 'percentage') {
      // Subtotal is in PKR, value is percentage
      return Math.round((subtotal * taxSettings.value) / 100);
    } else {
      // Fixed amount tax is in PKR
      return Math.round(taxSettings.value || 0);
    }
  };

  // Shipping charges removed from cart
  const tax = calculateTax();
  const finalTotal = subtotal + tax;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50"
            onClick={() => dispatch(closeCart())}
          />

          {/* Cart Panel */}
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
                <ShoppingBag className="w-5 h-5 text-gray-900" />
                <span className="text-lg font-semibold text-gray-900">
                  Shopping Cart ({itemCount})
                </span>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Looks like you haven&apos;t added any items to your cart yet.
                  </p>
                  <Link
                    href="/products"
                    onClick={() => dispatch(closeCart())}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {/* Clear Cart Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-700 transition-colors flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear Cart</span>
                    </button>
                  </div>

                  {/* Cart Items */}
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
                        className="group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
                      >
                        {/* Product Image with Hover Effect */}
                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mb-3 group-hover:scale-105 transition-transform duration-200">
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                          {/* Wishlist Button */}
                          <button
                            aria-label={`Add ${item.name} to wishlist`}
                            className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                          >
                            <Heart className="w-3 h-3 text-gray-500 hover:text-red-500 transition-colors" />
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 mb-3">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 mb-2">
                            {item.brand}
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
                            {item.quantity > 1 && (
                              <p className="text-xs text-gray-500">
                                {formatPrice(item.price * item.quantity)} total
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="p-2 hover:bg-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-semibold text-gray-900 min-w-[2rem] text-center px-2">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                              className="p-2 hover:bg-white rounded-md transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label={`Remove ${item.name} from cart`}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group/remove"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4 group-hover/remove:scale-110 transition-transform" />
                          </button>
                        </div>

                        {/* Subtle Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4 bg-white">
                {/* Order Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div>
                  <Link
                    href="/checkout"
                    onClick={() => dispatch(closeCart())}
                    className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 font-medium"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
