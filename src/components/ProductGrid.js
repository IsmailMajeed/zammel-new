'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products = [] }) {
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'best-selling', label: 'Best selling' },
    { value: 'title-ascending', label: 'Alphabetically, A-Z' },
    { value: 'title-descending', label: 'Alphabetically, Z-A' },
    { value: 'price-ascending', label: 'Price, low to high' },
    { value: 'price-descending', label: 'Price, high to low' },
    { value: 'created-ascending', label: 'Date, old to new' },
    { value: 'created-descending', label: 'Date, new to old' },
  ];

  const handleSortChange = (value) => {
    setSortBy(value);
    // Here you would implement the actual sorting logic
    console.log('Sorting by:', value);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="py-8">
      <div className="container">
        {/* Collection Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoodie Collection</h1>
          <p className="text-gray-600">
            Discover our premium collection of comfortable and stylish hoodies
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          {/* Filter Button */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter</span>
            </button>
          </div>

          {/* View Mode and Sort Controls */}
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''} hover:bg-gray-50 transition-colors`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''} hover:bg-gray-50 transition-colors`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
          }`}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="btn-secondary">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  );
}
