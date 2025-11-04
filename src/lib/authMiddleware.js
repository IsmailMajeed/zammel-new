import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { errorResponse } from '@/utils/responses';

/**
 * Middleware to verify JWT token and check if user is admin
 * @param {Request} request - The incoming request
 * @returns {Object|null} - Returns user info if valid, null otherwise
 */
export function verifyAdminToken(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev_secret'
    );

    // Check if user is admin
    if (!decoded.isAdmin) {
      return null;
    }

    return {
      userId: decoded.sub,
      email: decoded.email,
      isAdmin: true
    };
  } catch (error) {
    return null;
  }
}

/**
 * Middleware wrapper for admin-only API routes
 * @param {Function} handler - The route handler function
 * @returns {Function} - Wrapped handler with admin authentication
 */
export function requireAdmin(handler) {
  return async (request, context) => {
    const admin = verifyAdminToken(request);

    if (!admin) {
      return NextResponse.json(
        errorResponse('Unauthorized. Admin access required.', 401),
        { status: 401 }
      );
    }

    // Attach admin info to request for use in handler
    request.admin = admin;
    request.user = {
      id: admin.userId,
      email: admin.email,
      isAdmin: true
    };

    return handler(request, context);
  };
}

