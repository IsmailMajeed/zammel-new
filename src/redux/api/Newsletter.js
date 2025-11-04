import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../utils/axios";

export const newsletterApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/newsletter",
  }),
  tagTypes: ["Newsletter", "NewsletterSubscriber"],
  endpoints: (builder) => ({
    // Subscribe to newsletter (public)
    subscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: "/subscribe",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NewsletterSubscriber"],
    }),

    // Get all subscribers (admin only)
    getSubscribers: builder.query({
      query: (params) => ({
        url: "/subscribe",
        method: "GET",
        params,
      }),
      providesTags: ["NewsletterSubscriber"],
    }),

    // Get all newsletters (admin only)
    getNewsletters: builder.query({
      query: (params) => ({
        url: "",
        method: "GET",
        params,
      }),
      providesTags: ["Newsletter"],
    }),

    // Create newsletter (admin only)
    createNewsletter: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Newsletter"],
    }),

    // Send newsletter (admin only)
    sendNewsletter: builder.mutation({
      query: (data) => ({
        url: "",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Newsletter"],
    }),

    // Delete newsletter (admin only)
    deleteNewsletter: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Newsletter"],
    }),
  }),
});

export const {
  useSubscribeNewsletterMutation,
  useGetSubscribersQuery,
  useGetNewslettersQuery,
  useCreateNewsletterMutation,
  useSendNewsletterMutation,
  useDeleteNewsletterMutation,
} = newsletterApi;

