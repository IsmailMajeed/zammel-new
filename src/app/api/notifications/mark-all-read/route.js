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

// POST mark all notifications as read
export async function POST(request) {
  try {
    await connectToDb();

    const userId = getUserIdFromAuthHeader(request);
    if (!userId) {
      return NextResponse.json(
        errorResponse('Unauthorized', 401),
        { status: 401 }
      );
    }

    const result = await Notification.updateMany(
      { user: userId, read: false },
      {
        read: true,
        readAt: new Date()
      }
    );

    return NextResponse.json(
      successResponse('All notifications marked as read', {
        updatedCount: result.modifiedCount
      }, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error marking notifications as read:', err);
    const message = err?.message || 'Failed to mark notifications as read';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

