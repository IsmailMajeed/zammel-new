import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import NewsletterSubscriber from '@/models/NewsletterSubscriber';
import { successResponse, errorResponse } from '@/utils/responses';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body || {};

    // Validation
    if (!email) {
      return NextResponse.json(
        errorResponse('Email address is required', 422),
        { status: 422 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        errorResponse('Please provide a valid email address', 422),
        { status: 422 }
      );
    }

    await connectToDb();

    // Check if email already exists
    const existingSubscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          errorResponse('This email is already subscribed to our newsletter', 409),
          { status: 409 }
        );
      } else {
        // Re-subscribe if previously unsubscribed
        existingSubscriber.isActive = true;
        existingSubscriber.unsubscribedAt = null;
        await existingSubscriber.save();

        return NextResponse.json(
          successResponse('Successfully re-subscribed to newsletter!', null, 200),
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    await NewsletterSubscriber.create({
      email: email.toLowerCase(),
      isActive: true
    });

    return NextResponse.json(
      successResponse('Successfully subscribed to newsletter!', null, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    const message = err?.message || 'Failed to subscribe to newsletter. Please try again later.';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

// GET all subscribers (Admin only)
export async function GET(request) {
  try {
    // Check if admin - import here to avoid circular dependency
    const { verifyAdminToken } = await import('@/lib/authMiddleware');
    const admin = verifyAdminToken(request);

    if (!admin) {
      return NextResponse.json(
        errorResponse('Unauthorized. Admin access required.', 401),
        { status: 401 }
      );
    }

    await connectToDb();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'active' or 'all'
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;

    let query = {};
    if (status === 'active') {
      query.isActive = true;
    }

    const subscribers = await NewsletterSubscriber.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await NewsletterSubscriber.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      successResponse('Subscribers fetched successfully', {
        subscribers,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit
        }
      }, 200),
      { status: 200 }
    );
  } catch (err) {
    const message = err?.message || 'Failed to fetch subscribers';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

