'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '@/redux/slices/Cart';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CreditCard, MapPin, Phone, Mail, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { BRAND } from '@/utils/brandConstants';

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
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, total, itemCount } = useSelector(state => state.cart);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      router.push('/');
      setIsProcessing(false);
    }, 2000);
  };

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
                disabled={isProcessing}
                className="w-full bg-gray-900 text-white py-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60 font-medium text-lg"
              >
                {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(finalTotal)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
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
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
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
