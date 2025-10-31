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

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return NextResponse.json(
      successResponse('Products fetched successfully', {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
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
