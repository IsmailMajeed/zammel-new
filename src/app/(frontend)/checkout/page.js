'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, updateQuantity, removeFromCart } from '@/redux/slices/Cart';
import { useCreateOrderMutation } from '@/redux/api/Orders';
import { useGetSettingsQuery } from '@/redux/api/Settings';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CreditCard, MapPin, Phone, Mail, ArrowLeft, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { getVariantByColorAndSize } from '@/utils/productTransformers';
import Swal from 'sweetalert2';

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidatingStock, setIsValidatingStock] = useState(true);
  const [stockIssues, setStockIssues] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, total, itemCount } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  // Fetch settings for tax and shipping calculation
  const { data: settingsData, isLoading: isLoadingSettings } = useGetSettingsQuery();
  const settings = settingsData?.data?.settings;

  // Validate stock on component mount
  useEffect(() => {
    const validateStock = async () => {
      if (items.length === 0) {
        setIsValidatingStock(false);
        return;
      }

      const issues = [];

      for (const item of items) {
        if (!item.productId) continue;

        try {
          // Fetch fresh product data
          const response = await fetch(`/api/products/${item.productId}`);
          if (!response.ok) continue;

          const result = await response.json();
          if (!result.success || !result.data) continue;

          const product = result.data;

          // Find variant
          const variant = getVariantByColorAndSize(
            product,
            item.color || '',
            item.size || ''
          );

          if (!variant) {
            issues.push({
              itemId: item.id,
              productName: item.name,
              issue: 'not_found',
              message: 'Product variant not found. It may have been removed.'
            });
            continue;
          }

          const availableStock = variant.quantity || 0;

          if (availableStock <= 0) {
            issues.push({
              itemId: item.id,
              productName: item.name,
              issue: 'out_of_stock',
              message: 'This product is now out of stock.'
            });
          } else if (item.quantity > availableStock) {
            issues.push({
              itemId: item.id,
              productName: item.name,
              issue: 'quantity_reduced',
              availableStock,
              requestedQuantity: item.quantity,
              message: `Only ${availableStock} item(s) available. Quantity has been adjusted.`
            });

            // Update cart quantity
            dispatch(updateQuantity({
              id: item.id,
              quantity: availableStock,
              maxQuantity: availableStock
            }));
          }
        } catch (error) {
          console.error('Error validating stock for item:', item.id, error);
        }
      }

      setStockIssues(issues);
      setIsValidatingStock(false);

      // Show summary toast
      if (issues.length > 0) {
        const outOfStock = issues.filter(i => i.issue === 'out_of_stock').length;
        const reduced = issues.filter(i => i.issue === 'quantity_reduced').length;

        let message = 'Some items in your cart have stock issues: ';
        if (outOfStock > 0) {
          message += `${outOfStock} item(s) out of stock. `;
        }
        if (reduced > 0) {
          message += `${reduced} item(s) quantity reduced. `;
        }
        message += 'Please review your cart below.';

        toast.error('Stock Updated', { description: message, duration: 8000 });
      }
    };

    validateStock();
    // eslint-disable-next-line
  }, []); // Only run once on mount

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price / 100); // Convert from paisa to PKR
  };

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Calculate tax based on settings
  const calculateTax = () => {
    if (!settings?.tax?.enabled) return 0;

    const taxSettings = settings.tax;
    if (taxSettings.type === 'percentage') {
      return (subtotal * taxSettings.value) / 100;
    } else {
      return taxSettings.value;
    }
  };

  // Calculate shipping based on settings
  const calculateShipping = () => {
    if (!settings?.shipping?.enabled) return 0;

    const shippingSettings = settings.shipping;

    // Free shipping above threshold
    if (shippingSettings.type === 'free_above' && shippingSettings.freeShippingAbove) {
      const threshold = shippingSettings.freeShippingAbove;
      if (subtotal >= threshold) {
        return 0;
      }
      return shippingSettings.value || 0;
    }

    // Percentage based
    if (shippingSettings.type === 'percentage') {
      return (subtotal * shippingSettings.value) / 100;
    }

    // Fixed amount
    return shippingSettings.value || 0;
  };

  const tax = calculateTax();
  const shipping = calculateShipping();
  const finalTotal = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
    setStockIssues(prev => prev.filter(issue => issue.itemId !== itemId));
    toast('Item removed from cart');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Don't allow checkout if there are stock issues
    if (stockIssues.some(issue => issue.issue === 'out_of_stock')) {
      toast.error('Cannot Proceed', {
        description: 'Please remove out of stock items before checkout.'
      });
      return;
    }

    // Don't proceed if still validating
    if (isValidatingStock) {
      toast.error('Please wait', {
        description: 'Stock validation in progress. Please wait...'
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order items
      const orderItems = items.map(item => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        variant: {
          color: item.color || '',
          size: item.size || ''
        },
        images: item.images || []
      }));

      // Prepare shipping address
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode
      };

      // Store tax and shipping details from settings
      const taxDetails = settings?.tax ? {
        enabled: settings.tax.enabled,
        type: settings.tax.type,
        value: settings.tax.value,
        description: settings.tax.description || 'Sales Tax'
      } : {
        enabled: false,
        type: 'percentage',
        value: 0,
        description: 'Sales Tax'
      };

      const shippingDetails = settings?.shipping ? {
        enabled: settings.shipping.enabled,
        type: settings.shipping.type,
        value: settings.shipping.value || 0,
        freeShippingAbove: settings.shipping.freeShippingAbove || 0,
        description: settings.shipping.description || 'Standard Shipping'
      } : {
        enabled: false,
        type: 'fixed',
        value: 0,
        freeShippingAbove: 0,
        description: 'Standard Shipping'
      };

      // Create order
      const result = await createOrder({
        items: orderItems,
        shippingAddress,
        paymentMethod: formData.paymentMethod,
        subtotal: subtotal / 100, // Convert from paisa to PKR
        shipping: shipping / 100, // Convert from paisa to PKR
        tax: tax / 100, // Convert from paisa to PKR
        taxDetails: taxDetails,
        shippingDetails: shippingDetails,
        discount: 0,
        total: finalTotal / 100, // Convert from paisa to PKR
        userId: user?._id || null
      }).unwrap();

      // Success
      dispatch(clearCart());

      // SHOW Swal.fire INSTEAD OF TOAST
      await Swal.fire({
        icon: 'success',
        title: 'Order Placed Successfully!',
        html: `<div style="font-size:1.2em">Order #<b>${result.data.order.orderNumber}</b> has been placed.</div>`,
        confirmButtonText: 'View Order',
        allowOutsideClick: false,
        customClass: {
          popup: 'swal2-custom-popup'
        }
      });

      // Redirect to order confirmation or home
      router.push(`/orders/${result.data.order._id}`);
    } catch (error) {
      console.error('Order creation error:', error);

      // Handle stock issues from API
      if (error?.data?.details?.stockIssues) {
        const apiStockIssues = error.data.details.stockIssues;
        setStockIssues(apiStockIssues);

        // Update cart quantities if API reduced them
        apiStockIssues.forEach(issue => {
          if (issue.issue === 'insufficient_stock' && issue.availableStock) {
            const item = items.find(i =>
              i.productName === issue.productName &&
              i.color === issue.variant?.color &&
              i.size === issue.variant?.size
            );
            if (item) {
              dispatch(updateQuantity({
                id: item.id,
                quantity: issue.availableStock,
                maxQuantity: issue.availableStock
              }));
            }
          }
        });

        const outOfStockCount = apiStockIssues.filter(i => i.issue === 'out_of_stock').length;
        const reducedCount = apiStockIssues.filter(i => i.issue === 'insufficient_stock').length;

        let errorMessage = 'Order cannot be processed: ';
        if (outOfStockCount > 0) {
          errorMessage += `${outOfStockCount} item(s) out of stock. `;
        }
        if (reducedCount > 0) {
          errorMessage += `${reducedCount} item(s) quantity reduced. `;
        }
        errorMessage += 'Please review your cart.';

        toast.error('Stock Issues', {
          description: errorMessage,
          duration: 8000
        });
      } else {
        toast.error('Order Failed', {
          description: error?.data?.message || 'Failed to place order. Please try again.'
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading while settings are being fetched
  if (isLoadingSettings) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart before checkout</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-6">
                  <MapPin className="w-5 h-5 text-gray-900 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Street address, apartment, suite, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-5 h-5 text-gray-900 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                        <span className="text-gray-900">Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="w-5 h-5 mr-2 text-gray-600 flex items-center justify-center">
                          <span className="text-xs font-bold">Rs</span>
                        </div>
                        <span className="text-gray-900">Cash on Delivery (COD)</span>
                      </label>
                    </div>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
                        <input
                          type="text"
                          name="nameOnCard"
                          value={formData.nameOnCard}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>
                    </>
                  )}

                  {formData.paymentMethod === 'cod' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="w-5 h-5 mr-3 text-blue-600 mt-0.5">
                          <span className="text-xs font-bold">₹</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-900 mb-1">Cash on Delivery</h4>
                          <p className="text-sm text-blue-700">
                            Pay with cash when your order is delivered. No additional charges apply.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessing || isCreatingOrder || isValidatingStock || stockIssues.some(i => i.issue === 'out_of_stock')}
                className="w-full bg-gray-900 text-white py-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-medium text-lg"
              >
                {isProcessing || isCreatingOrder
                  ? 'Processing Order...'
                  : isValidatingStock
                    ? 'Validating Stock...'
                    : stockIssues.some(i => i.issue === 'out_of_stock')
                      ? 'Please Remove Out of Stock Items'
                      : `Place Order - ${formatPrice(finalTotal)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

              {/* Stock Validation Loading */}
              {isValidatingStock && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-center">
                    <span className="animate-spin mr-2">⏳</span>
                    Verifying product availability...
                  </p>
                </div>
              )}

              {/* Stock Issues Alert */}
              {!isValidatingStock && stockIssues.length > 0 && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-red-900 mb-2">
                        Stock Issues Detected
                      </h4>
                      <div className="space-y-2">
                        {stockIssues.map((issue) => (
                          <div key={issue.itemId} className="text-sm text-red-700">
                            <p className="font-medium">{issue.productName}</p>
                            <p className="text-xs">{issue.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const issue = stockIssues.find(i => i.itemId === item.id);
                  const isOutOfStock = issue?.issue === 'out_of_stock';

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${isOutOfStock ? 'bg-red-50 border border-red-200' : issue ? 'bg-yellow-50 border border-yellow-200' : ''}`}
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.images?.[0] || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            {(item.size || item.color) && (
                              <div className="flex items-center space-x-1 mt-1">
                                {item.size && (
                                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {item.color}
                                  </span>
                                )}
                              </div>
                            )}
                            {issue && (
                              <p className={`text-xs mt-1 ${isOutOfStock ? 'text-red-600 font-medium' : 'text-yellow-700'}`}>
                                {issue.message}
                              </p>
                            )}
                            {item.maxQuantity !== undefined && !issue && (
                              <p className="text-xs text-gray-500 mt-1">
                                Stock: {item.maxQuantity} available
                              </p>
                            )}
                          </div>
                          {isOutOfStock && (
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="ml-2 text-red-600 hover:text-red-800 text-xs font-medium"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
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

              {/* Security Notice */}
              <div className="mt-6 flex items-center text-xs text-gray-500">
                <Lock className="w-4 h-4 mr-2" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
