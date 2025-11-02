import { createApi } from "@reduxjs/toolkit/query/react";
import { CUSTOMER_ENDPOINTS } from "../../utils/ApiUrls";
import { axiosBaseQuery } from "../../utils/axios";

export const customersApi = createApi({
  reducerPath: "customersApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    // Get all customers
    getCustomers: builder.query({
      query: (params) => ({
        url: CUSTOMER_ENDPOINTS.GET_ALL,
        method: "GET",
        params,
      }),
      providesTags: ["Customer"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
} = customersApi;

