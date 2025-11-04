import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authMiddleware';
import { connectToDb } from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';
import { successResponse, errorResponse } from '@/utils/responses';

// DELETE newsletter by ID
export const DELETE = requireAdmin(async (request, { params }) => {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        errorResponse('Newsletter ID is required', 400),
        { status: 400 }
      );
    }

    await connectToDb();

    const newsletter = await Newsletter.findById(id);

    if (!newsletter) {
      return NextResponse.json(
        errorResponse('Newsletter not found', 404),
        { status: 404 }
      );
    }

    await Newsletter.findByIdAndDelete(id);

    return NextResponse.json(
      successResponse('Newsletter deleted successfully', null, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Newsletter deletion error:', err);
    const message = err?.message || 'Failed to delete newsletter';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

