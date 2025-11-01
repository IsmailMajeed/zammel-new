import { createApi } from "@reduxjs/toolkit/query/react";
import { SETTINGS_ENDPOINTS } from "../../utils/ApiUrls";
import { axiosBaseQuery } from "../../utils/axios";

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    // Get settings
    getSettings: builder.query({
      query: () => ({
        url: SETTINGS_ENDPOINTS.GET,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    // Update settings
    updateSettings: builder.mutation({
      query: (data) => ({
        url: SETTINGS_ENDPOINTS.UPDATE,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = settingsApi;

