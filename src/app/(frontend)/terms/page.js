'use client';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <p className="text-gray-600 text-sm mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please read these Terms of Service carefully before using our website and making a purchase.
              By accessing or using our website, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Zammel's website, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to these Terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily access the materials on Zammel's website for personal,
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
              and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Products and Pricing</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We strive to provide accurate product descriptions and pricing. However, we do not warrant
                that product descriptions or other content on this site is accurate, complete, reliable,
                current, or error-free.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Prices are subject to change without notice. We reserve the right to modify or discontinue
                products at any time without prior notice. We shall not be liable to you or any third party
                for any modification, price change, suspension, or discontinuance of the product.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Orders and Payment</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                When you place an order, you are offering to purchase a product subject to these Terms.
                All orders are subject to acceptance by us, and we reserve the right to refuse or cancel
                any order for any reason.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We accept various payment methods including cash on delivery (COD), credit/debit cards,
                and bank transfers. With our "Open Parcel Before Payment" policy, you can inspect your
                order before making payment.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping and Delivery</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Shipping terms are available on our Shipping Information page. Delivery times are estimates
              and may vary. We are not responsible for delays caused by courier services or circumstances
              beyond our control.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for providing accurate shipping information. We are not liable for
              orders shipped to incorrect addresses provided by you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Returns and Refunds</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our return and refund policy is detailed on our Returns & Exchanges page. Returns must be
              made within 7 days of delivery and items must be in original condition with tags attached.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Refunds will be processed to the original payment method within 5-7 business days after
              we receive and inspect the returned item.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the
              property of Zammel or its content suppliers and is protected by copyright and other intellectual
              property laws. You may not use, reproduce, or distribute any content from this website without
              our prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you create an account on our website, you are responsible for maintaining the confidentiality
              of your account and password. You agree to accept responsibility for all activities that occur
              under your account.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to refuse service, terminate accounts, or remove content at our sole
              discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall Zammel or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or
              inability to use the materials on Zammel's website, even if Zammel or a Zammel authorized
              representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Pakistan, without
              regard to its conflict of law provisions. Any disputes arising from these Terms or your use of
              our website shall be subject to the exclusive jurisdiction of the courts of Pakistan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to revise these Terms at any time without notice. By using this website,
              you are agreeing to be bound by the then current version of these Terms. We encourage you to
              review these Terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
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

