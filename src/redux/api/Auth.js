import { createApi } from "@reduxjs/toolkit/query/react";
import { AUTH_ENDPOINTS } from "../../utils/ApiUrls";
import { axiosBaseQuery } from "../../utils/axios";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: AUTH_ENDPOINTS.LOGIN,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: AUTH_ENDPOINTS.REGISTER,
        method: "POST",
        body: data,
      }),
    }),
    setAccount: builder.mutation({
      query: (data) => ({
        url: AUTH_ENDPOINTS.SET_ACCOUNT,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: AUTH_ENDPOINTS.LOGOUT,
        method: "POST",
        headers: {},
      }),
    }),
    adminLogin: builder.mutation({
      query: (data) => ({
        url: AUTH_ENDPOINTS.ADMIN_LOGIN,
        method: "POST",
        body: data,
      }),
    }),
    // Change Password API
    changePassword: builder.mutation({
      query: (data) => ({
        url: AUTH_ENDPOINTS.CHANGE_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSetAccountMutation,
  useLogoutMutation,
  useAdminLoginMutation,
  useChangePasswordMutation,
} = authApi;
