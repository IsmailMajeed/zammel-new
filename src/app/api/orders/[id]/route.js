import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User'; // Import User model to ensure it's registered
import { successResponse, errorResponse } from '@/utils/responses';

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

// PUT update order status
export async function PUT(request, { params }) {
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

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        errorResponse('Order not found', 404),
        { status: 404 }
      );
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    return NextResponse.json(
      successResponse('Order updated successfully', {
        order: await Order.findById(order._id).populate('user', 'name email')
      }, 200),
      { status: 200 }
    );
  } catch (err) {
    const message = err?.message || 'Failed to update order';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
}

