import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { successResponse, errorResponse } from '@/utils/responses';

// GET all products
export async function GET(request) {
  try {
    await connectToDb();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'created-descending';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (featured !== null && featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object based on sortBy parameter
    let sortObject = {};
    switch (sortBy) {
      case 'featured':
        sortObject = { featured: -1, createdAt: -1 };
        break;
      case 'title-ascending':
        sortObject = { name: 1 };
        break;
      case 'title-descending':
        sortObject = { name: -1 };
        break;
      case 'price-ascending':
        // Will sort by minimum variant price
        sortObject = { createdAt: -1 }; // Default, will sort after fetching
        break;
      case 'price-descending':
        // Will sort by maximum variant price
        sortObject = { createdAt: -1 }; // Default, will sort after fetching
        break;
      case 'created-ascending':
        sortObject = { createdAt: 1 };
        break;
      case 'created-descending':
      default:
        sortObject = { createdAt: -1 };
        break;
    }

    let products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortObject)
      .skip(skip)
      .limit(limit * 2); // Fetch more to handle price filtering

    // Filter by price range if provided
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) * 100 : 0; // Convert PKR to paisa
      const max = maxPrice ? parseFloat(maxPrice) * 100 : Infinity;

      products = products.filter(product => {
        // Get minimum price from all variants
        const prices = product.variants?.map(v => {
          const variantPrice = (v.price || 0) * 100; // Convert PKR to paisa
          const discount = v.discount || 0;
          const finalPrice = discount > 0
            ? variantPrice * (1 - discount / 100)
            : variantPrice;
          return finalPrice;
        }) || [];

        if (prices.length === 0) return false;
        const minProductPrice = Math.min(...prices);
        return minProductPrice >= min && minProductPrice <= max;
      });
    }

    // Sort by price if needed (after filtering)
    if (sortBy === 'price-ascending' || sortBy === 'price-descending') {
      products.sort((a, b) => {
        const getMinPrice = (product) => {
          const prices = product.variants?.map(v => {
            const variantPrice = (v.price || 0) * 100;
            const discount = v.discount || 0;
            return discount > 0 ? variantPrice * (1 - discount / 100) : variantPrice;
          }) || [];
          return prices.length > 0 ? Math.min(...prices) : 0;
        };

        const priceA = getMinPrice(a);
        const priceB = getMinPrice(b);

        return sortBy === 'price-ascending' ? priceA - priceB : priceB - priceA;
      });
    }

    // Limit to requested number after filtering/sorting
    products = products.slice(0, limit);

    // Count total matching products (before price filter)
    let totalQuery = { ...query };
    let totalProducts = await Product.find(totalQuery);

    // Apply price filter to count if needed
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) * 100 : 0;
      const max = maxPrice ? parseFloat(maxPrice) * 100 : Infinity;

      totalProducts = totalProducts.filter(product => {
        const prices = product.variants?.map(v => {
          const variantPrice = (v.price || 0) * 100;
          const discount = v.discount || 0;
          const finalPrice = discount > 0
            ? variantPrice * (1 - discount / 100)
            : variantPrice;
          return finalPrice;
        }) || [];

        if (prices.length === 0) return false;
        const minProductPrice = Math.min(...prices);
        return minProductPrice >= min && minProductPrice <= max;
      });
    }

    const total = totalProducts.length;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json(
      successResponse('Products fetched successfully', {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasMore
        }
      }, 200),
      { status: 200 }
    );
  } catch (err) {
    const message = err?.message || 'Failed to fetch products';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

// POST create new product
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, category, variants, status, featured, tags } = body || {};

    if (!name || !description || !category) {
      return NextResponse.json(
        errorResponse('Name, description, and category are required', 422),
        { status: 422 }
      );
    }

    if (!variants || variants.length === 0) {
      return NextResponse.json(
        errorResponse('At least one variant is required', 422),
        { status: 422 }
      );
    }

    // Validate all variants have required fields
    for (const variant of variants) {
      if (!variant.color || !variant.size || variant.price === undefined || variant.quantity === undefined || !variant.sku) {
        return NextResponse.json(
          errorResponse('Each variant must have color, size, price, quantity, and SKU', 422),
          { status: 422 }
        );
      }
    }

    await connectToDb();

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json(errorResponse('Category not found', 404), { status: 404 });
    }

    // Check for duplicate SKUs
    const skus = variants.map(v => v.sku);
    const duplicateSkus = await Product.find({
      'variants.sku': { $in: skus }
    });

    if (duplicateSkus.length > 0) {
      return NextResponse.json(
        errorResponse('One or more SKUs already exist', 409),
        { status: 409 }
      );
    }

    const product = await Product.create({
      name,
      description,
      category,
      variants,
      status: status || 'active',
      featured: featured || false,
      tags: tags || []
    });

    await product.populate('category', 'name slug');

    return NextResponse.json(
      successResponse('Product created successfully', product, 201),
      { status: 201 }
    );
  } catch (err) {
    const message = err?.message || 'Failed to create product';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}
