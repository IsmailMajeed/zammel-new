import ProductGrid from "@/components/ProductGrid";

// Sample product data based on the original HTML
const products = [
  {
    id: 'hoodie-pack-of-2',
    title: 'Hoodie- Pack of 2',
    price: 299900, // PKR in paisa
    compareAtPrice: 500000,
    discountPercentage: 40,
    image: 'https://mettwear.com/cdn/shop/files/PO2_Hoodie.jpg?v=1730314234',
    hoverImage: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-white.jpg?v=1696799478',
    sizes: ['M', 'L', 'XL'],
    badge: 'sale'
  },
  {
    id: 'hoodie-black',
    title: 'Hoodie-Black',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-Black.jpg?v=1696798486',
    sizes: ['M', 'L', 'XL'],
    badge: 'sale'
  },
  {
    id: 'hoodie-white',
    title: 'Hoodie-White',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-white.jpg?v=1696799478',
    sizes: ['M', 'L', 'XL'],
    badge: 'sale'
  },
  {
    id: 'hoodie-charcoal-gray',
    title: 'Hoodie-Charcoal Gray',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-CharcoalGrey.jpg?v=1696798670',
    sizes: ['M', 'L', 'XL'],
    badge: 'sale'
  },
  {
    id: 'hoodie-navy-blue',
    title: 'Hoodie-Navy Blue',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-NavyBlue.jpg?v=1696799236',
    sizes: ['M', 'L', 'XL'],
    badge: 'sale'
  },
  {
    id: 'hoodie-sky-blue',
    title: 'Hoodie-Sky Blue',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-LightBlue.jpg?v=1696799178',
    sizes: ['M', 'L', 'XL'],
    badge: 'sale'
  },
  {
    id: 'hoodie-beige',
    title: 'Hoodie-Beige',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-Khaki.jpg?v=1696799149',
    sizes: ['M', 'L', 'XL'],
    badge: 'sale'
  },
  {
    id: 'hoodie-army-green',
    title: 'Hoodie-Army Green',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-ArmyGreen.jpg?v=1696796359',
    sizes: ['M', 'L', 'XL'],
    badge: 'sale'
  },
  {
    id: 'hoodie-maroon',
    title: 'Hoodie-Maroon',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-Marron.jpg?v=1696799209',
    sizes: ['M', 'L', 'XL'],
    badge: 'sale'
  },
  {
    id: 'hoodie-bottle-green',
    title: 'Hoodie-Bottle Green',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-BottleGreen.jpg?v=1696798585',
    sizes: ['M', 'L', 'XL'],
    badge: 'sale'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Promo Banner */}
      <section className="bg-gray-900 text-white py-3">
        <div className="container text-center">
          <span className="text-sm font-medium">
            Open Your Parcel Before Payment 🔥 First Check then Pay ✔
          </span>
        </div>
      </section>

      {/* Main Content */}
      <ProductGrid products={products} />

      {/* Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Let customers speak for us</h2>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">from 656 reviews</span>
            </div>
          </div>

          {/* Sample Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Ahmed Khan',
                rating: 5,
                comment: 'Amazing quality! The hoodie is so comfortable and the material is premium. Highly recommended!',
                verified: true
              },
              {
                name: 'Sara Ali',
                rating: 5,
                comment: 'Love the fit and the colors are exactly as shown. Fast delivery and great customer service.',
                verified: true
              },
              {
                name: 'Muhammad Hassan',
                rating: 4,
                comment: 'Good quality hoodie, comfortable to wear. The sizing is accurate. Will order again.',
                verified: true
              }
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="flex space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {review.verified && (
                    <svg className="w-4 h-4 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                <p className="text-sm font-medium text-gray-900">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}