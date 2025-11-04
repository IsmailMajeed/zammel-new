'use client';

import { useState, useEffect } from 'react';
import { useGetCategoriesQuery } from '@/redux/api/Categories';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function CollectionsPage() {
  const { data, isLoading, isError } = useGetCategoriesQuery({
    status: 'active',
    limit: 1000
  });

  const categories = data?.data?.categories || data?.data || [];

  if (isLoading) {
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

  if (isError) {
    return (
      <main className="min-h-screen bg-white py-8">
        <div className="container py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Collections</h1>
            <p className="text-gray-600">Failed to load collections. Please try again later.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Collections</h1>
          <p className="text-gray-600 text-lg">
            Explore our curated collection of premium fashion products
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No collections available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category._id || category.id}
                href={`/collections/${category.slug || category._id}`}
                className="group block"
              >
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <span className="text-4xl font-bold text-gray-400">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors flex-shrink-0 ml-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

