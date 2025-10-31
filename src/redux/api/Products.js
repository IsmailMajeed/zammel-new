import { createApi } from "@reduxjs/toolkit/query/react";
import { PRODUCT_ENDPOINTS } from "../../utils/ApiUrls";
import { axiosBaseQuery } from "../../utils/axios";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query({
      query: (params) => ({
        url: PRODUCT_ENDPOINTS.GET_ALL,
        method: "GET",
        params,
      }),
      providesTags: ["Product"],
    }),
    
    // Get product by ID
    getProductById: builder.query({
      query: (id) => ({
        url: PRODUCT_ENDPOINTS.GET_BY_ID(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    
    // Create product
    createProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCT_ENDPOINTS.CREATE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    
    // Update product
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: PRODUCT_ENDPOINTS.UPDATE(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }, "Product"],
    }),
    
    // Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: PRODUCT_ENDPOINTS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
