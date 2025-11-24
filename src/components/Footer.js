'use client';

import { useState } from 'react';
import BRAND from '@/utils/brandConstants';
import Link from 'next/link';
import { useSubscribeNewsletterMutation } from '@/redux/api/Newsletter';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribeNewsletter, { isLoading: isSubmitting, error: subscribeError }] = useSubscribeNewsletterMutation();
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setSubmitStatus('error');
      setSubmitMessage('Please enter your email address');
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage('');
      }, 3000);
      return;
    }

    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const result = await subscribeNewsletter({ email }).unwrap();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage('Successfully subscribed! You will receive our newsletter updates.');
        setEmail('');
        setTimeout(() => {
          setSubmitStatus(null);
          setSubmitMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubmitStatus('error');
      const errorMsg = error?.data?.message || error?.message || 'Failed to subscribe. Please try again.';
      setSubmitMessage(errorMsg);
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage('');
      }, 5000);
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-6">
              Subscribe to our newsletter and be the first to know about new products and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {submitStatus && (
              <div className={`mt-4 max-w-md mx-auto px-4 py-3 rounded-lg text-sm ${submitStatus === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                {submitMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">{BRAND.name}</h4>
              <p className="text-gray-600 mb-4">
                First in Pakistan to offer open parcel delivery. Premium quality hoodies with first check then pay policy.
              </p>
              <div className="flex space-x-4">
                <a
                  href={BRAND.social.whatsapp}
                  target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors">
                  <FaWhatsapp size={20} />
                </a>
                <a href={BRAND.social.facebook}
                  target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors">
                  <FaFacebook size={20} />
                </a>
                <a
                  href={BRAND.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors">
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/collections/hoodie" className="text-gray-600 hover:text-blue-500 transition-colors">
                    Hoodies
                  </Link>
                </li>
                <li>
                  <Link href="/collections" className="text-gray-600 hover:text-blue-500 transition-colors">
                    All Collections
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-blue-500 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-blue-500 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/shipping" className="text-gray-600 hover:text-blue-500 transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-600 hover:text-blue-500 transition-colors">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="text-gray-600 hover:text-blue-500 transition-colors">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-blue-500 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h4>
              <div className="flex flex-col gap-y-2 text-gray-600">
                <a href={`mailto:${BRAND.contact.email}`}>📧 {BRAND.contact.email}</a>
                <a href={`tel:${BRAND.contact.phone}`}>📞 {BRAND.contact.phone}</a>
                <span>📍 Lahore, Pakistan</span>
                {/* <span>🕒 Mon - Fri: 9AM - 6PM</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-gray-600 text-sm mb-4 md:mb-0">
              Copyright © {currentYear} <span className="font-semibold">{BRAND.name}</span> all rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-500 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
