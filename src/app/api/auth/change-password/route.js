import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDb } from '@/lib/mongodb';
import User from '@/models/User';
import { successResponse, errorResponse } from '@/utils/responses';

function getUserIdFromAuthHeader(request) {
  const auth = request.headers.get('authorization');
  if (!auth) return null;
  const token = auth.replace('Bearer ', '').trim();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    return decoded?.sub || null;
  } catch (_) {
    return null;
  }
}

export async function POST(request) {
  try {
    const userId = getUserIdFromAuthHeader(request);
    if (!userId) {
      return NextResponse.json(errorResponse('Unauthorized', 401), { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body || {};
    if (!currentPassword || !newPassword) {
      return NextResponse.json(errorResponse('Current and new password are required', 422), { status: 422 });
    }

    await connectToDb();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(errorResponse('User not found', 404), { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json(errorResponse('Current password is incorrect', 400), { status: 400 });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json(successResponse('Password changed', null, 200), { status: 200 });
  } catch (err) {
    const message = err?.message || 'Change password failed';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}


