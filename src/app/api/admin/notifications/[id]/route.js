import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { successResponse, errorResponse } from '@/utils/responses';
import { requireAdmin, verifyAdminToken } from '@/lib/authMiddleware';

// GET admin notification by ID
export const GET = requireAdmin(async (request, { params }) => {
  try {
    await connectToDb();

    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        errorResponse('Notification ID is required', 400),
        { status: 400 }
      );
    }

    const notification = await Notification.findOne({ _id: id, isAdmin: true });

    if (!notification) {
      return NextResponse.json(
        errorResponse('Notification not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(
      successResponse('Notification fetched successfully', { notification }, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching admin notification:', err);
    const message = err?.message || 'Failed to fetch notification';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

// PATCH mark admin notification as read/unread
export const PATCH = requireAdmin(async (request, { params }) => {
  try {
    await connectToDb();

    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        errorResponse('Notification ID is required', 400),
        { status: 400 }
      );
    }

    const body = await request.json();
    const { read } = body;

    const updateData = { read };
    if (read) {
      updateData.readAt = new Date();
    } else {
      updateData.readAt = null;
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, isAdmin: true },
      updateData,
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        errorResponse('Notification not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(
      successResponse('Notification updated successfully', { notification }, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating admin notification:', err);
    const message = err?.message || 'Failed to update notification';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

// DELETE admin notification
export const DELETE = requireAdmin(async (request, { params }) => {
  try {
    await connectToDb();

    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        errorResponse('Notification ID is required', 400),
        { status: 400 }
      );
    }

    const notification = await Notification.findOneAndDelete({ _id: id, isAdmin: true });

    if (!notification) {
      return NextResponse.json(
        errorResponse('Notification not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(
      successResponse('Notification deleted successfully', {}, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error deleting admin notification:', err);
    const message = err?.message || 'Failed to delete notification';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

