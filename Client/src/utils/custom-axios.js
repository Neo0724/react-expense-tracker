import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const customAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const REFRESH_URL = "/auth/refresh";

let isRefreshing = false;
let failedRequests = [];

const processFailedRequests = (error) => {
  failedRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedRequests = [];
};

customAxios.interceptors.request.use(
  (c) => {
    return c;
  },
  (error) => {
    Promise.reject(error);
  },
);

customAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes(REFRESH_URL) || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequests.push({ resolve, reject });
      }).then(() => customAxios(originalRequest));
    }

    isRefreshing = true;

    try {
      await axios.get(`${BASE_URL}${REFRESH_URL}`, {
        withCredentials: true,
      });

      processFailedRequests(null);

      return customAxios(originalRequest);
    } catch (error) {
      processFailedRequests(error);

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);
