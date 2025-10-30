import { NextResponse } from 'next/server';
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
    const { name } = body || {};

    await connectToDb();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(errorResponse('User not found', 404), { status: 404 });
    }

    if (typeof name === 'string' && name.trim()) {
      user.name = name.trim();
    }
    if (user.isFirstLogin) user.isFirstLogin = false;
    await user.save();

    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isFirstLogin: user.isFirstLogin,
    };

    return NextResponse.json(successResponse('Account updated', { user: safeUser }, 200), { status: 200 });
  } catch (err) {
    const message = err?.message || 'Set account failed';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}


