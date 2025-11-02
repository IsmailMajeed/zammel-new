import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import { successResponse, errorResponse } from '@/utils/responses';
import { requireAdmin } from '@/lib/authMiddleware';
import mongoose from 'mongoose';

// GET all customers (Admin only)
export const GET = requireAdmin(async (request) => {
  try {
    await connectToDb();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const city = searchParams.get('city');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build query for users (non-admin customers only)
    let userQuery = { isAdmin: false };

    // Search filter (name, email)
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filtering (based on join date / createdAt)
    if (startDate || endDate) {
      userQuery.createdAt = {};
      if (startDate) {
        // Start of the start date
        userQuery.createdAt.$gte = new Date(startDate + 'T00:00:00.000Z');
      }
      if (endDate) {
        // End of the end date (23:59:59.999)
        const endDateTime = new Date(endDate + 'T23:59:59.999Z');
        userQuery.createdAt.$lte = endDateTime;
      }
    }

    // Get all customers matching the query
    const customers = await User.find(userQuery)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    // Get orders for all customers to calculate stats
    const userIds = customers.map(c => c._id);
    const orders = await Order.find({ user: { $in: userIds } })
      .select('user total orderStatus paymentStatus createdAt shippingAddress')
      .sort({ createdAt: -1 })
      .lean();

    // Aggregate order data per customer
    const customerStatsMap = {};
    orders.forEach(order => {
      const userId = order.user?.toString();
      if (!userId) return;

      if (!customerStatsMap[userId]) {
        customerStatsMap[userId] = {
          totalOrders: 0,
          totalSpent: 0,
          lastOrder: null,
          city: order.shippingAddress?.city || null
        };
      }

      const stats = customerStatsMap[userId];
      stats.totalOrders += 1;

      // Only count paid and non-cancelled orders
      if (order.paymentStatus === 'paid' && order.orderStatus !== 'cancelled') {
        stats.totalSpent += order.total || 0;
      }

      // Track last order date
      if (!stats.lastOrder || new Date(order.createdAt) > new Date(stats.lastOrder)) {
        stats.lastOrder = order.createdAt;
      }
    });

    // Combine customer data with stats
    let customersWithStats = customers.map(customer => {
      const stats = customerStatsMap[customer._id.toString()] || {
        totalOrders: 0,
        totalSpent: 0,
        lastOrder: null,
        city: null
      };

      // Determine status (active if has orders in last 90 days, otherwise inactive)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const isActive = stats.lastOrder && new Date(stats.lastOrder) >= ninetyDaysAgo;

      return {
        id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
        phone: stats.phone || null, // Get from most recent order
        address: null, // Can be populated from order shipping address if needed
        city: stats.city || null,
        country: 'Pakistan', // Default or can be from order
        status: isActive ? 'active' : 'inactive',
        totalOrders: stats.totalOrders,
        totalSpent: stats.totalSpent,
        lastOrder: stats.lastOrder,
        joinDate: customer.createdAt,
        avatar: null
      };
    });

    // Apply status filter (if specified)
    if (status && status !== 'all') {
      customersWithStats = customersWithStats.filter(c => c.status === status);
    }

    // Apply city filter (if specified)
    if (city && city !== 'all') {
      customersWithStats = customersWithStats.filter(c => c.city === city);
    }

    // Calculate aggregate stats before pagination
    const activeCustomers = customersWithStats.filter(c => c.status === 'active').length;
    const totalRevenue = customersWithStats.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalOrders = customersWithStats.reduce((sum, c) => sum + c.totalOrders, 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Get total count before pagination
    const total = customersWithStats.length;

    // Apply pagination
    const paginatedCustomers = customersWithStats.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    // Get phone numbers from most recent orders
    const userIdsForPhone = paginatedCustomers.map(c => new mongoose.Types.ObjectId(c.id));
    const recentOrders = await Order.find({
      user: { $in: userIdsForPhone }
    })
      .select('user shippingAddress.phone')
      .sort({ createdAt: -1 })
      .lean();

    // Create a map of user IDs to their most recent phone number
    const phoneMap = {};
    recentOrders.forEach(order => {
      const userId = order.user?.toString();
      if (userId && order.shippingAddress?.phone && !phoneMap[userId]) {
        phoneMap[userId] = order.shippingAddress.phone;
      }
    });

    // Add phone numbers to customers
    const finalCustomers = paginatedCustomers.map(customer => ({
      ...customer,
      phone: phoneMap[customer.id] || null
    }));

    return NextResponse.json(
      successResponse('Customers fetched successfully', {
        customers: finalCustomers,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit
        },
        stats: {
          totalCustomers: total,
          activeCustomers,
          totalRevenue,
          avgOrderValue
        }
      }, 200),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching customers:', err);
    const message = err?.message || 'Failed to fetch customers';
    return NextResponse.json(errorResponse(message, 500), { status: 500 });
  }
});

