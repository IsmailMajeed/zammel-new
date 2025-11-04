'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetOrderByIdQuery } from '@/redux/api/Orders';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Package, Truck, Home } from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id;

  const { data, isLoading, isError } = useGetOrderByIdQuery(orderId);

  const order = data?.data?.order;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          </div>
          <p className="text-gray-600">
            Thank you for your order. We've received it and will process it shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-lg font-semibold text-gray-900">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                }`}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{item.productName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {item.variant?.size && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {item.variant.size}
                        </span>
                      )}
                      {item.variant?.color && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {item.variant.color}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatPrice(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
          <div className="text-gray-600">
            <p className="font-medium text-gray-900">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p className="mt-2">
              <span className="font-medium">Email:</span> {order.shippingAddress.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <Link
            href="/"
            className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors text-center font-medium"
          >
            Continue Shopping
          </Link>
          <Link
            href="/profile"
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}

