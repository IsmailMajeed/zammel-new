import axios from "axios";
import { toast } from "sonner";
import { accessKey, adminAccessKey } from "./constants";

// Create axios instance with default config
const axiosInstance = axios.create({
  timeout: 60000, // 60 seconds timeout
  timeoutErrorMessage: "Request timeout - please try again",
});

// Track ongoing requests to prevent duplicates (optional)
const pendingRequests = new Map();

// Lightweight concurrency queue to control parallel API calls
class ConcurrencyQueue {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = Math.max(1, Number(maxConcurrent) || 1);
    this.queue = [];
    this.activeCount = 0;
  }

  setLimit(limit) {
    this.maxConcurrent = Math.max(1, Number(limit) || 1);
    this.#dequeue();
  }

  enqueue(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.#dequeue();
    });
  }

  clear() {
    this.queue = [];
  }

  get size() {
    return this.queue.length;
  }

  #dequeue() {
    while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift();
      this.activeCount++;
      Promise.resolve()
        .then(task.fn)
        .then((result) => task.resolve(result))
        .catch((error) => task.reject(error))
        .finally(() => {
          this.activeCount--;
          this.#dequeue();
        });
    }
  }
}

// Single shared queue instance for all requests
const requestQueue = new ConcurrencyQueue(5);

// Expose simple controls
export const setRequestConcurrency = (limit) => requestQueue.setLimit(limit);
export const pendingQueueSize = () => requestQueue.size;
export const clearPendingQueue = () => requestQueue.clear();

// Request interceptor for common headers
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const isAdminApi = typeof config.url === 'string' && config.url.includes('/admin');
      const tokenKey = isAdminApi ? adminAccessKey : accessKey;
      const token = localStorage.getItem(tokenKey);
      if (token) {
        if (!config.headers) config.headers = {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for common error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 unauthorized
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const publicPaths = ["/auth/login", "/auth/register", "/", "/auth/admin/login"];

        // If we are on admin login page, don't redirect; let UI show error
        if (currentPath.startsWith('/auth/admin')) {
          return Promise.reject(error);
        }

        if (!publicPaths.includes(currentPath)) {
          // Clear token(s) and redirect based on area
          const isInAdminArea = currentPath.startsWith('/admin');
          if (isInAdminArea) {
            localStorage.removeItem(adminAccessKey);
            window.location.href = "/auth/admin/login";
          } else {
            localStorage.removeItem(accessKey);
            window.location.href = "/auth/login";
          }
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  }
);

// NOTE: No TypeScript types/interfaces, JS only
export const axiosBaseQuery =
  ({ baseUrl = "" } = {}) =>
    async ({
      url,
      method = "GET",
      body,
      params,
      headers = {},
      timeout,
      cancelPrevious = false,
      silent = false,
    }) => {
      const fullUrl = baseUrl + url;
      const requestKey = `${method}-${fullUrl}`;

      try {
        // Cancel previous request if requested
        if (cancelPrevious && pendingRequests.has(requestKey)) {
          const previousRequest = pendingRequests.get(requestKey);
          if (previousRequest && typeof previousRequest.cancel === "function") {
            previousRequest.cancel("New request initiated");
          }
          pendingRequests.delete(requestKey);
        }

        // Create cancel token for this request
        const cancelTokenSource = axios.CancelToken.source();
        if (cancelPrevious) {
          pendingRequests.set(requestKey, cancelTokenSource);
        }

        // Prepare request data
        let requestData = body;
        const isFormData =
          typeof FormData !== "undefined" && body instanceof FormData;
        const hasFile =
          body &&
          typeof body === "object" &&
          (Object.values(body).some &&
            Object.values(body).some(
              (value) => typeof File !== "undefined" && value instanceof File
            ));

        // Set content type based on data
        const contentType =
          isFormData || hasFile ? "multipart/form-data" : "application/json";

        const config = {
          url: fullUrl,
          method,
          data: requestData,
          params,
          timeout: timeout || 30000,
          cancelToken: cancelTokenSource.token,
          headers: {
            "Content-Type": contentType,
            ...headers,
          },
        };

        console.log(`🚀 API Call: ${method} ${fullUrl}`, {
          data: requestData,
          params,
          timeout: config.timeout,
        });

        // const result = await axiosInstance(config);
        // Schedule through the concurrency queue so multiple requests can run in parallel
        const result = await requestQueue.enqueue(() => axiosInstance(config));

        // Clean up pending request
        if (cancelPrevious) {
          pendingRequests.delete(requestKey);
        }

        // Handle success messages
        if (
          !silent &&
          method !== "GET" &&
          result &&
          result.data &&
          result.data.status !== 204
        ) {
          const isSuccess =
            (result.data &&
              result.data.status >= 200 &&
              result.data.status < 300) ||
            (result.status >= 200 && result.status < 300);
          const message = result.data && result.data.message;

          if (message) {
            if (isSuccess) {
              toast.success(message);
            } else {
              toast.error(message);
            }
          }
        }

        console.log(`✅ API Success: ${method} ${fullUrl}`, result.data);
        return { data: result.data };
      } catch (axiosError) {
        // Clean up pending request
        if (cancelPrevious) {
          pendingRequests.delete(requestKey);
        }

        // Handle request cancellation
        if (axios.isCancel(axiosError)) {
          console.log(`🚫 Request cancelled: ${method} ${fullUrl}`);
          return {
            error: {
              status: "CANCELLED",
              data: "Request was cancelled",
            },
          };
        }

        const error = axiosError;
        const status = error && error.response && error.response.status;
        const errorData = error && error.response && error.response.data;

        console.error(`❌ API Error: ${method} ${fullUrl}`, {
          status,
          data: errorData,
          message: error && error.message,
        });

        // Handle error messages
        if (!silent) {
          let errorMessage = "An error occurred!";

          if (errorData && Array.isArray(errorData.message)) {
            errorMessage = errorData.message[0];
          } else if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else if (error && error.code === "ECONNABORTED") {
            errorMessage = "Request timeout - please try again";
          } else if (error && error.code === "ERR_NETWORK") {
            errorMessage = "Network error - please check your connection";
          }

          // Don't show toast for 401 errors (handled by interceptor)
          if (status !== 401) {
            toast.error(errorMessage);
          }
        }

        return {
          error: {
            status: status || "NETWORK_ERROR",
            data: errorData || (error && error.message),
          },
        };
      }
    };

// Utility function to cancel all pending requests
export const cancelAllPendingRequests = () => {
  pendingRequests.forEach((cancelTokenSource, key) => {
    if (cancelTokenSource && typeof cancelTokenSource.cancel === "function") {
      cancelTokenSource.cancel("Cancelled all pending requests");
    }
  });
  pendingRequests.clear();
};

// Utility function to cancel specific request
export const cancelRequest = (method, url) => {
  const requestKey = `${method}-${url}`;
  const cancelTokenSource = pendingRequests.get(requestKey);
  if (cancelTokenSource && typeof cancelTokenSource.cancel === "function") {
    cancelTokenSource.cancel("Request cancelled manually");
    pendingRequests.delete(requestKey);
  }
};
