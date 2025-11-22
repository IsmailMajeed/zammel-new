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

// GET all notifications for the authenticated user
export async function GET(request) {
  try {
    await connectToDb();

    const userId = getUserIdFromAuthHeader(request);
    if (!userId) {
      return NextResponse.json(
        errorResponse('Unauthorized', 401),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const read = searchParams.get('read'); // 'true', 'false', or null for all
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    const query = { user: userId };
    if (read === 'true') {
      query.read = true;
    } else if (read === 'false') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user: userId, read: false });

    return NextResponse.json(
      successResponse('Notifications fetched successfully', {
        notifications,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + notifications.length < total
        },
        unreadCount
      }, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching notifications:', err);
    const message = err?.message || 'Failed to fetch notifications';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

// POST create new notification (for admin/system use)
export async function POST(request) {
  try {
    await connectToDb();

    const body = await request.json();
    const { user, type, title, message, link, relatedId, relatedModel, metadata } = body;

    if (!user || !type || !title || !message) {
      return NextResponse.json(
        errorResponse('User, type, title, and message are required', 400),
        { status: 400 }
      );
    }

    const notification = await Notification.create({
      user,
      type,
      title,
      message,
      link,
      relatedId,
      relatedModel,
      metadata: metadata || {}
    });

    return NextResponse.json(
      successResponse('Notification created successfully', { notification }, 201),
      { status: 201 }
    );
  } catch (err) {
    console.error('Error creating notification:', err);
    const message = err?.message || 'Failed to create notification';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

