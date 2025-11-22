import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { successResponse, errorResponse } from '@/utils/responses';
import jwt from 'jsonwebtoken';

// Helper function to extract user ID from JWT token
function getUserIdFromAuthHeader(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev_secret'
    );

    if (decoded && decoded.sub && !decoded.isAdmin) {
      return decoded.sub;
    }

    return null;
  } catch (error) {
    return null;
  }
}

// GET notification by ID
export async function GET(request, { params }) {
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

    const userId = getUserIdFromAuthHeader(request);
    if (!userId) {
      return NextResponse.json(
        errorResponse('Unauthorized', 401),
        { status: 401 }
      );
    }

    const notification = await Notification.findOne({ _id: id, user: userId });

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
    console.error('Error fetching notification:', err);
    const message = err?.message || 'Failed to fetch notification';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

// PATCH mark notification as read/unread
export async function PATCH(request, { params }) {
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

    const userId = getUserIdFromAuthHeader(request);
    if (!userId) {
      return NextResponse.json(
        errorResponse('Unauthorized', 401),
        { status: 401 }
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
      { _id: id, user: userId },
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
    console.error('Error updating notification:', err);
    const message = err?.message || 'Failed to update notification';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

// DELETE notification
export async function DELETE(request, { params }) {
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

    const userId = getUserIdFromAuthHeader(request);
    if (!userId) {
      return NextResponse.json(
        errorResponse('Unauthorized', 401),
        { status: 401 }
      );
    }

    const notification = await Notification.findOneAndDelete({ _id: id, user: userId });

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
    console.error('Error deleting notification:', err);
    const message = err?.message || 'Failed to delete notification';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

