import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { successResponse, errorResponse } from '@/utils/responses';
import { requireAdmin } from '@/lib/authMiddleware';

// GET settings
export async function GET(request) {
  try {
    await connectToDb();

    const settings = await Settings.getSettings();

    return NextResponse.json(
      successResponse('Settings fetched successfully', { settings }, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Settings fetch error:', err);
    const message = err?.message || 'Failed to fetch settings';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

// PUT update settings (Admin only)
export const PUT = requireAdmin(async (request) => {
  try {
    await connectToDb();

    const body = await request.json();
    const { tax, shipping } = body;

    // Get existing settings or create default
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({
        tax: {
          enabled: true,
          type: 'percentage',
          value: 8,
          description: 'Sales Tax'
        },
        shipping: {
          enabled: true,
          type: 'fixed',
          value: 500,
          freeShippingAbove: 5000,
          description: 'Standard Shipping'
        }
      });
    }

    // Update tax settings if provided
    if (tax !== undefined) {
      if (tax.enabled !== undefined) settings.tax.enabled = tax.enabled;
      if (tax.type !== undefined) settings.tax.type = tax.type;
      if (tax.value !== undefined) {
        if (tax.value < 0) {
          return NextResponse.json(
            errorResponse('Tax value cannot be negative', 400),
            { status: 400 }
          );
        }
        settings.tax.value = tax.value;
      }
      if (tax.description !== undefined) settings.tax.description = tax.description;
    }

    // Update shipping settings if provided
    if (shipping !== undefined) {
      if (shipping.enabled !== undefined) settings.shipping.enabled = shipping.enabled;
      if (shipping.type !== undefined) settings.shipping.type = shipping.type;
      if (shipping.value !== undefined) {
        if (shipping.value < 0) {
          return NextResponse.json(
            errorResponse('Shipping value cannot be negative', 400),
            { status: 400 }
          );
        }
        settings.shipping.value = shipping.value;
      }
      if (shipping.freeShippingAbove !== undefined) {
        if (shipping.freeShippingAbove < 0) {
          return NextResponse.json(
            errorResponse('Free shipping threshold cannot be negative', 400),
            { status: 400 }
          );
        }
        settings.shipping.freeShippingAbove = shipping.freeShippingAbove;
      }
      if (shipping.description !== undefined) settings.shipping.description = shipping.description;
    }

    await settings.save();

    return NextResponse.json(
      successResponse('Settings updated successfully', { settings }, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Settings update error:', err);
    const message = err?.message || 'Failed to update settings';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

