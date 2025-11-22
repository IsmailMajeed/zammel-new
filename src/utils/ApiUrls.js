export const AUTH_ENDPOINTS = {
  LOGIN: `auth/login`,
  REGISTER: `auth/register`,
  SET_ACCOUNT: `auth/set-account`,
  LOGOUT: `auth/logout`,
  ADMIN_LOGIN: `auth/admin/login`,
  CHANGE_PASSWORD: "auth/change-password",
};

export const PRODUCT_ENDPOINTS = {
  GET_ALL: `products`,
  GET_BY_ID: (id) => `products/${id}`,
  CREATE: `products`,
  UPDATE: (id) => `products/${id}`,
  DELETE: (id) => `products/${id}`,
};

export const CATEGORY_ENDPOINTS = {
  GET_ALL: `categories`,
  GET_BY_ID: (id) => `categories/${id}`,
  CREATE: `categories`,
  UPDATE: (id) => `categories/${id}`,
  DELETE: (id) => `categories/${id}`,
};

export const ORDER_ENDPOINTS = {
  GET_ALL: `orders`,
  GET_BY_ID: (id) => `orders/${id}`,
  CREATE: `orders`,
  UPDATE: (id) => `orders/${id}`,
};

export const SETTINGS_ENDPOINTS = {
  GET: `settings`,
  UPDATE: `settings`,
};

export const DASHBOARD_ENDPOINTS = {
  GET_STATS: `dashboard`,
};

export const CUSTOMER_ENDPOINTS = {
  GET_ALL: `customers`,
  GET_BY_ID: (id) => `customers/${id}`,
};

export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: `notifications`,
  GET_BY_ID: (id) => `notifications/${id}`,
  MARK_READ: (id) => `notifications/${id}`,
  MARK_ALL_READ: `notifications/mark-all-read`,
  DELETE: (id) => `notifications/${id}`,
};

export const ADMIN_NOTIFICATION_ENDPOINTS = {
  GET_ALL: `admin/notifications`,
  GET_BY_ID: (id) => `admin/notifications/${id}`,
  MARK_READ: (id) => `admin/notifications/${id}`,
  MARK_ALL_READ: `admin/notifications/mark-all-read`,
  DELETE: (id) => `admin/notifications/${id}`,
};
