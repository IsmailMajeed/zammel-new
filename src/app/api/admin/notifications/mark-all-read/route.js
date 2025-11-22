import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { successResponse, errorResponse } from '@/utils/responses';
import { requireAdmin } from '@/lib/authMiddleware';

// POST mark all admin notifications as read
export const POST = requireAdmin(async (request) => {
  try {
    await connectToDb();

    const result = await Notification.updateMany(
      { isAdmin: true, read: false },
      {
        read: true,
        readAt: new Date()
      }
    );

    return NextResponse.json(
      successResponse('All admin notifications marked as read', {
        updatedCount: result.modifiedCount
      }, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error marking admin notifications as read:', err);
    const message = err?.message || 'Failed to mark notifications as read';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

