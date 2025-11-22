import { createApi } from "@reduxjs/toolkit/query/react";
import { ADMIN_NOTIFICATION_ENDPOINTS, NOTIFICATION_ENDPOINTS } from "../../utils/ApiUrls";
import { axiosBaseQuery } from "../../utils/axios";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    // Get all notifications
    getNotifications: builder.query({
      query: (params = {}) => ({
        url: NOTIFICATION_ENDPOINTS.GET_ALL,
        method: "GET",
        params,
      }),
      providesTags: ["Notification"],
    }),

    // Get notification by ID
    getNotificationById: builder.query({
      query: (id) => ({
        url: NOTIFICATION_ENDPOINTS.GET_BY_ID(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Notification", id }],
    }),

    // Mark notification as read/unread
    markNotificationRead: builder.mutation({
      query: ({ id, read }) => ({
        url: NOTIFICATION_ENDPOINTS.MARK_READ(id),
        method: "PATCH",
        body: { read },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Notification", id }, "Notification"],
    }),

    // Mark all notifications as read
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: NOTIFICATION_ENDPOINTS.MARK_ALL_READ,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),

    // Delete notification
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: NOTIFICATION_ENDPOINTS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;

// Admin Notifications API
export const adminNotificationsApi = createApi({
  reducerPath: "adminNotificationsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["AdminNotification"],
  endpoints: (builder) => ({
    // Get all admin notifications
    getAdminNotifications: builder.query({
      query: (params = {}) => ({
        url: ADMIN_NOTIFICATION_ENDPOINTS.GET_ALL,
        method: "GET",
        params,
      }),
      providesTags: ["AdminNotification"],
    }),

    // Get admin notification by ID
    getAdminNotificationById: builder.query({
      query: (id) => ({
        url: ADMIN_NOTIFICATION_ENDPOINTS.GET_BY_ID(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AdminNotification", id }],
    }),

    // Mark admin notification as read/unread
    markAdminNotificationRead: builder.mutation({
      query: ({ id, read }) => ({
        url: ADMIN_NOTIFICATION_ENDPOINTS.MARK_READ(id),
        method: "PATCH",
        body: { read },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "AdminNotification", id }, "AdminNotification"],
    }),

    // Mark all admin notifications as read
    markAllAdminNotificationsRead: builder.mutation({
      query: () => ({
        url: ADMIN_NOTIFICATION_ENDPOINTS.MARK_ALL_READ,
        method: "POST",
      }),
      invalidatesTags: ["AdminNotification"],
    }),

    // Delete admin notification
    deleteAdminNotification: builder.mutation({
      query: (id) => ({
        url: ADMIN_NOTIFICATION_ENDPOINTS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["AdminNotification"],
    }),
  }),
});

export const {
  useGetAdminNotificationsQuery,
  useGetAdminNotificationByIdQuery,
  useMarkAdminNotificationReadMutation,
  useMarkAllAdminNotificationsReadMutation,
  useDeleteAdminNotificationMutation,
} = adminNotificationsApi;

