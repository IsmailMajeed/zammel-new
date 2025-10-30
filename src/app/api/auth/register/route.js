import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDb } from '@/lib/mongodb';
import User from '@/models/User';
import { successResponse, errorResponse } from '@/utils/responses';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      return NextResponse.json(errorResponse('Name, email and password are required', 422), { status: 422 });
    }

    await connectToDb();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(errorResponse('Email already in use', 409), { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = jwt.sign({ sub: user._id.toString(), email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isFirstLogin: user.isFirstLogin,
    };

    return NextResponse.json(
      successResponse('Account created', { token, user: safeUser }, 201),
      { status: 201 }
    );
  } catch (err) {
    const message = err?.message || 'Registration failed';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}


