'use client';

import { Truck, Package, Clock, MapPin } from 'lucide-react';

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping Information</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We offer fast and reliable shipping across Pakistan. All orders are processed and shipped
              within 1-2 business days after order confirmation.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Truck className="w-6 h-6 text-gray-900 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Standard Shipping</h3>
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Delivery Time:</strong> 3-5 business days
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Cost:</strong> PKR 300
              </p>
              <p className="text-gray-600 text-sm">
                Available for all cities across Pakistan
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Package className="w-6 h-6 text-gray-900 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Express Shipping</h3>
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Delivery Time:</strong> 1-2 business days
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Cost:</strong> PKR 500
              </p>
              <p className="text-gray-600 text-sm">
                Available for major cities (Lahore, Karachi, Islamabad)
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Free Shipping</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Enjoy free standard shipping on orders above PKR 5,000. Free shipping applies automatically
              at checkout for eligible orders.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Processing</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Order Confirmation</h3>
                  <p className="text-gray-700">
                    Once you place your order, you'll receive an email confirmation with your order details.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Processing</h3>
                  <p className="text-gray-700">
                    Your order is prepared and packed with care. This usually takes 1-2 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Shipping</h3>
                  <p className="text-gray-700">
                    Your order is shipped and you'll receive a tracking number via email.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Delivery</h3>
                  <p className="text-gray-700">
                    Your order arrives at your doorstep. Remember, you can open your parcel before payment!
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tracking Your Order</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Once your order is shipped, you'll receive a tracking number via email. You can use this
              number to track your package's journey to your doorstep.
            </p>
            <p className="text-gray-700 leading-relaxed">
              For any shipping-related inquiries, please contact our customer service team at{' '}
              <a href="mailto:zammelOfficial@gmail.com" className="text-blue-600 hover:underline">
                zammelOfficial@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Important Notes</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Delivery times are estimates and may vary based on location and weather conditions.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>We are not responsible for delays caused by courier services.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Please ensure your shipping address is correct. We cannot modify addresses after shipment.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>For remote areas, additional delivery time may be required.</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

