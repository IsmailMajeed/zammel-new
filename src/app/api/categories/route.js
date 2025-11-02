import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authMiddleware';
import { connectToDb } from '@/lib/mongodb';
import Category from '@/models/Category';
import { successResponse, errorResponse } from '@/utils/responses';

// GET all categories
export async function GET(request) {
  try {
    await connectToDb();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const parentId = searchParams.get('parent');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (parentId) {
      query.parent = parentId === 'null' ? null : parentId;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }

    const categories = await Category.find(query)
      .populate('parent', 'name slug')
      .sort({ order: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments(query);

    return NextResponse.json(
      successResponse('Categories fetched successfully', {
        categories,
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
    const message = err?.message || 'Failed to fetch categories';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

// POST create new category
export const POST = requireAdmin(async (request) => {
  try {
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

    if (!name) {
      return NextResponse.json(errorResponse('Category name is required', 422), { status: 422 });
    }

    await connectToDb();

    // Check if category with same name exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json(errorResponse('Category with this name already exists', 409), { status: 409 });
    }

    // Parse order as number, default to 0 if invalid
    const orderNum = order !== undefined && order !== null && order !== ''
      ? parseInt(order, 10)
      : 0;

    // Validate order is a number
    const finalOrder = isNaN(orderNum) ? 0 : orderNum;

    // Generate slug from name
    const generateSlug = (categoryName) => {
      return categoryName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    const trimmedName = name.trim();
    const generatedSlug = generateSlug(trimmedName);

    // Check if slug already exists
    const existingSlug = await Category.findOne({ slug: generatedSlug });
    if (existingSlug) {
      return NextResponse.json(
        errorResponse('A category with a similar name already exists', 409),
        { status: 409 }
      );
    }

    const category = await Category.create({
      name: trimmedName,
      slug: generatedSlug,
      description: description?.trim() || undefined,
      image: image || undefined,
      status: status || 'active',
      parent: parent || null,
      order: finalOrder
    });

    return NextResponse.json(
      successResponse('Category created successfully', category, 201),
      { status: 201 }
    );
  } catch (err) {
    console.error('Category creation error:', err);
    const message = err?.message || 'Failed to create category';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});
