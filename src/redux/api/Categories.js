import { createApi } from "@reduxjs/toolkit/query/react";
import { CATEGORY_ENDPOINTS } from "../../utils/ApiUrls";
import { axiosBaseQuery } from "../../utils/axios";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    // Get all categories
    getCategories: builder.query({
      query: (params) => ({
        url: CATEGORY_ENDPOINTS.GET_ALL,
        method: "GET",
        params,
      }),
      providesTags: ["Category"],
    }),
    
    // Get category by ID
    getCategoryById: builder.query({
      query: (id) => ({
        url: CATEGORY_ENDPOINTS.GET_BY_ID(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    
    // Create category
    createCategory: builder.mutation({
      query: (data) => ({
        url: CATEGORY_ENDPOINTS.CREATE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    
    // Update category
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: CATEGORY_ENDPOINTS.UPDATE(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Category", id }, "Category"],
    }),
    
    // Delete category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: CATEGORY_ENDPOINTS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
