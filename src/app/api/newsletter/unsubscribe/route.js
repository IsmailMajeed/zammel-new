import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import NewsletterSubscriber from '@/models/NewsletterSubscriber';
import { successResponse, errorResponse } from '@/utils/responses';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        errorResponse('Unsubscribe token is required', 400),
        { status: 400 }
      );
    }

    try {
      // Decode JWT token to get email
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      const email = decoded.email;

      if (!email) {
        return NextResponse.json(
          errorResponse('Invalid unsubscribe token', 400),
          { status: 400 }
        );
      }

      await connectToDb();

      // Find subscriber and unsubscribe
      const subscriber = await NewsletterSubscriber.findOne({
        email: email.toLowerCase()
      });

      if (!subscriber) {
        return NextResponse.json(
          errorResponse('Subscriber not found', 404),
          { status: 404 }
        );
      }

      if (!subscriber.isActive) {
        return NextResponse.json(
          errorResponse('You are already unsubscribed from our newsletter', 400),
          { status: 400 }
        );
      }

      // Unsubscribe
      subscriber.isActive = false;
      subscriber.unsubscribedAt = new Date();
      await subscriber.save();

      // Return success page HTML
      const successHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Unsubscribed Successfully</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background-color: #f4f4f4;
              }
              .container {
                background-color: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 500px;
              }
              .success-icon {
                width: 64px;
                height: 64px;
                background-color: #d1fae5;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
              }
              h1 {
                color: #065f46;
                margin-bottom: 10px;
              }
              p {
                color: #4b5563;
                line-height: 1.6;
              }
              .button {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 24px;
                background-color: #1f2937;
                color: white;
                text-decoration: none;
                border-radius: 6px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success-icon">
                <svg width="32" height="32" fill="none" stroke="#065f46" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1>Successfully Unsubscribed</h1>
              <p>You have been unsubscribed from our newsletter.</p>
              <p>We're sorry to see you go. If you change your mind, you can always subscribe again.</p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://zammel.store'}" class="button">
                Visit Our Store
              </a>
            </div>
          </body>
        </html>
      `;

      return new Response(successHtml, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } catch (jwtError) {
      return NextResponse.json(
        errorResponse('Invalid or expired unsubscribe token', 400),
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('Unsubscribe error:', err);
    const message = err?.message || 'Failed to unsubscribe';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

