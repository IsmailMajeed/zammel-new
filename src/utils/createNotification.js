import Notification from '@/models/Notification';

/**
 * Create a notification for a user
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.type - Notification type
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} params.link - Optional link
 * @param {string} params.relatedId - Optional related ID (order, product, etc.)
 * @param {string} params.relatedModel - Optional related model name
 * @param {Object} params.metadata - Optional metadata
 * @param {boolean} params.isAdmin - Whether this is an admin notification
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  link = null,
  relatedId = null,
  relatedModel = null,
  metadata = {},
  isAdmin = false
}) {
  try {
    if (!userId || !type || !title || !message) {
      console.error('Missing required notification fields');
      return null;
    }

    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      link,
      relatedId,
      relatedModel,
      metadata,
      isAdmin
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

/**
 * Create notifications for all admin users
 * @param {Object} params
 * @param {string} params.type - Notification type
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} params.link - Optional link
 * @param {string} params.relatedId - Optional related ID (order, product, etc.)
 * @param {string} params.relatedModel - Optional related model name
 * @param {Object} params.metadata - Optional metadata
 */
export async function createAdminNotification({
  type,
  title,
  message,
  link = null,
  relatedId = null,
  relatedModel = null,
  metadata = {}
}) {
  try {
    if (!type || !title || !message) {
      console.error('Missing required notification fields');
      return null;
    }

    const User = (await import('@/models/User')).default;
    const adminUsers = await User.find({ isAdmin: true }).select('_id');

    if (adminUsers.length === 0) {
      console.log('No admin users found');
      return null;
    }

    // Create notification for each admin
    const notifications = await Promise.all(
      adminUsers.map(admin =>
        Notification.create({
          user: admin._id,
          type,
          title,
          message,
          link,
          relatedId,
          relatedModel,
          metadata: metadata || {},
          isAdmin: true
        })
      )
    );

    return notifications;
  } catch (error) {
    console.error('Error creating admin notifications:', error);
    return null;
  }
}

/**
 * Create admin notifications for new orders
 */
export async function createAdminOrderNotification(order) {
  try {
    await createAdminNotification({
      type: 'order_placed',
      title: 'New Order Received',
      message: `New order #${order.orderNumber} has been placed. Total: ₨${Math.round(order.total || 0).toLocaleString()}`,
      link: `/admin/orders/${order._id}`,
      relatedId: order._id,
      relatedModel: 'Order',
      metadata: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        total: order.total,
        itemsCount: order.items?.length || 0
      }
    });
  } catch (error) {
    console.error('Failed to create admin order notification:', error);
  }
}

/**
 * Create order-related notifications
 */
export async function createOrderNotification(order, type) {
  if (!order?.user) return null; // Only for logged-in users

  const notificationTypes = {
    order_placed: {
      title: 'Order Placed Successfully',
      message: `Your order #${order.orderNumber} has been placed successfully. We'll process it soon.`,
      link: `/orders/${order._id}`
    },
    order_processing: {
      title: 'Order Processing',
      message: `Your order #${order.orderNumber} is now being processed.`,
      link: `/orders/${order._id}`
    },
    order_shipped: {
      title: 'Order Shipped',
      message: `Great news! Your order #${order.orderNumber} has been shipped.`,
      link: `/orders/${order._id}`
    },
    order_delivered: {
      title: 'Order Delivered',
      message: `Your order #${order.orderNumber} has been delivered. Thank you for shopping with us!`,
      link: `/orders/${order._id}`
    },
    order_cancelled: {
      title: 'Order Cancelled',
      message: `Your order #${order.orderNumber} has been cancelled.`,
      link: `/orders/${order._id}`
    },
    payment_paid: {
      title: 'Payment Received',
      message: `Payment for order #${order.orderNumber} has been received.`,
      link: `/orders/${order._id}`
    },
    payment_failed: {
      title: 'Payment Failed',
      message: `Payment for order #${order.orderNumber} failed. Please try again.`,
      link: `/orders/${order._id}`
    },
    payment_refunded: {
      title: 'Payment Refunded',
      message: `Your payment for order #${order.orderNumber} has been refunded.`,
      link: `/orders/${order._id}`
    }
  };

  const notificationData = notificationTypes[type];
  if (!notificationData) return null;

  return await createNotification({
    userId: order.user,
    type,
    title: notificationData.title,
    message: notificationData.message,
    link: notificationData.link,
    relatedId: order._id,
    relatedModel: 'Order',
    metadata: {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus
    }
  });
}

