import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authMiddleware';
import { connectToDb } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User'; // Import User model to ensure it's registered
import { successResponse, errorResponse } from '@/utils/responses';
import mongoose from 'mongoose';

// Helper function to get variant by color and size
function getVariantByColorAndSize(product, color, size) {
  if (!product?.variants) return null;
  return product.variants.find(
    v => v.color?.toLowerCase() === color?.toLowerCase() &&
      v.size === size
  ) || product.variants[0];
}

// GET order by ID
export async function GET(request, { params }) {
  try {
    await connectToDb();

    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        errorResponse('Order ID is required', 400),
        { status: 400 }
      );
    }

    const order = await Order.findById(id).populate('user', 'name email');

    if (!order) {
      return NextResponse.json(
        errorResponse('Order not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(
      successResponse('Order fetched successfully', { order }, 200),
      { status: 200 }
    );
  } catch (err) {
    const message = err?.message || 'Failed to fetch order';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

// PUT update order status (Admin only)
export const PUT = requireAdmin(async (request, { params }) => {
  try {
    await connectToDb();

    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        errorResponse('Order ID is required', 400),
        { status: 400 }
      );
    }

    const body = await request.json();
    const { orderStatus, paymentStatus } = body;

    // Validate orderStatus if provided
    const validOrderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      return NextResponse.json(
        errorResponse(`Invalid order status. Valid statuses are: ${validOrderStatuses.join(', ')}`, 400),
        { status: 400 }
      );
    }

    // Validate paymentStatus if provided
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        errorResponse(`Invalid payment status. Valid statuses are: ${validPaymentStatuses.join(', ')}`, 400),
        { status: 400 }
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        errorResponse('Order not found', 404),
        { status: 404 }
      );
    }

    const oldOrderStatus = order.orderStatus;
    const isCancelling = orderStatus === 'cancelled' && oldOrderStatus !== 'cancelled';
    const isRestoringFromCancelled = oldOrderStatus === 'cancelled' && orderStatus && orderStatus !== 'cancelled';

    // Start MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update order within transaction
      if (orderStatus) {
        order.orderStatus = orderStatus;
      }

      if (paymentStatus) {
        order.paymentStatus = paymentStatus;
      }

      await order.save({ session });

      // Restore stock if order is being cancelled
      if (isCancelling && order.items && order.items.length > 0) {
        for (const item of order.items) {
          try {
            const product = await Product.findById(item.productId).session(session);
            if (product) {
              const variant = getVariantByColorAndSize(
                product,
                item.variant?.color,
                item.variant?.size
              );

              if (variant) {
                // Restore stock quantity
                variant.quantity = (variant.quantity || 0) + (item.quantity || 0);
                await product.save({ session });
              }
            }
          } catch (stockError) {
            console.error('Error restoring stock for item:', item.productId, stockError);
            // Continue with other items even if one fails
          }
        }
      }

      // Deduct stock if order is being restored from cancelled status
      // (e.g., if admin accidentally cancelled and wants to restore)
      if (isRestoringFromCancelled && order.items && order.items.length > 0) {
        for (const item of order.items) {
          try {
            const product = await Product.findById(item.productId).session(session);
            if (product) {
              const variant = getVariantByColorAndSize(
                product,
                item.variant?.color,
                item.variant?.size
              );

              if (variant) {
                // Deduct stock quantity
                variant.quantity = Math.max(0, (variant.quantity || 0) - (item.quantity || 0));
                await product.save({ session });
              }
            }
          } catch (stockError) {
            console.error('Error deducting stock for item:', item.productId, stockError);
            // Continue with other items even if one fails
          }
        }
      }

      // Commit transaction if update succeeds
      await session.commitTransaction();
    } catch (transactionError) {
      // Rollback transaction on any error
      await session.abortTransaction();

      // Check if it's a Mongoose validation error
      if (transactionError.name === 'ValidationError') {
        const validationErrors = Object.values(transactionError.errors || {}).map(err => err.message).join(', ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }

      throw transactionError;
    } finally {
      // End session
      session.endSession();
    }

    // Get populated order for email (outside transaction)
    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

    // Send order status update email to customer if status changed
    if (orderStatus && orderStatus !== oldOrderStatus) {
      try {
        const { sendOrderEmail } = await import('@/utils/sendOrderEmail');
        const { getOrderStatusUpdateEmail } = await import('@/utils/emailTemplates');

        const customerEmail = populatedOrder.shippingAddress?.email;
        if (customerEmail) {
          const emailHtml = getOrderStatusUpdateEmail(populatedOrder, oldOrderStatus);
          await sendOrderEmail(
            customerEmail,
            `Order Status Update - ${populatedOrder.orderNumber}`,
            emailHtml
          );
        }
      } catch (emailError) {
        // Log error but don't fail order update
        console.error('Failed to send order status update email:', emailError);
      }

      // Create notification for order status change (only for logged-in users)
      if (populatedOrder.user) {
        try {
          const { createOrderNotification } = await import('@/utils/createNotification');
          await createOrderNotification(populatedOrder, `order_${orderStatus}`);
        } catch (notificationError) {
          console.error('Failed to create order status notification:', notificationError);
          // Don't fail order update if notification fails
        }
      }
    }

    // Create notification for payment status change (only for logged-in users)
    if (paymentStatus && paymentStatus !== order.paymentStatus && populatedOrder.user) {
      try {
        const { createOrderNotification } = await import('@/utils/createNotification');
        await createOrderNotification(populatedOrder, `payment_${paymentStatus}`);
      } catch (notificationError) {
        console.error('Failed to create payment status notification:', notificationError);
        // Don't fail order update if notification fails
      }
    }

    return NextResponse.json(
      successResponse('Order updated successfully', {
        order: populatedOrder
      }, 200),
      { status: 200 }
    );
  } catch (err) {
    // Handle validation errors with 400 status
    if (err.name === 'ValidationError' || err.message?.includes('Validation failed') || err.message?.includes('Invalid')) {
      const message = err?.message || 'Validation failed';
      return NextResponse.json(errorResponse(message, 400), { status: 400 });
    }

    const message = err?.message || 'Failed to update order';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

