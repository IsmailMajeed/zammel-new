import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { successResponse, errorResponse } from '@/utils/responses';
import { requireAdmin } from '@/lib/authMiddleware';

// GET dashboard stats (Admin only)
export const GET = requireAdmin(async (request) => {
  try {
    await connectToDb();

    // Get total revenue (sum of all completed/paid orders)
    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          orderStatus: { $nin: ['cancelled', 'delivered'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get total orders count
    const totalOrders = await Order.countDocuments({
      orderStatus: { $ne: 'cancelled' }
    });

    // Get pending orders count
    const pendingOrders = await Order.countDocuments({
      orderStatus: 'pending'
    });

    // Get total products count (active only)
    const totalProducts = await Product.countDocuments({
      status: 'active'
    });

    // Get total customers count (non-admin users)
    const totalCustomers = await User.countDocuments({
      isAdmin: false
    });

    // Get recent orders (last 5)
    const recentOrders = await Order.find({
      orderStatus: { $ne: 'cancelled' }
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber user items total orderStatus paymentStatus createdAt');

    // Format recent orders
    const formattedRecentOrders = recentOrders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      customerName: order.user?.name || order.shippingAddress?.firstName || 'Guest User',
      customerEmail: order.user?.email || order.shippingAddress?.email || 'No email',
      itemsCount: order.items?.length || 0,
      total: order.total || 0,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt
    }));

    const stats = {
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalCustomers,
      recentOrders: formattedRecentOrders
    };

    return NextResponse.json(
      successResponse('Dashboard stats fetched successfully', { stats }, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Dashboard stats error:', err);
    const message = err?.message || 'Failed to fetch dashboard stats';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

