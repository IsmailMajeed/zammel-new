import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/sendEmail';
import { successResponse, errorResponse } from '@/utils/responses';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body || {};

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        errorResponse('Name, email, subject, and message are required', 422),
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

    // Create HTML email template
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #1f2937;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 5px;
              display: block;
            }
            .value {
              color: #4b5563;
              padding: 10px;
              background-color: #f3f4f6;
              border-radius: 4px;
            }
            .message-box {
              padding: 15px;
              background-color: #f3f4f6;
              border-radius: 4px;
              border-left: 4px solid #1f2937;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <span class="label">Email:</span>
                <div class="value">${email}</div>
              </div>
              
              ${phone ? `
              <div class="field">
                <span class="label">Phone:</span>
                <div class="value">${phone}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <span class="label">Subject:</span>
                <div class="value">${subject}</div>
              </div>
              
              <div class="field">
                <span class="label">Message:</span>
                <div class="message-box">${message}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    await sendEmail(name, email, `Contact Form: ${subject}`, html);

    return NextResponse.json(
      successResponse('Message sent successfully. We will get back to you soon!', null, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Contact form error:', err);
    const message = err?.message || 'Failed to send message. Please try again later.';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

