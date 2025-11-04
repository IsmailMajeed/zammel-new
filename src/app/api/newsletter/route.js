import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authMiddleware';
import { connectToDb } from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';
import NewsletterSubscriber from '@/models/NewsletterSubscriber';
import { sendOrderEmail } from '@/utils/sendOrderEmail';
import { successResponse, errorResponse } from '@/utils/responses';
import jwt from 'jsonwebtoken';
import BRAND from '@/utils/brandConstants';

// POST create new newsletter
export const POST = requireAdmin(async (request) => {
  try {
    const body = await request.json();
    const { title, content, subject } = body || {};

    if (!title || !content || !subject) {
      return NextResponse.json(
        errorResponse('Title, content, and subject are required', 422),
        { status: 422 }
      );
    }

    await connectToDb();

    // Get admin user ID from request (set by requireAdmin middleware)
    const adminId = request.user?.id || null;

    const newsletter = await Newsletter.create({
      title,
      content,
      subject,
      status: 'draft',
      createdBy: adminId
    });

    return NextResponse.json(
      successResponse('Newsletter created successfully', { newsletter }, 201),
      { status: 201 }
    );
  } catch (err) {
    console.error('Newsletter creation error:', err);
    const message = err?.message || 'Failed to create newsletter';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

// PUT send newsletter
export const PUT = requireAdmin(async (request) => {
  try {
    const body = await request.json();
    const { newsletterId } = body || {};

    if (!newsletterId) {
      return NextResponse.json(
        errorResponse('Newsletter ID is required', 422),
        { status: 422 }
      );
    }

    await connectToDb();

    const newsletter = await Newsletter.findById(newsletterId);
    if (!newsletter) {
      return NextResponse.json(
        errorResponse('Newsletter not found', 404),
        { status: 404 }
      );
    }

    // Get all active subscribers
    const subscribers = await NewsletterSubscriber.find({ isActive: true })
      .select('email')
      .lean();

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        errorResponse('No active subscribers found', 400),
        { status: 400 }
      );
    }

    // Generate unsubscribe tokens for each subscriber
    const unsubscribeTokens = subscribers.map(subscriber => {
      const token = jwt.sign(
        { email: subscriber.email },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: '365d' } // Valid for 1 year
      );
      return { email: subscriber.email, token };
    });

    // Create email HTML with unsubscribe link
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://zammel.store').replace(/\/$/, '');

    let sentCount = 0;
    let failedCount = 0;

    // Send newsletter to all subscribers
    for (const { email, token } of unsubscribeTokens) {
      try {
        const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${token}`;

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: white;
                }
                .header {
                  background-color: #1f2937;
                  color: white;
                  padding: 30px;
                  text-align: center;
                }
                .header h1 {
                  margin: 0;
                  font-size: 24px;
                }
                .content {
                  padding: 30px;
                }
                .newsletter-content {
                  margin: 20px 0;
                }
                .footer {
                  background-color: #f9fafb;
                  padding: 20px;
                  text-align: center;
                  border-top: 1px solid #e5e7eb;
                  font-size: 12px;
                  color: #6b7280;
                }
                .unsubscribe-link {
                  color: #6b7280;
                  text-decoration: underline;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>${BRAND.name}</h1>
                </div>
                <div class="content">
                  <h2 style="color: #1f2937; margin-top: 0;">${newsletter.subject}</h2>
                  <div class="newsletter-content">
                    ${newsletter.content.replace(/\n/g, '<br>')}
                  </div>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
                  <p style="margin-top: 10px;">
                    <a href="${unsubscribeUrl}" class="unsubscribe-link">Unsubscribe from this newsletter</a>
                  </p>
                </div>
              </div>
            </body>
          </html>
        `;

        await sendOrderEmail(
          email,
          newsletter.subject,
          emailHtml
        );

        sentCount++;
      } catch (emailError) {
        console.error(`Failed to send newsletter to ${email}:`, emailError);
        failedCount++;
      }
    }

    // Update newsletter status
    newsletter.status = 'sent';
    newsletter.sentAt = new Date();
    newsletter.recipientsCount = sentCount;
    await newsletter.save();

    return NextResponse.json(
      successResponse('Newsletter sent successfully', {
        newsletter,
        sentCount,
        failedCount,
        totalSubscribers: subscribers.length
      }, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Newsletter sending error:', err);
    const message = err?.message || 'Failed to send newsletter';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

// GET all newsletters
export const GET = requireAdmin(async (request) => {
  try {
    await connectToDb();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const newsletters = await Newsletter.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Newsletter.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      successResponse('Newsletters fetched successfully', {
        newsletters,
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
    const message = err?.message || 'Failed to fetch newsletters';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

