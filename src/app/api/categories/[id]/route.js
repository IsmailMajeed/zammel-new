import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { successResponse, errorResponse } from '@/utils/responses';

// GET category by ID
export async function GET(request, { params }) {
  try {
    // Handle params - can be sync (Next.js 14) or async (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      console.error('Missing category ID in params:', resolvedParams);
      return NextResponse.json(errorResponse('Category ID is required', 400), { status: 400 });
    }

    await connectToDb();

    if (!id) {
      return NextResponse.json(errorResponse('Category ID is required', 400), { status: 400 });
    }

    const category = await Category.findById(id).populate('parent', 'name slug');

    if (!category) {
      return NextResponse.json(errorResponse('Category not found', 404), { status: 404 });
    }

    return NextResponse.json(
      successResponse('Category fetched successfully', category, 200),
      { status: 200 }
    );
  } catch (err) {
    const message = err?.message || 'Failed to fetch category';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

// PUT update category by ID
export async function PUT(request, { params }) {
  try {
    // Handle params - can be sync (Next.js 14) or async (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      console.error('Missing category ID in params:', resolvedParams);
      return NextResponse.json(errorResponse('Category ID is required', 400), { status: 400 });
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        errorResponse('Invalid JSON in request body: ' + parseError.message, 400),
        { status: 400 }
      );
    }

    const { name, description, image, status, parent, order } = body || {};

    await connectToDb();

    if (!id) {
      return NextResponse.json(errorResponse('Category ID is required', 400), { status: 400 });
    }

    const category = await Category.findById(id);

    if (!category) {
      console.error('Category not found with ID:', id);
      return NextResponse.json(errorResponse('Category not found', 404), { status: 404 });
    }

    // Generate slug helper function
    const generateSlug = (categoryName) => {
      return categoryName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    // Check if name is being changed and if it already exists
    if (name && name !== category.name) {
      const trimmedName = name.trim();
      const existingCategory = await Category.findOne({ name: trimmedName });
      if (existingCategory) {
        return NextResponse.json(errorResponse('Category with this name already exists', 409), { status: 409 });
      }
      category.name = trimmedName;
      // Regenerate slug when name changes
      category.slug = generateSlug(trimmedName);

      // Check if new slug already exists
      const existingSlug = await Category.findOne({ slug: category.slug, _id: { $ne: id } });
      if (existingSlug) {
        return NextResponse.json(errorResponse('A category with a similar name already exists', 409), { status: 409 });
      }
    }

    if (description !== undefined) category.description = description?.trim() || undefined;
    if (image !== undefined) category.image = image || undefined;
    if (status !== undefined) category.status = status;
    if (parent !== undefined) category.parent = parent || null;
    if (order !== undefined) {
      // Parse order as number, default to 0 if invalid
      const orderNum = order !== null && order !== ''
        ? parseInt(order, 10)
        : 0;
      category.order = isNaN(orderNum) ? 0 : orderNum;
    }

    await category.save();

    return NextResponse.json(
      successResponse('Category updated successfully', category, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Category update error:', err);
    const message = err?.message || 'Failed to update category';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

// DELETE category by ID
export async function DELETE(request, { params }) {
  try {
    // Handle params - can be sync (Next.js 14) or async (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      console.error('Missing category ID in params:', resolvedParams);
      return NextResponse.json(errorResponse('Category ID is required', 400), { status: 400 });
    }

    await connectToDb();

    if (!id) {
      return NextResponse.json(errorResponse('Category ID is required', 400), { status: 400 });
    }

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(errorResponse('Category not found', 404), { status: 404 });
    }

    // Check if category has products
    const productsCount = await Product.countDocuments({ category: id });

    if (productsCount > 0) {
      return NextResponse.json(
        errorResponse(`Cannot delete category. It has ${productsCount} products associated with it.`, 400),
        { status: 400 }
      );
    }

    // Check if category has subcategories
    const subcategoriesCount = await Category.countDocuments({ parent: id });

    if (subcategoriesCount > 0) {
      return NextResponse.json(
        errorResponse(`Cannot delete category. It has ${subcategoriesCount} subcategories.`, 400),
        { status: 400 }
      );
    }

    await category.deleteOne();

    return NextResponse.json(
      successResponse('Category deleted successfully', null, 200),
      { status: 200 }
    );
  } catch (err) {
    const message = err?.message || 'Failed to delete category';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}
