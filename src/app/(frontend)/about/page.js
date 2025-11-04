'use client';

import Link from 'next/link';
import BRAND from '@/utils/brandConstants';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to {BRAND.name}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {BRAND.name} is Pakistan's premier fashion destination, revolutionizing the online shopping
              experience with our innovative "Open Your Parcel Before Payment" policy. We believe in
              transparency, quality, and customer satisfaction above all else.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to provide premium quality hoodies and fashion apparel that meet the highest
              standards of craftsmanship and design. We're committed to ensuring that every customer feels
              confident and satisfied with their purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Founded with a vision to transform the e-commerce landscape in Pakistan, {BRAND.name} started
              with a simple yet powerful idea: customers should be able to inspect their products before
              making payment. This customer-first approach has set us apart in the industry.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We specialize in premium quality hoodies, carefully curated to ensure exceptional comfort,
              durability, and style. Each product in our collection undergoes rigorous quality checks to
              meet our high standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose {BRAND.name}?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>First Check, Then Pay:</strong> Inspect your parcel before payment - a first in Pakistan</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>Premium Quality:</strong> Only the finest materials and craftsmanship</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>Customer Satisfaction:</strong> Your happiness is our priority</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>Easy Returns:</strong> Hassle-free return and exchange policy</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>Fast Shipping:</strong> Quick and reliable delivery across Pakistan</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed">
              At {BRAND.name}, we're committed to providing you with the best shopping experience possible.
              From our innovative payment policy to our premium product selection, every aspect of our
              business is designed with you in mind.
            </p>
          </section>

          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Have questions or want to learn more? We'd love to hear from you!
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}

