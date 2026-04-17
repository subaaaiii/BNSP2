import axios from "axios";
import Cookies from "js-cookie";

const Api = axios.create({
  baseURL: "http://localhost:8080", // sesuaikan
});

// 🔥 AUTO ATTACH TOKEN
Api.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 AUTO LOGOUT kalau 401
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");

      // optional: redirect paksa
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default Api;