import { createApi } from "@reduxjs/toolkit/query/react";
import { ORDER_ENDPOINTS } from "../../utils/ApiUrls";
import { axiosBaseQuery } from "../../utils/axios";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // Get all orders
    getOrders: builder.query({
      query: (params) => ({
        url: ORDER_ENDPOINTS.GET_ALL,
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
    }),

    // Get order by ID
    getOrderById: builder.query({
      query: (id) => ({
        url: ORDER_ENDPOINTS.GET_BY_ID(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // Create order
    createOrder: builder.mutation({
      query: (data) => ({
        url: ORDER_ENDPOINTS.CREATE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    // Update order
    updateOrder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: ORDER_ENDPOINTS.UPDATE(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }, "Order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
} = ordersApi;

