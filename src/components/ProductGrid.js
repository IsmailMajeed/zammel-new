'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ProductCard from './ProductCard';
import { useGetCategoriesQuery } from '@/redux/api/Categories';
import useDebounce from '@/hooks/useDebounce';

export default function ProductGrid({
  canResetFilters = true,
  collectionName = 'Zammel Collections',
  collectionDescription = 'Curated essentials from every category - mix fits, colours, and fabrics to build your own look.',
  products = [],
  filters: initialFilters,
  onFiltersChange,
  totalProducts = 0,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  isLoadMoreLoading = false
}) {
  const [showFilters, setShowFilters] = useState(false);
  const onFiltersChangeRef = useRef(onFiltersChange);
  const prevFiltersRef = useRef(null);

  // Memoize initial filters to prevent unnecessary recalculations
  const initialFiltersMemo = useMemo(() => ({
    category: initialFilters?.category || 'all',
    minPrice: initialFilters?.minPrice || '',
    maxPrice: initialFilters?.maxPrice || '',
    sortBy: initialFilters?.sortBy || 'featured'
    // Make sure initialFiltersMemo is updated if canResetFilters or initialFilters changes
  }), [
    canResetFilters,
    initialFilters?.category,
    initialFilters?.minPrice,
    initialFilters?.maxPrice,
    initialFilters?.sortBy,
  ]);

  const [localFilters, setLocalFilters] = useState(initialFiltersMemo);
  const prevInitialFiltersRef = useRef(initialFiltersMemo);
  const filterPanelContentRef = useRef(null);
  const [filterPanelHeight, setFilterPanelHeight] = useState(0);

  // Update ref when onFiltersChange changes
  useEffect(() => {
    onFiltersChangeRef.current = onFiltersChange;
  }, [onFiltersChange]);

  // Sync local filters with prop filters only when values actually change
  useEffect(() => {
    const prevInitial = prevInitialFiltersRef.current;
    const filtersChanged =
      initialFiltersMemo.category !== prevInitial.category ||
      initialFiltersMemo.minPrice !== prevInitial.minPrice ||
      initialFiltersMemo.maxPrice !== prevInitial.maxPrice ||
      initialFiltersMemo.sortBy !== prevInitial.sortBy;

    if (filtersChanged) {
      prevInitialFiltersRef.current = initialFiltersMemo;
      setLocalFilters(initialFiltersMemo);
    }
  }, [initialFiltersMemo]);

  // Debounce price inputs to avoid too many API calls
  const debouncedMinPrice = useDebounce(localFilters.minPrice, 500);
  const debouncedMaxPrice = useDebounce(localFilters.maxPrice, 500);

  // Update parent when filters change (only when values actually change)
  useEffect(() => {
    // In slug-page mode (canResetFilters === false), always force category to initialFilters.category
    const effectiveCategory =
      canResetFilters ? localFilters.category : (initialFilters?.category || 'all');

    const newFilters = {
      ...localFilters,
      category: effectiveCategory,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice
    };

    // Compare with previous filters to avoid unnecessary updates
    const filtersString = JSON.stringify(newFilters);
    const prevFiltersString = prevFiltersRef.current ? JSON.stringify(prevFiltersRef.current) : null;

    if (filtersString !== prevFiltersString && onFiltersChangeRef.current) {
      prevFiltersRef.current = newFilters;
      onFiltersChangeRef.current(newFilters);
    }
  }, [
    localFilters.category,
    debouncedMinPrice,
    debouncedMaxPrice,
    localFilters.sortBy,
    canResetFilters,
    initialFilters?.category
  ]);

  // Fetch categories for filtering
  const { data: categoriesData } = useGetCategoriesQuery({
    status: 'active',
    limit: 1000
  });
  const categories = categoriesData?.data?.categories || categoriesData?.data || [];

  // Keep animated panel height in sync with its content
  useEffect(() => {
    const updatePanelHeight = () => {
      if (filterPanelContentRef.current) {
        setFilterPanelHeight(filterPanelContentRef.current.scrollHeight);
      }
    };

    updatePanelHeight();
    window.addEventListener('resize', updatePanelHeight);
    return () => window.removeEventListener('resize', updatePanelHeight);
  }, [categories.length, products.length, showFilters]);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'title-ascending', label: 'Alphabetically, A-Z' },
    { value: 'title-descending', label: 'Alphabetically, Z-A' },
    { value: 'price-ascending', label: 'Price, low to high' },
    { value: 'price-descending', label: 'Price, high to low' },
    { value: 'created-descending', label: 'Date, new to old' },
    { value: 'created-ascending', label: 'Date, old to new' },
  ];

  const handleSortChange = (value) => {
    setLocalFilters(prev => ({ ...prev, sortBy: value }));
  };

  const handleCategoryChange = (value) => {
    // In slug mode (canResetFilters === false), don't let user change the category
    if (!canResetFilters) return;
    setLocalFilters(prev => ({ ...prev, category: value }));
  };

  const handlePriceChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFilterReset = () => {
    // Don't allow filter reset in slug mode (canResetFilters === false)
    if (!canResetFilters) return;
    const resetFilters = {
      category: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'featured'
    };
    setLocalFilters(resetFilters);
    if (onFiltersChange) {
      onFiltersChange(resetFilters);
    }
  };

  // For slug pages, activeFilterCount should not consider the category, since user can't change it.
  const activeCategoryChanged =
    canResetFilters
      ? (localFilters.category !== 'all')
      : false;

  const activePriceChanged = (localFilters.minPrice !== '' || localFilters.maxPrice !== '');

  const activeFilterCount = (activeCategoryChanged ? 1 : 0) + (activePriceChanged ? 1 : 0);

  return (
    <div className="py-8">
      <div className="container">
        {/* Collection Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{collectionName}</h1>
          <p className="text-gray-600">
            {collectionDescription}
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          {/* Filter Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors relative ${showFilters
                ? 'bg-gray-900 text-white border-gray-900 hover:bg-black'
                : 'border-gray-300 hover:border-gray-400 text-gray-900'
                }`}
            >
              <span className="relative flex w-4 h-4">
                {/* Filter icon */}
                <svg
                  className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${showFilters ? 'opacity-0 scale-75 rotate-45' : 'opacity-100 scale-100 rotate-0'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${showFilters ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-45'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && canResetFilters && (
              <button
                onClick={handleFilterReset}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <label htmlFor="sortBy" className="text-sm text-gray-600 mr-2">Sort by:</label>
              <select
                id="sortBy"
                value={localFilters.sortBy}
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

        {/* Filter Panel */}
        <div
          className={`transition-[max-height,opacity] duration-300 ease-out ${showFilters ? 'opacity-100 mt-2 mb-6' : 'opacity-0 pointer-events-none'}`}
          style={{ maxHeight: showFilters ? filterPanelHeight : 0 }}
        >
          <div ref={filterPanelContentRef} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              {/* If canResetFilters is false (slug pages), don't show category filter */}
              {canResetFilters && (
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                    {isLoading && (
                      <span className="ml-2 inline-block">
                        <svg className="animate-spin h-4 w-4 text-blue-600 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    )}
                  </label>
                  <select
                    id="category"
                    value={localFilters.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    disabled={isLoading}
                    className={`w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (PKR)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id="minPrice"
                    type="number"
                    placeholder="Min"
                    aria-label="Minimum price"
                    value={localFilters.minPrice}
                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    id="maxPrice"
                    type="number"
                    placeholder="Max"
                    aria-label="Maximum price"
                    value={localFilters.maxPrice}
                    onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{products.length}</span> of {totalProducts} products
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your filters.</p>
              {
                // Only offer "Clear all filters" if canResetFilters is true and there is a filter to clear.
                activeFilterCount > 0 && canResetFilters && (
                  <button
                    onClick={handleFilterReset}
                    className="mt-4 text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear all filters
                  </button>
                )
              }
            </div>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={onLoadMore}
              disabled={isLoadMoreLoading}
              className={`btn-secondary ${isLoadMoreLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoadMoreLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Load More Products'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
