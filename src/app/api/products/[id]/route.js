import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authMiddleware';
import { connectToDb } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { successResponse, errorResponse } from '@/utils/responses';

// GET product by ID
export async function GET(request, { params }) {
  try {
    // Handle params - can be sync (Next.js 14) or async (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(errorResponse('Product ID is required', 400), { status: 400 });
    }

    await connectToDb();

    const product = await Product.findById(id).populate('category', 'name slug');

    if (!product) {
      return NextResponse.json(errorResponse('Product not found', 404), { status: 404 });
    }

    return NextResponse.json(
      successResponse('Product fetched successfully', product, 200),
      { status: 200 }
    );
  } catch (err) {
    const message = err?.message || 'Failed to fetch product';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
};

// PUT update product by ID
export const PUT = requireAdmin(async (request, { params }) => {
  try {
    // Handle params - can be sync (Next.js 14) or async (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(errorResponse('Product ID is required', 400), { status: 400 });
    }

    const body = await request.json();
    const { name, description, category, variants, status, featured, tags } = body || {};

    await connectToDb();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(errorResponse('Product not found', 404), { status: 404 });
    }

    // Verify category exists if being updated
    if (category && category !== product.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return NextResponse.json(errorResponse('Category not found', 404), { status: 404 });
      }
      product.category = category;
    }

    // Check for duplicate SKUs if variants are being updated
    if (variants && variants.length > 0) {
      // Validate all variants have required fields
      for (const variant of variants) {
        if (!variant.color || !variant.size || variant.price === undefined || variant.quantity === undefined || !variant.sku) {
          return NextResponse.json(
            errorResponse('Each variant must have color, size, price, quantity, and SKU', 422),
            { status: 422 }
          );
        }
      }

      const skus = variants.map(v => v.sku);
      const duplicateSkus = await Product.find({
        _id: { $ne: id },
        'variants.sku': { $in: skus }
      });

      if (duplicateSkus.length > 0) {
        return NextResponse.json(
          errorResponse('One or more SKUs already exist', 409),
          { status: 409 }
        );
      }

      product.variants = variants;
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (status !== undefined) product.status = status;
    if (featured !== undefined) product.featured = featured;
    if (tags !== undefined) product.tags = tags;

    await product.save();
    await product.populate('category', 'name slug');

    return NextResponse.json(
      successResponse('Product updated successfully', product, 200),
      { status: 200 }
    );
  } catch (err) {
    const message = err?.message || 'Failed to update product';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

// DELETE product by ID
export const DELETE = requireAdmin(async (request, { params }) => {
  try {
    // Handle params - can be sync (Next.js 14) or async (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(errorResponse('Product ID is required', 400), { status: 400 });
    }

    await connectToDb();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(errorResponse('Product not found', 404), { status: 404 });
    }

    await product.deleteOne();

    return NextResponse.json(
      successResponse('Product deleted successfully', null, 200),
      { status: 200 }
    );
  } catch (err) {
    const message = err?.message || 'Failed to delete product';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});
