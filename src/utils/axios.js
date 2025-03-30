// src/utils/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8089/api/v1",
});

// Tự động gắn Authorization trước mỗi request
axiosClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.email && user?.password) {
    config.headers.Authorization =
      "Basic " + btoa(`${user.email}:${user.password}`);
  }
  return config;
});

// Tự động rút gọn response → chỉ lấy phần .data
axiosClient.interceptors.response.use((response) => response.data);

export default axiosClient;
