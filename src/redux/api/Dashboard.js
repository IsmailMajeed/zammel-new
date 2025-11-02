import { createApi } from "@reduxjs/toolkit/query/react";
import { DASHBOARD_ENDPOINTS } from "../../utils/ApiUrls";
import { axiosBaseQuery } from "../../utils/axios";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    // Get dashboard stats
    getDashboardStats: builder.query({
      query: () => ({
        url: DASHBOARD_ENDPOINTS.GET_STATS,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
} = dashboardApi;

