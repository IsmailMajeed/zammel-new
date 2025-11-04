'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useGetCategoriesQuery } from '@/redux/api/Categories';
import { useGetProductsQuery } from '@/redux/api/Products';
import ProductGrid from '@/components/ProductGrid';
import { transformProductForFrontend } from '@/utils/productTransformers';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function CollectionPage() {
  const params = useParams();
  const slug = params?.slug;
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'featured'
  });
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all categories to find the current category
  const { data: categoriesData } = useGetCategoriesQuery({
    status: 'active',
    limit: 1000
  });

  const categories = categoriesData?.data?.categories || categoriesData?.data || [];
  const currentCategory = categories.find(
    cat => (cat.slug === slug) || (cat._id === slug) || (cat.id === slug)
  );

  // Reset products and page when filters change
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.sortBy]);

  // Set category filter when category is found
  useEffect(() => {
    if (currentCategory) {
      setFilters(prev => ({
        ...prev,
        category: currentCategory._id || currentCategory.id
      }));
    }
  }, [currentCategory]);

  const queryParams = {
    status: 'active',
    limit: 20,
    page,
    ...(filters.category && { category: filters.category }),
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
        setAllProducts(transformedProducts);
      } else {
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

  if (isLoading || !currentCategory) {
    return (
      <main className="min-h-screen bg-white py-8">
        <div className="container py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !currentCategory) {
    return (
      <main className="min-h-screen bg-white py-8">
        <div className="container py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Collection Not Found</h1>
            <p className="text-gray-600 mb-6">The collection you're looking for doesn't exist.</p>
            <Link href="/collections" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="inline w-4 h-4 mr-2" />
              Back to Collections
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/collections"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collections
          </Link>
        </div>

        {/* Collection Header */}
        <div className="mb-12">
          {currentCategory.image && (
            <div className="relative w-full h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden mb-6">
              <Image
                src={currentCategory.image}
                alt={currentCategory.name}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentCategory.name}</h1>
          {currentCategory.description && (
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
              {currentCategory.description}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <div className="text-red-500">
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
      </div>
    </main>
  );
}

