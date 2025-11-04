import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User'; // Import User model to ensure it's registered
import { successResponse, errorResponse } from '@/utils/responses';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Helper function to extract user ID from JWT token in authorization header
function getUserIdFromAuthHeader(request) {
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

    // Return user ID if token is valid and user is not admin (regular customer)
    if (decoded && decoded.sub && !decoded.isAdmin) {
      return decoded.sub;
    }

    return null;
  } catch (error) {
    return null;
  }
}

// Helper function to get variant by color and size (since we're in API route)
function getVariantByColorAndSize(product, color, size) {
  if (!product?.variants) return null;
  return product.variants.find(
    v => v.color?.toLowerCase() === color?.toLowerCase() &&
      v.size === size
  ) || product.variants[0];
}

// POST create new order
export async function POST(request) {
  try {
    await connectToDb();

    const body = await request.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      userId: bodyUserId = null
    } = body;

    // Automatically extract user ID from JWT token if user is logged in
    // This ensures logged-in users are always associated with their orders
    const tokenUserId = getUserIdFromAuthHeader(request);
    const userId = tokenUserId || bodyUserId; // Prioritize token-extracted user ID for security

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        errorResponse('Order must have at least one item', 400),
        { status: 400 }
      );
    }

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        errorResponse('Shipping address and payment method are required', 400),
        { status: 400 }
      );
    }

    // Validate and check stock for each item
    const stockIssues = [];
    const validatedItems = [];

    for (const item of items) {
      const { productId, quantity, variant } = item;

      if (!productId || !quantity || !variant) {
        stockIssues.push({
          productName: item.productName || 'Unknown Product',
          issue: 'missing_data',
          message: 'Missing product ID, quantity, or variant information'
        });
        continue;
      }

      // Fetch product from database
      const product = await Product.findById(productId);
      if (!product) {
        stockIssues.push({
          productName: item.productName || 'Unknown Product',
          issue: 'not_found',
          message: 'Product not found'
        });
        continue;
      }

      // Find the specific variant
      const productVariant = getVariantByColorAndSize(
        product,
        variant.color,
        variant.size
      );

      if (!productVariant) {
        stockIssues.push({
          productName: item.productName || product.name,
          issue: 'variant_not_found',
          message: `Variant with color "${variant.color}" and size "${variant.size}" not found`
        });
        continue;
      }

      // Check stock availability
      const availableStock = productVariant.quantity || 0;
      if (availableStock <= 0) {
        stockIssues.push({
          productName: item.productName || product.name,
          variant: variant,
          issue: 'out_of_stock',
          message: 'This item is out of stock'
        });
        continue;
      }

      if (quantity > availableStock) {
        stockIssues.push({
          productName: item.productName || product.name,
          variant: variant,
          issue: 'insufficient_stock',
          availableStock,
          requestedQuantity: quantity,
          message: `Only ${availableStock} item(s) available, but ${quantity} requested`
        });
        continue;
      }

      // Use price from frontend (already includes discount) if provided, otherwise use variant price
      // Frontend sends the correct discounted price, so we use that
      const itemPrice = item.price !== undefined ? item.price : productVariant.price;

      // Add validated item with price from frontend (discounted price)
      validatedItems.push({
        productId: product._id,
        productName: item.productName || product.name,
        variant: {
          color: variant.color,
          size: variant.size,
          sku: productVariant.sku
        },
        price: itemPrice, // Use price from frontend (includes discount), not variant price
        quantity: quantity,
        images: item.images || productVariant.images || []
      });
    }

    // If there are stock issues, return error
    if (stockIssues.length > 0) {
      return NextResponse.json(
        errorResponse(
          'Some items have stock issues',
          400,
          { stockIssues }
        ),
        { status: 400 }
      );
    }

    // Recalculate totals based on validated items
    const recalculatedSubtotal = Math.round(validatedItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    ));

    // Calculate tax based on provided taxDetails (already calculated on frontend)
    // Use provided tax value if available, otherwise calculate from taxDetails
    const providedTaxDetails = body.taxDetails;
    let recalculatedTax = body.tax || 0;

    // If taxDetails provided, we can recalculate for verification
    if (providedTaxDetails && providedTaxDetails.enabled) {
      if (providedTaxDetails.type === 'percentage') {
        recalculatedTax = Math.round((recalculatedSubtotal * providedTaxDetails.value) / 100);
      } else {
        recalculatedTax = Math.round(providedTaxDetails.value || 0);
      }
    }

    // Use provided shipping value (already calculated on frontend)
    const finalShipping = Math.round(shipping || 0);

    const recalculatedTotal = Math.round(recalculatedSubtotal + finalShipping + recalculatedTax - (discount || 0));

    // Generate unique order number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `ORD-${timestamp}-${random}`;

    // Get tax and shipping details from request body
    const taxDetails = body.taxDetails || {
      enabled: false,
      type: 'percentage',
      value: 0,
      description: 'Sales Tax'
    };

    const shippingDetails = body.shippingDetails || {
      enabled: false,
      type: 'fixed',
      value: 0,
      freeShippingAbove: 0,
      description: 'Standard Shipping'
    };

    // Start MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create order within transaction
      const order = await Order.create([{
        orderNumber,
        user: userId || null,
        items: validatedItems,
        shippingAddress,
        paymentMethod,
        subtotal: recalculatedSubtotal,
        shipping: finalShipping,
        tax: recalculatedTax,
        taxDetails: taxDetails,
        shippingDetails: shippingDetails,
        discount: discount || 0,
        total: recalculatedTotal,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        orderStatus: 'pending'
      }], { session });

      const createdOrder = order[0];

      // Update product stock within transaction
      for (const item of validatedItems) {
        const product = await Product.findById(item.productId).session(session);
        if (product) {
          const variant = getVariantByColorAndSize(
            product,
            item.variant.color,
            item.variant.size
          );

          if (variant) {
            variant.quantity = Math.max(0, variant.quantity - item.quantity);
            await product.save({ session });
          }
        }
      }

      // Commit transaction if all operations succeed
      await session.commitTransaction();

      // Use created order for further operations
      var finalOrder = createdOrder;
    } catch (transactionError) {
      // Rollback transaction on any error
      await session.abortTransaction();
      throw transactionError;
    } finally {
      // End session
      session.endSession();
    }

    // Get populated order for email (outside transaction)
    const populatedOrder = await Order.findById(finalOrder._id).populate('user', 'name email');

    // Send order confirmation email to customer
    try {
      const { sendOrderEmail } = await import('@/utils/sendOrderEmail');
      const { getOrderConfirmationEmail } = await import('@/utils/emailTemplates');

      const customerEmail = populatedOrder.shippingAddress?.email;
      if (customerEmail) {
        const emailHtml = getOrderConfirmationEmail(populatedOrder);
        await sendOrderEmail(
          customerEmail,
          `Order Confirmation - ${populatedOrder.orderNumber}`,
          emailHtml
        );
      }
    } catch (emailError) {
      // Log error but don't fail order creation
      console.error('Failed to send order confirmation email:', emailError);
    }

    return NextResponse.json(
      successResponse('Order created successfully', {
        order: populatedOrder
      }, 201),
      { status: 201 }
    );
  } catch (err) {
    console.error('Order creation error:', err);
    const message = err?.message || 'Failed to create order';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

// GET all orders (with filtering)
export async function GET(request) {
  try {
    await connectToDb();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderStatus = searchParams.get('orderStatus');
    const paymentStatus = searchParams.get('paymentStatus');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (userId) {
      query.user = userId;
    }

    if (orderStatus) {
      query.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Date range filtering
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        // Start of the start date
        query.createdAt.$gte = new Date(startDate + 'T00:00:00.000Z');
      }
      if (endDate) {
        // End of the end date (23:59:59.999)
        const endDateTime = new Date(endDate + 'T23:59:59.999Z');
        query.createdAt.$lte = endDateTime;
      }
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      successResponse('Orders fetched successfully', {
        orders,
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
    const message = err?.message || 'Failed to fetch orders';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

