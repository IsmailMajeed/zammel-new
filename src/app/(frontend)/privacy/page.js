'use client';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <p className="text-gray-600 text-sm mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-gray-700 leading-relaxed">
              At Zammel, we are committed to protecting your privacy. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you visit our website and
              make a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-gray-700 mb-2">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Name and contact information (email address, phone number, mailing address)</li>
                  <li>Payment information (credit card details, billing address)</li>
                  <li>Order history and preferences</li>
                  <li>Account credentials if you create an account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Automatically Collected Information</h3>
                <p className="text-gray-700 mb-2">When you visit our website, we automatically collect:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>IP address and browser type</li>
                  <li>Device information</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Send you order confirmations and updates</li>
              <li>Respond to your customer service requests</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share
              your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Service Providers:</strong> We may share information with third-party service
                providers who perform services on our behalf (e.g., payment processing, shipping,
                marketing)</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law
                or in response to valid requests by public authorities</li>
              <li><strong>Business Transfers:</strong> If we merge or are acquired, your information
                may be transferred to the new entity</li>
              <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your
              personal information against unauthorized access, alteration, disclosure, or destruction.
              However, no method of transmission over the internet or electronic storage is 100% secure,
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our website and
              hold certain information. Cookies are files with a small amount of data which may include
              an anonymous unique identifier.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being
              sent. However, if you do not accept cookies, you may not be able to use some portions of
              our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Access and receive a copy of your personal information</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website is not intended for children under the age of 18. We do not knowingly collect
              personal information from children. If you are a parent or guardian and believe your child
              has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the "Last updated" date. You are
              advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
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
        </div>
      </div>
    </main>
  );
}

