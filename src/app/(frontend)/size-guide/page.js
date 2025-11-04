'use client';

import { Ruler } from 'lucide-react';

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Size Guide</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Find Your Perfect Fit</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Finding the right size is important for comfort and style. Follow our guide below to
              ensure you select the perfect size for your hoodie.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hoodie Size Chart</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Size</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Chest (inches)</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Length (inches)</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Sleeve Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">S</td>
                    <td className="border border-gray-300 px-4 py-3">36-38</td>
                    <td className="border border-gray-300 px-4 py-3">26-27</td>
                    <td className="border border-gray-300 px-4 py-3">32-33</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">M</td>
                    <td className="border border-gray-300 px-4 py-3">40-42</td>
                    <td className="border border-gray-300 px-4 py-3">27-28</td>
                    <td className="border border-gray-300 px-4 py-3">33-34</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">L</td>
                    <td className="border border-gray-300 px-4 py-3">44-46</td>
                    <td className="border border-gray-300 px-4 py-3">28-29</td>
                    <td className="border border-gray-300 px-4 py-3">34-35</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">XL</td>
                    <td className="border border-gray-300 px-4 py-3">48-50</td>
                    <td className="border border-gray-300 px-4 py-3">29-30</td>
                    <td className="border border-gray-300 px-4 py-3">35-36</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">XXL</td>
                    <td className="border border-gray-300 px-4 py-3">52-54</td>
                    <td className="border border-gray-300 px-4 py-3">30-31</td>
                    <td className="border border-gray-300 px-4 py-3">36-37</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              * Measurements are approximate and may vary slightly. All measurements are in inches.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Measure</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Ruler className="w-5 h-5 mr-2" />
                  Chest Measurement
                </h3>
                <p className="text-gray-700">
                  Measure around the fullest part of your chest, keeping the tape measure horizontal
                  and parallel to the ground. Make sure it's not too tight or too loose.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Ruler className="w-5 h-5 mr-2" />
                  Length Measurement
                </h3>
                <p className="text-gray-700">
                  Measure from the top of your shoulder (where the hoodie would sit) down to where
                  you want the hoodie to end (usually around the hip area).
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Ruler className="w-5 h-5 mr-2" />
                  Sleeve Length
                </h3>
                <p className="text-gray-700">
                  Measure from the center of the back of your neck, across your shoulder, and down
                  to your wrist bone.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Size Tips</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>For a relaxed fit:</strong> Choose one size larger than your usual size.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>For a standard fit:</strong> Choose your usual size.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>For a fitted look:</strong> Choose one size smaller than your usual size.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>When in doubt:</strong> We recommend sizing up for a more comfortable fit.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still Unsure?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you're still not sure about your size, our customer service team is here to help!
              Contact us and we'll help you find the perfect fit.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:zammelOfficial@gmail.com" className="text-blue-600 hover:underline">
                  zammelOfficial@gmail.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong>{' '}
                <a href="tel:+923710713445" className="text-blue-600 hover:underline">
                  +92 (371) 0713445
                </a>
              </p>
            </div>
          </section>

          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Remember!</h2>
            <p className="text-gray-700">
              Don't worry if the size doesn't fit perfectly! You can easily exchange it within 7 days
              of delivery. Just contact our customer service team and we'll help you with the exchange process.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

