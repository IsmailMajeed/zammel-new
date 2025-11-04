'use client';

import { RotateCcw, Package, Clock, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Returns & Exchanges</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Return Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Zammel, we want you to be completely satisfied with your purchase. That's why we offer
              a hassle-free return and exchange policy. If you're not happy with your order, you can return
              or exchange it within 7 days of delivery.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800">
                <strong>Remember:</strong> You can open your parcel before payment! This ensures you're
                satisfied with your purchase before making payment.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Conditions</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Items Must Be:</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Unused and in original condition</li>
                    <li>• In original packaging with tags attached</li>
                    <li>• Free from any damage, stains, or odors</li>
                    <li>• Returned within 7 days of delivery</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Non-Returnable Items:</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Items that have been worn or used</li>
                    <li>• Items without original tags</li>
                    <li>• Items damaged by customer misuse</li>
                    <li>• Items returned after 7 days</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Return</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Contact Us</h3>
                  <p className="text-gray-700">
                    Email us at{' '}
                    <a href="mailto:zammelOfficial@gmail.com" className="text-blue-600 hover:underline">
                      zammelOfficial@gmail.com
                    </a>{' '}
                    or call us at{' '}
                    <a href="tel:+923710713445" className="text-blue-600 hover:underline">
                      +92 (371) 0713445
                    </a>
                    {' '}with your order number and reason for return.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Get Approval</h3>
                  <p className="text-gray-700">
                    Our customer service team will review your request and provide return instructions
                    within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Pack & Ship</h3>
                  <p className="text-gray-700">
                    Pack the item in its original packaging with all tags attached. We'll provide you
                    with a return shipping label.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Refund or Exchange</h3>
                  <p className="text-gray-700">
                    Once we receive and inspect your return, we'll process your refund or exchange
                    within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exchanges</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Need a different size or color? We offer hassle-free exchanges for all eligible items.
              Simply follow the return process above and mention that you'd like an exchange instead
              of a refund.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If the exchange item is of different value, we'll process the price difference accordingly.
              If the new item costs more, you'll need to pay the difference. If it costs less, we'll
              refund the difference.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Process</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                <strong>Refund Timeline:</strong>
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Return request approval: 24 hours</li>
                <li>• Return shipping: 2-3 business days</li>
                <li>• Item inspection: 1-2 business days</li>
                <li>• Refund processing: 5-7 business days</li>
              </ul>
              <p className="text-gray-600 text-sm mt-4">
                Total time: 8-13 business days from return request to refund
              </p>
            </div>
            <p className="text-gray-700 mt-4">
              Refunds will be processed to the original payment method. Please allow additional time
              for your bank to process the refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Shipping</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Return shipping costs are the responsibility of the customer unless the item is defective
              or incorrect. In such cases, we'll cover the return shipping costs.
            </p>
            <p className="text-gray-700 leading-relaxed">
              For free return shipping, contact our customer service team and they'll provide you with
              a prepaid return label.
            </p>
          </section>

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Need Help?</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about returns or exchanges, our customer service team is here to help.
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:zammelOfficial@gmail.com" className="text-blue-600 hover:underline">
                  zammelOfficial@gmail.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href="tel:+923710713445" className="text-blue-600 hover:underline">
                  +92 (371) 0713445
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

