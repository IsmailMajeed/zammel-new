'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is your 'Open Parcel Before Payment' policy?",
      answer: "We're the first in Pakistan to offer this innovative policy! You can open and inspect your parcel before making payment. This ensures you're completely satisfied with your purchase before you pay. If you're not happy, you can return it without any charges."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. All orders are processed and shipped within 1-2 business days after order confirmation. Free shipping is available on orders above PKR 5,000."
    },
    {
      question: "What is your return policy?",
      answer: "You can return or exchange items within 7 days of delivery. Items must be unused, in original condition, with tags attached, and in original packaging. For defective or incorrect items, we cover return shipping costs."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email. You can use this tracking number to monitor your package's journey to your doorstep."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash on delivery (COD), credit/debit cards, and bank transfers. Remember, with our 'Open Parcel Before Payment' policy, you can inspect your order before payment even with COD!"
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we only ship within Pakistan. We're working on expanding our shipping to international destinations in the future."
    },
    {
      question: "What if I receive a damaged or incorrect item?",
      answer: "If you receive a damaged or incorrect item, please contact us immediately at zammelOfficial@gmail.com or call +92 (371) 0713445. We'll arrange a free return and replacement or full refund as per your preference."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order before it's shipped. Once shipped, you can return it using our standard return process. Contact our customer service team to cancel your order."
    },
    {
      question: "How do I know my size?",
      answer: "We have a detailed size guide on our website. You can also contact our customer service team for personalized size recommendations. If the size doesn't fit, you can exchange it within 7 days."
    },
    {
      question: "Are your products authentic?",
      answer: "Yes! All our products are 100% authentic and sourced directly from manufacturers. We guarantee the quality and authenticity of every item in our collection."
    },
    {
      question: "Do you offer discounts or promotions?",
      answer: "Yes! We regularly offer discounts and promotions. Subscribe to our newsletter to stay updated on exclusive offers, new arrivals, and special deals. You can also follow us on social media for the latest updates."
    },
    {
      question: "How can I contact customer service?",
      answer: "You can reach us via email at zammelOfficial@gmail.com, call us at +92 (371) 0713445, or use the contact form on our website. Our customer service team is available Monday to Friday, 9 AM to 6 PM."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Still Have Questions?</h2>
          <p className="text-gray-700 mb-4">
            Can't find the answer you're looking for? Our customer service team is here to help!
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
        </div>
      </div>
    </main>
  );
}

