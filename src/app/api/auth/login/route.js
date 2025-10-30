import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDb } from '@/lib/mongodb';
import User from '@/models/User';
import { successResponse, errorResponse } from '@/utils/responses';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(errorResponse('Email and password are required', 422), { status: 422 });
    }

    await connectToDb();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(errorResponse('Invalid credentials', 401), { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(errorResponse('Invalid credentials', 401), { status: 401 });
    }

    // Block admins from logging in via customer login route
    if (user.isAdmin) {
      return NextResponse.json(errorResponse('Admins must use admin login', 403), { status: 403 });
    }

    const token = jwt.sign({ sub: user._id.toString(), email: user.email, isAdmin: false }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: false,
      isFirstLogin: user.isFirstLogin,
    };

    return NextResponse.json(
      successResponse('Logged in', { token, user: safeUser }, 200),
      { status: 200 }
    );
  } catch (err) {
    const message = err?.message || 'Login failed';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}


