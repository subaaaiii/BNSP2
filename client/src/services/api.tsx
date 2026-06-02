import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

Api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/login") &&
      !originalRequest.url?.includes("/api/register") &&
      originalRequest.url !== "/api/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        await Api.post("/api/auth/refresh");

        return Api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default Api;
