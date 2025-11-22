import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { successResponse, errorResponse } from '@/utils/responses';
import { requireAdmin, verifyAdminToken } from '@/lib/authMiddleware';

// GET all admin notifications
export const GET = requireAdmin(async (request) => {
  try {
    await connectToDb();

    const admin = verifyAdminToken(request);
    if (!admin) {
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

    // Build query - get all admin notifications (not user-specific)
    const query = { isAdmin: true };
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
    const unreadCount = await Notification.countDocuments({ isAdmin: true, read: false });

    return NextResponse.json(
      successResponse('Admin notifications fetched successfully', {
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
    console.error('Error fetching admin notifications:', err);
    const message = err?.message || 'Failed to fetch admin notifications';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

// POST create new admin notification (for system use)
export const POST = requireAdmin(async (request) => {
  try {
    await connectToDb();

    const body = await request.json();
    const { type, title, message, link, relatedId, relatedModel, metadata } = body;

    if (!type || !title || !message) {
      return NextResponse.json(
        errorResponse('Type, title, and message are required', 400),
        { status: 400 }
      );
    }

    // Get all admin users
    const User = (await import('@/models/User')).default;
    const adminUsers = await User.find({ isAdmin: true }).select('_id');

    if (adminUsers.length === 0) {
      return NextResponse.json(
        errorResponse('No admin users found', 404),
        { status: 404 }
      );
    }

    // Create notification for each admin
    const notifications = await Promise.all(
      adminUsers.map(admin =>
        Notification.create({
          user: admin._id,
          type,
          title,
          message,
          link,
          relatedId,
          relatedModel,
          metadata: metadata || {},
          isAdmin: true
        })
      )
    );

    return NextResponse.json(
      successResponse('Admin notifications created successfully', {
        notifications,
        count: notifications.length
      }, 201),
      { status: 201 }
    );
  } catch (err) {
    console.error('Error creating admin notification:', err);
    const message = err?.message || 'Failed to create admin notification';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

