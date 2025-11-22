'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation
} from '@/redux/api/Notifications';
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Notifications() {
  const router = useRouter();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useGetNotificationsQuery({
    read: filter === 'all' ? undefined : filter === 'unread' ? 'false' : 'true',
    page,
    limit: 20
  });

  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;
  const pagination = data?.data?.pagination || {};

  const handleMarkRead = async (id, currentReadStatus) => {
    try {
      await markRead({ id, read: !currentReadStatus }).unwrap();
    } catch (error) {
      console.error('Failed to mark notification:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id).unwrap();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.read) {
      await handleMarkRead(notification._id, false);
    }

    // Navigate to link if available
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order_placed: '📦',
      order_processing: '⚙️',
      order_shipped: '🚚',
      order_delivered: '✅',
      order_cancelled: '❌',
      payment_paid: '💳',
      payment_failed: '⚠️',
      payment_refunded: '💰',
      product_back_in_stock: '📦',
      price_drop: '💸',
      new_product: '🆕',
      system: '🔔'
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      order_placed: 'bg-blue-100 text-blue-800',
      order_processing: 'bg-yellow-100 text-yellow-800',
      order_shipped: 'bg-purple-100 text-purple-800',
      order_delivered: 'bg-green-100 text-green-800',
      order_cancelled: 'bg-red-100 text-red-800',
      payment_paid: 'bg-green-100 text-green-800',
      payment_failed: 'bg-red-100 text-red-800',
      payment_refunded: 'bg-blue-100 text-blue-800',
      product_back_in_stock: 'bg-green-100 text-green-800',
      price_drop: 'bg-orange-100 text-orange-800',
      new_product: 'bg-blue-100 text-blue-800',
      system: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-gray-700" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-500">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="px-6 py-3 border-b border-gray-100 flex gap-2">
        <button
          onClick={() => { setFilter('all'); setPage(1); }}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'all'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          All
        </button>
        <button
          onClick={() => { setFilter('unread'); setPage(1); }}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'unread'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
        <button
          onClick={() => { setFilter('read'); setPage(1); }}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'read'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-100">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications found</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getNotificationColor(notification.type)}`}>
                            {notification.type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(notification.createdAt).toLocaleDateString('en-PK', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkRead(notification._id, notification.read);
                          }}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                          title={notification.read ? 'Mark as unread' : 'Mark as read'}
                        >
                          {notification.read ? (
                            <Check className="w-4 h-4 text-gray-500" />
                          ) : (
                            <CheckCheck className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification._id);
                          }}
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                    {notification.link && (
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View details →
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!pagination.hasMore}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

