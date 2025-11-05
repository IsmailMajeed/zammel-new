'use client';

import { useState, useEffect } from 'react';
import { useGetProductsQuery } from "@/redux/api/Products";
import ProductGrid from "@/components/ProductGrid";
import { transformProductForFrontend } from "@/utils/productTransformers";

export default function Home() {
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'featured'
  });
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  // Reset products and page when filters change
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.sortBy]);

  const queryParams = {
    status: 'active',
    limit: 20, // Smaller limit for better pagination
    page,
    ...(filters.category !== 'all' && { category: filters.category }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    ...(filters.sortBy && { sortBy: filters.sortBy })
  };

  const { data, isFetching, isLoading, isError, error } = useGetProductsQuery(queryParams);

  // Update allProducts when new data arrives
  useEffect(() => {
    if (data?.data?.products) {
      const transformedProducts = data.data.products
        .map(transformProductForFrontend)
        .filter(Boolean);

      if (page === 1) {
        // First page or filter change - replace all products
        setAllProducts(transformedProducts);
      } else {
        // Subsequent pages - append products
        setAllProducts(prev => [...prev, ...transformedProducts]);
      }
    }
  }, [data, page]);

  const hasMore = data?.data?.pagination?.hasMore || false;
  const totalProducts = data?.data?.pagination?.totalItems || allProducts.length;

  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Page Intro */}
      <section className="container !py-8 hidden">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Premium Hoodies by Zammel – Check First, Then Pay</h1>
        <p className="text-gray-600 max-w-3xl">Experience premium comfort and style. Explore our latest collections with open-parcel delivery across Pakistan.</p>
      </section>
      {/* Promo Banner */}
      <section className="bg-gray-900 text-white py-3">
        <div className="container text-center">
          <span className="text-sm font-medium">
            Open Your Parcel Before Payment 🔥 First Check then Pay ✔
          </span>
        </div>
      </section>

      {/* Main Content */}
      {isLoading ? (
        <div className="container !py-12">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      ) : isError ? (
        <div className="container !py-12">
          <div className="text-center text-red-500">
            {error?.data?.message || 'Failed to load products. Please try again later.'}
          </div>
        </div>
      ) : (
        <ProductGrid
          products={allProducts}
          filters={filters}
          onFiltersChange={setFilters}
          totalProducts={totalProducts}
          isLoading={isFetching}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          isLoadMoreLoading={isFetching && page > 1}
        />
      )}

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